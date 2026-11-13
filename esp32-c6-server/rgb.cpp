#include "rgb.h"

Adafruit_NeoPixel rgb(
  NUM_PIXELS,
  RGB_PIN,
  NEO_RGB + NEO_KHZ800
);

uint8_t currentR = 0;
uint8_t currentG = 0;
uint8_t currentB = 0;

void initRgb() {

  rgb.begin();
  rgb.clear();
  rgb.show();
}

void setColor(
  uint8_t r,
  uint8_t g,
  uint8_t b
) {

  currentR = r;
  currentG = g;
  currentB = b;

  rgb.setPixelColor(
    0,
    rgb.Color(r, g, b)
  );

  rgb.show();

  Serial.print("RGB: ");
  Serial.print(r);
  Serial.print(", ");
  Serial.print(g);
  Serial.print(", ");
  Serial.println(b);
}