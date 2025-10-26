const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "User name is required"],
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
        lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    blocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const setImageUrl = (doc) => {
    if(doc.profileImage){
        const imageUrl= `${process.env.BASE_URL}/users/${doc.profileImage}`;
        doc.profileImage=imageUrl
    }
}

userSchema.post('init', (doc) => {
    setImageUrl(doc);
});
userSchema.post('save', (doc) => {
    setImageUrl(doc);
});

userSchema.pre("save", async function (next) {
    // Hash the password before saving the user model
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
});
// Hash password before updating user (findOneAndUpdate / updateOne)
async function hashPasswordBeforeUpdate(next) {
  const update = this.getUpdate();

  if (!update || !update.password) return next();

  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(update.password, salt);

  // Update the password and optionally update passwordChangedAt
  this.setUpdate({
    ...update,
    password: hashedPassword,
    passwordChangedAt: Date.now(),
  });

  next();
}


userSchema.pre("updateOne", hashPasswordBeforeUpdate);


const User = mongoose.model("User", userSchema);
module.exports = User;