CREATE DATABASE  IF NOT EXISTS `education_evaluation` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `education_evaluation`;
-- MySQL dump 10.13  Distrib 5.7.20, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: education_evaluation
-- ------------------------------------------------------
-- Server version	5.7.14-google

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aktiveratlarandemal`
--

DROP TABLE IF EXISTS `aktiveratlarandemal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aktiveratlarandemal` (
  `larandemal` int(11) NOT NULL,
  `aktiverat` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`larandemal`),
  CONSTRAINT `aktiveradelarandemal` FOREIGN KEY (`larandemal`) REFERENCES `larandemal` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aktiveratlarandemal`
--

LOCK TABLES `aktiveratlarandemal` WRITE;
/*!40000 ALTER TABLE `aktiveratlarandemal` DISABLE KEYS */;
INSERT INTO `aktiveratlarandemal` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(21,1),(22,1),(23,1),(24,1),(33,1),(34,1),(35,1),(36,1),(37,1),(38,1),(39,1),(40,1),(41,1),(42,1),(43,1),(44,1),(45,1),(46,1),(47,1),(48,1),(49,1),(50,1),(51,1),(52,1),(53,1),(54,1),(55,1),(56,1),(57,1),(58,1),(59,1),(60,1),(61,1),(62,1),(63,1),(64,1),(65,1),(66,1),(67,1),(68,1),(69,1),(70,1),(71,1),(72,1),(73,1),(74,1),(75,1),(76,1),(77,1),(78,1),(79,1),(80,1),(81,1),(82,1),(83,1),(84,1),(85,1),(86,1),(87,1),(88,1),(89,1),(90,1),(91,1),(92,1),(93,1);
/*!40000 ALTER TABLE `aktiveratlarandemal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arskull`
--

DROP TABLE IF EXISTS `arskull`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arskull` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `program` varchar(64) NOT NULL,
  `terminstart` varchar(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `AN1` (`program`,`terminstart`),
  CONSTRAINT `arskull.program` FOREIGN KEY (`program`) REFERENCES `program` (`programkod`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='	';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arskull`
--

LOCK TABLES `arskull` WRITE;
/*!40000 ALTER TABLE `arskull` DISABLE KEYS */;
INSERT INTO `arskull` VALUES (2,'TIDAB','HT17'),(1,'TIDAB','HT19'),(3,'TIDAB','HT20'),(4,'TIEDB','HT20');
/*!40000 ALTER TABLE `arskull` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bloom`
--

DROP TABLE IF EXISTS `bloom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bloom` (
  `niva` int(1) NOT NULL,
  `niva_text` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`niva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloom`
--

LOCK TABLES `bloom` WRITE;
/*!40000 ALTER TABLE `bloom` DISABLE KEYS */;
INSERT INTO `bloom` VALUES (1,'Fakta'),(2,'Förståelse'),(3,'Tillämpning'),(4,'Analys'),(5,'Syntes'),(6,'Värdering');
/*!40000 ALTER TABLE `bloom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enkat`
--

DROP TABLE IF EXISTS `enkat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enkat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `form_id` varchar(128) DEFAULT NULL,
  `skapad` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `form_id_UNIQUE` (`form_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enkat`
--

LOCK TABLES `enkat` WRITE;
/*!40000 ALTER TABLE `enkat` DISABLE KEYS */;
/*!40000 ALTER TABLE `enkat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enkatfraga`
--

DROP TABLE IF EXISTS `enkatfraga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enkatfraga` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enkat` int(11) NOT NULL,
  `larandemal` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`enkat`,`larandemal`),
  KEY `larandemal_idx` (`larandemal`),
  CONSTRAINT `enkatfraga.enkat` FOREIGN KEY (`enkat`) REFERENCES `enkat` (`id`),
  CONSTRAINT `enkatfraga.larandemal` FOREIGN KEY (`larandemal`) REFERENCES `larandemal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=415 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enkatfraga`
--

LOCK TABLES `enkatfraga` WRITE;
/*!40000 ALTER TABLE `enkatfraga` DISABLE KEYS */;
/*!40000 ALTER TABLE `enkatfraga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enkatfragesvar`
--

DROP TABLE IF EXISTS `enkatfragesvar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enkatfragesvar` (
  `respons` int(11) NOT NULL,
  `enkatfraga` int(11) NOT NULL,
  `svar` tinyint(4) NOT NULL,
  PRIMARY KEY (`respons`,`enkatfraga`),
  KEY `enkatfraga_idx` (`enkatfraga`),
  CONSTRAINT `enkatfragesvar.enkatfraga` FOREIGN KEY (`enkatfraga`) REFERENCES `enkatfraga` (`id`),
  CONSTRAINT `enkatfragesvar.respons` FOREIGN KEY (`respons`) REFERENCES `respons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enkatfragesvar`
--

LOCK TABLES `enkatfragesvar` WRITE;
/*!40000 ALTER TABLE `enkatfragesvar` DISABLE KEYS */;
/*!40000 ALTER TABLE `enkatfragesvar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inriktning`
--

DROP TABLE IF EXISTS `inriktning`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inriktning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `namn` varchar(64) NOT NULL,
  `arskull` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inriktning.arskull_idx` (`arskull`),
  CONSTRAINT `inriktning.arskull` FOREIGN KEY (`arskull`) REFERENCES `arskull` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inriktning`
--

LOCK TABLES `inriktning` WRITE;
/*!40000 ALTER TABLE `inriktning` DISABLE KEYS */;
INSERT INTO `inriktning` VALUES (1,'Programutveckling',2),(2,'Sakernas internet',2),(3,'Programutveckling',3),(4,'Sakernas internet',3);
/*!40000 ALTER TABLE `inriktning` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inriktningskurs`
--

DROP TABLE IF EXISTS `inriktningskurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inriktningskurs` (
  `inriktning` int(11) NOT NULL,
  `kurs` int(11) NOT NULL,
  `ar` int(1) NOT NULL,
  PRIMARY KEY (`inriktning`,`kurs`),
  KEY `kurs_idx` (`kurs`),
  CONSTRAINT `inriktningskurs.inriktning` FOREIGN KEY (`inriktning`) REFERENCES `inriktning` (`id`),
  CONSTRAINT `inriktningskurs.kurs` FOREIGN KEY (`kurs`) REFERENCES `kurs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inriktningskurs`
--

LOCK TABLES `inriktningskurs` WRITE;
/*!40000 ALTER TABLE `inriktningskurs` DISABLE KEYS */;
INSERT INTO `inriktningskurs` VALUES (1,19,3),(1,20,3),(1,22,3),(2,34,3),(2,35,3),(2,36,3),(3,19,3),(3,20,3),(4,34,3),(4,35,3),(4,36,3);
/*!40000 ALTER TABLE `inriktningskurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kurs`
--

DROP TABLE IF EXISTS `kurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kurskod` varchar(6) NOT NULL,
  `namn` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kurskod_UNIQUE` (`kurskod`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kurs`
--

LOCK TABLES `kurs` WRITE;
/*!40000 ALTER TABLE `kurs` DISABLE KEYS */;
INSERT INTO `kurs` VALUES (1,'II1300','Ingenjörsmetodik'),(2,'IX1304','Matematisk analys'),(3,'ID1018','Programmering I'),(4,'IE1204','Digital design'),(5,'IS1200','Datorteknik, grundkurs'),(6,'IX1307','Problemlösning i matematik'),(7,'IV1350','Objektorienterad design'),(8,'IX1303','Algebra och geometri'),(9,'IK1203','Nätverk och kommunikation'),(11,'ID1020','Algoritmer och datastrukturer'),(12,'IX1500','Diskret matematik'),(13,'ID1354','Applikationer för internet, grundkurs'),(14,'IV1351','Datalagring'),(15,'ID1019','Programmering II'),(16,'II1302','Projekt och projektmetoder'),(17,'IX1501','Matematisk statistik'),(18,'ID1206','Operativsystem'),(19,'ID1212','Nätverksprogrammering'),(20,'IV1201','Arkitektur och design av globala applikationer'),(21,'II142X','Examensarbete inom datateknik, grundnivå'),(22,'IV1013','Introduktion till datasäkerhet'),(34,'IS1300','Inbyggda system'),(35,'IK1332','Sakernas internet'),(36,'IL1333','Hårdvarusäkerhet'),(37,'ABC123','Testkurs'),(38,'AB1234','Kursnamn'),(39,'DH2642','Interaktionsprogrammering och dynamiska webben'),(40,'IF1330','Ellära'),(41,'IE1202','Analog elektronik'),(42,'IE1332','Utveckling av elektronikprodukter'),(43,'II1303','Signalbehandling'),(44,'HE1038','Styr- och reglerteknik'),(45,'IK1330','Trådlösa system'),(46,'IL1331','VHDL-design'),(47,'IL142X','Examensarbete inom elektronik och datorteknik, grundnivå'),(48,'Kurs1','Kurs1-namn'),(49,'Kurs2','Kurs2-namn'),(50,'Kurs3','Kurs3-namn'),(51,'Kurs4','Kurs4-namn'),(52,'Kurs5','Kurs5-namn'),(53,'Kurs6','Kurs6-namn'),(54,'Kurs7','Kurs7-namn'),(55,'Kurs8','Kurs8-namn'),(56,'Kurs9','Kurs9-namn'),(57,'Kurs10','Kurs10-namn'),(58,'II1306','Introduktion till IT'),(59,'SF1689','Baskurs i matematik'),(60,'SF1625','Envariabelanalys'),(61,'IE1206','Inbyggd elektronik'),(62,'II1305','Projekt inom informations- och kommunikationsteknik'),(63,'SF1626','Flervaribelanalys'),(64,'SK1118','Elektromagnetism och vågrörelselära'),(65,'DD1351','Logik för dataloger'),(66,'ME1003','Industriell ekonomi'),(67,'IV1303','Modern mjukvaruutveckling'),(68,'AG1815','Hållbar utveckling, ICT och innovation'),(69,'II143X','Examensarbete inom informations- och kommunikationsteknik, grundnivå'),(70,'SF1912','Sannolikhetsteori och statistik');
/*!40000 ALTER TABLE `kurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `larandemal`
--

DROP TABLE IF EXISTS `larandemal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `larandemal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bloom` int(1) NOT NULL,
  `programmal` int(2) NOT NULL,
  `nummer` int(3) NOT NULL,
  `version` int(3) NOT NULL,
  `beskrivning` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`bloom`,`programmal`,`nummer`,`version`),
  KEY `larandemal.examensmal_idx` (`programmal`),
  CONSTRAINT `larandemal.bloom` FOREIGN KEY (`bloom`) REFERENCES `bloom` (`niva`),
  CONSTRAINT `larandemal.programmal` FOREIGN KEY (`programmal`) REFERENCES `programmal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=348 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `larandemal`
--

LOCK TABLES `larandemal` WRITE;
/*!40000 ALTER TABLE `larandemal` DISABLE KEYS */;
INSERT INTO `larandemal` VALUES (1,1,1,1,1,'Kunna redogöra för akademiskt arbete och organisation m a p utbildning och forskning samt kunna ange några relevanta forskningsområden, aktuella forskningsresultat och vilka forskningsmetoder som använt'),(2,1,1,2,1,'Kunna förklara/definiera vetenskaplighet och hur den kan bedömas i ingenjörsprojekt som handlar om datateknik, elektronik och IT.'),(3,1,1,3,1,'Kunna redogöra för någon typ av gängse innehållsstruktur i akademiska, vetenskapliga och ingenjörsmässiga artiklar och rapporter t ex den s k IMRaD-modellen.'),(4,1,2,1,1,'Utifrån utbildningsprogrammets specifika målsättning (utöver de nationella examensmålen) kunna ange teknikämnen, teknikkurser, matematik och naturvetenskap som är relevant ur ett brett perspektiv.'),(5,2,2,1,1,'I en specifik teknikkurs eller i en matematik eller naturvetenskaplig kurs kunna motivera dess ämnesinnehåll utifrån programmets teknikområde och programmets specifika programmål.'),(6,2,2,2,1,'Ha kunskap om matematik inom områdena ”matematisk analys, ”matematisk linjär algebra och geometri”, ”diskret matematik” samt ”matematisk statistik” samt kunna lösa allmänna och grundläggande matematiska problem inom dessa områden.'),(7,2,2,3,1,'Uppnå godkända matematikkurser som tillsammans motsvarar minst 25 högskolepoäng (KTHs examenskrav)'),(13,1,1,4,1,'Känna till några relevanta databaser med vetenskapliga/ingenjörsmässiga artiklar och hur man kommer åt att söka och hämta artiklar ur dessa databaser (acm.org, ieee.org, kth.se (diva) m fl ).'),(14,1,1,5,1,'Känna till någon relevant ansats, definition och metod för ”kritisk granskning” och bedömning av trovärdighet/vetenskaplighet i artiklar, böcker och ingenjörsrapporter.'),(15,1,1,6,1,'Genom utbildningen aktivt söka och samla, inför det självständiga arbetet och blivande yrkesrollen, referenser till aktuell beprövad ingenjörserfarenhet och kunskap med akademiskt vetenskaplig grund (användning av verktyg som t ex Mandalay, EndNote, Zotero, Google Scholar).'),(16,1,1,7,1,'Ordbehandlingsmässigt kunna skriva och redigera mallar (IEEE tvåspalt) för vetenskapliga artiklar (ej infört i matris II1300 eller infört i designmatris)'),(17,1,1,8,1,'Begreppsmässigt (utan djupare förståelse) kunna ange vad som är aktuella forskningsområden inom specifika ämnen (ämnen i kurs) och vilka forskningsområden som finns vid aktuell (kursgivande) avdelning.'),(18,1,1,9,1,'Översiktligt kunna beskriva innehållet i någon vetenskaplig artikel som kopplar till ämnet i en kurs.'),(19,2,1,1,1,'Kunna redogöra för och kritiskt förhålla sig till innehållet i någon vald vetenskaplig artikel och hur den relaterar till den blivande ingenjörsrollen/ ingenjörsarbetet. (syftet är att påvisa nyttan av att söka och läsa artiklar både från företag, organisationer och akademiskt vetenskapligt förankrade organisationer som acm.org, ieee.org, kth.se (diva) m fl) '),(20,3,1,1,1,'Kunna skriva texter som förklarar/redogör för egna ingenjörskonstruktioner och där texten innehåller relevanta och passande referenser till vetenskapliga artiklar/böcker eller beprövad ingenjörserfarenhet.'),(21,3,1,2,1,'Kunna kritisera medstudenters texter m a p dessa texters referenser till vetenskaplighet och beprövad erfarenhet samt bedöma texternas innehåll m a p vetenskaplighet utifrån något kriterium.'),(22,3,1,3,1,'Kunna skriva en ingenjörsmässig rapport i det programavslutande självständiga arbetet där rapporten tydligt och relevant refererar arbetet till områdets vetenskapliga grund och/eller beprövade erfarenhet.'),(23,2,2,4,1,'Uppnå minst 90 högskolepoäng (inkl examensarbete 15 högskolepoäng) i ämnen som är centrala för teknikområdet.'),(24,2,2,5,1,'I olika tekniskt sammansatta problemställningar brett kunna ange flera, helst minst tre, relativt olika tekniska sätt att ansätta problemet och ur dessa förslag kunna förorda ett förslag till ansats.'),(33,3,2,1,1,'I olika tekniska problemställningar, projekt och uppgifter kunna ange och formulera vilken typ av matematik som skulle kunna vara tillämpbar och på vilket sätt.'),(34,3,2,2,1,'Att i det programavslutande självständiga arbetet kunna ange och formulera vilken matematik/naturvetenskap som är relevant ur ett brett perspektiv samt genomföra härledningar och beräkningar om detta är relevant till uppgiftens omfattning.'),(35,3,2,3,1,'Att i det programavslutande självständiga arbetet, ur ett brett tekniskt perspektiv, kunna ange och formulera relativt olika, helst minst tre, tekniska sätt att lösa problemet och därefter förorda och genomföra ett av alternativen.'),(36,3,2,4,1,'bla'),(37,4,2,1,1,'Kunna analysera, genom identifikation mot något referensverk, den egna tekniska lösningens ingenjörsmässighet och/eller vetenskaplighet.'),(38,4,2,2,1,'Kunna analysera, var (i den tekniska lösningen) och i vilken form, matematiska och naturvetenskapliga teorier och tillämpningar är adekvata.'),(39,5,2,1,1,'Kunna föreslå och motivera relevanta synteser mellan ingenjörsmässighet, vetenskaplighet1, matematik/naturvetenskap som ligger till grund för framtagen teknisk lösning.'),(40,5,2,2,1,'Progression i lärandemål 2.5.1 från “föreslagen syntes” till tillämpning av föreslagen syntes.'),(41,1,3,1,1,'Inse att test är en viktig del i utvärdering av system och ingenjörens ansvar för att test genomförs.'),(42,1,3,2,1,'Kunna lista olika typer av test enligt någon vedertagen ontologi/praxis'),(43,2,3,1,1,'I olika sammansatta problemställningar om teknik brett kunna ange flera, helst minst tre, relativt olika tekniska sätt att ansätta problemet och ur dessa förslag kunna förorda ett förslag till ansats.'),(44,2,3,2,1,'Kunna formulera testfall och förklara dessa'),(45,3,3,1,1,'Inom ramen för ett verkligt industriproblem, och inom industrin, kunna formulera problemställning, ange flera ansatser (minst tre och relativt olika ansatser, ej “nyanser” av en ansats) till problemlösning, genomföra design/utveckling, föreslå metod för driftsättnings samt ange direktiv för kontinuerlig drift, underhåll/utveckling och avveckling.'),(46,3,3,2,1,'Kunna specificera testfall och utföra dessa i konkreta fall samt dokumentera och säkerställa att tillkortakommanden följs upp.'),(47,3,3,3,1,'Kunna följa en testplan och och ta personligt ansvar för de “egna” testerna.'),(48,4,3,1,1,'Kunna analyser, via checklista, den tekniska lösningens kvalitet m a p, uppfyllande av dess syfte, mål och krav, dess “testningstäckning” och “tekniska skuld”,  dess formalitetsnivå och status vad gäller teknisk dokumentation,  versionshantering av artefakter och görligheten i fortsatt utveckling, “decomposition” i form av moduler m a p “inkapsling”, “decoupling”, funktionsansvar, mm'),(49,4,3,2,1,'Kunna analysera brister, genom identifikation mot något referensverk, den egna tekniska lösningens ingenjörsmässighet och/eller vetenskaplighet.'),(50,6,3,1,1,'Kunna utvärdera, genom identifikation mot något referensverk1, den egna tekniska lösningens ingenjörsmässighet och/eller vetenskaplighet.'),(51,6,3,2,1,'Kunna värdera den tekniska lösning m a p på lärandemålet 3.4.1 men även \"hållbarhet\" (anpassning till individer, religion, etniska aspekter, mm)'),(52,1,5,1,1,'Känna till begreppet ”abstraktion” och dess vitala betydelse för ingenjören i ett systematiskt, kontrollerat och planerat utvecklingsarbete (ingenjörens modeller och ritningar)'),(53,1,5,2,1,'Känna till och kunna ange olika och gängse metoder och verktyg för abstraktion, modellering, simulering och dokumentation av ingenjörstekniska problem och lösningar inom det egna teknikområdet'),(54,1,5,3,1,'Känna till olika metoder och verktyg för abstraktion, modellering och dokumentation av utvecklings- och projektmodeller (d v s metoder) för ingenjörsarbete vid problemlösning och konstruktion.'),(55,2,5,1,1,'Kunna tolka och förklara abstrakta modeller, simuleringar, påpeka dess förtjänster och brister samt föreslå förbättringar.'),(56,2,5,2,1,'Kunna reflektera över nyttan och möjligheterna med abstrakta modeller och simuleringar i syfte att kunna se orsaker och sammanhang samt förutsäga framtida skeenden och beteenden.'),(57,2,5,3,1,'Kunna ange ingenjörsrelevanta områden där abstraktion, modellering och simulering är tillämpligt. Exempel är tekniska konstruktioner med statiska och dynamiska beskrivningar, matematik, tekniska kravbeskrivningar, tekniska arkitekturbeskrivningar i syfte att beskriva lösningar men också för att driva och organisera utvecklingsarbete, tekniska utvecklingsmodeller mm'),(58,3,5,1,1,'Kunna ange och konstruera lämpliga abstrakta modeller för tekniska problemställningar och tekniskt konstruktionsarbete samt anamma angiven formalitetsnivå vad avser dokumentation.'),(59,3,5,2,1,'Kunna använda sig av abstrakta modeller och simuleringar vid presentation, muntligt och skriftligt, i beskrivningar av tekniska lösningar.'),(60,3,5,3,1,'Aspekter av ingenjörsarbetet som regelmässigt och i relevant omfattning skall kunna abstraheras i form av modeller och simuleringar (ritningar) är kravspecifikationer, olika'),(61,1,6,1,1,'Redogöra för och diskutera begreppet hållbar utveckling med avseende på motiv, historik, definition, och vilka de viktigaste globala utmaningarna är. Studenterna ska också kunna ge exempel på samband mellan ekologisk, ekonomisk och social hållbarhet.'),(62,1,6,2,1,'Redogöra för Sveriges, EUs och FNs målsättningar inom hållbar utveckling. Studenterna ska också kunna diskutera vetenskapliga perspektiv på politiskt satta målsättningar.'),(63,1,6,3,1,'Kunna lista olika miljöramverk och organisationer för miljöledning, miljöcertifiering och miljömärkning samt ange deras syfte och mål.'),(64,2,6,1,1,'Redogöra och värdera för hur dennes kunskaper och färdigheter kan påverka och bidra till hållbar utveckling, kopplat till de egna kunskaperna.'),(65,2,6,2,1,'Beskriva vilka aktiviteter och teknologier (i samhället och inom datateknik)  som påverkar globala och prioriterade svenska hållbarhetsaspekter mest. Studenterna ska även kunna beskriva tänkbara strategier för att stärka positiv sådan påverkan och motverka negativ.'),(66,2,6,3,1,'Beskriva hur de delar av samhället som utbildningsprogrammet behandlar påverkar globala och svenska hållbarhetsaspekter. Studenterna ska även kunna beskriva och värdera tänkbara strategier för att stärka positiv sådan påverkan och motverka negativ.'),(67,2,6,4,1,'Lista och förklara ekonomiska och institutionella faktorer som kan förklara bristen på hållbar utveckling (risker och riskfaktorer).'),(68,2,6,5,1,'Identifiera och förstå kopplingen mellan miljöaspekter och affärsmöjligheter, specifikt för den egna sektorn.'),(69,2,6,6,1,'Diskutera etiska aspekter, särskilt i sin framtida yrkesroll,  genusperspektiv och andra rättviseaspekter på hållbar utveckling såsom fördelningen av resurser inom och mellan generationer.'),(70,3,6,1,1,'Beskriva (ej värdera) och tillämpa olika generiska strategier som används vid utveckling och design av produkter, processer och system som bidrar till en hållbar utveckling.'),(71,3,6,2,1,'(Generisk ”projektdefinition, mall, med MHU är infört i projketkurser II1300 och II1302 samt exjobb TIDAB) '),(72,3,6,3,1,'Beskriva (ej värdera) och tillämpa olika sektors- och teknikspecifika metoder och strategier som används vid utveckling och design av produkter, processer och system som bidrar till en hållbar utveckling.'),(73,4,6,1,1,'Reflektera kring punkten 6.1.1 sid 8 (egen enkel analys varför HU nu? Kunde det ha utvecklats på något annat sätt (bra och sämre sätt)? Analysera samband mellan ekologisk, ekonomisk och social hållbarhet. (ej utvärderat eller infört i designmatris)'),(74,4,6,2,1,'Kritiskt analysera (realistiskt? Vad måste till? Eget bidrag?) och diskutera målsättningar enligt punkten 6.1.2 sid 8 (ej utvärderat eller infört i designmatris)'),(75,4,6,3,1,'Analysera och värdera det som anges i punkten 6.3.1 sid 8'),(76,5,6,1,1,'Identifiera och förstå koppling som är relevant för utbildningsprogrammet, mellan hållbarhetsaspekter och innovation (ej utvärderat eller infört i designmatris)'),(77,5,6,2,1,'Koppla en förståelse för hållbar utveckling (såsom beskrivs i de övriga målen) till färdigheter och kunskaper som är specifika för utbildningsprorammet genom att föreslå samt diskutera tekniska lösningar, innovationer och idéer som kan bidra till en mer hållbar utveckling. (ej utvärderat eller infört i designmatris)'),(78,1,8,1,1,'Känna till detta examensmål i utbildningen och kunna ange dess ungefärliga lydelse.'),(79,1,8,2,1,'Kunna referera till bakomliggande idé och syfte med detta examensmål.'),(80,1,8,3,1,'Kunna ange och lista exempel på olika ”grupper” och deras relevans/koppling i den kommande egna ingenjörsrollen.'),(81,2,8,1,1,'Inför olika situationer (muntliga och skriftliga) kunna förstå och ange/definiera vilka grupper som anses eller kan förmodas bli mottagare av informationen.'),(82,2,8,2,1,'Förstå vilka behov av information och informationsutformning som olika grupper har i en aktuell kontext och hur dessa behov kan realiseras i informationsutbytet.'),(83,3,8,1,1,'Kunna anpassa och genomföra en muntlig presentation med hänsyn till mottagarens ”grupptillhörighet”/gruppkategori.'),(84,3,8,2,1,'Kunna anpassa och skapa skriftlig information (dokument allmänt, manualer, rapporter, brev, e-post, redogörelser, mm) med hänsyn till mottagarens grupptillhörighet/gruppkategori.'),(85,1,10,1,1,'Känna till detta examensmål i utbildningen och kunna ange dess ungefärliga lydelse.'),(86,1,10,2,1,'Kunna referera till bakomliggande idé och syfte med detta examensmål.'),(87,1,10,3,1,'Känna till arbetsmiljölagstiftningen och översiktligt ange dess innehåll.'),(88,1,10,4,1,'Kunna lista faktorer och åtgärder som berör arbetsergonomi i det egna och andras arbete.'),(89,1,10,5,1,'Känna till globala och nationella miljömål.'),(90,1,10,6,1,'Kunna ange några tekniska och forskningsmässiga tillkortakommanden ur ett tilllämpningsperspektiv och samhällsperspektiv.'),(91,1,10,7,1,'Kunna ange teknik och forskning, inom det egna teknikområdet, som förändrat samhället socialt, ekonomiskt och miljömässigt samt ändrat människors ansvar och arbetsmiljö.'),(92,2,10,1,1,'Förstå och redogöra för hur egna och andras teknikkonstruktioner ger samhället och människor möjligheter till förändringar (både positiva och negativa) ur aspekterna socialt, ekonomiskt, miljö och arbetsmiljö.'),(93,2,10,2,1,'Förstå och redogöra för hur egna och andras tekniklösningar kan nyttjas ur önskade och oönskade aspekter och var ansvar finns.');
/*!40000 ALTER TABLE `larandemal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program`
--

DROP TABLE IF EXISTS `program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `program` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `programkod` varchar(10) DEFAULT NULL,
  `beskrivande_namn` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `programkod_UNIQUE` (`programkod`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program`
--

LOCK TABLES `program` WRITE;
/*!40000 ALTER TABLE `program` DISABLE KEYS */;
INSERT INTO `program` VALUES (1,'TIDAB','Högskoleingenjörsutbildning i Datateknik'),(2,'CINTE','Civilingenjörsutbildning i Datateknik'),(3,'TIEDB','Högskoleingenjörsutbildning i Elektronik och Datorteknik'),(5,'Program1','Program1-namn'),(6,'Program2','Program2-namn'),(7,'Program3','Program3-namn'),(8,'Program4','Program4-namn'),(9,'Program5','Program5-namn');
/*!40000 ALTER TABLE `program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programkurs`
--

DROP TABLE IF EXISTS `programkurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programkurs` (
  `arskull` int(11) NOT NULL,
  `kurs` int(11) NOT NULL,
  `ar` int(1) NOT NULL,
  PRIMARY KEY (`arskull`,`kurs`),
  KEY `kurs_idx` (`kurs`),
  CONSTRAINT `programkurs.arskull` FOREIGN KEY (`arskull`) REFERENCES `arskull` (`id`),
  CONSTRAINT `programkurs.kurs` FOREIGN KEY (`kurs`) REFERENCES `kurs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programkurs`
--

LOCK TABLES `programkurs` WRITE;
/*!40000 ALTER TABLE `programkurs` DISABLE KEYS */;
INSERT INTO `programkurs` VALUES (2,1,1),(2,2,1),(2,3,1),(2,4,1),(2,5,1),(2,6,1),(2,7,1),(2,8,1),(2,9,2),(2,11,2),(2,12,2),(2,13,2),(2,14,2),(2,15,2),(2,16,2),(2,17,3),(2,18,3),(2,21,3),(2,37,1),(3,1,1),(3,2,1),(3,3,1),(3,4,1),(3,5,1),(3,6,1),(3,7,1),(3,8,1),(3,9,2),(3,11,2),(3,12,2),(3,14,2),(3,15,2),(3,16,2),(3,17,3),(3,18,3),(3,39,2),(4,1,1),(4,2,1),(4,3,1),(4,4,1),(4,5,1),(4,6,1),(4,8,1),(4,9,2),(4,11,2),(4,12,2),(4,16,2),(4,17,3),(4,34,2),(4,40,1),(4,41,2),(4,42,2),(4,43,2),(4,44,3),(4,45,3),(4,46,3),(4,47,3);
/*!40000 ALTER TABLE `programkurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programmal`
--

DROP TABLE IF EXISTS `programmal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programmal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typ` int(11) NOT NULL,
  `nummer` int(3) NOT NULL,
  `beskrivning` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `programmal.typ_idx` (`typ`),
  CONSTRAINT `programmal.typ` FOREIGN KEY (`typ`) REFERENCES `programmaltyp` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programmal`
--

LOCK TABLES `programmal` WRITE;
/*!40000 ALTER TABLE `programmal` DISABLE KEYS */;
INSERT INTO `programmal` VALUES (1,1,1,'Visa kunskap om det valda teknikområdets vetenskapliga grund och dess beprövade erfarenhet samt kännedom om aktuellt forsknings- och utvecklingsarbete.'),(2,1,2,'Visa brett kunnande inom det valda teknikområdet och relevant kunskap i matematik och naturvetenskap.'),(3,1,3,'Visa förmåga att med helhetssyn självständigt och kreativt identifiera, formulera och hantera frågeställningar och analysera och utvärdera olika tekniska lösningar.'),(4,1,4,'Visa förmåga att planera och med adekvata metoder genomföra uppgifter inom givna ramar.'),(5,1,5,'Visa förmåga att kritiskt och systematiskt använda kunskap samt att modellera, simulera, förutsäga och utvärdera skeenden med utgångspunkt i relevant information.'),(6,1,6,'Visa förmåga att utforma och hantera produkter, processer och system med hänsyn till människors förutsättningar och behov och samhällets mål för ekonomiskt, socialt och ekologiskt hållbar utveckling.'),(7,1,7,'Visa förmåga till lagarbete och samverkan i grupper med olika sammansättning.'),(8,1,8,'Visa förmåga att muntligt och skriftligt redogöra för och diskutera information, problem och lösningar i dialog med olika grupper.'),(9,1,9,'Visa förmåga att göra bedömningar med hänsyn till relevanta vetenskapliga, samhälleliga och etiska aspekter.'),(10,1,10,'Visa insikt i teknikens möjligheter och begränsningar, dess roll i samhället och människors ansvar för dess nyttjande, inbegripet sociala och ekonomiska aspekter samt miljö- och arbetsmiljöaspekter.'),(11,1,11,'Visa förmåga att identifiera sitt behov av ytterligare kunskap och att fortlöpande utveckla sin kompetens.'),(16,2,1,'JML - Jämställdhetslagen, jämlikhet'),(17,2,2,'Software engineering'),(18,2,3,'Projektmetoder'),(19,2,4,'Programmering'),(20,2,5,'Entreprenörsskap'),(21,2,6,'???'),(22,2,7,'???'),(23,2,8,'???'),(24,2,9,'???'),(25,2,10,'???'),(26,2,11,'Speciellt temamål för el-data'),(27,2,12,'???'),(28,2,13,'???'),(29,2,14,'???'),(30,2,15,'???');
/*!40000 ALTER TABLE `programmal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programmaltyp`
--

DROP TABLE IF EXISTS `programmaltyp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programmaltyp` (
  `id` int(11) NOT NULL,
  `typ` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `typ_UNIQUE` (`typ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programmaltyp`
--

LOCK TABLES `programmaltyp` WRITE;
/*!40000 ALTER TABLE `programmaltyp` DISABLE KEYS */;
INSERT INTO `programmaltyp` VALUES (1,'Examensmål'),(2,'Temamål');
/*!40000 ALTER TABLE `programmaltyp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programprogrammal`
--

DROP TABLE IF EXISTS `programprogrammal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programprogrammal` (
  `program` int(11) NOT NULL,
  `programmal` int(11) NOT NULL,
  PRIMARY KEY (`program`,`programmal`),
  KEY `programprogrammal.programmal_idx` (`programmal`),
  CONSTRAINT `programprogrammal.program` FOREIGN KEY (`program`) REFERENCES `program` (`id`),
  CONSTRAINT `programprogrammal.programmal` FOREIGN KEY (`programmal`) REFERENCES `programmal` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='	';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programprogrammal`
--

LOCK TABLES `programprogrammal` WRITE;
/*!40000 ALTER TABLE `programprogrammal` DISABLE KEYS */;
INSERT INTO `programprogrammal` VALUES (1,1),(3,1),(1,2),(3,2),(1,3),(3,3),(1,4),(3,4),(1,5),(3,5),(1,6),(3,6),(1,7),(3,7),(1,8),(3,8),(1,9),(3,9),(1,10),(3,10),(1,11),(3,11),(1,16),(1,17),(1,18),(1,19),(1,20),(3,20),(1,21),(1,22),(1,23),(1,24),(1,25);
/*!40000 ALTER TABLE `programprogrammal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respons`
--

DROP TABLE IF EXISTS `respons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `respons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enkat` int(11) NOT NULL,
  `respondent_namn` varchar(64) DEFAULT NULL,
  `kurskod` varchar(6) NOT NULL,
  `inskickat` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`enkat`,`kurskod`,`inskickat`),
  KEY `kurskod_idx` (`kurskod`),
  CONSTRAINT `respons.enkat` FOREIGN KEY (`enkat`) REFERENCES `enkat` (`id`),
  CONSTRAINT `respons.kurskod` FOREIGN KEY (`kurskod`) REFERENCES `kurs` (`kurskod`)
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respons`
--

LOCK TABLES `respons` WRITE;
/*!40000 ALTER TABLE `respons` DISABLE KEYS */;
/*!40000 ALTER TABLE `respons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `view_arskull`
--

DROP TABLE IF EXISTS `view_arskull`;
/*!50001 DROP VIEW IF EXISTS `view_arskull`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_arskull` AS SELECT 
 1 AS `Program`,
 1 AS `Årskull`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_enkat`
--

DROP TABLE IF EXISTS `view_enkat`;
/*!50001 DROP VIEW IF EXISTS `view_enkat`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_enkat` AS SELECT 
 1 AS `Enkät_ID`,
 1 AS `Skapad_Datum`,
 1 AS `Måltyp`,
 1 AS `Målnummer`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_enkatfraga`
--

DROP TABLE IF EXISTS `view_enkatfraga`;
/*!50001 DROP VIEW IF EXISTS `view_enkatfraga`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_enkatfraga` AS SELECT 
 1 AS `Enkät_ID`,
 1 AS `Programmåltyp`,
 1 AS `Programmålnummer`,
 1 AS `Bloomnivå`,
 1 AS `Nummer`,
 1 AS `Version`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_enkatfragesvar`
--

DROP TABLE IF EXISTS `view_enkatfragesvar`;
/*!50001 DROP VIEW IF EXISTS `view_enkatfragesvar`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_enkatfragesvar` AS SELECT 
 1 AS `Enkät_ID`,
 1 AS `Inskickat_Datum`,
 1 AS `Kurs`,
 1 AS `Lärandemåltext`,
 1 AS `Svar`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_inriktning`
--

DROP TABLE IF EXISTS `view_inriktning`;
/*!50001 DROP VIEW IF EXISTS `view_inriktning`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_inriktning` AS SELECT 
 1 AS `Inriktning`,
 1 AS `Program`,
 1 AS `Årskull`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_inriktningskurs`
--

DROP TABLE IF EXISTS `view_inriktningskurs`;
/*!50001 DROP VIEW IF EXISTS `view_inriktningskurs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_inriktningskurs` AS SELECT 
 1 AS `Program`,
 1 AS `Årskull`,
 1 AS `Inriktning`,
 1 AS `År`,
 1 AS `Kurs`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_kurs`
--

DROP TABLE IF EXISTS `view_kurs`;
/*!50001 DROP VIEW IF EXISTS `view_kurs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_kurs` AS SELECT 
 1 AS `kurskod`,
 1 AS `namn`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_larandemal`
--

DROP TABLE IF EXISTS `view_larandemal`;
/*!50001 DROP VIEW IF EXISTS `view_larandemal`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_larandemal` AS SELECT 
 1 AS `Måltyp`,
 1 AS `Målnummer`,
 1 AS `Bloomtext`,
 1 AS `Bloomnivå`,
 1 AS `LärandemålVersion`,
 1 AS `LärandemålText`,
 1 AS `Aktivt`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_program`
--

DROP TABLE IF EXISTS `view_program`;
/*!50001 DROP VIEW IF EXISTS `view_program`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_program` AS SELECT 
 1 AS `Programkod`,
 1 AS `Programtitel`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_programkurs`
--

DROP TABLE IF EXISTS `view_programkurs`;
/*!50001 DROP VIEW IF EXISTS `view_programkurs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_programkurs` AS SELECT 
 1 AS `Program`,
 1 AS `Årskull`,
 1 AS `Kurs`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_programmal`
--

DROP TABLE IF EXISTS `view_programmal`;
/*!50001 DROP VIEW IF EXISTS `view_programmal`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_programmal` AS SELECT 
 1 AS `Måltyp`,
 1 AS `Målnummer`,
 1 AS `Måltext`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_programmaltyp`
--

DROP TABLE IF EXISTS `view_programmaltyp`;
/*!50001 DROP VIEW IF EXISTS `view_programmaltyp`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_programmaltyp` AS SELECT 
 1 AS `Måltyp`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_programprogrammal`
--

DROP TABLE IF EXISTS `view_programprogrammal`;
/*!50001 DROP VIEW IF EXISTS `view_programprogrammal`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_programprogrammal` AS SELECT 
 1 AS `Program`,
 1 AS `Måltyp`,
 1 AS `Målnummer`,
 1 AS `Måltext`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `view_respons`
--

DROP TABLE IF EXISTS `view_respons`;
/*!50001 DROP VIEW IF EXISTS `view_respons`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `view_respons` AS SELECT 
 1 AS `Formulär_ID`,
 1 AS `Person`,
 1 AS `Kurskod`,
 1 AS `Datum_Inskickat`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `view_arskull`
--

/*!50001 DROP VIEW IF EXISTS `view_arskull`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_arskull` AS select `a`.`program` AS `Program`,`a`.`terminstart` AS `Årskull` from `arskull` `a` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_enkat`
--

/*!50001 DROP VIEW IF EXISTS `view_enkat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_enkat` AS select distinct `e`.`form_id` AS `Enkät_ID`,`e`.`skapad` AS `Skapad_Datum`,`pmt`.`typ` AS `Måltyp`,`pm`.`nummer` AS `Målnummer` from ((((`enkat` `e` join `enkatfraga` `ef` on((`e`.`id` = `ef`.`enkat`))) join `larandemal` `lm` on((`ef`.`larandemal` = `lm`.`id`))) join `programmal` `pm` on((`lm`.`programmal` = `pm`.`id`))) join `programmaltyp` `pmt` on((`pm`.`typ` = `pmt`.`id`))) order by `e`.`skapad` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_enkatfraga`
--

/*!50001 DROP VIEW IF EXISTS `view_enkatfraga`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_enkatfraga` AS select `e`.`form_id` AS `Enkät_ID`,`pmt`.`typ` AS `Programmåltyp`,`pm`.`nummer` AS `Programmålnummer`,`lm`.`bloom` AS `Bloomnivå`,`lm`.`nummer` AS `Nummer`,`lm`.`version` AS `Version` from ((((`enkatfraga` `ef` join `enkat` `e` on((`ef`.`enkat` = `e`.`id`))) join `larandemal` `lm` on((`ef`.`larandemal` = `lm`.`id`))) join `programmal` `pm` on((`lm`.`programmal` = `pm`.`id`))) join `programmaltyp` `pmt` on((`pm`.`typ` = `pmt`.`id`))) order by `e`.`skapad` desc,`pm`.`nummer`,`lm`.`bloom`,`lm`.`nummer`,`lm`.`version` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_enkatfragesvar`
--

/*!50001 DROP VIEW IF EXISTS `view_enkatfragesvar`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_enkatfragesvar` AS select `e`.`form_id` AS `Enkät_ID`,`r`.`inskickat` AS `Inskickat_Datum`,`r`.`kurskod` AS `Kurs`,`lm`.`beskrivning` AS `Lärandemåltext`,`efs`.`svar` AS `Svar` from ((((`enkatfragesvar` `efs` join `respons` `r` on((`efs`.`respons` = `r`.`id`))) join `enkat` `e` on((`r`.`enkat` = `e`.`id`))) join `enkatfraga` `ef` on((`efs`.`enkatfraga` = `ef`.`id`))) join `larandemal` `lm` on((`ef`.`larandemal` = `lm`.`id`))) order by `r`.`inskickat` desc,`r`.`kurskod`,`lm`.`programmal`,`lm`.`bloom`,`lm`.`nummer` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_inriktning`
--

/*!50001 DROP VIEW IF EXISTS `view_inriktning`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_inriktning` AS select `i`.`namn` AS `Inriktning`,`a`.`program` AS `Program`,`a`.`terminstart` AS `Årskull` from (`inriktning` `i` join `arskull` `a` on((`i`.`arskull` = `a`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_inriktningskurs`
--

/*!50001 DROP VIEW IF EXISTS `view_inriktningskurs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_inriktningskurs` AS select `ak`.`program` AS `Program`,`ak`.`terminstart` AS `Årskull`,`i`.`namn` AS `Inriktning`,`ik`.`ar` AS `År`,`k`.`kurskod` AS `Kurs` from (((`inriktningskurs` `ik` join `inriktning` `i` on((`ik`.`inriktning` = `i`.`id`))) join `arskull` `ak` on((`i`.`arskull` = `ak`.`id`))) join `kurs` `k` on((`ik`.`kurs` = `k`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_kurs`
--

/*!50001 DROP VIEW IF EXISTS `view_kurs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_kurs` AS select `kurs`.`kurskod` AS `kurskod`,`kurs`.`namn` AS `namn` from `kurs` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_larandemal`
--

/*!50001 DROP VIEW IF EXISTS `view_larandemal`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_larandemal` AS select `pmt`.`typ` AS `Måltyp`,`pm`.`nummer` AS `Målnummer`,`b`.`niva_text` AS `Bloomtext`,`lm`.`nummer` AS `Bloomnivå`,`lm`.`version` AS `LärandemålVersion`,`lm`.`beskrivning` AS `LärandemålText`,`alm`.`aktiverat` AS `Aktivt` from ((((`larandemal` `lm` join `bloom` `b` on((`lm`.`bloom` = `b`.`niva`))) join `programmal` `pm` on((`lm`.`programmal` = `pm`.`id`))) join `programmaltyp` `pmt` on((`pm`.`typ` = `pmt`.`id`))) join `aktiveratlarandemal` `alm` on((`lm`.`id` = `alm`.`larandemal`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_program`
--

/*!50001 DROP VIEW IF EXISTS `view_program`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_program` AS select `program`.`programkod` AS `Programkod`,`program`.`beskrivande_namn` AS `Programtitel` from `program` */
/*!50002 WITH CASCADED CHECK OPTION */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_programkurs`
--

/*!50001 DROP VIEW IF EXISTS `view_programkurs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_programkurs` AS select `a`.`program` AS `Program`,`a`.`terminstart` AS `Årskull`,`k`.`kurskod` AS `Kurs` from ((`programkurs` `pk` join `arskull` `a` on((`pk`.`arskull` = `a`.`id`))) join `kurs` `k` on((`pk`.`kurs` = `k`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_programmal`
--

/*!50001 DROP VIEW IF EXISTS `view_programmal`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_programmal` AS select `pmt`.`typ` AS `Måltyp`,`pm`.`nummer` AS `Målnummer`,`pm`.`beskrivning` AS `Måltext` from (`programmal` `pm` join `programmaltyp` `pmt` on((`pm`.`typ` = `pmt`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_programmaltyp`
--

/*!50001 DROP VIEW IF EXISTS `view_programmaltyp`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_programmaltyp` AS select `programmaltyp`.`typ` AS `Måltyp` from `programmaltyp` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_programprogrammal`
--

/*!50001 DROP VIEW IF EXISTS `view_programprogrammal`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_programprogrammal` AS select `p`.`programkod` AS `Program`,`pmt`.`typ` AS `Måltyp`,`pm`.`nummer` AS `Målnummer`,`pm`.`beskrivning` AS `Måltext` from (((`programprogrammal` `ppm` join `program` `p` on((`ppm`.`program` = `p`.`id`))) join `programmal` `pm` on((`ppm`.`programmal` = `pm`.`id`))) join `programmaltyp` `pmt` on((`pm`.`typ` = `pmt`.`id`))) order by `p`.`programkod`,`pmt`.`typ`,`pm`.`nummer` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `view_respons`
--

/*!50001 DROP VIEW IF EXISTS `view_respons`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `view_respons` AS select `enkat`.`form_id` AS `Formulär_ID`,`respons`.`respondent_namn` AS `Person`,`respons`.`kurskod` AS `Kurskod`,`respons`.`inskickat` AS `Datum_Inskickat` from (`respons` join `enkat` on((`respons`.`enkat` = `enkat`.`id`))) order by `respons`.`inskickat` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-01-22 11:11:52
