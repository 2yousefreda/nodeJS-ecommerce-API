const mongoose =require('mongoose');

const subCategorySchema=new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Sub category name is required' ],
        unique: [ true, 'Sub category name must be unique' ],
        minlength: [ 2, 'Sub category name must be at least 2 characters' ],
        maxlength: [ 32, 'Sub category name must be at most 32 characters' ],
    },
    slug:{
        type: String,
        lowercase: true
    }
    ,
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Sub category must belong to a category']
    }
  
},{
    timestamps: true

})

module.exports=mongoose.model('SubCategory', subCategorySchema);