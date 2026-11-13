const express = require("express");

module.exports = function (esp32Url) {
    const router = express.Router();

    router.post("/", async (req, res) => {
        const { r, g, b } = req.body;

        if (
            typeof r !== "number" ||
            typeof g !== "number" ||
            typeof b !== "number"
        ) {
            return res.status(400).json({
                error: "r, g and b must be numbers"
            });
        }

        if (
            r < 0 || r > 255 ||
            g < 0 || g > 255 ||
            b < 0 || b > 255
        ) {
            return res.status(400).json({
                error: "RGB values must be between 0 and 255"
            });
        }

        try {
            const response = await fetch(`${esp32Url}/api/color`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ r, g, b })
            });

            const data = await response.json();

            res.status(response.status).json(data);

        } catch (error) {
            console.error("ESP32 error:", error);

            res.status(500).json({
                error: "Could not connect to ESP32"
            });
        }
    });

    return router;
};