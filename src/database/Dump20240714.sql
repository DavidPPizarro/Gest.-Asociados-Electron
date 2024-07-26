-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: sociosdb
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `deuda`
--

DROP TABLE IF EXISTS `deuda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deuda` (
  `id_deuda` int NOT NULL AUTO_INCREMENT,
  `fecha_registro` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `descripcion` text NOT NULL,
  `monto` decimal(10,1) NOT NULL,
  PRIMARY KEY (`id_deuda`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deuda`
--

LOCK TABLES `deuda` WRITE;
/*!40000 ALTER TABLE `deuda` DISABLE KEYS */;
INSERT INTO `deuda` VALUES (54,'2024-07-14','2024-07-15','Compra de 10 cámaras digitales marca Sony modelo Alpha 135, con lentes intercambiables de 18-55mm y 55-210mm, incluye tarjeta de memoria de 64GB y trípode.',300.0),(55,'2024-07-14','2024-08-18','Pago del primer semestre del préstamo bancario para la adquisición de un nuevo vehículo comercial.',1000.0),(56,'2024-07-14','2024-07-25','Pago del servicio de electricidad correspondiente al mes de junio de 2024.',50.0);
/*!40000 ALTER TABLE `deuda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localidad`
--

DROP TABLE IF EXISTS `localidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localidad` (
  `id_localidad` int NOT NULL AUTO_INCREMENT,
  `nombre_local` text NOT NULL,
  PRIMARY KEY (`id_localidad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localidad`
--

LOCK TABLES `localidad` WRITE;
/*!40000 ALTER TABLE `localidad` DISABLE KEYS */;
INSERT INTO `localidad` VALUES (1,'Casa Blanca'),(2,'Sacsamarca'),(3,'Tarmatambo'),(4,'Palca');
/*!40000 ALTER TABLE `localidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulo`
--

DROP TABLE IF EXISTS `modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulo` (
  `id_modulo` int NOT NULL AUTO_INCREMENT,
  `nombre_modulo` text NOT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_modulo`),
  CONSTRAINT `modulo_chk_1` CHECK ((`estado` in (_utf8mb4'ocupado',_utf8mb4'no ocupado',_utf8mb4'dañado',_utf8mb4'fuera de servicio',_utf8mb4'nuevo_valor')))
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulo`
--

LOCK TABLES `modulo` WRITE;
/*!40000 ALTER TABLE `modulo` DISABLE KEYS */;
INSERT INTO `modulo` VALUES (51,'Pasillo 1 - Puesto 1','Ocupado'),(52,'Pasillo 1 - Puesto 2','Ocupado'),(53,'Pasillo 1 - Puesto 3','Ocupado'),(54,'Pasillo 1 - Puesto 4','Ocupado'),(55,'Pasillo 1 - Puesto 5','Ocupado'),(56,'Pasillo 1 - Puesto 6','Ocupado'),(57,'Pasillo 1 - Puesto 7','Ocupado'),(58,'Pasillo 1 - Puesto 8','Ocupado'),(59,'Pasillo 1 - Puesto 9','Ocupado'),(60,'Pasillo 1 - Puesto 10','Ocupado'),(61,'Pasillo 1 - Puesto 11','Ocupado'),(62,'Pasillo 1 - Puesto 12','Ocupado'),(63,'Pasillo 1 - Puesto 13','Ocupado'),(64,'Pasillo 1 - Puesto 14','Ocupado'),(65,'Pasillo 1 - Puesto 15','Ocupado'),(66,'Pasillo 1 - Puesto 16','Ocupado'),(67,'Pasillo 1 - Puesto 17','Ocupado'),(68,'Pasillo 1 - Puesto 18','Ocupado'),(69,'Pasillo 1 - Puesto 19','Ocupado'),(70,'Pasillo 1 - Puesto 20','Ocupado'),(71,'Pasillo 1 - Puesto 21','Ocupado'),(72,'Pasillo 1 - Puesto 22','No Ocupado'),(73,'Pasillo 1 - Puesto 23','No Ocupado'),(74,'Pasillo 1 - Puesto 24','No Ocupado'),(75,'Pasillo 1 - Puesto 25','No Ocupado'),(76,'Pasillo 1 - Puesto 26','No Ocupado'),(77,'Pasillo 1 - Puesto 27','No Ocupado'),(78,'Pasillo 1 - Puesto 28','No Ocupado'),(79,'Pasillo 1 - Puesto 29','No Ocupado'),(80,'Pasillo 1 - Puesto 30','No Ocupado'),(81,'Pasillo 1 - Puesto 31','No Ocupado'),(82,'Pasillo 1 - Puesto 32','No Ocupado'),(83,'Pasillo 1 - Puesto 33','No Ocupado'),(84,'Pasillo 1 - Puesto 34','No Ocupado'),(85,'Pasillo 1 - Puesto 35','No Ocupado'),(86,'Pasillo 1 - Puesto 36','No Ocupado'),(87,'Pasillo 1 - Puesto 37','No Ocupado'),(88,'Pasillo 1 - Puesto 38','No Ocupado'),(89,'Pasillo 1 - Puesto 39','No Ocupado'),(90,'Pasillo 1 - Puesto 40','No Ocupado'),(91,'Pasillo 1 - Puesto 41','No Ocupado'),(92,'Pasillo 1 - Puesto 42','No Ocupado'),(93,'Pasillo 1 - Puesto 43','No Ocupado'),(94,'Pasillo 1 - Puesto 44','No Ocupado'),(95,'Pasillo 1 - Puesto 45','No Ocupado'),(96,'Pasillo 1 - Puesto 46','No Ocupado'),(97,'Pasillo 1 - Puesto 47','No Ocupado'),(98,'Pasillo 1 - Puesto 48','No Ocupado'),(99,'Pasillo 1 - Puesto 49','No Ocupado'),(100,'Pasillo 1 - Puesto 50','No Ocupado'),(101,'Pasillo 2 - Puesto 1','No Ocupado'),(102,'Pasillo 2 - Puesto 2','No Ocupado'),(103,'Pasillo 2 - Puesto 3','No Ocupado'),(104,'Pasillo 2 - Puesto 4','No Ocupado'),(105,'Pasillo 2 - Puesto 5','No Ocupado'),(106,'Pasillo 2 - Puesto 6','No Ocupado'),(107,'Pasillo 2 - Puesto 7','No Ocupado'),(108,'Pasillo 2 - Puesto 8','No Ocupado'),(109,'Pasillo 2 - Puesto 9','No Ocupado'),(110,'Pasillo 2 - Puesto 10','No Ocupado'),(111,'Pasillo 2 - Puesto 11','No Ocupado'),(112,'Pasillo 2 - Puesto 12','No Ocupado'),(113,'Pasillo 2 - Puesto 13','No Ocupado'),(114,'Pasillo 2 - Puesto 14','No Ocupado'),(115,'Pasillo 2 - Puesto 15','No Ocupado'),(116,'Pasillo 2 - Puesto 16','No Ocupado'),(117,'Pasillo 2 - Puesto 17','No Ocupado'),(118,'Pasillo 2 - Puesto 18','No Ocupado'),(119,'Pasillo 2 - Puesto 19','No Ocupado'),(120,'Pasillo 2 - Puesto 20','No Ocupado'),(121,'Pasillo 2 - Puesto 21','No Ocupado'),(122,'Pasillo 2 - Puesto 22','No Ocupado'),(123,'Pasillo 2 - Puesto 23','No Ocupado'),(124,'Pasillo 2 - Puesto 24','No Ocupado'),(125,'Pasillo 2 - Puesto 25','No Ocupado'),(126,'Pasillo 2 - Puesto 26','No Ocupado'),(127,'Pasillo 2 - Puesto 27','No Ocupado'),(128,'Pasillo 2 - Puesto 28','No Ocupado'),(129,'Pasillo 2 - Puesto 29','No Ocupado'),(130,'Pasillo 2 - Puesto 30','No Ocupado'),(131,'Pasillo 2 - Puesto 31','No Ocupado'),(132,'Pasillo 2 - Puesto 32','No Ocupado'),(133,'Pasillo 2 - Puesto 33','No Ocupado'),(134,'Pasillo 2 - Puesto 34','No Ocupado'),(135,'Pasillo 2 - Puesto 35','No Ocupado'),(136,'Pasillo 2 - Puesto 36','No Ocupado'),(137,'Pasillo 2 - Puesto 37','No Ocupado'),(138,'Pasillo 2 - Puesto 38','No Ocupado'),(139,'Pasillo 2 - Puesto 39','No Ocupado'),(140,'Pasillo 2 - Puesto 40','No Ocupado'),(141,'Pasillo 2 - Puesto 41','No Ocupado'),(142,'Pasillo 2 - Puesto 42','No Ocupado'),(143,'Pasillo 2 - Puesto 43','No Ocupado'),(144,'Pasillo 2 - Puesto 44','No Ocupado'),(145,'Pasillo 2 - Puesto 45','No Ocupado'),(146,'Pasillo 2 - Puesto 46','No Ocupado'),(147,'Pasillo 2 - Puesto 47','No Ocupado'),(148,'Pasillo 2 - Puesto 48','No Ocupado'),(149,'Pasillo 2 - Puesto 49','No Ocupado'),(150,'Pasillo 2 - Puesto 50','No Ocupado'),(151,'Pasillo 3 - Puesto 1','No Ocupado'),(152,'Pasillo 3 - Puesto 2','No Ocupado'),(153,'Pasillo 3 - Puesto 3','No Ocupado'),(154,'Pasillo 3 - Puesto 4','No Ocupado'),(155,'Pasillo 3 - Puesto 5','No Ocupado'),(156,'Pasillo 3 - Puesto 6','No Ocupado'),(157,'Pasillo 3 - Puesto 7','No Ocupado'),(158,'Pasillo 3 - Puesto 8','No Ocupado'),(159,'Pasillo 3 - Puesto 9','No Ocupado'),(160,'Pasillo 3 - Puesto 10','No Ocupado'),(161,'Pasillo 3 - Puesto 11','No Ocupado'),(162,'Pasillo 3 - Puesto 12','No Ocupado'),(163,'Pasillo 3 - Puesto 13','No Ocupado'),(164,'Pasillo 3 - Puesto 14','No Ocupado'),(165,'Pasillo 3 - Puesto 15','No Ocupado'),(166,'Pasillo 3 - Puesto 16','No Ocupado'),(167,'Pasillo 3 - Puesto 17','No Ocupado'),(168,'Pasillo 3 - Puesto 18','No Ocupado'),(169,'Pasillo 3 - Puesto 19','No Ocupado'),(170,'Pasillo 3 - Puesto 20','No Ocupado'),(171,'Pasillo 3 - Puesto 21','No Ocupado'),(172,'Pasillo 3 - Puesto 22','No Ocupado'),(173,'Pasillo 3 - Puesto 23','No Ocupado'),(174,'Pasillo 3 - Puesto 24','No Ocupado'),(175,'Pasillo 3 - Puesto 25','No Ocupado'),(176,'Pasillo 3 - Puesto 26','No Ocupado'),(177,'Pasillo 3 - Puesto 27','No Ocupado'),(178,'Pasillo 3 - Puesto 28','No Ocupado'),(179,'Pasillo 3 - Puesto 29','No Ocupado'),(180,'Pasillo 3 - Puesto 30','No Ocupado'),(181,'Pasillo 3 - Puesto 31','No Ocupado'),(182,'Pasillo 3 - Puesto 32','No Ocupado'),(183,'Pasillo 3 - Puesto 33','No Ocupado'),(184,'Pasillo 3 - Puesto 34','No Ocupado'),(185,'Pasillo 3 - Puesto 35','No Ocupado'),(186,'Pasillo 3 - Puesto 36','No Ocupado'),(187,'Pasillo 3 - Puesto 37','No Ocupado'),(188,'Pasillo 3 - Puesto 38','No Ocupado'),(189,'Pasillo 3 - Puesto 39','No Ocupado'),(190,'Pasillo 3 - Puesto 40','No Ocupado'),(191,'Pasillo 3 - Puesto 41','No Ocupado'),(192,'Pasillo 3 - Puesto 42','No Ocupado'),(193,'Pasillo 3 - Puesto 43','No Ocupado'),(194,'Pasillo 3 - Puesto 44','No Ocupado'),(195,'Pasillo 3 - Puesto 45','No Ocupado'),(196,'Pasillo 3 - Puesto 46','No Ocupado'),(197,'Pasillo 3 - Puesto 47','No Ocupado'),(198,'Pasillo 3 - Puesto 48','No Ocupado'),(199,'Pasillo 3 - Puesto 49','No Ocupado'),(200,'Pasillo 3 - Puesto 50','No Ocupado'),(201,'Pasillo 4 - Puesto 1','No Ocupado'),(202,'Pasillo 4 - Puesto 2','No Ocupado'),(203,'Pasillo 4 - Puesto 3','No Ocupado'),(204,'Pasillo 4 - Puesto 4','No Ocupado'),(205,'Pasillo 4 - Puesto 5','No Ocupado'),(206,'Pasillo 4 - Puesto 6','No Ocupado'),(207,'Pasillo 4 - Puesto 7','No Ocupado'),(208,'Pasillo 4 - Puesto 8','No Ocupado'),(209,'Pasillo 4 - Puesto 9','No Ocupado'),(210,'Pasillo 4 - Puesto 10','No Ocupado'),(211,'Pasillo 4 - Puesto 11','No Ocupado'),(212,'Pasillo 4 - Puesto 12','No Ocupado'),(213,'Pasillo 4 - Puesto 13','No Ocupado'),(214,'Pasillo 4 - Puesto 14','No Ocupado'),(215,'Pasillo 4 - Puesto 15','No Ocupado'),(216,'Pasillo 4 - Puesto 16','No Ocupado'),(217,'Pasillo 4 - Puesto 17','No Ocupado'),(218,'Pasillo 4 - Puesto 18','No Ocupado'),(219,'Pasillo 4 - Puesto 19','No Ocupado'),(220,'Pasillo 4 - Puesto 20','No Ocupado'),(221,'Pasillo 4 - Puesto 21','No Ocupado'),(222,'Pasillo 4 - Puesto 22','No Ocupado'),(223,'Pasillo 4 - Puesto 23','No Ocupado'),(224,'Pasillo 4 - Puesto 24','No Ocupado'),(225,'Pasillo 4 - Puesto 25','No Ocupado'),(226,'Pasillo 4 - Puesto 26','No Ocupado'),(227,'Pasillo 4 - Puesto 27','No Ocupado'),(228,'Pasillo 4 - Puesto 28','No Ocupado'),(229,'Pasillo 4 - Puesto 29','No Ocupado'),(230,'Pasillo 4 - Puesto 30','No Ocupado'),(231,'Pasillo 4 - Puesto 31','No Ocupado'),(232,'Pasillo 4 - Puesto 32','No Ocupado'),(233,'Pasillo 4 - Puesto 33','No Ocupado'),(234,'Pasillo 4 - Puesto 34','No Ocupado'),(235,'Pasillo 4 - Puesto 35','No Ocupado'),(236,'Pasillo 4 - Puesto 36','No Ocupado'),(237,'Pasillo 4 - Puesto 37','No Ocupado'),(238,'Pasillo 4 - Puesto 38','No Ocupado'),(239,'Pasillo 4 - Puesto 39','No Ocupado'),(240,'Pasillo 4 - Puesto 40','No Ocupado'),(241,'Pasillo 4 - Puesto 41','No Ocupado'),(242,'Pasillo 4 - Puesto 42','No Ocupado'),(243,'Pasillo 4 - Puesto 43','No Ocupado'),(244,'Pasillo 4 - Puesto 44','No Ocupado'),(245,'Pasillo 4 - Puesto 45','No Ocupado'),(246,'Pasillo 4 - Puesto 46','No Ocupado'),(247,'Pasillo 4 - Puesto 47','No Ocupado'),(248,'Pasillo 4 - Puesto 48','No Ocupado'),(249,'Pasillo 4 - Puesto 49','No Ocupado'),(250,'Pasillo 4 - Puesto 50','No Ocupado');
/*!40000 ALTER TABLE `modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` text NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador'),(2,'Secretariado'),(3,'Contabilidad');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socio`
--

DROP TABLE IF EXISTS `socio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socio` (
  `id_socio` int NOT NULL AUTO_INCREMENT,
  `nombres` text NOT NULL,
  `apellidos` text NOT NULL,
  `dni` char(8) NOT NULL,
  `id_localidad` int NOT NULL,
  `id_modulo` int NOT NULL,
  `ruta_escritura` varchar(255) NOT NULL,
  `ruta_comprobante_inscr` varchar(255) NOT NULL,
  PRIMARY KEY (`id_socio`),
  KEY `socio_localidad` (`id_localidad`),
  KEY `socio_modulo` (`id_modulo`),
  CONSTRAINT `socio_localidad` FOREIGN KEY (`id_localidad`) REFERENCES `localidad` (`id_localidad`),
  CONSTRAINT `socio_modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socio`
--

LOCK TABLES `socio` WRITE;
/*!40000 ALTER TABLE `socio` DISABLE KEYS */;
INSERT INTO `socio` VALUES (35,'Juan Raul','Rodriguez Mendosa','76457834',3,51,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721004531623.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721004531623.pdf'),(36,'Ana ','Ramírez Flores','45678901',3,52,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005334374.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005334404.pdf'),(37,'Juan','López Pérez','12345678',4,53,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005368126.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005368127.pdf'),(38,'María ','García Martínez','87654321',2,54,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005387453.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005387453.pdf'),(39,'Pedro ','Flores Gonzales','98765432',4,55,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005422574.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005422575.pdf'),(40,'Laura ','Fernández Muñoz','10293847',3,56,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005462270.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005462270.pdf'),(41,'Carlos ','González Ruiz','34567890',1,57,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005488445.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005488445.pdf'),(42,'Blanca ','Martínez Pérez','23456789',1,58,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005507974.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005507975.pdf'),(43,'Diego ','López García','56789012',4,59,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005525966.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005525966.pdf'),(44,'Sofía ','Ramírez Flores','78901234',3,60,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005545071.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005545071.pdf'),(45,'Andrea ','Flores Gonzales','65432109',3,61,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005558870.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005558870.pdf'),(46,'Javier ','Sánchez López','11223344',3,62,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005575588.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005575588.pdf'),(47,'Isabel ','Ramírez García','22334455',4,63,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005590582.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005590582.pdf'),(48,'Luis ','García González','33445566',1,64,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005606214.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005606214.pdf'),(49,'Patricia ','Flores Ramírez','44556677',1,65,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005622477.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005622477.pdf'),(50,'Marco ','Martínez López','55667788',1,66,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005641437.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005641437.pdf'),(51,'Claudia ','Ramírez Pérez','66778899',1,67,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005662100.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005662100.pdf'),(52,'Daniel ','López Pérez','77889900',2,68,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005678053.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005678053.pdf'),(53,'Vanessa ','Flores Ramírez','88990011',3,69,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005689878.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005689878.pdf'),(54,'Vanessa ','Flores Ramírez','88990011',3,70,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005690115.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005690115.pdf'),(55,'Miguel ','Martínez López','99001122',3,71,'C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfEscritura-1721005704479.pdf','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\pdfComprobante-1721005704479.pdf');
/*!40000 ALTER TABLE `socio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socio_deuda`
--

DROP TABLE IF EXISTS `socio_deuda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socio_deuda` (
  `id_socio` int NOT NULL,
  `id_deuda` int NOT NULL,
  `estado` text NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `cod_voucher` varchar(255) DEFAULT NULL,
  `ruta_comprobante` text,
  PRIMARY KEY (`id_socio`,`id_deuda`),
  KEY `socio_deuda_deuda` (`id_deuda`),
  CONSTRAINT `socio_deuda_deuda` FOREIGN KEY (`id_deuda`) REFERENCES `deuda` (`id_deuda`),
  CONSTRAINT `socio_deuda_socio` FOREIGN KEY (`id_socio`) REFERENCES `socio` (`id_socio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socio_deuda`
--

LOCK TABLES `socio_deuda` WRITE;
/*!40000 ALTER TABLE `socio_deuda` DISABLE KEYS */;
INSERT INTO `socio_deuda` VALUES (35,54,'pendiente',NULL,NULL,NULL),(35,55,'pendiente',NULL,NULL,NULL),(35,56,'pendiente',NULL,NULL,NULL),(36,54,'pendiente',NULL,NULL,NULL),(36,55,'pendiente',NULL,NULL,NULL),(36,56,'pendiente',NULL,NULL,NULL),(37,54,'pendiente',NULL,NULL,NULL),(37,55,'pendiente',NULL,NULL,NULL),(37,56,'pendiente',NULL,NULL,NULL),(38,54,'pendiente',NULL,NULL,NULL),(38,55,'pendiente',NULL,NULL,NULL),(38,56,'pendiente',NULL,NULL,NULL),(39,54,'pendiente',NULL,NULL,NULL),(39,55,'pendiente',NULL,NULL,NULL),(39,56,'pendiente',NULL,NULL,NULL),(40,54,'pendiente',NULL,NULL,NULL),(40,55,'pendiente',NULL,NULL,NULL),(40,56,'pendiente',NULL,NULL,NULL),(41,54,'pendiente',NULL,NULL,NULL),(41,55,'pendiente',NULL,NULL,NULL),(41,56,'pendiente',NULL,NULL,NULL),(42,54,'pendiente',NULL,NULL,NULL),(42,55,'pendiente',NULL,NULL,NULL),(42,56,'pendiente',NULL,NULL,NULL),(43,54,'pendiente',NULL,NULL,NULL),(43,55,'pendiente',NULL,NULL,NULL),(43,56,'pendiente',NULL,NULL,NULL),(44,54,'pendiente',NULL,NULL,NULL),(44,55,'pendiente',NULL,NULL,NULL),(44,56,'pendiente',NULL,NULL,NULL),(45,54,'pendiente',NULL,NULL,NULL),(45,55,'pendiente',NULL,NULL,NULL),(45,56,'pendiente',NULL,NULL,NULL),(46,54,'pendiente',NULL,NULL,NULL),(46,55,'pendiente',NULL,NULL,NULL),(46,56,'pendiente',NULL,NULL,NULL),(47,54,'pendiente',NULL,NULL,NULL),(47,55,'pendiente',NULL,NULL,NULL),(47,56,'pendiente',NULL,NULL,NULL),(48,54,'pendiente',NULL,NULL,NULL),(48,55,'pendiente',NULL,NULL,NULL),(48,56,'pendiente',NULL,NULL,NULL),(49,54,'pendiente',NULL,NULL,NULL),(49,55,'pendiente',NULL,NULL,NULL),(49,56,'pendiente',NULL,NULL,NULL),(50,54,'pendiente',NULL,NULL,NULL),(50,55,'pendiente',NULL,NULL,NULL),(50,56,'pendiente',NULL,NULL,NULL),(51,54,'pendiente',NULL,NULL,NULL),(51,55,'pendiente',NULL,NULL,NULL),(51,56,'pendiente',NULL,NULL,NULL),(52,54,'pendiente',NULL,NULL,NULL),(52,55,'pendiente',NULL,NULL,NULL),(52,56,'pendiente',NULL,NULL,NULL),(53,54,'pendiente',NULL,NULL,NULL),(53,55,'pendiente',NULL,NULL,NULL),(53,56,'pendiente',NULL,NULL,NULL),(54,54,'pendiente',NULL,NULL,NULL),(54,55,'pendiente',NULL,NULL,NULL),(54,56,'pendiente',NULL,NULL,NULL),(55,54,'cancelado','2024-07-15','V-124334R3D3','C:\\Users\\David\\Documents\\electron\\electron_app\\uploads\\comprobantePago-1721006131084.pdf'),(55,55,'pendiente',NULL,NULL,NULL),(55,56,'pendiente',NULL,NULL,NULL);
/*!40000 ALTER TABLE `socio_deuda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nombre` text NOT NULL,
  `apellido` text NOT NULL,
  `mail` text NOT NULL,
  `password` text NOT NULL,
  `fecha_registro` date NOT NULL,
  `dni` char(8) NOT NULL,
  `id_rol` int NOT NULL,
  PRIMARY KEY (`id_user`),
  KEY `usuario_rol` (`id_rol`),
  CONSTRAINT `usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Admin','Principal','admin@example.com','admin123','2024-01-01','12345678',1),(2,'Usuario Up','Normal','user@example.com','user123','2024-02-01','87654321',2),(3,'Invitado','Temporal','guest@example.com','guest123','2024-03-01','11223344',3),(9,'David Paul','Pizarro Ureta','2020100280@ucss.pe','HOLA','2024-06-30','72609947',2),(10,'Lhiz','Puris','2020101163@ucss.pe','HOLA','2024-07-13','78563421',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-14 22:31:10
