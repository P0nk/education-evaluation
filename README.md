# education-evaluation
Examensarbete utfört av Erik Larsson och Per Lovén i KTH Kista.

Systemets huvudsyfte är att underlätta arbetet med måluppfyllnad i ett utbildningsprogram på högskola. Detta system lämpar sig åt den som ansvarar för programmet och överser hur examensmålen uppfylls.

Systemet är byggt i Google Apps Script (GAS). Det är uppdelat i flera GAS-projekt som är kopplade till sina egna filer i Google Drive.

## GAS-projekt
Fil-namn | Projekt-namn
------------|------------
Lärandemålslista | Lärandemålslista
Formulärsgenerering | FormCreation
Formulärssvar | Response
Panel | Dashboard
(ingen fil) | Common

## Arkitektur
Systemet består av fem stycken GAS-projekt, och en databas i Google Cloud SQL. GAS-projekten kan ses som moduler som interagerar med databasen. Modulerna arbetar med olika typer av data.

## Language / Språk
The JavaScript code that runs in Apps Script is a blend of English and Swedish. Many variabel and function names include swedish terms. The database is entirely in Swedish. The documentation is in Swedish.

Koden i Apps Script är till större delen skriven på engelska, men många svenska termer förekommer både i variabelnamn och funktionsnamn. Databasen är helt och hållet på svenska. Dokumentationen är på svenska.

