const fs=require('fs');
require('colors');
const dotenv=require('dotenv');

const Product =require('../../models/productModel');
const dbConnection=require('../../config/database');
dotenv.config({path:'../../.env'});


console.log("Database URL:", process.env.DB_URL);
dbConnection();

const products=JSON.parse(fs.readFileSync(`./products.json`));
const insertData=async()=>{
    try {
        await Product.create(products);
        console.log('data inserted'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const deleteData=async()=>{
    try {
        await Product.deleteMany();
        console.log('data deleted'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}
// node seeder --i  to insert
if(process.argv[2]==='--i'){
    insertData();
    // node seeder --d  to delete
}else if(process.argv[2]==='--d'){
    deleteData();
}