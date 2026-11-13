const pool = require("../db");

async function getSensorData(esp32Url) {
    const response = await fetch(`${esp32Url}/api/status`);

    if (!response.ok) {
        throw new Error("ESP32 returned an error");
    }

    const data = await response.json();

    if (!data.sensor) {
        throw new Error("ESP32 response does not contain sensor data");
    }

    return data.sensor;
}

async function saveSensorReading(sensor) {
    const { temperature, humidity, pressure } = sensor;

    const query = `
        INSERT INTO sensor_readings (
            temperature,
            humidity,
            pressure
        )
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [
        temperature,
        humidity,
        pressure
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}

module.exports = {
    getSensorData,
    saveSensorReading
};