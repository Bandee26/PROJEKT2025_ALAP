﻿--
-- Script was generated by Devart dbForge Studio for MySQL, Version 9.2.105.0
-- Product home page: http://www.devart.com/dbforge/mysql/studio
-- Script date 2025. 03. 17. 9:54:47
-- Server version: 8.4.0
-- Client version: 4.1
--

-- 
-- Disable foreign keys
-- 
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- 
-- Set SQL mode
-- 
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 
-- Set character set the client will use to send SQL statements to the server
--
SET NAMES 'utf8mb4';

--
-- Set default database
--
USE auto_adatbazis;

--
-- Drop table `parkolo`
--
DROP TABLE IF EXISTS parkolo;

--
-- Drop table `dolgozo`
--
DROP TABLE IF EXISTS dolgozo;

--
-- Drop table `jogosultsag`
--
DROP TABLE IF EXISTS jogosultsag;

--
-- Drop table `foglalas`
--
DROP TABLE IF EXISTS foglalas;

--
-- Drop table `regisztracio`
--
DROP TABLE IF EXISTS regisztracio;

--
-- Drop view `autorendszer`
--
DROP VIEW IF EXISTS autorendszer CASCADE;

--
-- Drop view `markaidleker`
--
DROP VIEW IF EXISTS markaidleker CASCADE;

--
-- Drop view `view1`
--
DROP VIEW IF EXISTS view1 CASCADE;

--
-- Drop table `autok`
--
DROP TABLE IF EXISTS autok;

--
-- Drop table `markak`
--
DROP TABLE IF EXISTS markak;

--
-- Drop table `szinek`
--
DROP TABLE IF EXISTS szinek;

--
-- Drop table `modellek`
--
DROP TABLE IF EXISTS modellek;

--
-- Drop table `motortipusok`
--
DROP TABLE IF EXISTS motortipusok;

--
-- Drop table `motorspecifikaciok`
--
DROP TABLE IF EXISTS motorspecifikaciok;

--
-- Drop table `hasznalat`
--
DROP TABLE IF EXISTS hasznalat;

--
-- Drop table `sebessegvaltok`
--
DROP TABLE IF EXISTS sebessegvaltok;

--
-- Drop table `eladok`
--
DROP TABLE IF EXISTS eladok;

--
-- Set default database
--
USE auto_adatbazis;

--
-- Create table `eladok`
--
CREATE TABLE eladok (
  Elado_ID INT NOT NULL AUTO_INCREMENT,
  Nev VARCHAR(25) DEFAULT NULL,
  Telefon VARCHAR(15) DEFAULT NULL,
  Email VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (Elado_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 23,
AVG_ROW_LENGTH = 819,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `sebessegvaltok`
--
CREATE TABLE sebessegvaltok (
  Sebessegvalto_ID INT NOT NULL AUTO_INCREMENT,
  Sebessegvalto VARCHAR(15) DEFAULT NULL,
  PRIMARY KEY (Sebessegvalto_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 3,
AVG_ROW_LENGTH = 8192,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `hasznalat`
--
CREATE TABLE hasznalat (
  Hasznalat_ID INT NOT NULL AUTO_INCREMENT,
  Hasznalat VARCHAR(25) DEFAULT NULL,
  PRIMARY KEY (Hasznalat_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 4,
AVG_ROW_LENGTH = 5461,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `motorspecifikaciok`
--
CREATE TABLE motorspecifikaciok (
  Motorspecifikacio_ID INT NOT NULL AUTO_INCREMENT,
  Motorspecifikacio VARCHAR(30) DEFAULT NULL,
  `Motortipus azonosito` INT DEFAULT NULL,
  PRIMARY KEY (Motorspecifikacio_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 9,
AVG_ROW_LENGTH = 2048,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `motortipusok`
--
CREATE TABLE motortipusok (
  Motortipus_ID INT NOT NULL AUTO_INCREMENT,
  Motortipus VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (Motortipus_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 5,
AVG_ROW_LENGTH = 4096,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `modellek`
--
CREATE TABLE modellek (
  Modell_ID INT NOT NULL AUTO_INCREMENT,
  `Marka azonosito` INT DEFAULT NULL,
  Modell VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (Modell_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 16,
AVG_ROW_LENGTH = 1092,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `szinek`
--
CREATE TABLE szinek (
  Szin_ID INT NOT NULL AUTO_INCREMENT,
  Szin VARCHAR(15) DEFAULT NULL,
  PRIMARY KEY (Szin_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 12,
AVG_ROW_LENGTH = 1638,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `markak`
--
CREATE TABLE markak (
  Marka_ID INT NOT NULL AUTO_INCREMENT,
  Marka VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (Marka_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 8,
AVG_ROW_LENGTH = 3276,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `autok`
--
CREATE TABLE autok (
  Auto_ID INT NOT NULL AUTO_INCREMENT,
  Rendszam VARCHAR(50) DEFAULT NULL,
  Marka_ID INT DEFAULT NULL,
  Szin_ID INT DEFAULT NULL,
  Modell_ID INT DEFAULT NULL,
  Evjarat INT DEFAULT NULL,
  Kilometerora VARCHAR(15) DEFAULT NULL,
  Motortipus_ID INT DEFAULT NULL,
  Motorspecifikacio_ID INT DEFAULT NULL,
  Hasznalat_ID INT DEFAULT NULL,
  Sebessegvalto_ID INT DEFAULT NULL,
  Ar INT DEFAULT NULL,
  Elado_ID INT DEFAULT NULL,
  PRIMARY KEY (Auto_ID)
)
ENGINE = INNODB,
AUTO_INCREMENT = 53,
AVG_ROW_LENGTH = 321,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_hungarian_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create foreign key
--
ALTER TABLE autok 
  ADD CONSTRAINT `FK_autok_Elado ID` FOREIGN KEY (Elado_ID)
    REFERENCES eladok(Elado_ID) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE autok 
  ADD CONSTRAINT `FK_autok_Hasznalat ID` FOREIGN KEY (Hasznalat_ID)
    REFERENCES hasznalat(Hasznalat_ID) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE autok 
  ADD CONSTRAINT `FK_autok_Marka ID` FOREIGN KEY (Marka_ID)
    REFERENCES markak(Marka_ID) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE autok 
  ADD CONSTRAINT `FK_autok_Modell ID` FOREIGN KEY (Modell_ID)
    REFERENCES modellek(Modell_ID) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE autok 
  ADD CONSTRAINT `FK_autok_Motorspecifikacio ID` FOREIGN KEY (Motorspecifikacio_ID)
    REFERENCES motorspecifikaciok(Motorspecifikacio_ID) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE autok 
  ADD CONSTRAINT `FK_autok_Motortipus ID` FOREIGN KEY (Motortipus_ID)
    REFERENCES motortipusok(Motortipus_ID) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE autok 
  ADD CONSTRAINT `FK_autok_Sebessegvalto ID` FOREIGN KEY (Sebessegvalto_ID)
    REFERENCES sebessegvaltok(Sebessegvalto_ID) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE autok 
  ADD CONSTRAINT `FK_autok_Szin ID` FOREIGN KEY (Szin_ID)
    REFERENCES szinek(Szin_ID) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create view `view1`
--
CREATE 
	DEFINER = 'root'@'localhost'
VIEW view1
AS
SELECT
  `markak`.`Marka` AS `Marka`,
  `hasznalat`.`Hasznalat` AS `Hasznalat`
FROM ((`autok`
  JOIN `hasznalat`
    ON ((`autok`.`Hasznalat_ID` = `hasznalat`.`Hasznalat_ID`)))
  JOIN `markak`
    ON ((`autok`.`Marka_ID` = `markak`.`Marka_ID`)));

--
-- Create view `markaidleker`
--
CREATE 
	DEFINER = 'root'@'localhost'
VIEW markaidleker
AS
SELECT
  `m`.`Marka` AS `Marka`
FROM (`autok` `a`
  JOIN `markak` `m`
    ON ((`a`.`Marka_ID` = `m`.`Marka_ID`)));

--
-- Create view `autorendszer`
--
CREATE 
	DEFINER = 'root'@'localhost'
VIEW autorendszer
AS
SELECT
  `a`.`Auto_ID` AS `Auto_ID`,
  `a`.`Rendszam` AS `Rendszam`,
  `m`.`Marka` AS `Marka`,
  `sz`.`Szin` AS `Szin`,
  `mo`.`Modell` AS `Modell`,
  `a`.`Evjarat` AS `Evjarat`,
  `a`.`Kilometerora` AS `Kilometerora`,
  `mt`.`Motortipus` AS `Motortipus`,
  `ms`.`Motorspecifikacio` AS `Motorspecifikacio`,
  `h`.`Hasznalat` AS `Hasznalat`,
  `sv`.`Sebessegvalto` AS `Sebessegvalto`,
  `a`.`Ar` AS `Ar`,
  `e`.`Nev` AS `Nev`,
  `e`.`Telefon` AS `Telefon`,
  `e`.`Email` AS `Email`
FROM ((((((((`autok` `a`
  JOIN `markak` `m`
    ON ((`a`.`Marka_ID` = `m`.`Marka_ID`)))
  JOIN `szinek` `sz`
    ON ((`a`.`Szin_ID` = `sz`.`Szin_ID`)))
  JOIN `modellek` `mo`
    ON ((`a`.`Modell_ID` = `mo`.`Modell_ID`)))
  JOIN `motortipusok` `mt`
    ON ((`a`.`Motortipus_ID` = `mt`.`Motortipus_ID`)))
  JOIN `motorspecifikaciok` `ms`
    ON ((`a`.`Motorspecifikacio_ID` = `ms`.`Motorspecifikacio_ID`)))
  JOIN `hasznalat` `h`
    ON ((`a`.`Hasznalat_ID` = `h`.`Hasznalat_ID`)))
  JOIN `sebessegvaltok` `sv`
    ON ((`a`.`Sebessegvalto_ID` = `sv`.`Sebessegvalto_ID`)))
  JOIN `eladok` `e`
    ON ((`a`.`Elado_ID` = `e`.`Elado_ID`)))
ORDER BY `a`.`Auto_ID`;

--
-- Create table `regisztracio`
--
CREATE TABLE regisztracio (
  id INT NOT NULL AUTO_INCREMENT,
  nev VARCHAR(30) DEFAULT NULL,
  telefon VARCHAR(15) DEFAULT NULL,
  email VARCHAR(30) DEFAULT NULL,
  jelszo VARCHAR(256) DEFAULT NULL,
  kedvencek VARCHAR(15000) NOT NULL DEFAULT '[]',
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 48,
AVG_ROW_LENGTH = 409,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_0900_ai_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `foglalas`
--
CREATE TABLE foglalas (
  id INT NOT NULL AUTO_INCREMENT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  car_id VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 38,
AVG_ROW_LENGTH = 5461,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_0900_ai_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create foreign key
--
ALTER TABLE foglalas 
  ADD CONSTRAINT foglalas_ibfk_1 FOREIGN KEY (user_id)
    REFERENCES regisztracio(id) ON DELETE CASCADE;

--
-- Create table `jogosultsag`
--
CREATE TABLE jogosultsag (
  id INT NOT NULL AUTO_INCREMENT,
  jogosultsag VARCHAR(15) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 3,
AVG_ROW_LENGTH = 8192,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_0900_ai_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create table `dolgozo`
--
CREATE TABLE dolgozo (
  id INT NOT NULL AUTO_INCREMENT,
  felhasznalonev VARCHAR(20) DEFAULT NULL,
  email VARCHAR(40) DEFAULT NULL,
  jelszo VARCHAR(64) DEFAULT NULL,
  jogosultsag_id INT DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 5,
AVG_ROW_LENGTH = 8192,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_0900_ai_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create foreign key
--
ALTER TABLE dolgozo 
  ADD CONSTRAINT `FK_dolgozo_jogosultsag id` FOREIGN KEY (jogosultsag_id)
    REFERENCES jogosultsag(id) ON UPDATE CASCADE;

--
-- Create table `parkolo`
--
CREATE TABLE parkolo (
  parkolo INT NOT NULL AUTO_INCREMENT,
  elado_id INT DEFAULT NULL,
  kedvenc_auto_id INT DEFAULT NULL,
  PRIMARY KEY (parkolo)
)
ENGINE = INNODB,
AUTO_INCREMENT = 31,
AVG_ROW_LENGTH = 546,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_0900_ai_ci,
ROW_FORMAT = DYNAMIC;

-- 
-- Dumping data for table regisztracio
--
INSERT INTO regisztracio VALUES
(1, 'Kiss László', '06940589125', 'kisslaszlo@email.hu', '1b1ab739069102d8ef362ab2ef2008b7646338d201fa6c6ab9dd5d2b6ef00bdc', '[]'),
(2, 'Nagy Anna', '6985082486', 'nagyanna@email.hu', 'f49f33723539d2b792c6a89329770491d677cdbc75fee50cf7431fc242aa7d19', '[]'),
(3, 'Szabó Béla', '06777775307', 'szabobela@email.hu', '12ba2fe6066d1ea812e92c6828f7895f4890610c990fc62a8d7e3fff991ea5dc', '[]'),
(4, 'Tóth Katalin', '06079267711', 'tothkatalin@email.hu', '2945168e32e0e441d7948035be536c773f984cd6fbfcdea0433a2d6f69ad6829', '[]'),
(5, 'Horváth Gábor', '06734699096', 'horvathgabor@email.hu', '648cb7433cb7ab5ce09668c8cd22282d5013c5f647250e0aac8eece868592dd8', '[]'),
(6, 'Varga Erzsébet', '06567449405', 'vargaerzsebet@email.hu', '7f94aa6cb567150ed36d088190db33d57f274dd8b31ef2b8b790fa97c3d34950', '[]'),
(7, 'Kovács Péter', '06081550665', 'kovacspeter@email.hu', '199dbe831f3583899a4e71e209d1a364103fb23ded58843de776760cb2666ff2', '[]'),
(8, 'Molnár Zsófia', '06002042850', 'molnarzsofia@email.hu', 'b04c6264b6cff8df6f3852c7ab58e817044d2982252e40d9b93b85cbec0a7812', '[]'),
(9, 'Németh István', '06667708331', 'nemethistvan@email.hu', '236f311b1dcc498561fb5b9ee8d05503ae58212b865096e3bc38e43909a8fe49', '[]'),
(10, 'Farkas Anikó', '06235702264', 'farkasaniko@email.hu', '3e9ef7bd81bcbbd6819dc46dd8aa223a76864846fd66326417656b0bba0bfb1d', '[]'),
(11, 'Balogh Ferenc', '06526032899', 'baloghferenc@email.hu', '6dff16e26fcb75cdc8be22b2c27b368d9db6fb9694e017df8a320e94747718ba', '[]'),
(12, 'Simon Andrea', '06607623014', 'simonandrea@email.hu', '279fc56b6499cd416954b6bc6a2a2cbbb19290814018e40a10f081a4462d5606', '[]'),
(13, 'Lukács János', '06737497459', 'lukacsjanos@email.hu', 'da34b43d3f7af7de7f2e247c89c97ee414d8616a6260533656354a0e54399523', '[]'),
(14, 'Nagy Zoltán', '06135030268', 'nagyzoltan@email.hu', '3e4fe1706ea18ab53ea8516c4d5b2d0711e6a71a36eaeec1fef3d7caef4035a9', '[]'),
(15, 'Kiss Éva', '06372780358', 'kisseva@email.hu', '3a35662d287a41ee0768e81f7223bceece80482e246b2a4621d789987ba8af25', '[]'),
(16, 'Tóth Tamás', '06134449675', 'tothtamas@email.hu', '02a43b0141a851a3b5443c27b6917042be9769b80244edabdd0ad2418d61a853', '[]'),
(17, 'Molnár Attila', '06892692669', 'molnarattila@email.hu', 'a44148c14f792cd9c263e9dac89e81e9ca6e457182a35ffe43b23613ba2dbee2', '[]'),
(18, 'Fekete Ildikó', '06163886024', 'feketeildiko@email.hu', '14d5332200fe2e1c98c04f61625cd35c572c7470204003188b1d67ff1058531d', '[]'),
(19, 'Varga László', '06216916429', 'vargalaszlo@email.hu', '82249d71da69d065f0c1e6450db162591ccbe0bf512dbe9b177e30b28df80da0', '[]'),
(20, 'Németh Gergely', '06939736108', 'nemethgergely@email.hu', '575e48e91c43365b7ae3b3ab08dc3b8d3778694e431e0c038a7b251d635a22c8', '[]'),
(21, 'Balogh Norbert', '06158034336', 'balogh.norbert@email.hu', '2df26df1618687df00e58facffff7953da07b36daa9bd41a572cf15b1d558122', '[]'),
(22, 'Farkas Anikó', '06973373163', 'farkas.aniko@email.hu', '8a899d19aa222430872a67d997b55c594bf898719a54c217db3a418641936d6a', '[]'),
(23, 'Tóth Éva', '06820102312', 'toth.eva@email.hu', '7932c79da31a5718cc5361c059e31132718a5d8099af3a9fad563e55d1e6fd7b', '[]'),
(24, 'Szabó Eszter', '06902568604', 'szabo.eszter@email.hu', '201ac918179c63d56ed24f56330d37a676515a81772a5fb7ce19ce0927665c2b', '[]'),
(25, 'Miklós Gábor', '06601143802', 'miklos.gabor@email.hu', 'c108b48376d5484ffe3fe1ee62899213149559d084aa47bab399df51eed97017', '[]'),
(26, 'Hegedűs Miklós', '06661876180', 'hegedus.miklos@email.hu', 'b10619624e51d06d32589411c801299a1c273266fc15a8ec21c06ed989a20ed7', '[]'),
(27, 'Horváth Lajos', '06185826772', 'horvath.lajos@email.hu', '61d03841c335d6765494e6352396594b58e55df1c6963ab4ca9469eeb54dfeaf', '[]'),
(28, 'Nagy Judit', '06685890089', 'nagy.judit@email.hu', '2cd12b15162147ef56bab5cc1a0113388c7e30c6a5138688e5233e3b4e2863da', '[]'),
(29, 'Tóth Béla', '06634981257', 'toth.bela@email.hu', '5b6f32e8d2fc310ac108da528cc80408d873de262fdf05506c4f18a26b750d82', '[]'),
(30, 'Kis Anna', '06942099777', 'kis.anna@email.hu', 'b5e4ceca665f36bf4288b6135bc48f660afb322e33f0d55a1afc0be73ac41ad8', '[]'),
(31, 'Kovács Zsolt', '06448742583', 'kovacs.zsolt@email.hu', '591aa4c0b89734added534065268e47f757bb4702debc46ffa7f60c4db9c6746', '[]'),
(32, 'Varga Gergely', '06319681395', 'varga.gergely@email.hu', '40443493e098ef51786c200e0116b1709f67f7846b032c77a60e3d1d4afd93d7', '[]'),
(33, 'Nagy Gábor', '06438365416', 'nagy.gabor@email.hu', 'c2e3ab837d7713e40045ecf7cdbc88e0199b2c47a83b64bd6dd48cb18e0725ed', '[]'),
(34, 'Kiss Judit', '06560088431', 'kiss.judit@email.hu', '9a0ab29e0d19c1781b3e53dcece1221870df13f7c5e94a7b60e0b63284c1782b', '[]'),
(35, 'Balázs László', '06096350597', 'balazs.laszlo@email.hu', '5b4a0be151f0becba5cd626a71df1d33eb2f28a200d0e7e999b2ea5c1e21597a', '[]'),
(36, 'Kovács Ilona', '06499780974', 'kovacs.ilona@email.hu', '1a5fe2f3207972bb332bc5cce4ac1252b673e12921115b6a3a8812e91e2d6afd', '[]'),
(37, 'Juhász Andrea', '06183708031', 'juhasz.andrea@email.hu', 'c7a3cb7e2861641823514b39f26d336edc12d1c503b1e338731a54b2cdbe8645', '[]'),
(38, 'Kiss Gábor', '06594373454', 'kiss.gabor@email.hu', '529cf85d2e995da9828a7248e4798b9043673cd072538f74deeba601d68d5f76', '[]'),
(39, 'Molnár Réka', '06869147142', 'molnar.reka@email.hu', 'dfa06cfb9c0a6c3e4810794da25db4a7d80ebc89de3d0ed99ab5b2f1ee58ad7c', '[]'),
(40, 'Németh Péter', '06234330023', 'nemeth.peter@email.hu', '7c67c157ac467b37b6ea21fc7cb9b24b54e47e0da8f6ddaa9a681d2be2c874d9', '[]'),
(43, 'Bandi', '303030', 'bandi@gmail.com', '893b95a698ff9bca2806a9bbb04d1d713d33ca45ced817ab1cfa8a38b04bce92', '["YCFW-444", "QSTU-245", "ZEGT-780"]'),
(44, 'Kőműves Zoltán Lajos', '0620000', 'zolko@gmail.com', '56e32b8c43b0109cea729ebb3ca85338731a2fdddedd55c9c61a347a5cb53417', '[]'),
(45, 'Molnár Zsombor', '067000', 'zsombi@gmail.com', '81251286584c1d658e42983b72dbf3f3fa58a30277a2be0495bfc3b4af7141fa', '[]'),
(46, 'a', '06', 'a', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '[]'),
(47, 'Kiss Péter', '006', 'kissPeter@gmail.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', '[]');

-- 
-- Dumping data for table jogosultsag
--
INSERT INTO jogosultsag VALUES
(1, 'admin'),
(2, 'titkarno');

-- 
-- Dumping data for table szinek
--
INSERT INTO szinek VALUES
(1, 'Fekete'),
(2, 'Fehér'),
(3, 'Piros'),
(4, 'Kék'),
(5, 'Szürke'),
(6, 'Zöld'),
(7, 'Sárga'),
(8, 'Narancs'),
(9, 'Lila'),
(10, 'Barna');

-- 
-- Dumping data for table sebessegvaltok
--
INSERT INTO sebessegvaltok VALUES
(1, 'Automata'),
(2, 'Manuális');

-- 
-- Dumping data for table motortipusok
--
INSERT INTO motortipusok VALUES
(1, 'Benzines'),
(2, 'Dízel'),
(3, 'Elektromos'),
(4, 'Hibrid');

-- 
-- Dumping data for table motorspecifikaciok
--
INSERT INTO motorspecifikaciok VALUES
(1, '2.0L I4', 1),
(2, '3.0L V6', 1),
(3, '2.0L I4', 2),
(4, '3.0L V6', 2),
(5, '300kW', 3),
(6, '400kW', 3),
(7, '1.5L I4 Hybrid', 4),
(8, '2.0L I4 Hybrid', 4);

-- 
-- Dumping data for table modellek
--
INSERT INTO modellek VALUES
(1, 1, 'Corolla'),
(2, 1, 'Camry'),
(3, 1, 'Yaris'),
(4, 2, 'Focus'),
(5, 2, 'Fiesta'),
(6, 2, 'Mustang'),
(7, 3, 'Golf'),
(8, 3, 'Passat'),
(9, 3, 'Polo'),
(10, 4, '3 Series'),
(11, 4, '5 Series'),
(12, 4, 'X5'),
(13, 5, 'A4'),
(14, 5, 'Q5'),
(15, 5, 'A3');

-- 
-- Dumping data for table markak
--
INSERT INTO markak VALUES
(1, 'Toyota'),
(2, 'Ford'),
(3, 'Volkswagen'),
(4, 'BMW'),
(5, 'Audi');

-- 
-- Dumping data for table hasznalat
--
INSERT INTO hasznalat VALUES
(1, 'Autopalya'),
(2, 'Varos'),
(3, 'Vegyes');

-- 
-- Dumping data for table eladok
--
INSERT INTO eladok VALUES
(1, 'Kiss László', '06940589125', 'kisslaszlo@email.hu'),
(2, 'Nagy Anna', '6985082486', 'nagyanna@email.hu'),
(3, 'Szabó Béla', '06777775307', 'szabobela@email.hu'),
(4, 'Tóth Katalin', '06079267711', 'tothkatalin@email.hu'),
(5, 'Horváth Gábor', '06734699096', 'horvathgabor@email.hu'),
(6, 'Varga Erzsébet', '06567449405', 'vargaerzsebet@email.hu'),
(7, 'Kovács Péter', '06081550665', 'kovacspeter@email.hu'),
(8, 'Molnár Zsófia', '06002042850', 'molnarzsofia@email.hu'),
(9, 'Németh István', '06667708331', 'nemethistvan@email.hu'),
(10, 'Farkas Anikó', '06235702264', 'farkasaniko@email.hu'),
(11, 'Balogh Ferenc', '06526032899', 'baloghferenc@email.hu'),
(12, 'Simon Andrea', '06607623014', 'simonandrea@email.hu'),
(13, 'Lukács János', '06737497459', 'lukacsjanos@email.hu'),
(14, 'Nagy Zoltán', '06135030268', 'nagyzoltan@email.hu'),
(15, 'Kiss Éva', '06372780358', 'kisseva@email.hu'),
(16, 'Tóth Tamás', '06134449675', 'tothtamas@email.hu'),
(17, 'Molnár Attila', '06892692669', 'molnarattila@email.hu'),
(18, 'Fekete Ildikó', '06163886024', 'feketeildiko@email.hu'),
(19, 'Varga László', '06216916429', 'vargalaszlo@email.hu'),
(20, 'Németh Gergely', '06939736108', 'nemethgergely@email.hu');

-- 
-- Dumping data for table parkolo
--
INSERT INTO parkolo VALUES
(1, 1, 1),
(2, 1, 7),
(3, 1, 9),
(4, 2, 1),
(5, 2, 4),
(6, 3, 2),
(7, 3, 5),
(8, 3, 10),
(9, 4, 6),
(10, 5, 8),
(11, 5, 12),
(12, 6, 11),
(13, 7, 15),
(14, 8, 13),
(15, 9, 14),
(16, 9, 16),
(17, 10, 17),
(18, 11, 18),
(19, 12, 19),
(20, 13, 20),
(21, 14, 5),
(22, 14, 9),
(23, 15, 7),
(24, 16, 8),
(25, 17, 10),
(26, 18, 4),
(27, 18, 11),
(28, 19, 1),
(29, 20, 3),
(30, 20, 16);

-- 
-- Dumping data for table foglalas
--
INSERT INTO foglalas VALUES
(35, '2025-03-11 13:42:23', 'YCFW-444,QSTU-245,ZEGT-780', 43),
(36, '2025-03-11 13:43:34', 'YCFW-444,QSTU-245', 43),
(37, '2025-03-11 13:44:16', 'QSTU-245', 43);

-- 
-- Dumping data for table dolgozo
--
INSERT INTO dolgozo VALUES
(3, 'Molnár Kati', 'kati@gmail.com', '4c8b4124c42e764bfa0ecef9b1eec35a43d7fe15bb68d678654586412f271069', 2),
(4, 'Molnár István', 'istvan@gmail.com', '5786bfc503db4bd202b96acf6aadf9db4f9c97a9237ff13e6d61c2cba8ab78dd', 1);

-- 
-- Dumping data for table autok
--
INSERT INTO autok VALUES
(1, 'ONEP-577', 3, 7, 8, 2012, '294038', 1, 1, 1, 2, 3500000, 20),
(2, 'CJRR-818', 3, 8, 9, 2020, '193550', 2, 4, 1, 1, 2737990, 9),
(3, 'BFSJ-549', 1, 7, 2, 2011, '245741', 1, 1, 2, 1, 5507000, 14),
(4, 'ACVQ-424', 3, 2, 9, 2011, '156005', 1, 2, 3, 1, 5259990, 19),
(5, 'ZYHV-660', 4, 3, 10, 2001, '73855', 4, 8, 1, 1, 1013000, 1),
(6, 'MPUT-129', 3, 7, 7, 2015, '66851', 4, 8, 2, 1, 3528000, 11),
(7, 'QSTU-245', 2, 8, 4, 2022, '175554', 4, 7, 2, 1, 7955000, 11),
(8, 'UALV-477', 1, 10, 2, 2013, '75874', 3, 5, 3, 2, 7731990, 2),
(9, 'YCFW-444', 2, 2, 6, 2012, '259704', 4, 7, 3, 1, 8432000, 5),
(10, 'RGHI-479', 3, 2, 9, 2011, '274426', 2, 4, 3, 1, 9653990, 3),
(11, 'XXBG-478', 4, 8, 11, 2021, '104484', 3, 5, 1, 1, 2754000, 10),
(12, 'EKCZ-702', 2, 3, 6, 2015, '157309', 3, 5, 1, 2, 9647990, 19),
(13, 'ZEGT-780', 3, 3, 8, 2002, '238356', 3, 5, 3, 1, 5684990, 14),
(14, 'GWGS-413', 4, 9, 11, 2016, '117892', 4, 7, 3, 2, 2390000, 2),
(15, 'GJSN-373', 3, 1, 9, 2018, '47311', 2, 4, 3, 1, 3170000, 13),
(16, 'DZOT-890', 5, 10, 14, 2011, '265215', 3, 6, 3, 2, 6921990, 11),
(17, 'JUHV-727', 4, 9, 10, 2011, '110205', 4, 7, 1, 1, 7139000, 5),
(18, 'ODSD-634', 5, 1, 14, 2003, '110714', 3, 6, 2, 1, 6659000, 11),
(19, 'OYLM-498', 3, 9, 7, 2001, '31008', 2, 4, 2, 1, 6883990, 13),
(20, 'GJBZ-032', 3, 1, 7, 2016, '171651', 1, 1, 1, 2, 4831000, 14),
(21, 'ZBSK-276', 2, 10, 4, 2013, '179540', 4, 7, 3, 2, 9989990, 19),
(22, 'ZLKU-028', 3, 3, 8, 2019, '157647', 4, 7, 3, 1, 9062990, 14),
(23, 'RIVA-711', 2, 6, 6, 2018, '206719', 1, 1, 1, 2, 7072990, 11),
(24, 'VYQO-163', 1, 10, 2, 2012, '273951', 1, 2, 1, 2, 4358990, 8),
(25, 'AQHZ-673', 3, 2, 8, 2008, '41576', 1, 1, 1, 1, 1921990, 8),
(26, 'UOSQ-595', 3, 2, 7, 2008, '193309', 3, 5, 2, 2, 6296000, 10),
(27, 'MOJJ-974', 1, 5, 3, 2010, '93797', 4, 7, 2, 2, 8147990, 11),
(28, 'OXHS-987', 5, 5, 14, 2008, '71639', 2, 4, 3, 1, 4067000, 10),
(29, 'GJXJ-238', 1, 3, 2, 2013, '255386', 4, 8, 1, 1, 8451000, 3),
(30, 'ZKFB-988', 4, 2, 12, 2021, '108063', 3, 6, 2, 2, 2710000, 3),
(31, 'XVQV-905', 3, 3, 8, 2019, '241814', 4, 7, 2, 1, 8958000, 18),
(32, 'JYJL-539', 3, 10, 9, 2006, '129029', 1, 2, 1, 1, 4504990, 17),
(33, 'AHPV-762', 3, 4, 7, 2004, '79122', 1, 2, 1, 1, 8748990, 1),
(34, 'CYCN-597', 1, 3, 2, 2010, '30942', 4, 7, 3, 2, 3310000, 20),
(35, 'YZMA-196', 3, 9, 7, 2001, '140610', 4, 8, 3, 2, 6357000, 18),
(36, 'VGSM-190', 2, 8, 5, 2009, '214442', 1, 1, 1, 1, 6506990, 1),
(37, 'VUVU-968', 4, 7, 10, 2009, '287431', 2, 3, 2, 2, 3655990, 3),
(38, 'LEZD-328', 3, 10, 7, 2009, '180224', 2, 4, 1, 1, 5506000, 20),
(39, 'JHHM-901', 2, 10, 6, 2012, '121930', 2, 3, 3, 1, 3602990, 4),
(40, 'YWWG-178', 5, 10, 13, 2010, '194656', 3, 5, 1, 1, 9463000, 10),
(41, 'GJRF-097', 3, 10, 7, 2022, '134589', 2, 4, 3, 2, 6729000, 9),
(42, 'TZHG-410', 3, 3, 9, 2012, '226453', 1, 1, 1, 2, 3171000, 12),
(43, 'UGEL-908', 5, 7, 14, 2001, '19345', 4, 8, 3, 2, 8794000, 8),
(44, 'MCXF-192', 3, 7, 9, 2016, '164105', 3, 6, 2, 1, 1771000, 9),
(45, 'ALBM-034', 3, 9, 7, 2017, '147574', 1, 1, 2, 1, 4489000, 18),
(46, 'XQDV-967', 1, 10, 3, 2006, '50795', 2, 3, 2, 2, 9268000, 8),
(47, 'VROM-921', 4, 7, 12, 2010, '80739', 1, 2, 1, 2, 4225000, 18),
(48, 'HDLO-694', 2, 9, 6, 2005, '66629', 4, 8, 3, 2, 2092990, 8),
(49, 'YVUY-925', 5, 2, 15, 2022, '225164', 4, 7, 2, 2, 7146990, 18),
(50, 'UNYH-593', 5, 9, 14, 2017, '71873', 1, 2, 3, 2, 4706000, 20),
(51, 'AACC-111', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- 
-- Restore previous SQL mode
-- 
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

-- 
-- Enable foreign keys
-- 
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;