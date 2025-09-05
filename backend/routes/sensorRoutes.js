const express = require("express");
const SensorData = require("../models/SensorData");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Tambah data sensor (dipakai device IoT untuk kirim data)
router.post("/", async (req, res) => {
    try {
        const {
            device_id,
            gyroscope_value,
            gps_lat,
            gps_long,
            emergency_alert,
        } = req.body;

        const data = new SensorData({
            device_id,
            gyroscope_value,
            gps_lat,
            gps_long,
            emergency_alert,
        });

        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 📌 Ambil semua data sensor (hanya admin)
router.get("/", protect, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }

        const data = await SensorData.find().populate(
            "device_id",
            "nama_device"
        );
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📌 Ambil data sensor untuk device tertentu (worker bisa lihat device-nya sendiri)
router.get("/device/:deviceId", protect, async (req, res) => {
    try {
        const data = await SensorData.find({
            device_id: req.params.deviceId,
        }).sort({ timestamp: -1 });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
