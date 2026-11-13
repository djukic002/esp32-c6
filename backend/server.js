require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    getSensorData,
    saveSensorReading
} = require("./services/sensor.service");

const colorRoutes = require("./routes/color.routes");
const statusRoutes = require("./routes/status.routes");
const historyRoutes = require("./routes/history.routes");
const firmwareRoutes = require("./routes/firmware.routes");
const updateRoutes = require("./routes/update.routes");

const app = express();

const PORT = process.env.PORT || 3000;
const ESP32_URL = process.env.ESP32_URL;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "ESP32 RGB Controller API"
    });
});

app.use("/api/color", colorRoutes(ESP32_URL));
app.use("/api/status", statusRoutes(ESP32_URL));
app.use("/api/history", historyRoutes);
app.use("/api/firmware", firmwareRoutes);
app.use("/api/update", updateRoutes(ESP32_URL));


async function collectSensorData() {
    try {
        const sensor = await getSensorData(ESP32_URL);

        const reading = await saveSensorReading(sensor);

        console.log(
            `Sensor reading saved: ${reading.temperature} °C, ` +
            `${reading.humidity} %, ` +
            `${reading.pressure} hPa`
        );

    } catch (error) {
        console.error("Failed to collect sensor data:", error.message);
    }
}

const SENSOR_INTERVAL = 60 * 1000;

collectSensorData();

setInterval(collectSensorData, SENSOR_INTERVAL);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});