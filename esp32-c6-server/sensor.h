#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>
#include <Adafruit_BME280.h>

#define SDA_PIN 6
#define SCL_PIN 7

extern Adafruit_BME280 bme;

bool initSensor();

float getTemperature();
float getHumidity();
float getPressure();

#endif