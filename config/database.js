const mongoose =require('mongoose');
const dbConnection=()=>{
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME
}).then((conn) => {
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
})
}
module.exports=dbConnection;