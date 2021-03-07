const express = require("express");
const bodyParser = require("body-parser");
const playerRoutes = require("./routes/player.routes");
const skillRoutes = require("./routes/skill.routes");
const techniqueRoutes = require("./routes/technique.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api/player", playerRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/technique", techniqueRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
