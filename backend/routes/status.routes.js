const express = require("express");

module.exports = function (esp32Url) {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const response = await fetch(`${esp32Url}/api/status`);

            if (!response.ok) {
                throw new Error("ESP32 returned an error");
            }

            const data = await response.json();

            res.json({
                ...data,
                online: true
            });

        } catch (error) {
            console.error("ESP32 status error:", error);

            res.status(503).json({
                device: "esp32-c6",
                online: false,
                ip: esp32Url.replace("http://", "")
            });
        }
    });

    return router;
};