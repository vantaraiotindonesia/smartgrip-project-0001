const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        nama_device: { type: String, required: true },
        mqtt_broker: { type: String, required: true },
        mqtt_topic: { type: String, required: true },
        mqtt_port: { type: Number, required: true },
        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline",
        },
        last_seen: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
