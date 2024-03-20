const express =require('express');
const dotenv=require("dotenv")
const app=express();
const cors = require('cors');
dotenv.config({path: './config.env'})
require('./db/mongoDb')

app.use(cors({
    origin: 'https://navkarartistryhub.netlify.app',
    credentials: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json())
const PORT=process.env.PORT;

const authRouter = require('./router/auth');
app.use('/auth', authRouter);
const userRouter = require('./router/user');
app.use('/user', userRouter);
const productRouter = require('./router/product');
app.use('/product', productRouter);
const cartRouter = require('./router/cart');
app.use('/cart', cartRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the root endpoint!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})