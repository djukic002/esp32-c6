const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                timestamp,
                temperature,
                humidity,
                pressure
            FROM sensor_readings
            ORDER BY timestamp DESC
            LIMIT 100
        `);

        res.json(result.rows);

    } catch (error) {
        console.error("History error:", error);

        res.status(500).json({
            error: "Could not retrieve sensor history"
        });
    }
});

module.exports = router;