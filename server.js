const express = require("express");
const userRoutes = require("./routes/user.routes");
const playerRoutes = require("./routes/player.routes");
const skillRoutes = require("./routes/skill.routes");
const techniqueRoutes = require("./routes/technique.routes");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const { requireAuth, checkUser } = require("./middleware/auth.middleware");
const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

app.use((req, res, next) => {
    res.header({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    next();
});

// jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (require, res) => {
    res.status(200).send(res.locals.user._id);
});

// routes
app.use("/api/user", userRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/technique", techniqueRoutes);

// server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});