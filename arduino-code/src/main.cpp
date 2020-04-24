#include <Arduino.h>
#include <dht_nonblocking.h>
#define DHT_SENSOR_TYPE DHT_TYPE_11

float temperatures[6];
float humidities[6];
int counter = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

}

static bool measure_environment(float *temperature, float *humidity)
{
  static unsigned long measurement_timestamp = millis();

  /* Measure once every minute. */
  if (millis() - measurement_timestamp > 10000ul)
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
    temperatures[counter] = temperature;
    humidities[counter] = humidity;
    counter++;
    if (counter >= 6) {
      counter = 0;
      float averageTemperature = (temperatures[0]+temperatures[1]+temperatures[2]+temperatures[3]+temperatures[4]+temperatures[5])/6;
      float averageHumidity = (humidities[0]+humidities[1]+humidities[2]+humidities[3]+humidities[4]+humidities[5])/6;
      Serial.print("T=");
      Serial.print(averageTemperature, 1);
      Serial.print(";H=");
      Serial.println(averageHumidity, 1);
    }
    
  }
}