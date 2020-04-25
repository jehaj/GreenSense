#include <dht_nonblocking.h>
#define DHT_SENSOR_TYPE DHT_TYPE_11

static const int DHT_SENSOR_PIN = 2;
DHT_nonblocking dht_sensor( DHT_SENSOR_PIN, DHT_SENSOR_TYPE );

static const int PHOTOCELL_PIN = 0;

float temperatures[12];
float humidities[12];
float lightsensities[12];
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

static float returnAverage(float myArray[], int size) {
  float sum = 0;
  for (int i = 0; i < size; i++) {
    sum = sum + myArray[i];
  }
  float average = sum/size;
  return average;
  
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
    lightsensities[counter] = analogRead(PHOTOCELL_PIN);
    counter++;
    if (counter >= 12) {
      counter = 0;
      float averageTemperature = returnAverage(temperatures, sizeof(temperatures)/sizeof(temperatures[0]));
      float averageHumidity = returnAverage(humidities, sizeof(humidities)/sizeof(humidities[0]));
      float averageLight = returnAverage(lightsensities, sizeof(lightsensities)/sizeof(lightsensities[0]));
      Serial.print("T=");
      Serial.print(averageTemperature, 1);
      Serial.print(";H=");
      Serial.print(averageHumidity, 1);
      Serial.print(";LS=");
      Serial.println(averageLight, 1);
    }
    
  }
}
