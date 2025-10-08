const mongoose =require('mongoose');

const productSchema=new mongoose.Schema({
    title: {
        type: String,
        required: [ true, 'Product name is required' ],
        trim: true,
        unique: [ true, 'Product name must be unique' ],
        minlength: [ 2, 'Product name must be at least 2 characters' ],
        maxlength: [ 100, 'Product name must be at most 32 characters' ],
    },
    slug: {
        type: String,
        required: [ true, 'Product slug is required' ],
        lowercase: true
    },
    description: {
        type: String,
        required: [ true, 'Product description is required' ],
        minlength: [ 2, 'Product description must be at least 2 characters' ],
        maxlength: [ 2000, 'Product description must be at most 200 characters' ],
    },
    price: {
        type: Number,
        required: [ true, 'Product price is required' ],
        min: [ 0, 'Product price must be at least 0' ], 
    },
    priceAfterDiscount: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: [ true, 'Product quantity is required' ],
        min: [ 0, 'Product quantity must be at least 0' ], 
    },
    sold: {
        type: Number,
        default: 0
    },
    colors:[String],
    imageCover:{
        type: String,
        required: [ true, 'Product cover image is required' ],
    },
    images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must belong to a category']
    },
    subCategory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'SubCategory',
        }
    ],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage: {
        type: Number,
        min: [ 1, 'Rating must be at least 1' ],
        max: [ 5, 'Rating must be at most 5' ],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
},{
    timestamps: true
});

//Mongoose query middleware to populate the category and subCategory fields
productSchema.pre(/^find/, function(next){
    this.populate({
        path: 'category',
        select: 'name -_id'
    }).populate({
        path: 'subCategory',
        select: 'name -_id'
    });

    next();
});

    module.exports=mongoose.model('Product', productSchema);