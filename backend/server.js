const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const sensorRoutes = require("./routes/sensorRoutes");

app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);

app.get("/", (req, res) => {
    res.send("SmartGrip API running...");
});

// nanti di sini kita tambah route user/device/sensor

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
