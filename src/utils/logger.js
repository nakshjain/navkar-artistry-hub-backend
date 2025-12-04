const format = (level, message, meta) => {
    const time = new Date().toISOString();

    return JSON.stringify({
        time,
        level,
        message,
        ...(meta ? { meta } : {})
    });
};

module.exports = {
    info: (message, meta = null) => {
        console.log(format("INFO", message, meta));
    },

    warn: (message, meta = null) => {
        console.warn(format("WARN", message, meta));
    },

    error: (message, meta = null) => {
        console.error(format("ERROR", message, meta));
    }
};