const express =require('express');
const dotenv=require("dotenv")
const app=express();
const cors = require('cors');

const PORT=process.env.PORT;

dotenv.config({path: './config.env'})
require('./db/mongoDb')

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json())

const authRouter = require('./router/auth');
app.use('/auth', authRouter);
const userRouter = require('./router/user');
app.use('/user', userRouter);
const productRouter = require('./router/product');
app.use('/product', productRouter);
const wishlistRouter = require('./router/wishlist');
app.use('/wishlist', wishlistRouter);
const cartRouter = require('./router/cart');
app.use('/cart', cartRouter);
const orderRouter = require('./router/order');
app.use('/order', orderRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the root endpoint!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})