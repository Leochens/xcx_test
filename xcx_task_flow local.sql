-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1
-- 生成日期： 2019-05-03 02:23:59
-- 服务器版本： 8.0.12
-- PHP 版本： 7.1.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `xcx_task_flow`
--

DELIMITER $$
--
-- 存储过程
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_tf_status` ()  NO SQL
BEGIN
 	DECLARE cnt INT DEFAULT 0;
    DECLARE i INT DEFAULT 0;
    DECLARE tf_id varchar(32);
    DECLARE eTime datetime;
    DECLARE now_time datetime; 
    DECLARE flag int;
    DECLARE IS_FOUND INTEGER DEFAULT 1;
	DECLARE cus CURSOR for SELECT id,end_time from task_flow where is_completed = 0;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET IS_FOUND=0;
	SELECT COUNT(*) into cnt from task_flow WHERE is_completed = 0; 
    
    open cus;
    FETCH cus into tf_id,eTime;
    WHILE i < cnt AND IS_FOUND DO
    	SELECT now() into now_time;
    	SELECT UNIX_TIMESTAMP(now_time) > UNIX_TIMESTAMP(eTime) into flag;
    	UPDATE task_flow 
    	set is_completed = 1
    	WHERE id = tf_id and flag = 1;
        
        set i = i + 1;
        FETCH cus into tf_id,eTime;
    END WHILE;
    CLOSE cus;  
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_t_status` ()  NO SQL
BEGIN
	# 如果子任务到期了还没有确认已完成 那么就是逾期
 	DECLARE cnt INT DEFAULT 0;
    DECLARE i INT DEFAULT 0;
    DECLARE t_id varchar(32);
    DECLARE eTime datetime;
    DECLARE now_time datetime; 
    DECLARE flag int;
    DECLARE IS_FOUND INTEGER DEFAULT 1;
	DECLARE cus CURSOR for SELECT id,end_time from task where is_completed = 0;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET IS_FOUND=0;
	SELECT COUNT(*) into cnt from task WHERE is_completed = 0; 
    
    open cus;
    FETCH cus into t_id,eTime;
    WHILE i < cnt AND IS_FOUND DO
    	SELECT now() into now_time;
    	SELECT UNIX_TIMESTAMP(now_time) > UNIX_TIMESTAMP(eTime) into flag;
    	UPDATE task 
    	set is_completed = 2 #任务逾期
    	WHERE id = t_id and flag = 1;
        
        set i = i + 1;
        FETCH cus into t_id,eTime;
    END WHILE;
    CLOSE cus;  
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- 表的结构 `category`
--

CREATE TABLE `category` (
  `id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `name` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `u_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '谁创建的分类',
  `tf_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '哪个任务流属于这个分类'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `comment`
--

CREATE TABLE `comment` (
  `id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `comment_type` tinyint(4) DEFAULT '0',
  `content` text CHARACTER SET utf8,
  `create_time` datetime DEFAULT NULL,
  `u_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `t_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `comment`
--

INSERT INTO `comment` (`id`, `comment_type`, `content`, `create_time`, `u_id`, `t_id`) VALUES
('0d5a6370a9b771bb5c71be7077dc35d5', 0, '干嘛→_→', '2019-04-06 21:25:17', '102f7ef87a534c5289e326a31a5d153b', '24ec2a6741be18877618a857c9b560f9'),
('0e4af5405805c24a1c72bd6402278e47', 0, '干嘛', '2019-04-06 21:25:13', '102f7ef87a534c5289e326a31a5d153b', '24ec2a6741be18877618a857c9b560f9'),
('13a96c8a5114147c71bcc47862482c12', 0, 'helloNULL', '2019-04-07 09:34:03', '102f7ef87a534c5289e326a31a5d153b', '472f62b143a783a2f195af17b4c56750'),
('1408e40444842ab5b2432e8809a23057', 0, '来吧', '2019-04-07 11:50:00', '102f7ef87a534c5289e326a31a5d153b', '4c9371b0068dc0024204ada77d511097'),
('1d5339fdebc9f2152d01407f5c5f462c', 0, '不见雨夜', '2019-04-07 20:03:00', '102f7ef87a534c5289e326a31a5d153b', 'b94535231d9e4cc08eb2e524d2c33905'),
('1ea2d53b329851bb423caf3bc733f8a2', 0, '啦啦啦', '2019-04-06 21:25:09', '102f7ef87a534c5289e326a31a5d153b', '24ec2a6741be18877618a857c9b560f9'),
('1edc8be0109159b71245aba68eda2289', 0, '有人吗？', '2019-04-07 18:43:00', '102f7ef87a534c5289e326a31a5d153b', 'b1f3f47d619a7549e746dbae23d8de0a'),
('2cc90f781b2e63ea0dde29aa84f40932', 0, '评论一下', '2019-04-07 20:02:00', '102f7ef87a534c5289e326a31a5d153b', 'b94535231d9e4cc08eb2e524d2c33905'),
('38df7998e4255a4858fc8d60c211c18b', 0, '巴巴爸爸巴巴爸爸巴巴爸爸啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊爸爸巴巴爸爸啊啊啊啊啊', '2019-04-06 21:36:04', '0a4206159794a591b4f03f460306d3ec', '3191197f46dc609d1ec25f363d6a705b'),
('50d913d5b58c4abb91e0905940c332ed', 0, '评论qww', '2019-04-07 21:46:00', 'ea5d0ae3645a6890c79a93c64ceab867', '7b07aa3734246f51cc7256028945036b'),
('5557552b2ba82f81b95a77bf90f8b18b', 0, '就啊啊', '2019-04-06 21:35:08', '102f7ef87a534c5289e326a31a5d153b', '3191197f46dc609d1ec25f363d6a705b'),
('6253ef070f61e99e74dd2603bb0a9240', 0, '来了老弟', '2019-04-06 22:44:10', '102f7ef87a534c5289e326a31a5d153b', '688333b5686fad1f2bfeb2874c3ea101'),
('773bf84545e3c5c72747002258a0fd99', 0, '来啊', '2019-04-06 22:41:39', '102f7ef87a534c5289e326a31a5d153b', '6bb7d055a319af59cc273f825a8fc39c'),
('7928ae924c1b7a349eb183578c9513fb', 0, '好', '2019-04-06 22:55:43', '102f7ef87a534c5289e326a31a5d153b', 'd6939972418bed4aa40630396c2dea5d'),
('9d3fa38bda1fb0abcefb83239fbd3d22', 0, '是啊', '2019-04-06 21:35:02', '0a4206159794a591b4f03f460306d3ec', '3191197f46dc609d1ec25f363d6a705b'),
('a256fd16c390f4dbb1485f1302b1673a', 0, '好快活', '2019-04-06 21:34:59', '0a4206159794a591b4f03f460306d3ec', '3191197f46dc609d1ec25f363d6a705b'),
('beeb9988e689c85bab424131ba26b99f', 0, '来啊 快活啊', '2019-04-06 21:34:42', '102f7ef87a534c5289e326a31a5d153b', '3191197f46dc609d1ec25f363d6a705b'),
('c5a429f96a3a098bd2195652e5cc6fa5', 0, '快活啊', '2019-04-06 22:41:45', '102f7ef87a534c5289e326a31a5d153b', '6bb7d055a319af59cc273f825a8fc39c'),
('d8d862afe35d2154dc43d2d685de44b8', 0, 'a', '2019-04-07 12:23:00', '102f7ef87a534c5289e326a31a5d153b', '472f62b143a783a2f195af17b4c56750');

-- --------------------------------------------------------

--
-- 表的结构 `image`
--

CREATE TABLE `image` (
  `id` varchar(32) NOT NULL,
  `t_id` varchar(32) DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL,
  `url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `image`
--

INSERT INTO `image` (`id`, `t_id`, `u_id`, `url`) VALUES
('huwzavxlQFGoXy8', 'd34f1875c75bd4831ffa8008a8f87915', '102f7ef87a534c5289e326a31a5d153b', 'https://i.loli.net/2019/04/27/5cc41b0d1972f.jpg'),
('l5jButLrhm3CzaS', '01de0957d5c70d87f68de2ebf369da6d', '102f7ef87a534c5289e326a31a5d153b', 'https://i.loli.net/2019/04/27/5cc4167ba3527.jpg'),
('ulR9TtJ2qVZDxg4', '01de0957d5c70d87f68de2ebf369da6d', '102f7ef87a534c5289e326a31a5d153b', 'https://i.loli.net/2019/04/27/5cc417ff4333a.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE `message` (
  `id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `create_time` datetime DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT NULL,
  `to_user_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `tf_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `t_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `message`
--

INSERT INTO `message` (`id`, `content`, `create_time`, `is_read`, `to_user_id`, `tf_id`, `t_id`) VALUES
('0b25ed2a27e18914b08ba1731eadc7d5', '您创建了任务流推荐NULL？啦啦啦', '2019-05-03 09:36:04', 1, '102f7ef87a534c5289e326a31a5d153b', 'd31670c788e998dd17d109795e417a39', NULL),
('137a99a3d96e543967ab0e9353a3833e', '您创建了任务流df', '2019-04-20 16:09:09', 1, '102f7ef87a534c5289e326a31a5d153b', '37be356e01c348befc4e597ee9ac8a01', NULL),
('1a8f0b19ff1646ea66a74624a97ccfff', '您创建了任务流re', '2019-04-20 15:59:49', 1, '102f7ef87a534c5289e326a31a5d153b', 'b6bb5143859b4f0890f131a50fbb49ab', NULL),
('231a4606f0197a33824fb2c85263f494', '您创建了任务流bdefgjwe?()*&^%$#@!_+-=', '2019-05-03 09:07:03', 1, '102f7ef87a534c5289e326a31a5d153b', '2a0e912970868d1e4a856c23baac3f1b', NULL),
('2a83d192a711c6663977a0fad0cdac8a', '子任务:edewfwefw 已完成', '2019-05-02 14:04:43', 1, '102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', '6232eaadfc7a0b25cb9dffed857a557c'),
('3035833f4a173b36da529fc7bc8deac5', '您创建了任务流rgrgger', '2019-04-20 16:10:51', 1, '102f7ef87a534c5289e326a31a5d153b', '22f7c7050985bc3e1c28da08f57f80c5', NULL),
('311331fecef96044d241e5140f08a1a1', '您创建了任务流ce,截止日期为:2019-04-18 12:25:00', '2019-04-15 09:48:59', 1, '102f7ef87a534c5289e326a31a5d153b', 'c3020693bbf83fb0ac4014f112db2cc9', NULL),
('4658653e65358153c8e0c6f09ccacd42', '子任务:💔  已完成', '2019-05-03 10:17:52', 0, '102f7ef87a534c5289e326a31a5d153b', 'df281f245ee29b9e56c1530fb91c9fc3', '658a8372292b567d21065abf6482c0ee'),
('4b148b2ae0a67a836b34891ab4d888f8', '你有一个新的任务需要完成:e,截止日期为:Mon Apr 15 2019 18:09:00 GMT+0800 (CST),所属任务流:undefined', '2019-04-15 17:23:59', 1, '102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', '6610979787d65e97e70e607e52372c60'),
('4c199fd5e0a6469f1375c4baf5b6d1dc', '子任务:御景园 已完成', '2019-05-02 14:06:50', 1, '102f7ef87a534c5289e326a31a5d153b', 'f0259f230bdf0458d95a7d55edd5b168', 'bb392c9116db19c2dbea17e6b2e72315'),
('4cf4907993110cf4938e01d4b7a53270', '你有一个新的任务需要完成:hgcgNULL她', '2019-05-03 09:15:23', 1, '102f7ef87a534c5289e326a31a5d153b', 'c9026ee43a5e17f0ef089af3eb9430ec', '66dfe0b5ddcabc8026863f36cb82bd2a'),
('4d0f044f2ce7a95779ff6dcfbe1bfda4', '任务流:p已经被更改,新的任务流名:pfff,简介为:付尾款,截止时间是:2019-04-15 09:25.', '2019-04-15 09:25:36', 1, '102f7ef87a534c5289e326a31a5d153b', NULL, NULL),
('67fe7532560913f9879acffed99ce6d3', '你有一个新的任务需要完成:我,截止日期为:Mon Apr 15 2019 19:45:00 GMT+0800 (CST)', '2019-04-15 19:47:22', 1, '102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', '0f03b2097ff6a089e4213f3800a2bff2'),
('68f023eaba3a72cdabb36c975c4049b4', '任务流:任务rtewf 已经被更改,新的任务流名: 任务rtewf', '2019-04-26 15:01:40', 1, '102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', NULL),
('70040d483199dd7a54dd9812bd3bca10', '子任务:cv 已完成', '2019-05-02 14:06:36', 1, '102f7ef87a534c5289e326a31a5d153b', 'f0259f230bdf0458d95a7d55edd5b168', 'd2b1c10fc013347f15449b4ed9b57437'),
('7c6e22b0a10703894bb4b447c02bf14a', '您创建了任务流NULL和', '2019-05-03 10:21:06', 0, '102f7ef87a534c5289e326a31a5d153b', '3bf19c66b6e346a4d66aca1bca78644f', NULL),
('7e9d1409b40df0fd623f7eab778083c7', '子任务:御景园 已完成', '2019-05-02 14:06:50', 1, '102f7ef87a534c5289e326a31a5d153b', 'f0259f230bdf0458d95a7d55edd5b168', 'bb392c9116db19c2dbea17e6b2e72315'),
('8421a1e1b3a6affe9e7ebe00a46b836a', '任务流:pfff 已经被更改,新的任务流名: pfff', '2019-04-16 16:09:25', 1, '102f7ef87a534c5289e326a31a5d153b', 'a0f8e06113f79b75be7448bdc838ad0f', NULL),
('8b66f3d999977a63fb6e8a51c4cef3c3', '子任务:cv 已完成', '2019-05-02 14:06:36', 1, '102f7ef87a534c5289e326a31a5d153b', 'f0259f230bdf0458d95a7d55edd5b168', 'd2b1c10fc013347f15449b4ed9b57437'),
('9049b57c6ea2086995a5e8b7a31c8ec6', '您创建了任务流hbj ', '2019-04-20 16:00:45', 1, '102f7ef87a534c5289e326a31a5d153b', '98b2f740a95a05b7a094c2cfbbe9c05f', NULL),
('963500ccebb5b855f2debc71c2ff23ae', '您创建了任务流NULL@#%^&&^*^/', '2019-05-03 09:02:55', 1, '102f7ef87a534c5289e326a31a5d153b', 'c9026ee43a5e17f0ef089af3eb9430ec', NULL),
('a88acc573a73c362ff63b57e2df1724e', '子任务:💔  已完成', '2019-05-03 10:17:52', 0, '102f7ef87a534c5289e326a31a5d153b', 'df281f245ee29b9e56c1530fb91c9fc3', '658a8372292b567d21065abf6482c0ee'),
('acc4c3267e7adb755446f85c7203786e', '您创建了任务流fewrgetbnytu', '2019-04-20 21:20:55', 1, '102f7ef87a534c5289e326a31a5d153b', '092d8b96bb0dfb68cabad2d58d357182', NULL),
('ad4544141c43f5f4e92c9bb4906db44f', '任务流:任务rt 已经被更改,新的任务流名: 任务rtewf', '2019-04-26 14:59:26', 1, '102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', NULL),
('b6551e5ec9f6b68be0e1f2b17504706f', '您创建了任务流头哈NULL套路', '2019-05-03 09:38:46', 1, '102f7ef87a534c5289e326a31a5d153b', 'a7fc975ec68c3dc61814c9756bd9ed8e', NULL),
('ca21aa46f76066259fe5296df007ae4f', '你有一个新的任务需要完成:💔 ', '2019-05-03 10:17:36', 0, '102f7ef87a534c5289e326a31a5d153b', 'df281f245ee29b9e56c1530fb91c9fc3', '658a8372292b567d21065abf6482c0ee'),
('ccd8b642680bf5afad6c8356441fae7e', '您创建了任务流few', '2019-04-20 21:25:38', 1, '102f7ef87a534c5289e326a31a5d153b', '003df8ec63b5a6133c120bc355823807', NULL),
('ce04cd3c12afbee4ec44d71fe187bc64', '你有一个新的任务需要完成:edewfwefw,截止日期为:Mon Apr 15 2019 21:16:00 GMT+0800 (CST),所属任务流:undefined', '2019-04-15 19:17:04', 1, '102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', '6232eaadfc7a0b25cb9dffed857a557c'),
('e76fc01ffebd1fac333dc5bf92c9419b', '任务流:任务rt已经被更改,新的任务流名:任务rt,截止时间是:2019-04-19 19:29:00.', '2019-04-15 19:46:56', 1, '102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', NULL),
('ea1698b56f67e297c62a38c08c893fec', '您创建了任务流🐷 ', '2019-05-03 10:16:57', 1, '102f7ef87a534c5289e326a31a5d153b', 'dc4dc1fab59bda727985d043de6dfbde', NULL),
('f125980fbe29bc96eee63b240868653a', '任务流:任务已经被更改,新的任务流名:任务rt,截止时间是:2019-04-15 19:29.', '2019-04-15 19:29:34', 1, '102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `task`
--

CREATE TABLE `task` (
  `id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `t_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `t_describe` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `begin_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_completed` tinyint(4) DEFAULT NULL,
  `tf_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `is_important` tinyint(4) NOT NULL DEFAULT '0' COMMENT '此子任务在任务流中是否是重要的'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `task`
--

INSERT INTO `task` (`id`, `t_name`, `t_describe`, `begin_time`, `end_time`, `is_completed`, `tf_id`, `is_important`) VALUES
('01de0957d5c70d87f68de2ebf369da6d', '环境', '就', '2019-04-15 09:25:00', '2019-04-15 11:25:00', 1, '093338102639a9b3e0278b19b45949c2', 0),
('020b2ef3d7795d4fb313f898d7c9b8dc', 'et', '54t45', '2019-04-05 09:42:46', '2019-04-05 09:42:46', 1, '08c84ee74040acaaa72baba28984c48b', 0),
('0ad6ffd97bd26e1f28b77f0077f7a2f7', 'efew', 'ewfew', '2019-04-05 09:49:40', '2019-04-05 09:49:40', 1, '08c84ee74040acaaa72baba28984c48b', 0),
('0af758bf2ba105e18d0f4bab05df5dd3', '？', '！', '2019-04-04 17:46:48', '2019-04-05 17:46:48', 1, '79436bc67bbad46cc2b51a969f287704', 0),
('0c79c230f7df7bc89b6bd1c64dd48cfc', '再来测试啊啊啊啊啊啊啊 ', '哈哈啊哈哈', '2019-04-06 19:59:57', '2019-04-06 19:59:57', 2, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('0d5160715cd66dfa08bf3cf31382682c', '成功了！', '嗯！就是这样！', '2019-04-05 14:25:45', '2019-04-05 17:03:43', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('0da716f5969dfc5cdb78c34898ba5dd7', 'ddd', 'eeee', '2019-04-11 10:22:00', '2019-04-12 10:22:00', 2, '29b4820fcb930b620617636cef9b2c55', 0),
('0e497383df09b6fbc519ea922b0cd24b', '再测试', '哈哈哈', '2019-04-05 17:00:41', '2019-04-05 17:00:41', 2, 'f72d246e66daac8060e1070cb4f036bb', 0),
('0f03b2097ff6a089e4213f3800a2bff2', '我', '额废物', '2019-04-15 19:45:00', '2019-04-15 19:45:00', 1, '093338102639a9b3e0278b19b45949c2', 0),
('1715d9c028d1f3fea719d27d680dad51', 'd', 'd', '2019-04-06 19:27:14', '2019-04-06 19:27:14', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('1bda68011c2acee1d3fa376e10f9d7e2', '杀多少积分', '附件为康复', '2019-04-05 16:14:50', '2019-04-05 16:14:50', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('1ce96219b2c0140915fc949cd21c2a9c', 'qwdew', 'ewfe', '2019-04-05 09:42:46', '2019-04-05 09:42:46', 1, '08c84ee74040acaaa72baba28984c48b', 0),
('1d5ccc4d0d3ea131f8518d1ff4284f09', '晚上吃啥', '不知道', '2019-04-07 17:41:55', '2019-04-07 22:41:55', 2, 'f72d246e66daac8060e1070cb4f036bb', 0),
('1d6163f1d65ef4c9a278afc017941da7', 'ee', 'eee', '2019-04-05 10:02:05', '2019-04-05 10:02:05', 1, '08c84ee74040acaaa72baba28984c48b', 0),
('24ec2a6741be18877618a857c9b560f9', '懂', '哈？', '2019-04-06 21:24:40', '2019-04-06 21:24:40', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('28fed270d74fe8f2f07d3679ac1202c0', '4', '4', '2019-04-06 18:47:31', '2019-04-06 18:47:31', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('2a1914d8ffea39c6b14b12f0b96f4921', 'ac', 'a', '2019-04-15 17:09:00', '2019-04-16 17:09:00', 1, '093338102639a9b3e0278b19b45949c2', 0),
('2b69245c31ec888d8ea75758888aba27', 'hahah', 'hahah', '2019-04-06 18:43:55', '2019-04-06 20:43:55', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('2e3f85cfa558d59e5a17527adff76b04', 'ok', 'ok', '2019-04-06 18:55:51', '2019-04-06 18:55:51', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('31902642e69d3471d764b8b4ab805f8a', '都市风', 'trhr', '2019-04-05 16:57:33', '2019-04-05 16:57:33', 2, 'f72d246e66daac8060e1070cb4f036bb', 0),
('3191197f46dc609d1ec25f363d6a705b', '测试1', '测试1', '2019-04-06 21:24:40', '2019-04-07 21:24:40', 2, '0e7677216ebe4d3573b6578d86c6be41', 0),
('330e9d543a261973dfa957a8ba9eba59', 'c', 'c', '2019-04-06 19:36:10', '2019-04-06 19:36:10', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('33e43ef2831f3b53c9aec78c49a1b52e', '嗯', '对', '2019-04-06 18:00:28', '2019-04-07 18:00:28', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('35b73d51580587662a71afc631b80ce4', '好吧', '嗯', '2019-04-05 10:18:59', '2019-04-05 10:18:59', 1, '5373f08e5749a68b71f4780e9706472d', 0),
('372e5cab9ffe6ee65aae691894c3e3c0', '456', '456', '2019-04-06 19:25:13', '2019-04-06 19:25:13', 1, '08c84ee74040acaaa72baba28984c48b', 0),
('37a09b2c365575e2835d7707764eb789', '测试定时器', '哈喽啊', '2019-04-07 18:59:00', '2019-04-07 19:01:00', 2, 'd1376ba90f1a90c02167f06ce3e0fd72', 0),
('37b95aefcc371129989100f61d039427', 'k', 'k', '2019-04-11 10:22:00', '2019-04-11 10:22:00', 2, '29b4820fcb930b620617636cef9b2c55', 0),
('3a9bd1abdb6cf57a1c8fc08baa1a6835', '是嘛', '嗯。', '2019-04-05 14:10:10', '2019-04-06 14:10:10', 1, 'c94bcc1221ac03fc95ff58bad2c46969', 0),
('3e84c181896ec92444e9d3baf3dcf9ac', 'ew', 'we', '2019-04-11 10:22:00', '2019-04-12 10:22:00', 2, '29b4820fcb930b620617636cef9b2c55', 0),
('3f69f870a11413ca85ff4858bc26f094', '技术部做宣传海报', '要做的好看一些，突出风筝节的主题', '2019-04-04 14:00:20', '2019-04-05 14:00:20', 1, 'c94bcc1221ac03fc95ff58bad2c46969', 0),
('40158a9fdaa439463a9243d95e7f04da', 'mn', 'mn', '2019-04-06 19:18:11', '2019-04-06 19:18:11', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('471ea54e16123647b2d7b74461cf16d3', 'x', 'x', '2019-04-06 19:23:08', '2019-04-06 19:23:08', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('472f62b143a783a2f195af17b4c56750', '靠', '靠', '2019-04-06 19:18:11', '2019-04-06 19:18:11', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('4922be0cc41be996626d1eef3b1d5693', '饿死了', '咋办', '2019-04-06 17:41:55', '2019-04-06 17:41:55', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('49b8c1e3bc7c32189892505edf795050', 'sac', 'wfew', '2019-04-04 17:51:51', '2019-04-04 17:51:51', 1, '79436bc67bbad46cc2b51a969f287704', 0),
('4c9371b0068dc0024204ada77d511097', 'ad', 'ewf', '2019-04-04 17:50:15', '2019-04-04 17:50:15', 1, '79436bc67bbad46cc2b51a969f287704', 0),
('530c57264ee0e283da1e21465d018d33', 'as', 'e', '2019-04-05 09:50:25', '2019-04-05 09:50:25', 1, '08c84ee74040acaaa72baba28984c48b', 0),
('54fd5078a13ebd74924b20d5776adcd3', '再来一个吧', '行吗', '2019-04-06 20:05:40', '2019-04-06 20:05:40', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('583891cfdf4074142b073e5d1888ca16', '但是', '的', '2019-04-05 10:16:28', '2019-04-05 10:16:28', 2, '53f29d5e63a80ca2d10f7004f6771380', 0),
('5a2261672656a0899bf6368d7d13d36f', '再来一个', '哈哈哈', '2019-04-06 18:45:36', '2019-04-07 18:45:36', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('619a2d248bf7c99ecdfa314f1b8c364e', '是吗 在哪', '快说', '2019-04-07 12:31:00', '2019-04-09 12:31:00', 2, 'd1376ba90f1a90c02167f06ce3e0fd72', 0),
('623230c1e6b1c376a58aa04d40b7a751', 'ef', 'efw', '2019-04-15 09:25:00', '2019-04-15 12:25:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('6232eaadfc7a0b25cb9dffed857a557c', 'edewfwefw', 'f4f34gt3g45hgdrehtrjreedtr', '2019-04-15 19:16:00', '2019-04-15 21:16:00', 1, '093338102639a9b3e0278b19b45949c2', 0),
('658a8372292b567d21065abf6482c0ee', '💔 ', '🤷‍♂️ ', '2019-05-03 09:14:00', '2019-05-03 09:14:00', 1, 'df281f245ee29b9e56c1530fb91c9fc3', 0),
('6610979787d65e97e70e607e52372c60', 'e', 'gr', '2019-04-15 17:09:00', '2019-04-15 18:09:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('664ab8ef630dc469737b09e2e0113098', 'evfhjefw', 'wnf', '2019-04-15 09:25:00', '2019-04-15 11:25:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('66dfe0b5ddcabc8026863f36cb82bd2a', 'hgcgNULL她', '太可怕了?', '2019-05-03 09:14:00', '2019-05-03 09:14:00', 0, 'c9026ee43a5e17f0ef089af3eb9430ec', 0),
('68273d8b7acca26ee64e7dcac992c12e', 'er', 'rg', '2019-04-05 16:48:16', '2019-04-05 16:48:16', 1, '53f29d5e63a80ca2d10f7004f6771380', 0),
('688333b5686fad1f2bfeb2874c3ea101', '啊', '好吧我觉得挺好的挺好的挺好的挺好的我觉得挺好的挺好的挺好的挺好的¡i¡i¡i¡i¡i¡i¡i¡i¡ॣ ॣ ॣ我觉得挺好的挺好的挺好的挺好的ฏ้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้้', '2019-04-06 22:42:28', '2019-04-06 22:42:28', 1, 'a08751022b174e2491afc48dd314f09c', 0),
('6ac02c1009b3b2cfd99c18852c896b7f', 'cnm', 'cnm', '2019-04-06 19:31:46', '2019-04-06 19:31:46', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('6bb7d055a319af59cc273f825a8fc39c', 'y5y56y56', '65yu56u', '2019-04-05 16:52:05', '2019-04-05 16:52:05', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('7b07aa3734246f51cc7256028945036b', '字段需知', '字段中不能有特殊字符和表情', '2019-04-06 17:41:55', '2019-04-06 17:41:55', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('83504431fd342f2afb04f56588a88000', 'wewe', 'efw', '2019-04-11 10:22:00', '2019-04-11 11:22:00', 2, '017d85b127fef6358df87de2861ab103', 0),
('83d9b3580a6f7c44d1b6229c9a37b701', 'dsvrre', 'gergt', '2019-04-04 17:46:31', '2019-04-04 17:46:31', 1, '79436bc67bbad46cc2b51a969f287704', 0),
('894678032c949831c04f541e94a314c8', 'kk', 'kk', '2019-04-06 19:03:56', '2019-04-06 19:03:56', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('8b8574a4414ffefc4a898ab5944fd793', '啊', '啊', '2019-04-05 09:36:58', '2019-04-05 09:36:58', 1, '5373f08e5749a68b71f4780e9706472d', 0),
('9225f4b43de12cb1eac3487c56bcf606', 'dd', 'dd', '2019-04-12 15:03:00', '2019-04-12 17:03:00', 2, 'f0259f230bdf0458d95a7d55edd5b168', 0),
('924062c34de5130323a6a993e00df7a7', 'wxdqw', 'efewf', '2019-04-05 09:35:01', '2019-04-05 09:35:01', 1, '08c84ee74040acaaa72baba28984c48b', 0),
('92724b2244d1620b0f9b1cc12adb140b', 's', 'sr', '2019-04-15 17:09:00', '2019-04-15 17:09:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('9ad7c57ae3e78a6ab04c7680ff7b9741', 'hahahaahahh', 'hahahaahahah', '2019-04-05 16:13:20', '2019-04-05 16:13:20', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('9bab6804c2f60b24be0fc75c3bc1e9e1', '东大门', '十点多', '2019-04-11 10:18:00', '2019-04-12 10:18:00', 2, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('9f9d0859f8c77b4a3d91f1ad9b49a112', '啦', '可爱', '2019-04-07 19:44:00', '2019-04-08 09:44:00', 2, '4658b1ad40b6d88dd848a0c73ea3774f', 0),
('a06e8e4d0dcd6eb94587a50b4578eda3', 'ggg', 'ggg', '2019-04-15 17:08:00', '2019-04-16 17:08:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('a0a143e5f63a1183352055655cf390e5', '哈喽呀', '我也想玩', '2019-04-04 17:37:07', '2019-04-05 17:37:07', 1, '9c51a51edf850a6fc9759bd10354db21', 0),
('a1a552c38a6a0e9120e005df910445ff', 'gu', 'guk', '2019-04-15 17:09:00', '2019-04-15 19:09:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('a5df5da6febc7ebe9ce8da53e61f62a2', '嗯嗯', '哈哈', '2019-04-05 14:24:10', '2019-04-05 14:24:10', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('a9bbb20a87e6613dabc992aba3c26893', 'b', 'b', '2019-04-06 19:31:46', '2019-04-06 19:31:46', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('accc9f8807543247e543e7cac608cd42', '报不报', '报不报', '2019-04-06 19:20:51', '2019-04-06 19:20:51', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('afd0fac1995486747245a68151ed3d94', 'ss', 'ss', '2019-04-11 10:22:00', '2019-04-12 10:22:00', 2, '29b4820fcb930b620617636cef9b2c55', 0),
('b1f3f47d619a7549e746dbae23d8de0a', '说点什么吧', '行不', '2019-04-07 18:41:00', '2019-04-08 18:41:00', 2, 'f72d246e66daac8060e1070cb4f036bb', 0),
('b3d0195a938f82f32d8211eabd428ff5', '222', '222', '2019-04-05 16:54:53', '2019-04-05 16:54:53', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('b5ea86893751de8f4283e5a9877eba70', 'ww', 'ww', '2019-04-11 10:22:00', '2019-04-11 10:24:00', 2, '29b4820fcb930b620617636cef9b2c55', 0),
('b64f270caf306d1d134f4b3f3fc37583', '哈喽？', '来', '2019-04-05 15:24:39', '2019-04-06 15:24:39', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('b6bcea4fddf209587d029d6662b18d76', 'rt', '245', '2019-04-15 17:09:00', '2019-04-15 18:09:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('b94535231d9e4cc08eb2e524d2c33905', '5555', '233333\n', '2019-04-07 19:52:00', '2019-04-07 19:55:00', 2, 'e3c2ae3f580d83ece18e8ba7474b5380', 0),
('ba20dbadd631f958e2224ae4990de3d8', 'de', 'ed', '2019-04-06 19:08:06', '2019-04-06 19:08:06', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('bb392c9116db19c2dbea17e6b2e72315', '御景园', '他如果', '2019-04-12 14:54:00', '2019-04-12 14:54:00', 1, 'f0259f230bdf0458d95a7d55edd5b168', 0),
('bcc56e656ed979fe6ac70d610f8ee9c9', '啊', '啊', '2019-04-04 17:42:37', '2019-04-04 17:42:37', 1, '79436bc67bbad46cc2b51a969f287704', 0),
('c07169c89fec8739f3fbf00bb054a524', '45t', '54t', '2019-04-15 17:09:00', '2019-04-15 17:09:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('c9e55836fe81d3ad0ea2e2a064cdb9b5', 'ds', 'ew', '2019-04-12 14:28:00', '2019-04-13 12:28:00', 2, 'e2b3cc66978b794e1a45dc888a101107', 0),
('d2b1c10fc013347f15449b4ed9b57437', 'cv', 'cv', '2019-04-12 14:32:00', '2019-04-12 17:32:00', 1, 'f0259f230bdf0458d95a7d55edd5b168', 0),
('d34f1875c75bd4831ffa8008a8f87915', 'gjyb', 'ku ', '2019-04-15 09:25:00', '2019-04-15 13:25:00', 2, '093338102639a9b3e0278b19b45949c2', 0),
('d6939972418bed4aa40630396c2dea5d', '哈喽时间测试', '哈喽时间测试', '2019-04-06 13:46:06', '2019-04-06 17:46:06', 1, '5373f08e5749a68b71f4780e9706472d', 0),
('d84922d3fe910be91759e9128ec8b969', '嗯', '好', '2019-04-05 15:24:39', '2019-04-06 15:24:39', 1, 'f72d246e66daac8060e1070cb4f036bb', 0),
('de2a1f25f25ebebdc2c74cc9101ea9d1', 'a', 'a', '2019-04-06 19:31:46', '2019-04-06 19:31:46', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('df3d4b9908c36a3de3d564c5d9449cc2', 'sxqw', 'wqxqw', '2019-04-05 09:32:57', '2019-04-05 09:32:57', 1, '79436bc67bbad46cc2b51a969f287704', 0),
('e3ca05e10f32c873e6d45866adbda0fc', '啊', '额', '2019-04-07 08:12:45', '2019-04-07 10:12:45', 1, '53f29d5e63a80ca2d10f7004f6771380', 0),
('e81098b6dd88eee522df0eaf4400a06d', '23333', 'www', '2019-04-07 19:52:00', '2019-04-07 21:52:00', 2, 'e3c2ae3f580d83ece18e8ba7474b5380', 0),
('e977102b9ba9e0ca59adadcafa689449', 'v', 'v', '2019-04-06 19:38:52', '2019-04-06 19:38:52', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('ea36354a4164c3f5a3a2ecb83b3bf912', '只能这样啊', '好吧', '2019-04-06 20:01:06', '2019-04-06 20:01:06', 1, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('ee4d758e0de8643082031f4113edca5d', 'wdk', 'nfkwje', '2019-04-11 10:18:00', '2019-04-12 10:18:00', 2, '557f950ec0a76d4aac2a0fd74f1c5746', 0),
('fb04b6791853165e467885d3ccb9646b', 'es', 'd', '2019-04-15 17:09:00', '2019-04-15 18:09:00', 1, '093338102639a9b3e0278b19b45949c2', 0),
('fb79354f83973e8cdcc04cc1ead0cf8c', '空', '靠', '2019-04-05 17:03:03', '2019-04-05 17:03:03', 1, '53f29d5e63a80ca2d10f7004f6771380', 0),
('fe11743f3bc35f17a0119640b8f104d6', 'ewfw', 'ewfew', '2019-04-05 10:38:49', '2019-04-05 10:38:49', 1, '53f29d5e63a80ca2d10f7004f6771380', 0);

-- --------------------------------------------------------

--
-- 表的结构 `task_flow`
--

CREATE TABLE `task_flow` (
  `id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `tf_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '未命名',
  `tf_describe` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `is_completed` tinyint(4) DEFAULT NULL,
  `begin_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `leader_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `task_flow`
--

INSERT INTO `task_flow` (`id`, `tf_name`, `tf_describe`, `is_completed`, `begin_time`, `end_time`, `leader_id`) VALUES
('003df8ec63b5a6133c120bc355823807', 'few', 'regt', 1, '2019-04-20 21:25:00', '2019-04-20 21:25:00', '102f7ef87a534c5289e326a31a5d153b'),
('017d85b127fef6358df87de2861ab103', '的', '的', 1, '2019-04-09 10:00:00', '2019-04-13 10:00:00', '102f7ef87a534c5289e326a31a5d153b'),
('068d55b2c89af004fc6da6e9eb345dd1', 'ddd', 'ddd', 1, '2019-04-09 09:54:00', '2019-04-10 09:54:00', '102f7ef87a534c5289e326a31a5d153b'),
('0893816ce02b3170ce8a21df17c34966', '该是', '改名字喊好', 0, '2019-04-07 11:45:00', '2019-07-11 11:42:00', '102f7ef87a534c5289e326a31a5d153b'),
('08c84ee74040acaaa72baba28984c48b', '嗯好吧', '呼啦啦', 1, '2019-04-08 11:08:00', '2019-04-08 11:08:00', '102f7ef87a534c5289e326a31a5d153b'),
('092d8b96bb0dfb68cabad2d58d357182', 'fewrgetbnytu', 'ilyuikjyftdgwew', 1, '2019-04-20 21:20:00', '2019-04-20 21:20:00', '102f7ef87a534c5289e326a31a5d153b'),
('093338102639a9b3e0278b19b45949c2', '任务rtewf', '任务4t', 0, '2019-04-26 14:58:00', '2019-05-24 14:58:00', '102f7ef87a534c5289e326a31a5d153b'),
('0e7677216ebe4d3573b6578d86c6be41', '再做测试', '测试点\n1 添加子任务是否立即就能刷新出来\n2 测试一下评论功能\n3 子任务详情页面卡不卡', 1, '2019-04-06 21:24:40', '2019-04-06 23:24:40', '102f7ef87a534c5289e326a31a5d153b'),
('22f7c7050985bc3e1c28da08f57f80c5', 'rgrgger', 'regergthr', 1, '2019-04-20 15:52:00', '2019-04-20 15:52:00', '102f7ef87a534c5289e326a31a5d153b'),
('29b4820fcb930b620617636cef9b2c55', '测试消息', '啦啦啦阿拉啦啦', 1, '2019-04-10 14:36:00', '2019-04-12 14:36:00', '102f7ef87a534c5289e326a31a5d153b'),
('2a0e912970868d1e4a856c23baac3f1b', 'bdefgjwe?()*&^%$#@!_+-=', 'sf?)(*&^$@$%#$^@%$#%^&*', 0, '2019-05-03 09:04:00', '2019-05-03 09:04:00', '102f7ef87a534c5289e326a31a5d153b'),
('37be356e01c348befc4e597ee9ac8a01', 'df', 'egw', 1, '2019-04-20 15:52:00', '2019-04-20 15:52:00', '102f7ef87a534c5289e326a31a5d153b'),
('3bf19c66b6e346a4d66aca1bca78644f', 'NULL和', '💔 ', 0, '2019-05-03 09:14:00', '2019-05-04 09:14:00', '102f7ef87a534c5289e326a31a5d153b'),
('4638a58332dd3fdc68c2cd68b7d3be35', '12', '12', 1, '2019-04-10 14:39:00', '2019-04-10 14:39:00', '102f7ef87a534c5289e326a31a5d153b'),
('4658b1ad40b6d88dd848a0c73ea3774f', '新的标题', '十八', 1, '2019-04-07 11:46:00', '2019-04-08 10:57:00', '102f7ef87a534c5289e326a31a5d153b'),
('4d18a7d053d97572f2e6842833f3bc6d', 'NULL啊', '😳 ?', 0, '2019-05-03 09:14:00', '2019-05-04 09:14:00', '102f7ef87a534c5289e326a31a5d153b'),
('4ec7e44d6c04e1daeae1e3995f59b75a', '34', '34', 1, '2019-04-10 14:42:00', '2019-04-10 14:42:00', '102f7ef87a534c5289e326a31a5d153b'),
('5373f08e5749a68b71f4780e9706472d', '五号测试', '嗯啊', 1, '2019-04-05 09:36:58', '2019-04-09 09:36:58', '0a4206159794a591b4f03f460306d3ec'),
('53f29d5e63a80ca2d10f7004f6771380', '哈哈哈', '啦啦啦啦啦啦啦啦呀呀呀呀呀呀呀晕看评论', 1, '2019-04-05 10:16:28', '2019-04-07 10:16:28', '102f7ef87a534c5289e326a31a5d153b'),
('557f950ec0a76d4aac2a0fd74f1c5746', '今天牛逼了吗', '你说呢', 0, '2019-04-06 17:41:55', '2019-05-06 17:41:55', '102f7ef87a534c5289e326a31a5d153b'),
('56abe7543eeadc47e2c8f13c52eb4d86', '你哈啊啊', '上次你是否能', 1, '2019-04-07 10:57:00', '2019-04-07 10:57:00', '102f7ef87a534c5289e326a31a5d153b'),
('59ec9d409d526b269a76aa5c7b421b70', '13595', 'KKK', 1, '2019-04-05 14:26:59', '2019-04-05 14:26:59', 'ea5d0ae3645a6890c79a93c64ceab867'),
('79436bc67bbad46cc2b51a969f287704', '张鹤麟', '打扰了', 1, '2019-04-04 17:39:31', '2019-04-06 17:39:31', '102f7ef87a534c5289e326a31a5d153b'),
('7bfef14ace27f40ae851f2c467698579', '我想和你在一起', '行吗', 1, '2019-04-20 15:52:00', '2019-04-22 15:52:00', '102f7ef87a534c5289e326a31a5d153b'),
('8c061177c1598518fbf86d751cbad561', '78', '78', 0, '2019-04-12 10:50:00', '2019-05-12 10:50:00', '102f7ef87a534c5289e326a31a5d153b'),
('98b2f740a95a05b7a094c2cfbbe9c05f', 'hbj ', 'kbg', 1, '2019-04-20 15:52:00', '2019-04-20 15:52:00', '102f7ef87a534c5289e326a31a5d153b'),
('9abdcfe20400e0b004f0bb7760d3397f', '56', '56', 1, '2019-04-10 14:43:00', '2019-04-10 14:43:00', '102f7ef87a534c5289e326a31a5d153b'),
('9c51a51edf850a6fc9759bd10354db21', '成员测试', '这是成员测试', 0, '2019-04-04 17:35:53', '2019-05-04 17:35:53', '0a4206159794a591b4f03f460306d3ec'),
('a08751022b174e2491afc48dd314f09c', '啦', '啦', 1, '2019-04-06 22:32:44', '2019-04-06 22:32:44', '102f7ef87a534c5289e326a31a5d153b'),
('a0f8e06113f79b75be7448bdc838ad0f', 'pfff', '付尾款', 1, '2019-04-16 16:06:00', '2019-04-18 09:25:00', '102f7ef87a534c5289e326a31a5d153b'),
('a4f90cd5d592baceca8d84ea39d3ee92', 'cggg', 'jkkk', 1, '2019-04-04 16:12:59', '2019-04-04 16:12:59', '0a4206159794a591b4f03f460306d3ec'),
('a7fc975ec68c3dc61814c9756bd9ed8e', '头哈NULL套路', '啦啦啦', 0, '2019-05-03 09:14:00', '2019-05-04 09:14:00', '102f7ef87a534c5289e326a31a5d153b'),
('ac947634f11e02d1673d18273e0315d6', '人', '二', 1, '2019-04-20 15:52:00', '2019-04-22 15:52:00', '102f7ef87a534c5289e326a31a5d153b'),
('b6bb5143859b4f0890f131a50fbb49ab', 're', 'ret', 1, '2019-04-20 15:52:00', '2019-04-20 15:52:00', '102f7ef87a534c5289e326a31a5d153b'),
('c3020693bbf83fb0ac4014f112db2cc9', 'ce', 'e', 1, '2019-04-15 09:25:00', '2019-04-18 12:25:00', '102f7ef87a534c5289e326a31a5d153b'),
('c9026ee43a5e17f0ef089af3eb9430ec', 'NULL@#%^&&^*^/', 'sadewf', 0, '2019-05-03 09:01:00', '2019-05-03 09:01:00', '102f7ef87a534c5289e326a31a5d153b'),
('c94bcc1221ac03fc95ff58bad2c46969', '航标网风筝节', '风筝节就要来了，大家一起动起来，迎接美好的春天吧！', 1, '2019-04-04 13:42:36', '2019-04-10 13:42:36', '102f7ef87a534c5289e326a31a5d153b'),
('cff15623413e8c0847ae3a99b20c9edf', '嗯的吧', '啦啦啦', 1, '2019-04-04 17:19:33', '2019-04-07 17:19:33', '0a4206159794a591b4f03f460306d3ec'),
('d1376ba90f1a90c02167f06ce3e0fd72', '看人', '看啊，这有个人', 1, '2019-04-07 12:31:00', '2019-04-13 11:54:00', '102f7ef87a534c5289e326a31a5d153b'),
('d31670c788e998dd17d109795e417a39', '推荐NULL？啦啦啦', '啦啦啦？?', 0, '2019-05-03 09:14:00', '2019-05-03 09:14:00', '102f7ef87a534c5289e326a31a5d153b'),
('dc4dc1fab59bda727985d043de6dfbde', '🐷 ', '😳 ', 0, '2019-05-03 09:14:00', '2019-05-03 09:14:00', '102f7ef87a534c5289e326a31a5d153b'),
('de11d5301095358a2201cc52e69913d6', '在册', '的', 1, '2019-04-10 14:37:00', '2019-04-10 14:37:00', '102f7ef87a534c5289e326a31a5d153b'),
('df281f245ee29b9e56c1530fb91c9fc3', '🍺 ', '💪 ', 0, '2019-05-03 09:14:00', '2019-05-03 09:14:00', '102f7ef87a534c5289e326a31a5d153b'),
('dfdc52be3fdf037caf0a64382d693788', '🍺 ☺️ 😳 😄 ', '🎤 💩 ', 0, '2019-05-03 09:14:00', '2019-05-03 09:14:00', '102f7ef87a534c5289e326a31a5d153b'),
('e2b3cc66978b794e1a45dc888a101107', 'ke', 'ke', 1, '2019-04-12 14:27:00', '2019-04-13 14:27:00', '102f7ef87a534c5289e326a31a5d153b'),
('e3c2ae3f580d83ece18e8ba7474b5380', 'test', '测试测试~', 1, '2019-04-07 19:52:00', '2019-04-08 19:52:00', 'ea5d0ae3645a6890c79a93c64ceab867'),
('ea6d08a6211ae37ba9ddbf477759b67d', '🐂 ', '🐴 ', 0, '2019-05-03 09:14:00', '2019-05-03 09:14:00', '102f7ef87a534c5289e326a31a5d153b'),
('efec10a727f65d9941d9d3ab2e6b7ed3', '快好', '测试分类啊啊啊啊啊啊啊', 1, '2019-04-13 20:40:00', '2019-04-13 20:40:00', '102f7ef87a534c5289e326a31a5d153b'),
('eryetjyjhfjty', 'fhellosdfh?vfdsb???snkvas', 'safesgrhtfbxghtr', NULL, NULL, NULL, '102f7ef87a534c5289e326a31a5d153b'),
('f0259f230bdf0458d95a7d55edd5b168', 'op', 'op', 0, '2019-04-12 14:28:00', '2019-07-12 14:28:00', '102f7ef87a534c5289e326a31a5d153b'),
('f72d246e66daac8060e1070cb4f036bb', '测试一下下', '这是一个测试，测试，李沛霖小同学', 1, '2019-04-05 14:24:10', '2019-04-10 14:24:10', '102f7ef87a534c5289e326a31a5d153b');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `openid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `nick_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_number` varchar(18) CHARACTER SET utf8 DEFAULT '',
  `city` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `province` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `country` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `avatar_url` text CHARACTER SET utf8,
  `gender` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `openid`, `nick_name`, `phone_number`, `city`, `province`, `country`, `avatar_url`, `gender`) VALUES
('0a4206159794a591b4f03f460306d3ec', 'okulZ5O6rTEHBEk-y75dYR3CSQFQ', 'Tim', 'undefined', '', '', '', 'https://wx.qlogo.cn/mmopen/vi_32/4ia1K0FXqS2Nsv8ia0jZXibF2SIPjZLTo0Roaia03NGwOiaDjC4NEBdTAjEAPHiaIOUzUtgRg7C77CcxJVQcZpbbibeug/132', 0),
('102f7ef87a534c5289e326a31a5d153b', 'okulZ5LTxceX9Oq_nQL4Nfg_wUDM', 'Ryan Hardy', 'undefined', 'Baoding', 'Hebei', 'China', 'https://wx.qlogo.cn/mmopen/vi_32/nqMXuic5mkp7E1sqceEicZBG6UP2gSf6OlCVObTjUOao7UjuwGDuZIBdk7Derlk56ia743IzGFheNzwKOlVSqGquA/132', 1),
('ea5d0ae3645a6890c79a93c64ceab867', 'okulZ5Ov2fFeFZKPRjdUK-ZsGXPo', '雨夜', 'undefined', 'Cangzhou', 'Hebei', 'China', 'https://wx.qlogo.cn/mmopen/vi_32/ZuVa4CwuK4JoSNarjTVsphmmIBZO6eyvNLxIHSjicYkhNvibxveapRW4oG5eibickzsoibLXrnXUo7N6zyiaVmGOAVibg/132', 0);

-- --------------------------------------------------------

--
-- 表的结构 `user_task`
--

CREATE TABLE `user_task` (
  `u_id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `t_id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `user_status` tinyint(4) DEFAULT '1' COMMENT '用户状态 2完成 1进行中 0请假',
  `break_reason` varchar(64) CHARACTER SET utf8 DEFAULT NULL COMMENT '请假原因',
  `refuse_reason` varchar(64) CHARACTER SET utf8 DEFAULT NULL COMMENT '驳回请假请求的原因'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `user_task`
--

INSERT INTO `user_task` (`u_id`, `t_id`, `user_status`, `break_reason`, `refuse_reason`) VALUES
('0a4206159794a591b4f03f460306d3ec', '1d5ccc4d0d3ea131f8518d1ff4284f09', 0, '测试一下请假', '拒绝你'),
('0a4206159794a591b4f03f460306d3ec', '3191197f46dc609d1ec25f363d6a705b', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', '35b73d51580587662a71afc631b80ce4', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', '372e5cab9ffe6ee65aae691894c3e3c0', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', '530c57264ee0e283da1e21465d018d33', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', '5a2261672656a0899bf6368d7d13d36f', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', '7b07aa3734246f51cc7256028945036b', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', '8b8574a4414ffefc4a898ab5944fd793', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', '924062c34de5130323a6a993e00df7a7', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', 'a0a143e5f63a1183352055655cf390e5', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', 'b1f3f47d619a7549e746dbae23d8de0a', 1, '', ''),
('0a4206159794a591b4f03f460306d3ec', 'd6939972418bed4aa40630396c2dea5d', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '01de0957d5c70d87f68de2ebf369da6d', 2, 'hehe', ''),
('102f7ef87a534c5289e326a31a5d153b', '020b2ef3d7795d4fb313f898d7c9b8dc', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '0ad6ffd97bd26e1f28b77f0077f7a2f7', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '0af758bf2ba105e18d0f4bab05df5dd3', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '0c79c230f7df7bc89b6bd1c64dd48cfc', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '0d5160715cd66dfa08bf3cf31382682c', 2, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '0da716f5969dfc5cdb78c34898ba5dd7', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '0e497383df09b6fbc519ea922b0cd24b', 3, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '0f03b2097ff6a089e4213f3800a2bff2', 2, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '1715d9c028d1f3fea719d27d680dad51', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '1bda68011c2acee1d3fa376e10f9d7e2', 0, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '1ce96219b2c0140915fc949cd21c2a9c', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '1d5ccc4d0d3ea131f8518d1ff4284f09', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '1d6163f1d65ef4c9a278afc017941da7', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '24ec2a6741be18877618a857c9b560f9', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '28fed270d74fe8f2f07d3679ac1202c0', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '2a1914d8ffea39c6b14b12f0b96f4921', 2, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '2b69245c31ec888d8ea75758888aba27', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '2e3f85cfa558d59e5a17527adff76b04', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '3191197f46dc609d1ec25f363d6a705b', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '330e9d543a261973dfa957a8ba9eba59', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '33e43ef2831f3b53c9aec78c49a1b52e', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '372e5cab9ffe6ee65aae691894c3e3c0', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '37a09b2c365575e2835d7707764eb789', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '37b95aefcc371129989100f61d039427', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '3a9bd1abdb6cf57a1c8fc08baa1a6835', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '3e84c181896ec92444e9d3baf3dcf9ac', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '3f69f870a11413ca85ff4858bc26f094', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '40158a9fdaa439463a9243d95e7f04da', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '471ea54e16123647b2d7b74461cf16d3', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '472f62b143a783a2f195af17b4c56750', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '4922be0cc41be996626d1eef3b1d5693', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '49b8c1e3bc7c32189892505edf795050', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '4c9371b0068dc0024204ada77d511097', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '54fd5078a13ebd74924b20d5776adcd3', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '583891cfdf4074142b073e5d1888ca16', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '5a2261672656a0899bf6368d7d13d36f', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '619a2d248bf7c99ecdfa314f1b8c364e', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '623230c1e6b1c376a58aa04d40b7a751', 3, 'reefw', ''),
('102f7ef87a534c5289e326a31a5d153b', '6232eaadfc7a0b25cb9dffed857a557c', 2, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '658a8372292b567d21065abf6482c0ee', 2, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '6610979787d65e97e70e607e52372c60', 3, 'dcce', ''),
('102f7ef87a534c5289e326a31a5d153b', '664ab8ef630dc469737b09e2e0113098', 3, 'ewrr43r', ''),
('102f7ef87a534c5289e326a31a5d153b', '66dfe0b5ddcabc8026863f36cb82bd2a', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '68273d8b7acca26ee64e7dcac992c12e', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '688333b5686fad1f2bfeb2874c3ea101', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '6ac02c1009b3b2cfd99c18852c896b7f', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '6bb7d055a319af59cc273f825a8fc39c', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '83504431fd342f2afb04f56588a88000', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '83d9b3580a6f7c44d1b6229c9a37b701', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '894678032c949831c04f541e94a314c8', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '9225f4b43de12cb1eac3487c56bcf606', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '92724b2244d1620b0f9b1cc12adb140b', 2, 'sfewfewfwe', ''),
('102f7ef87a534c5289e326a31a5d153b', '9bab6804c2f60b24be0fc75c3bc1e9e1', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', '9f9d0859f8c77b4a3d91f1ad9b49a112', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'a06e8e4d0dcd6eb94587a50b4578eda3', 3, 'rf', ''),
('102f7ef87a534c5289e326a31a5d153b', 'a1a552c38a6a0e9120e005df910445ff', 3, 'fwefewf', ''),
('102f7ef87a534c5289e326a31a5d153b', 'a9bbb20a87e6613dabc992aba3c26893', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'accc9f8807543247e543e7cac608cd42', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'afd0fac1995486747245a68151ed3d94', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'b1f3f47d619a7549e746dbae23d8de0a', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'b3d0195a938f82f32d8211eabd428ff5', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'b5ea86893751de8f4283e5a9877eba70', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'b6bcea4fddf209587d029d6662b18d76', 3, '123', ''),
('102f7ef87a534c5289e326a31a5d153b', 'b94535231d9e4cc08eb2e524d2c33905', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'ba20dbadd631f958e2224ae4990de3d8', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'bb392c9116db19c2dbea17e6b2e72315', 2, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'bcc56e656ed979fe6ac70d610f8ee9c9', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'c07169c89fec8739f3fbf00bb054a524', 3, 'ga', ''),
('102f7ef87a534c5289e326a31a5d153b', 'c9e55836fe81d3ad0ea2e2a064cdb9b5', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'd2b1c10fc013347f15449b4ed9b57437', 2, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'd34f1875c75bd4831ffa8008a8f87915', 3, 'hhehee', ''),
('102f7ef87a534c5289e326a31a5d153b', 'd6939972418bed4aa40630396c2dea5d', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'd84922d3fe910be91759e9128ec8b969', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'de2a1f25f25ebebdc2c74cc9101ea9d1', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'df3d4b9908c36a3de3d564c5d9449cc2', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'e3ca05e10f32c873e6d45866adbda0fc', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'e977102b9ba9e0ca59adadcafa689449', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'ea36354a4164c3f5a3a2ecb83b3bf912', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'ee4d758e0de8643082031f4113edca5d', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'fb04b6791853165e467885d3ccb9646b', 2, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'fb79354f83973e8cdcc04cc1ead0cf8c', 1, '', ''),
('102f7ef87a534c5289e326a31a5d153b', 'fe11743f3bc35f17a0119640b8f104d6', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', '0d5160715cd66dfa08bf3cf31382682c', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', '0e497383df09b6fbc519ea922b0cd24b', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', '1d5ccc4d0d3ea131f8518d1ff4284f09', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', '31902642e69d3471d764b8b4ab805f8a', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', '5a2261672656a0899bf6368d7d13d36f', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', '9ad7c57ae3e78a6ab04c7680ff7b9741', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', 'b1f3f47d619a7549e746dbae23d8de0a', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', 'd84922d3fe910be91759e9128ec8b969', 1, '', ''),
('ea5d0ae3645a6890c79a93c64ceab867', 'e81098b6dd88eee522df0eaf4400a06d', 1, '', '');

-- --------------------------------------------------------

--
-- 表的结构 `user_taskflow`
--

CREATE TABLE `user_taskflow` (
  `u_id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `tf_id` varchar(32) CHARACTER SET utf8 NOT NULL,
  `role` tinyint(4) DEFAULT '0' COMMENT '用户对于此任务流的角色 1 管理员 0member',
  `category` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '默认' COMMENT '分类'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `user_taskflow`
--

INSERT INTO `user_taskflow` (`u_id`, `tf_id`, `role`, `category`) VALUES
('0a4206159794a591b4f03f460306d3ec', '08c84ee74040acaaa72baba28984c48b', 0, '默认'),
('0a4206159794a591b4f03f460306d3ec', '0e7677216ebe4d3573b6578d86c6be41', 0, '默认'),
('0a4206159794a591b4f03f460306d3ec', '5373f08e5749a68b71f4780e9706472d', 1, '默认'),
('0a4206159794a591b4f03f460306d3ec', '79436bc67bbad46cc2b51a969f287704', 0, '默认'),
('0a4206159794a591b4f03f460306d3ec', '9c51a51edf850a6fc9759bd10354db21', 1, '默认'),
('0a4206159794a591b4f03f460306d3ec', 'a4f90cd5d592baceca8d84ea39d3ee92', 1, '默认'),
('0a4206159794a591b4f03f460306d3ec', 'c94bcc1221ac03fc95ff58bad2c46969', 0, '默认'),
('0a4206159794a591b4f03f460306d3ec', 'cff15623413e8c0847ae3a99b20c9edf', 1, '默认'),
('0a4206159794a591b4f03f460306d3ec', 'f72d246e66daac8060e1070cb4f036bb', 0, '默认'),
('102f7ef87a534c5289e326a31a5d153b', '017d85b127fef6358df87de2861ab103', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', '0893816ce02b3170ce8a21df17c34966', 1, '默认'),
('102f7ef87a534c5289e326a31a5d153b', '08c84ee74040acaaa72baba28984c48b', 1, '测试'),
('102f7ef87a534c5289e326a31a5d153b', '093338102639a9b3e0278b19b45949c2', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', '0e7677216ebe4d3573b6578d86c6be41', 1, '默认'),
('102f7ef87a534c5289e326a31a5d153b', '2a0e912970868d1e4a856c23baac3f1b', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', '3bf19c66b6e346a4d66aca1bca78644f', 1, '😁 '),
('102f7ef87a534c5289e326a31a5d153b', '4638a58332dd3fdc68c2cd68b7d3be35', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', '4658b1ad40b6d88dd848a0c73ea3774f', 1, '默认'),
('102f7ef87a534c5289e326a31a5d153b', '5373f08e5749a68b71f4780e9706472d', 0, '默认'),
('102f7ef87a534c5289e326a31a5d153b', '53f29d5e63a80ca2d10f7004f6771380', 1, '五号'),
('102f7ef87a534c5289e326a31a5d153b', '557f950ec0a76d4aac2a0fd74f1c5746', 0, '默认'),
('102f7ef87a534c5289e326a31a5d153b', '56abe7543eeadc47e2c8f13c52eb4d86', 1, '默认'),
('102f7ef87a534c5289e326a31a5d153b', '79436bc67bbad46cc2b51a969f287704', 1, '默认'),
('102f7ef87a534c5289e326a31a5d153b', '8c061177c1598518fbf86d751cbad561', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'a08751022b174e2491afc48dd314f09c', 1, '默认'),
('102f7ef87a534c5289e326a31a5d153b', 'a4f90cd5d592baceca8d84ea39d3ee92', 0, '默认'),
('102f7ef87a534c5289e326a31a5d153b', 'a7fc975ec68c3dc61814c9756bd9ed8e', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'c9026ee43a5e17f0ef089af3eb9430ec', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'c94bcc1221ac03fc95ff58bad2c46969', 0, '默认'),
('102f7ef87a534c5289e326a31a5d153b', 'cff15623413e8c0847ae3a99b20c9edf', 0, '默认'),
('102f7ef87a534c5289e326a31a5d153b', 'd1376ba90f1a90c02167f06ce3e0fd72', 1, '默认'),
('102f7ef87a534c5289e326a31a5d153b', 'd31670c788e998dd17d109795e417a39', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'dc4dc1fab59bda727985d043de6dfbde', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'de11d5301095358a2201cc52e69913d6', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'df281f245ee29b9e56c1530fb91c9fc3', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'dfdc52be3fdf037caf0a64382d693788', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'e3c2ae3f580d83ece18e8ba7474b5380', 0, '默认'),
('102f7ef87a534c5289e326a31a5d153b', 'ea6d08a6211ae37ba9ddbf477759b67d', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'f0259f230bdf0458d95a7d55edd5b168', 1, '默认分类'),
('102f7ef87a534c5289e326a31a5d153b', 'f72d246e66daac8060e1070cb4f036bb', 0, '默认'),
('ea5d0ae3645a6890c79a93c64ceab867', '59ec9d409d526b269a76aa5c7b421b70', 1, '默认'),
('ea5d0ae3645a6890c79a93c64ceab867', 'e3c2ae3f580d83ece18e8ba7474b5380', 1, '默认'),
('ea5d0ae3645a6890c79a93c64ceab867', 'f72d246e66daac8060e1070cb4f036bb', 0, '默认');

--
-- 转储表的索引
--

--
-- 表的索引 `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `tf_id` (`tf_id`);

--
-- 表的索引 `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `t_id` (`t_id`);

--
-- 表的索引 `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `t_id` (`t_id`);

--
-- 表的索引 `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `to_user_id` (`to_user_id`),
  ADD KEY `tf_id` (`tf_id`),
  ADD KEY `t_id` (`t_id`);

--
-- 表的索引 `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tf_id` (`tf_id`);

--
-- 表的索引 `task_flow`
--
ALTER TABLE `task_flow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leader_id` (`leader_id`);

--
-- 表的索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `user_task`
--
ALTER TABLE `user_task`
  ADD PRIMARY KEY (`u_id`,`t_id`),
  ADD KEY `t_id` (`t_id`);

--
-- 表的索引 `user_taskflow`
--
ALTER TABLE `user_taskflow`
  ADD PRIMARY KEY (`u_id`,`tf_id`),
  ADD KEY `tf_id` (`tf_id`);

--
-- 限制导出的表
--

--
-- 限制表 `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `category_ibfk_2` FOREIGN KEY (`tf_id`) REFERENCES `task_flow` (`id`);

--
-- 限制表 `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`t_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `image_ibfk_2` FOREIGN KEY (`t_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`tf_id`) REFERENCES `task_flow` (`id`),
  ADD CONSTRAINT `message_ibfk_3` FOREIGN KEY (`t_id`) REFERENCES `task` (`id`);

--
-- 限制表 `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`tf_id`) REFERENCES `task_flow` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 限制表 `task_flow`
--
ALTER TABLE `task_flow`
  ADD CONSTRAINT `task_flow_ibfk_1` FOREIGN KEY (`leader_id`) REFERENCES `user` (`id`);

--
-- 限制表 `user_task`
--
ALTER TABLE `user_task`
  ADD CONSTRAINT `user_task_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_task_ibfk_2` FOREIGN KEY (`t_id`) REFERENCES `task` (`id`);

--
-- 限制表 `user_taskflow`
--
ALTER TABLE `user_taskflow`
  ADD CONSTRAINT `user_taskflow_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_taskflow_ibfk_2` FOREIGN KEY (`tf_id`) REFERENCES `task_flow` (`id`);

DELIMITER $$
--
-- 事件
--
CREATE DEFINER=`root`@`localhost` EVENT `update_tf_status_timer` ON SCHEDULE EVERY 60 SECOND STARTS '2019-04-07 18:58:25' ON COMPLETION PRESERVE ENABLE DO call update_tf_status()$$

CREATE DEFINER=`root`@`localhost` EVENT `update_t_status_timer` ON SCHEDULE EVERY 60 SECOND STARTS '2019-04-07 19:09:48' ON COMPLETION NOT PRESERVE ENABLE DO call update_t_status()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
