extern "C"{
#include <spi.h>
#include <spi_register.h>
}

#include <ESP8266WiFi.h>
#include "config.h"

WiFiClient wclient;

const char* host = "210-140-101-90.jp-east.compute.idcfcloud.com";
const int httpPort = 8080;

void setup()
{ 
  Serial.begin(115200);
  Serial.print("\n");

  spi_init(HSPI);
  pinMode(0, OUTPUT);
  digitalWrite(0, HIGH);
  pinMode(4, OUTPUT);
  digitalWrite(4, LOW);
  pinMode(16, OUTPUT);
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

  // insert val
  String url = "/add/commodity_history?user_id=dkawashi&commodity_id=1&weight=";
  url.concat(out);

  wclient.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
  /*
  // get status
  url = "/get/status?user_id=dkawashi&commodity_id=1";
  wclient.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
               */
               
  delay(1000);

} 
