const express = require("express");

const router = express.Router();

module.exports = (ESP32_URL) => {

    router.post("/", async (req, res) => {

        try {

            const response = await fetch(
                `${ESP32_URL}/api/update`,
                {
                    method: "POST"
                }
            );

            const responseBody = await response.text();

            if (!response.ok) {

                return res.status(response.status).json({
                    error: "ESP32 update request failed",
                    details: responseBody
                });
            }

            res.status(200).json({
                status: "success",
                message: "Firmware update started"
            });

        } catch (error) {

            console.error(
                "Failed to start ESP32 update:",
                error.message
            );

            res.status(500).json({
                error: "Failed to connect to ESP32",
                details: error.message
            });
        }
    });

    return router;
};