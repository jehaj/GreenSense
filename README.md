# GreenSense
## Hvad er det?
GreenSense er en plantepasser, som giver dig en masse statistik du kan bruge til at få en bedre forståelse for hvordan din plante vokser, samt vande den selv. GreenSense er vores produkt i teknologi og denne Github Repository er hjemmet til at vores kode som får produktet til at virke. Du kan endda selv prøve at bygge GreenSense og bruge vores kode.

## Hvordan ser det ud?
Med din GreenSense sat op, passer den automatisk din plante. Hvis du har lyst til at se omstændighederne dine planter døjer med kan du gøre det ved at besøge hjemmesiden, der indtil videre køres på en RASPBERRY PI.
###Forsiden
![Første billede af forsiden](https://github.com/NikolajK-HTX/GreenSense/blob/master/images/frontpage-1.png "Første billede af forsiden")
![Andet billede af forsiden](https://github.com/NikolajK-HTX/GreenSense/blob/master/images/frontpage-2.png "Andet billede af forsiden")

###Personlige side
![Første billede af personlige side](https://github.com/NikolajK-HTX/GreenSense/blob/master/images/personal-1.png "Første billede af personlige side")
Det er muligt at ændre billedet af din plante. Enten ved at uploade et billede eller ved at tage et nyt med din telefon.

![Andet billede af personlige side](https://github.com/NikolajK-HTX/GreenSense/blob/master/images/personal-2.png "Andet billede af personlige side")
Ved at trykke på de små grafer, loades de op på den store graf. Man kan have mere end én for at sammenligne værdierne.

## Hvordan kan jeg bruge det?
Først skal du sikre dig, at din computer har hvad der er nødvendigt for at køre koden. Det kræver **Nodejs** for at køre serveren, som kan hentes gratis. Resten af koden kommer til at køre i browseren.
Klon koden ved at bruge *Git* og kør derefter følgende kommandoer i server folderen. (anden linje er ikke nødvendig lige nu, da databasen allerede ligger i dette repository). Du kan fjerne alt data ved at slette arduinoDatabase.db og køre koden set i anden linje.
```
npm install
node createdatabase.js
```
Ovenstående kode har gjort din computer klar til at starte serveren. For at gøre det skriv følgende,
```
node app.js
```
For at komme ind på serveren skal du kende IP-addressen til den computer, hvor serveren bliver kørt fra. Det kan anbefales at køre serveren på en Raspberry PI.
