const express = require("express");
const Device = require("../models/Device");
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

module.exports = router;
