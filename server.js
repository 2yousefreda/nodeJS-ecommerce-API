const express =require('express');
const dotenv =require('dotenv').config();
var morgan = require('morgan')
const ApiError=require('./utils/apiError');
const glopalError =require('./middlewares/errorMiddleware');
const CategoryRoute=require('./routes/categoryRoute');
const subCategoryRoute=require('./routes/subCategoryRoute');
const brandRoute=require('./routes/brandRoute');
const productRoute=require('./routes/productRoute');

const dbConnection=require('./config/database');

dbConnection();

const app = express();  
app.use(express.json());
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}




app.use('/api/v1/categories',CategoryRoute);
app.use('/api/v1/subcategories',subCategoryRoute);
app.use('/api/v1/brands',brandRoute);
app.use('/api/v1/products',productRoute);


app.all(/.*/, (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(glopalError);


const PORT=process.env.PORT || 8000;
const server =app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
});

process.on('unhandledRejection', (err) => {
    console.error(`UNHANDLED REJECTION! Error: ${err.name} - ${err.message}`);
    server.close(() =>{
        process.exit(1);
    })
    
});