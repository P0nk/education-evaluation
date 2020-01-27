# education-evaluation
Examensarbete utfört av Erik Larsson och Per Lovén i KTH Kista.

Systemets huvudsyfte är att underlätta arbetet med måluppfyllnad i ett utbildningsprogram på högskola. Detta system är tillämpat för den som ansvarar för programmet och överser hur examensmålen uppfylls.

Systemet är byggt i Google Apps Script (GAS). Det är uppdelat i flera GAS-projekt som är kopplade till sina egna filer i Google Drive.
Alla filer och skript finns öppet tillgängliga på Google Drive: https://drive.google.com/drive/folders/1P2rvTCnUTUdEOASsFDHuBYKD5NdAWpOw?usp=sharing
Filerna är kopplade till GAS-projekt vars kod finns i detta repository. Det finns alltså två sätt att komma åt koden.

## Dokumentation
Google Sites-filen "Dokumentation för användare" är en användarmanual. Den beskriver hur delsystemen ska användas.

## GAS-projekt
Fil-namn | Projekt-namn
------------|------------
Lärandemålslista | Lärandemålslista
Formulärsgenerering | Formulärsgenerering
Formulärssvar | Response
Panel | Dashboard
(ingen fil) | Common

Man kan öppna GAS-projekt direkt via Apps Script dashboard: https://script.google.com/
Alternativt kan man öppna filen som skriptet är kopplat till, och sedan via menyn klicka Tools -> Script editor.

## Arkitektur
Systemet består av fem stycken GAS-projekt, och en databas i Google Cloud SQL. GAS-projekten kan ses som moduler som interagerar med databasen via ett bibliotek, men helt separerade från varandra.
![alt text](https://github.com/P0nk/education-evaluation/blob/master/images/Systemarkitektur.png "Architecture")

## Language / Språk
The Apps Script code is a blend of English and Swedish. Many variabel and function names include swedish terms. The database is entirely in Swedish. The documentation is in Swedish.

Koden i Apps Script är till större delen skriven på engelska, men många svenska termer förekommer både i variabelnamn och funktionsnamn. Databasen är helt och hållet på svenska. Dokumentationen är på svenska.

## Installation
Det är möjligt att köra en egen kopia av systemet, dock så kräver det en hel del konfiguration.

**Översikt**
1. Kopiera filerna.
2. Installera databasen.
3. Koppla ihop biblioteket med databasen.
4. Spara en version av biblioteket.
5. Leta upp bibliotekets id.
6. Koppla ihop projekten med biblioteket.
7. Lägg till en trigger.

### Kopiera filerna
1. Kopiera alla filer från Drive-foldern som är länkad längst upp i detta dokument.
2. Ändra namn på filerna. De enda kraven som finns är att det måste finnas en folder med det exakta namnet "Genererade formulär" där nya formulär placeras, och en Google Sheets-fil med det exakta namnet "Formulärssvar" där svar till nya formulär hamnar.

### Installera databasen
1. Skapa en Cloud SQL-instans med MySQL 5.7.
2. Koppla upp dig till databasen med Google Cloud Proxy: https://cloud.google.com/sql/docs/mysql/connect-admin-proxy
3. Koppla upp dig till databasen med en MySQL-klient via Cloud Proxy. En av de bästa MySQL-klienter är MySQL Workbench: https://www.mysql.com/products/workbench/
4. Skapa ett nytt schema med skriptet "database-backup.sql". 

   * I MySQL Workbench gör man det via menyn: Server > Data Import > välj "Import from Self-Contained File" > ange adress till filen > Start Import
   
### Koppla ihop biblioteket med databasen
1. Öppna GAS-projektet "Common".
2. Lägg till properties via menyn File > Project properties > Script properties. De properties som behöver läggas till finns i tabellen nedanför.

Property | Value
----------|------
DB_SUBNAME | ("Instance connection name" taget från Cloud SQL-instansen)
DB_SCHEMA | education_evaluation
DB_PASSWORD | (Lösenord till root-användaren i databasen)

### Spara en version av biblioteket
1. Öppna GAS-projektet "Common".
2. Via menyn: File > Manage versions... > klicka på "Save new version"

### Leta upp bibliotekets id
1. Öppna GAS-projektet "Common".
2. Via menyn: File > Project properties > Script ID

### Koppla ihop projekten med biblioteket
För alla GAS-projekt (Lärandemålslista, Formulärsgenerering, Response, Dashboard) gäller samma process:

1. Öppna GAS-projektet.
2. Via menyn: Resources > Libraries...
3. Ta bort alla befintliga bibliotek i listan.
4. Fyll i bibliotekets id i rutan, och klicka på Add. 
5. Välj den senaste versionen i dropdown-menyn i den nya raden som lades till.
