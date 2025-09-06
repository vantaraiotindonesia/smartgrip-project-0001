const express = require("express");
const Device = require("../models/Device");
const User = require("../models/User");
const SensorData = require("../models/SensorData");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ➕ Tambah Device baru → hanya admin
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const {
            user_id,
            nama_device,
            mqtt_broker,
            mqtt_topic,
            mqtt_port,
            status,
        } = req.body;
        const device = new Device({
            user_id,
            nama_device,
            mqtt_broker,
            mqtt_topic,
            mqtt_port,
            status,
        });
        await device.save();
        res.status(201).json(device);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 📋 Ambil semua device → hanya admin
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const devices = await Device.find().populate(
            "user_id",
            "username nama"
        );
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📋 Ambil device berdasarkan user → worker bisa lihat device miliknya sendiri
router.get("/user/:userId", protect, async (req, res) => {
    try {
        if (
            req.user.role !== "admin" &&
            req.user._id.toString() !== req.params.userId
        ) {
            return res.status(403).json({ error: "Access denied" });
        }

        const devices = await Device.find({ user_id: req.params.userId });
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET summary online/offline
router.get("/summary", async (req, res) => {
    try {
        const onlineCount = await Device.countDocuments({ status: "online" });
        const offlineCount = await Device.countDocuments({ status: "offline" });

        res.json({ online: onlineCount, offline: offlineCount });
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get detail device by ID
router.get("/:id/details", async (req, res) => {
    const { id } = req.params;

    try {
        // Ambil device + relasi user
        const device = await Device.findById(id).populate(
            "user_id",
            "nama nomor_karyawan"
        );
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        // Ambil data sensor terbaru untuk device ini
        const latestSensor = await SensorData.findOne({ device_id: id }).sort({
            createdAt: -1,
        });

        res.json({
            id: device._id,
            nama_device: device.nama_device,
            status: device.status,
            last_seen: device.last_seen,
            nama_karyawan: device.user_id?.nama || null,
            nomor_karyawan: device.user_id?.nomor_karyawan || null,
            gyroscope_value: latestSensor?.gyroscope_value || null,
            gps_lat: latestSensor?.gps_lat || null,
            gps_long: latestSensor?.gps_long || null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
