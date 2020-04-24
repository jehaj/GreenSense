#include <Arduino.h>
#include <dht_nonblocking.h>
#define DHT_SENSOR_TYPE DHT_TYPE_11

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

}

static bool measure_environment(float *temperature, float *humidity)
{
  static unsigned long measurement_timestamp = millis();

  /* Measure once every minute. */
  if (millis() - measurement_timestamp > 60000ul)
  {
    if (dht_sensor.measure(temperature, humidity) == true)
    {
      measurement_timestamp = millis();
      return (true);
    }
  }

  return (false);
}

void loop() {
  // put your main code here, to run repeatedly:
  float temperature;
  float humidity;

  /* Measure temperature and humidity.  If the functions returns
     true, then a measurement is available. */
  if (measure_environment(&temperature, &humidity) == true)
  {
    Serial.print("T=");
    Serial.print(temperature, 1);
    Serial.print(";H=");
    Serial.println(humidity, 1);
  }
}