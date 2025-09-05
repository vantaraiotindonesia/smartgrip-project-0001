const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
    {
        device_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true,
        },
        gyroscope_value: { type: Number, required: true },
        gps_lat: { type: Number, required: true },
        gps_long: { type: Number, required: true },
        emergency_alert: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);
