#ifndef RGB_H
#define RGB_H

#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

#define RGB_PIN 8
#define NUM_PIXELS 1

extern Adafruit_NeoPixel rgb;

extern uint8_t currentR;
extern uint8_t currentG;
extern uint8_t currentB;

void initRgb();

void setColor(
  uint8_t r,
  uint8_t g,
  uint8_t b
);

#endif