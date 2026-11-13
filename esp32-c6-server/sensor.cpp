#include "sensor.h"

Adafruit_BME280 bme;

bool initSensor() {

  Wire.begin(SDA_PIN, SCL_PIN);

  if (!bme.begin(0x76)) {

    Serial.println("BME280 nije pronadjen!");

    return false;
  }

  Serial.println("BME280 je pronadjen!");

  return true;
}

float getTemperature() {

  return bme.readTemperature();
}

float getHumidity() {

  return bme.readHumidity();
}

float getPressure() {

  return bme.readPressure() / 100.0F;
}