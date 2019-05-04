-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 04, 2019 at 04:58 AM
-- Server version: 5.5.60-MariaDB
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xcx_task_flow`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id` varchar(32) NOT NULL,
  `name` varchar(16) DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL COMMENT '谁创建的分类',
  `tf_id` varchar(32) DEFAULT NULL COMMENT '哪个任务流属于这个分类'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE IF NOT EXISTS `comment` (
  `id` varchar(32) NOT NULL,
  `comment_type` tinyint(4) DEFAULT '0',
  `content` text,
  `create_time` datetime DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL,
  `t_id` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE IF NOT EXISTS `image` (
  `id` varchar(32) NOT NULL,
  `t_id` varchar(32) DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL,
  `url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE IF NOT EXISTS `message` (
  `id` varchar(32) NOT NULL,
  `content` text,
  `create_time` datetime DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT NULL,
  `to_user_id` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `id` varchar(32) NOT NULL,
  `t_name` varchar(64) DEFAULT NULL,
  `t_describe` text NOT NULL,
  `begin_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_completed` tinyint(4) DEFAULT NULL,
  `tf_id` varchar(32) DEFAULT NULL,
  `is_important` tinyint(4) NOT NULL DEFAULT '0' COMMENT '此子任务在任务流中是否是重要的'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `task_flow`
--

CREATE TABLE IF NOT EXISTS `task_flow` (
  `id` varchar(32) NOT NULL,
  `tf_name` varchar(32) DEFAULT '未命名',
  `tf_describe` text,
  `is_completed` tinyint(4) DEFAULT NULL,
  `category` varchar(32) DEFAULT NULL,
  `begin_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `leader_id` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(32) NOT NULL,
  `openid` varchar(32) NOT NULL,
  `nick_name` varchar(64) DEFAULT NULL,
  `phone_number` varchar(18) DEFAULT '',
  `city` varchar(32) DEFAULT NULL,
  `province` varchar(32) DEFAULT NULL,
  `country` varchar(32) DEFAULT NULL,
  `avatar_url` varchar(128) DEFAULT NULL,
  `gender` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `user_task`
--

CREATE TABLE IF NOT EXISTS `user_task` (
  `u_id` varchar(32) NOT NULL,
  `t_id` varchar(32) NOT NULL,
  `user_status` tinyint(4) DEFAULT '1' COMMENT '用户状态 1正常 0请假',
  `break_reason` varchar(64) DEFAULT NULL COMMENT '请假原因',
  `refuse_reason` varchar(64) DEFAULT NULL COMMENT '驳回请假请求的原因'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_taskflow`
--

CREATE TABLE IF NOT EXISTS `user_taskflow` (
  `u_id` varchar(32) NOT NULL,
  `tf_id` varchar(32) NOT NULL,
  `role` tinyint(4) DEFAULT '0' COMMENT '用户对于此任务流的角色 1 管理员 0member',
  `is_favor` tinyint(4) DEFAULT '0' COMMENT '是否星标 1是 0否'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `tf_id` (`tf_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `t_id` (`t_id`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `t_id` (`t_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `to_user_id` (`to_user_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tf_id` (`tf_id`);

--
-- Indexes for table `task_flow`
--
ALTER TABLE `task_flow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leader_id` (`leader_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_task`
--
ALTER TABLE `user_task`
  ADD PRIMARY KEY (`u_id`,`t_id`),
  ADD KEY `t_id` (`t_id`);

--
-- Indexes for table `user_taskflow`
--
ALTER TABLE `user_taskflow`
  ADD PRIMARY KEY (`u_id`,`tf_id`),
  ADD KEY `tf_id` (`tf_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `category_ibfk_2` FOREIGN KEY (`tf_id`) REFERENCES `task_flow` (`id`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`t_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `image_ibfk_2` FOREIGN KEY (`t_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`tf_id`) REFERENCES `task_flow` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task_flow`
--
ALTER TABLE `task_flow`
  ADD CONSTRAINT `task_flow_ibfk_1` FOREIGN KEY (`leader_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `user_task`
--
ALTER TABLE `user_task`
  ADD CONSTRAINT `user_task_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_task_ibfk_2` FOREIGN KEY (`t_id`) REFERENCES `task` (`id`);

--
-- Constraints for table `user_taskflow`
--
ALTER TABLE `user_taskflow`
  ADD CONSTRAINT `user_taskflow_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_taskflow_ibfk_2` FOREIGN KEY (`tf_id`) REFERENCES `task_flow` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
