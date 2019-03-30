-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- 主机： 127.0.0.1
-- 生成日期： 2019-03-29 09:37:59
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

-- --------------------------------------------------------

--
-- 表的结构 `category`
--

CREATE TABLE `category` (
  `id` varchar(32) NOT NULL,
  `name` varchar(16) DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL COMMENT '谁创建的分类',
  `tf_id` varchar(32) DEFAULT NULL COMMENT '哪个任务流属于这个分类'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `comment`
--

CREATE TABLE `comment` (
  `id` varchar(32) NOT NULL,
  `comment_type` tinyint(4) DEFAULT '0',
  `content` text,
  `create_time` datetime DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL,
  `t_id` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

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

-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE `message` (
  `id` varchar(32) NOT NULL,
  `content` text,
  `create_time` datetime DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT NULL,
  `to_user_id` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `task`
--

CREATE TABLE `task` (
  `id` varchar(32) NOT NULL,
  `t_name` varchar(64) DEFAULT NULL,
  `begin_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_completed` tinyint(4) DEFAULT NULL,
  `tf_id` varchar(32) DEFAULT NULL,
  `is_important` tinyint(4) NOT NULL DEFAULT '0' COMMENT '此子任务在任务流中是否是重要的'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `task_flow`
--

CREATE TABLE `task_flow` (
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
-- 表的结构 `user`
--

CREATE TABLE `user` (
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
-- 表的结构 `user_task`
--

CREATE TABLE `user_task` (
  `u_id` varchar(32) DEFAULT NULL,
  `t_id` varchar(32) DEFAULT NULL,
  `user_status` tinyint(4) DEFAULT '1' COMMENT '用户状态 1正常 0请假',
  `break_reason` varchar(64) DEFAULT NULL COMMENT '请假原因',
  `refuse_reason` varchar(64) DEFAULT NULL COMMENT '驳回请假请求的原因'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user_taskflow`
--

CREATE TABLE `user_taskflow` (
  `u_id` varchar(32) NOT NULL,
  `tf_id` varchar(32) NOT NULL,
  `role` tinyint(4) DEFAULT '0' COMMENT '用户对于此任务流的角色 1 管理员 0member',
  `is_favor` tinyint(4) DEFAULT '0' COMMENT '是否星标 1是 0否'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  ADD KEY `to_user_id` (`to_user_id`);

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
  ADD KEY `u_id` (`u_id`),
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
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
