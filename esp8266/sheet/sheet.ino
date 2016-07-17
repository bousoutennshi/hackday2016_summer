nclude <spi.h>
#include <spi_register.h>
}

#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include "config.h"
#define BUFFER_SIZE 300

WiFiClient wclient;
int flag = 0;

const char* host = "210-140-101-90.jp-east.compute.idcfcloud.com";
const int httpPort = 8080;

void setup()
{
  Serial.begin(115200);
  Serial.print("\n");

  spi_init(HSPI);
  pinMode(0, OUTPUT); //blue
  digitalWrite(0, HIGH);
  pinMode(4, OUTPUT); // red
  digitalWrite(4, LOW);
  pinMode(16, OUTPUT); // green
  digitalWrite(16, HIGH);
  Serial.println("Ready...");

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

}


void loop()
{
  int channel = 0;

  int val = analogRead(A0);
  String out = String(val);

  Serial.print("val:");
  Serial.print(out);
  Serial.print("\n");

  if (!wclient.connect(host, httpPort)) {
    digitalWrite(4, LOW);
    digitalWrite(16, HIGH);
    return;
  } else {
    digitalWrite(4, HIGH);
    digitalWrite(16, LOW);
  }

  if (flag == 1) {
    // insert val
    Serial.println("insert");
    String url = "/add/commodity_history?user_id=dkawashi&commodity_id=1&weight=";
    url.concat(out);
    wclient.print(String("GET ") + url + " HTTP/1.1\r\n" +
                  "Host: " + host + "\r\n" +
                  "Connection: close\r\n\r\n");
    flag = 0;
  } else {
    Serial.println("status");
    // get status
    String url2 = "/get/status?user_id=dkawashi&commodity_id=1";
    /*
      wclient.print(String("GET ") + url2 + " HTTP/1.1\r\n" +
                  "Host: " + host + "\r\n" +
                  "Connection: close\r\n\r\n");
    */
    wclient.println("GET /get/status?user_id=dkawashi&commodity_id=1 HTTP/1.0");
    wclient.println();
    delay(100);
    while (wclient.available()) {
      String line = wclient.readStringUntil('\n');
      char buf[BUFFER_SIZE];
      line.toCharArray(buf, BUFFER_SIZE);
      StaticJsonBuffer<BUFFER_SIZE> jsonBuffer;
      JsonObject& root = jsonBuffer.parseObject(buf);
      int s = root["status"];

      Serial.print("line : ");
      Serial.println(line);

      if (s == 1) {
        digitalWrite(0, HIGH);
        digitalWrite(4, LOW);
        digitalWrite(16, LOW);
        delay(300);
        digitalWrite(4, HIGH);
        digitalWrite(16, HIGH);
        delay(300);
        digitalWrite(4, LOW);
        digitalWrite(16, LOW);
        delay(300);
        digitalWrite(4, HIGH);
        digitalWrite(16, HIGH);
        delay(300);
        digitalWrite(4, LOW);
        digitalWrite(16, LOW);
        delay(300);
        digitalWrite(4, HIGH);
        digitalWrite(16, HIGH);
        delay(300);
        digitalWrite(4, LOW);
        digitalWrite(16, LOW);
        delay(300);
        digitalWrite(4, HIGH);
        digitalWrite(16, HIGH);
        delay(300);
        digitalWrite(4, LOW);
        digitalWrite(16, LOW);
        delay(300);
        digitalWrite(4, HIGH);
        digitalWrite(16, LOW);
      }

    }
    flag = 1;
  }

  delay(1000);

}
