#include <dht_nonblocking.h>
#define DHT_SENSOR_TYPE DHT_TYPE_11

static const int DHT_SENSOR_PIN = 2;
DHT_nonblocking dht_sensor( DHT_SENSOR_PIN, DHT_SENSOR_TYPE );

const int PHOTOCELL_PIN = A0;
const int MOISTURE_PIN = A1;

const int MOTOR_PIN = 7;
String receivedMessage = "";

const int echoPin = 3;
const int trigPin = 4;
long duration;
float distance;

float temperatures[12];
float humidities[12];
float lightsensities[12];
float moistures[12];
float distances[12];
int counter = 0;

void setup() {
  // this is run once
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(MOTOR_PIN, OUTPUT);

  
  Serial.begin(9600);

}

static bool measure_environment(float *temperature, float *humidity)
{  
  static unsigned long measurement_timestamp = millis();

  /* Measure once every 10 seconds */
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

float getDistanceInPercent() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  // Calculating the distance
  distance = duration * 0.0343 / 2; // Speed of sound wave divided by 2 (go and back)
  // Return the value in percent
  float temp = (distance * (-200/9)) + (1400/9);
  temp = constrain(temp, 0, 100);
  return temp;
}

void loop() {
  if (Serial.available() > 0) {
    while (Serial.available()) {
      delay(10);
      receivedMessage += String((char)Serial.read());
    }
    digitalWrite(MOTOR_PIN, HIGH);
    delay(2000);
    digitalWrite(MOTOR_PIN, LOW);
  }
  
  // this runs repeatedly:
  float temperature;
  float humidity;

  // if 10 seconds has gone
  if (measure_environment(&temperature, &humidity) == true)
  {
    temperatures[counter] = temperature;
    humidities[counter] = humidity;
    lightsensities[counter] = analogRead(PHOTOCELL_PIN);
    moistures[counter] = ( 100 - ( (analogRead(MOISTURE_PIN)/1023.00) * 100 ));
    distances[counter] = getDistanceInPercent();

    counter++;
    if (counter >= 12) {
      counter = 0;
      float averageTemperature = returnAverage(temperatures, sizeof(temperatures)/sizeof(temperatures[0]));
      float averageHumidity = returnAverage(humidities, sizeof(humidities)/sizeof(humidities[0]));
      float averageLight = returnAverage(lightsensities, sizeof(lightsensities)/sizeof(lightsensities[0]));
      float averageMoisture = returnAverage(moistures, sizeof(moistures)/sizeof(moistures[0]));
      float averageWaterlevel = returnAverage(distances, sizeof(distances)/sizeof(distances[0]));
      
      Serial.print("T=");
      Serial.print(averageTemperature, 1);
      Serial.print(";H=");
      Serial.print(averageHumidity, 1);
      Serial.print(";LS=");
      Serial.print(averageLight, 1);
      Serial.print(";M=");
      Serial.print(averageMoisture, 1);
      Serial.print(";W=");
      Serial.println(averageWaterlevel, 1);
    }
    
  }
}
