# GreenSense
## Hvad er det?
GreenSense er en plantepasser, som giver dig en masse statistik du kan bruge til at få en bedre forståelse for hvordan din plante vokser, samt vande den selv. GreenSense er vores produkt i teknologi og denne Github Repository er hjemmet til at vores kode som får produktet til at virke. Du kan endda selv prøve at bygge GreenSense og bruge vores kode.

## Hvordan kan jeg bruge det?
Først skal du sikre dig, at din computer har hvad der er nødvendigt for at køre koden. Det kræver **Nodejs** for at køre serveren, som kan hentes gratis. Resten af koden kommer til at køre i browseren.
Klon koden ved at bruge *Git* og kør derefter følgende kommandoer i server folderen. (anden linje er ikke nødvendig lige nu, da databasen allerede ligger i dette repository).
```
npm install
node createdatabase.js
```
Ovenstående kode har gjort din computer klar til at starte serveren. For at gøre det skriv følgende,
```
node app.js
```
For at komme ind på serveren skal du kende IP-addressen til den computer, hvor serveren bliver kørt fra. Det kan anbefales at køre serveren på en Raspberry PI.
