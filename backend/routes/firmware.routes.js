const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
    const firmwarePath = path.join(
        __dirname,
        "..",
        "firmware",
        "firmware.bin"
    );

    res.download(
        firmwarePath,
        "firmware.bin",
        error => {
            if (error) {
                console.error("Firmware error:", error);

                if (!res.headersSent) {
                    res.status(404).json({
                        error: "Firmware file not found"
                    });
                }
            }
        }
    );
});

module.exports = router;