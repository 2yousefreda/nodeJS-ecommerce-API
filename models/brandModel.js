const mongoose =require('mongoose');

const brandSchema=new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Category name is required' ],
        unique: [ true, 'Category name must be unique' ],
        minlength: [ 2, 'Category name must be at least 2 characters' ],
        maxlength: [ 32, 'Category name must be at most 32 characters' ],
    },
    slug:{
        type: String,
        lowercase: true
    },
    image: {
        type: String,
    }
},{
    timestamps: true
}); 

module.exports=mongoose.model('Brand', brandSchema);
