CREATE DATABASE  IF NOT EXISTS `orkut_flat` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `orkut_flat`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: orkut_flat
-- ------------------------------------------------------
-- Server version	5.6.15-log

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(30) NOT NULL,
  `first_name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` int(11) NOT NULL DEFAULT '0',
  `birth_day` int(10) NOT NULL,
  `birth_month` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_year` int(10) NOT NULL,
  `city` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `relationship` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `interested_in` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  `friends` int(11) NOT NULL DEFAULT '0',
  `created_when` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,194928,'Joao Victor',' Segantini','theanimate8@gmail.com','$2b$10$QluYMEFBvJvs4b2xAv3e9OFeCfZTCVk.UdhuI76/wNg/i1.jmf/Ci',0,22,'Março',1999,'Carapicuíba','','','Brasil','','','','/photos/1694974652715.jfif',0,'2023'),(6,470100,'Joao','segantini','dev.joaovictor22@gmail.com','$2b$10$of75qrGvhvoeuoz/t8f.tuYiLmDU68puWSeiPp4hbK8ciMgSmueeq',0,18,'Março',1996,'','','','','','','','/photos/default_photo.png',0,'2023');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feed_posts`
--

DROP TABLE IF EXISTS `feed_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feed_posts` (
  `postID` int(11) NOT NULL AUTO_INCREMENT,
  `from_user` int(11) NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `posted_when` time NOT NULL,
  `date` datetime NOT NULL,
  `user_photo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `likes` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`postID`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed_posts`
--

LOCK TABLES `feed_posts` WRITE;
/*!40000 ALTER TABLE `feed_posts` DISABLE KEYS */;
INSERT INTO `feed_posts` VALUES (1,470100,'Joao','<p>teste</p>\r\n','15:32:00','2023-11-08 15:32:35','/photos/default_photo.png',0),(2,194928,'Joao Victor','<p>teste</p>\r\n','15:45:00','2023-11-08 15:45:29','/photos/1694974652715.jfif',0),(3,194928,'Joao Victor','<p>testando&nbsp;</p>\r\n','15:54:00','2023-11-08 15:54:23','/photos/1694974652715.jfif',0);
/*!40000 ALTER TABLE `feed_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend_list`
--

DROP TABLE IF EXISTS `friend_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friend_list` (
  `friendID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `friends_with` int(11) NOT NULL,
  `friend_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `friend_img` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`friendID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_list`
--

LOCK TABLES `friend_list` WRITE;
/*!40000 ALTER TABLE `friend_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends_resquest`
--

DROP TABLE IF EXISTS `friends_resquest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends_resquest` (
  `requestID` int(11) NOT NULL AUTO_INCREMENT,
  `from_user` int(11) NOT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_image` int(11) NOT NULL,
  `since_when` date NOT NULL,
  `to_user` int(11) NOT NULL,
  `accepted` int(11) NOT NULL,
  PRIMARY KEY (`requestID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends_resquest`
--

LOCK TABLES `friends_resquest` WRITE;
/*!40000 ALTER TABLE `friends_resquest` DISABLE KEYS */;
/*!40000 ALTER TABLE `friends_resquest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_comments`
--

DROP TABLE IF EXISTS `post_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_comments` (
  `commentID` int(11) NOT NULL AUTO_INCREMENT,
  `postID` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `posted_when` time NOT NULL,
  `user_photo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `likes` int(11) NOT NULL,
  PRIMARY KEY (`commentID`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_comments`
--

LOCK TABLES `post_comments` WRITE;
/*!40000 ALTER TABLE `post_comments` DISABLE KEYS */;
INSERT INTO `post_comments` VALUES (1,3,194928,'Joao Victor','<p><strong>teste de comentarios mantendo o like funcionando no post de cima .</strong></p>\r\n','11:36:00','/photos/1694974652715.jfif',0),(2,1,194928,'Joao Victor','<p><u>outro comentario para testar,.</u></p>\r\n','11:37:00','/photos/1694974652715.jfif',0),(3,2,194928,'Joao Victor','<p><em>terceiro&nbsp;</em></p>\r\n','11:38:00','/photos/1694974652715.jfif',0);
/*!40000 ALTER TABLE `post_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_comments_liked`
--

DROP TABLE IF EXISTS `post_comments_liked`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_comments_liked` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `postID` int(11) NOT NULL,
  `commentID` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `liked` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_comments_liked`
--

LOCK TABLES `post_comments_liked` WRITE;
/*!40000 ALTER TABLE `post_comments_liked` DISABLE KEYS */;
INSERT INTO `post_comments_liked` VALUES (1,3,0,194928,0),(2,3,0,470100,0),(3,2,0,194928,0),(4,2,0,470100,0),(5,1,0,194928,0),(6,1,0,470100,0);
/*!40000 ALTER TABLE `post_comments_liked` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_media`
--

DROP TABLE IF EXISTS `post_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_media` (
  `imageID` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) NOT NULL,
  `image` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `video` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`imageID`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_media`
--

LOCK TABLES `post_media` WRITE;
/*!40000 ALTER TABLE `post_media` DISABLE KEYS */;
INSERT INTO `post_media` VALUES (1,1,'/post_content/470100/File -1699468355487.jpeg',''),(2,2,'/post_content/194928/File -1699469129986.jpeg',''),(3,3,'','/post_content/194928/File -1699469663189.mp4');
/*!40000 ALTER TABLE `post_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_info`
--

DROP TABLE IF EXISTS `profile_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_info` (
  `infoID` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `who_i_am` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `languages` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `interest_orkut` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `childs` int(11) NOT NULL,
  `humor` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `animals` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `has_website` int(11) NOT NULL DEFAULT '0',
  `website` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scraps` int(11) NOT NULL DEFAULT '0',
  `photos` int(11) NOT NULL DEFAULT '0',
  `videos` int(11) NOT NULL DEFAULT '0',
  `fans` int(11) NOT NULL DEFAULT '0',
  `vis_created` int(11) NOT NULL DEFAULT '0',
  `last_week` int(11) NOT NULL DEFAULT '0',
  `yesterday` int(11) NOT NULL DEFAULT '0',
  `today` int(11) NOT NULL DEFAULT '0',
  `this_week` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`infoID`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_info`
--

LOCK TABLES `profile_info` WRITE;
/*!40000 ALTER TABLE `profile_info` DISABLE KEYS */;
INSERT INTO `profile_info` VALUES (1,194928,'','','',0,'','','',0,'',0,0,0,0,0,0,0,0,0),(2,470100,'','','',0,'','','',0,'',0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `profile_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_visits`
--

DROP TABLE IF EXISTS `profile_visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_visits` (
  `visitID` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visited_profile_id` int(11) NOT NULL,
  PRIMARY KEY (`visitID`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_visits`
--

LOCK TABLES `profile_visits` WRITE;
/*!40000 ALTER TABLE `profile_visits` DISABLE KEYS */;
INSERT INTO `profile_visits` VALUES (1,194928,'Joao Victor',470100);
/*!40000 ALTER TABLE `profile_visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-13 16:21:50
