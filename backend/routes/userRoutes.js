const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

// ✅ Register user baru
router.post("/register", async (req, res) => {
    try {
        const { username, password, nama, nomor_karyawan, role } = req.body;
        const user = new User({
            username,
            password,
            nama,
            nomor_karyawan,
            role,
        });
        await user.save();
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ List semua user
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
