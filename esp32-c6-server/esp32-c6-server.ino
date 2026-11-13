#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

#include "rgb.h"
#include "sensor.h"
#include "ota.h"
#include "secrets.h"

#define FIRMWARE_VERSION "1.0"

WebServer server(80);

void setup() {

  Serial.begin(115200);

  initRgb();

  Serial.println();
  Serial.println("Initializing BME280...");

  if (!initSensor()) {

    Serial.println("Sensor initialization failed!");

  }

  Serial.println();
  Serial.println("Connecting to Wi-Fi...");

  WiFi.begin(WIFI_SSID,
  WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {

    delay(500);

    Serial.print(".");
  }

  Serial.println();
  Serial.println("Wi-Fi connected!");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // RGB endpoints

  server.on("/", handleRoot);
  
  server.on(
    "/api/color",
    HTTP_POST,
    handleColor
  );

  // Sensor endpoint

  server.on(
    "/api/sensor",
    HTTP_GET,
    handleSensor
  );

  // Device status

  server.on(
    "/api/status",
    HTTP_GET,
    handleStatus
  );

  server.on(
    "/api/update",
    HTTP_POST,
    handleUpdate
  );

  server.begin();

  Serial.println("HTTP server started");
}

void loop() {

  server.handleClient();
}

void handleRoot() {

  server.send(
    200,
    "text/plain",
    "ESP32 RGB Controller"
  );
}

void handleSensor() {

  JsonDocument response;

  response["temperature"] = getTemperature();
  response["humidity"] = getHumidity();
  response["pressure"] = getPressure();

  String responseBody;

  serializeJson(
    response,
    responseBody
  );

  server.send(
    200,
    "application/json",
    responseBody
  );
}

void handleColor() {

  if (!server.hasArg("plain")) {

    server.send(
      400,
      "application/json",
      "{\"error\":\"Missing request body\"}"
    );

    return;
  }

  String body = server.arg("plain");

  Serial.print("Received JSON: ");
  Serial.println(body);

  JsonDocument doc;

  DeserializationError error =
    deserializeJson(doc, body);

  if (error) {

    Serial.print("JSON error: ");
    Serial.println(error.c_str());

    server.send(
      400,
      "application/json",
      "{\"error\":\"Invalid JSON\"}"
    );

    return;
  }

  int r = doc["r"] | 0;
  int g = doc["g"] | 0;
  int b = doc["b"] | 0;

  Serial.print("Parsed RGB: ");
  Serial.print(r);
  Serial.print(", ");
  Serial.print(g);
  Serial.print(", ");
  Serial.println(b);

  if (r < 0 || r > 255 ||
      g < 0 || g > 255 ||
      b < 0 || b > 255) {

    server.send(
      400,
      "application/json",
      "{\"error\":\"RGB values must be between 0 and 255\"}"
    );

    return;
  }

  setColor(r, g, b);

  JsonDocument response;

  response["status"] = "success";
  response["r"] = r;
  response["g"] = g;
  response["b"] = b;

  String responseBody;

  serializeJson(
    response,
    responseBody
  );

  server.send(
    200,
    "application/json",
    responseBody
  );
}

void handleStatus() {

  JsonDocument response;

  response["device"] = "esp32-c6";
  response["ip"] = WiFi.localIP().toString();
  response["uptime"] = millis() / 1000;
  response["wifiSignal"] = WiFi.RSSI();
  response["firmwareVersion"] = FIRMWARE_VERSION;

  JsonObject color =
    response["color"].to<JsonObject>();

  color["r"] = currentR;
  color["g"] = currentG;
  color["b"] = currentB;

  JsonObject sensor =
    response["sensor"].to<JsonObject>();

  sensor["temperature"] = getTemperature();
  sensor["humidity"] = getHumidity();
  sensor["pressure"] = getPressure();

  String responseBody;

  serializeJson(
    response,
    responseBody
  );

  server.send(
    200,
    "application/json",
    responseBody
  );
}

void handleUpdate() {

  Serial.println("[OTA] Update requested.");

  server.send(
    200,
    "text/plain",
    "OTA update started"
  );

  delay(100);

  updateFirmware();
}