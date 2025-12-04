require("./config/env");
const express = require("express");
const app = express();
const cors = require("cors");
const requestContext = require("./utils/requestContext");

const logger = require("./utils/logger");

app.use((req, res, next) => {
    requestContext.run({ req }, () => next());
});

const PORT = env.PORT;

require("./config/db");

// ------------------------
// GLOBAL REQUEST LOGGER
// ------------------------
app.use((req, res, next) => {
    logger.info("[REQUEST]", {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });
    next();
});

app.use(cors({
    origin: env.ORIGIN_URL,
    credentials: true
}));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
    if (req.method !== "GET") {
        logger.info("[REQUEST_BODY]", {
            url: req.originalUrl,
            keys: Object.keys(req.body || {})
        });
    }
    next();
});

const assetDecorator = require("./middleware/assetDecorator");
logger.info("[SERVER] Asset decorator middleware loaded.");
app.use(assetDecorator);

logger.info("[SERVER] Routes initialized.");
app.use("/", require("./routes"));

app.get("/", (req, res) => {
    logger.info("[ROOT] Hit root endpoint");
    res.send("Welcome to the root endpoint!");
});

app.listen(PORT, () => {
    logger.info(`[SERVER] Running on PORT ${PORT}`);
});