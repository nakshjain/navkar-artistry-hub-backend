require("./config/env");
const express =require('express');
const app=express();
const cors = require('cors');

const PORT=env.PORT;

require('./config/db')

app.use(cors({
    origin: env.ORIGIN_URL,
    credentials: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json())

const assetDecorator = require("./middleware/assetDecorator");
app.use(assetDecorator);
app.use("/", require("./routes"));

app.get('/', (req, res) => {
    res.send('Welcome to the root endpoint!');
});

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})