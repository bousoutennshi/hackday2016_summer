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
  
  pinMode(4, OUTPUT);
  digitalWrite(4, LOW);
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
  delay(5000);
  
  //uint32 val0 = check(0);

  int channel = 0;
  uint8 cmd = (0b11 << 3) | channel;

  const uint32 COMMAND_LENGTH = 5;
  const uint32 RESPONSE_LENGTH = 12;

  uint32 retval = spi_transaction(HSPI, 0, 0, 0, 0, COMMAND_LENGTH, cmd, RESPONSE_LENGTH, 0);

  uint32 val0 = retval & 0x3FF; // mask to 10-bit value  
  char out[9];
  itoa(val0, out, 10);
  
  Serial.print("val:");
  Serial.print(out);
  Serial.print("\n");

  if (!wclient.connect(host, httpPort)) {
    digitalWrite(4, HIGH);
    return;
  } else {
    digitalWrite(4, LOW);
  }

  String url = "/add/commodity_history?user_id=dkawashi&commodity_id=1&weight=";
  url.concat(out);

  wclient.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
} 

uint32 check(int channel) {
  uint8 cmd = (0b11 << 3) | channel;

  const uint32 COMMAND_LENGTH = 5;
  const uint32 RESPONSE_LENGTH = 12;

  uint32 retval = spi_transaction(HSPI, 0, 0, 0, 0, COMMAND_LENGTH, cmd, RESPONSE_LENGTH, 0);

  retval = retval & 0x3FF; // mask to 10-bit value
  return retval;
}
