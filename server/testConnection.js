const mongoose = require("mongoose");
require("dotenv").config();

(async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to:", conn.connection.host);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();