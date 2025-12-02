require("./config/env");
const express =require('express');
const dotenv=require("dotenv")
const app=express();
const cors = require('cors');

const PORT=env.PORT;

dotenv.config({path: './config.env'})
require('./config/db')

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json())

const assetDecorator = require("./middleware/assetDecorator");
app.use(assetDecorator);
const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);
const homeRouter = require('./routes/home.routes');
app.use('/home', homeRouter);
const userRouter = require('./routes/user.routes');
app.use('/user', userRouter);
const productRouter = require('./routes/product.routes');
app.use('/product', productRouter);
const wishlistRouter = require('./routes/wishlist.routes');
app.use('/wishlist', wishlistRouter);
const cartRouter = require('./routes/cart.routes');
app.use('/cart', cartRouter);
const orderRouter = require('./routes/order.routes');
app.use('/order', orderRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the root endpoint!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})