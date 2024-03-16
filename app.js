const express =require('express');
const dotenv=require("dotenv")
const app=express();
const cors = require('cors');
dotenv.config({path: './config.env'})
require('./db/mongoDb')

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json())
const PORT=process.env.PORT;

app.use(require('./router/auth'));
app.use(require('./router/user'));
app.use(require('./router/product'));

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})