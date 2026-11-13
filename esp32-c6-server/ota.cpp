#include "ota.h"

#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>

#include "secrets.h"

bool updateFirmware() {

  Serial.println("[OTA] Starting firmware update...");
  Serial.print("[OTA] URL: ");
  Serial.println(FIRMWARE_URL);

  HTTPClient http;

  if (!http.begin(FIRMWARE_URL)) {

    Serial.println("[OTA] Failed to initialize HTTP connection.");

    return false;
  }

  int httpCode = http.GET();

  if (httpCode != HTTP_CODE_OK) {

    Serial.print("[OTA] HTTP error: ");
    Serial.println(httpCode);

    http.end();

    return false;
  }

  int contentLength = http.getSize();

  Serial.print("[OTA] Firmware size: ");
  Serial.print(contentLength);
  Serial.println(" bytes");

  if (contentLength <= 0) {

    Serial.println("[OTA] Invalid firmware size.");

    http.end();

    return false;
  }

  if (!Update.begin(contentLength)) {

    Serial.println("[OTA] Not enough space for firmware.");

    Update.printError(Serial);

    http.end();

    return false;
  }

  WiFiClient* stream = http.getStreamPtr();

  uint8_t buffer[1024];

  size_t written = 0;
  int lastProgress = -1;

  while (http.connected() && written < contentLength) {

    size_t available = stream->available();

    if (available > 0) {

      size_t bytesToRead = min(
        available,
        sizeof(buffer)
      );

      size_t len = stream->readBytes(
        buffer,
        bytesToRead
      );

      if (len > 0) {

        size_t writtenBytes = Update.write(
          buffer,
          len
        );

        if (writtenBytes != len) {

          Serial.println();
          Serial.println("[OTA] Failed to write firmware data.");

          Update.printError(Serial);

          http.end();
          Update.end(false);

          return false;
        }

        written += writtenBytes;

        int progress =
          (written * 100) / contentLength;

        if (progress >= lastProgress + 10) {

          Serial.print("[OTA] Downloaded: ");
          Serial.print(progress);
          Serial.println("%");

          lastProgress = progress;
        }
      }

    } else {

      delay(1);
    }
  }

  http.end();

  Serial.println();

  if (written != contentLength) {

    Serial.println(
      "[OTA] Firmware download incomplete."
    );

    Update.end(false);

    return false;
  }

  if (!Update.end(true)) {

    Serial.println(
      "[OTA] Failed to commit OTA update."
    );

    Update.printError(Serial);

    return false;
  }

  Serial.println(
    "[OTA] OTA update successful!"
  );

  Serial.println(
    "[OTA] Restarting ESP32..."
  );

  delay(100);

  ESP.restart();

  return true;
}