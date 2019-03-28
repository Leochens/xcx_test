--
-- 表的结构 `task_flow`
--

CREATE TABLE `task_flow` (
  `id` varchar(32) NOT NULL PRIMARY KEY,
  `tf_name` varchar(32) DEFAULT '未命名',
  `tf_describe` text,
  `is_completed` tinyint(4) DEFAULT NULL,
  `category` varchar(32) DEFAULT NULL,
  `begin_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` varchar(32) NOT NULL PRIMARY KEY,
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
-- 表的结构 `task`
--

CREATE TABLE `task` (
  `id` varchar(32) NOT NULL PRIMARY KEY,

  `t_name` varchar(64) DEFAULT NULL,
  `begin_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_completed` tinyint(4) DEFAULT NULL,
  `tf_id` varchar(32) DEFAULT NULL,
  `is_important` tinyint(4) NOT NULL DEFAULT '0' COMMENT '此子任务在任务流中是否是重要的',
  FOREIGN KEY(tf_id) REFERENCES task_flow(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------


CREATE TABLE `category` (
  `id` varchar(32) NOT NULL PRIMARY KEY,
  `name` varchar(16) DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL COMMENT '谁创建的分类',
  `tf_id` varchar(32) DEFAULT NULL COMMENT '哪个任务流属于这个分类',
  FOREIGN KEY(u_id) REFERENCES user(id),
  FOREIGN KEY(tf_id) REFERENCES task_flow(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `comment`
--

CREATE TABLE `comment` (
  `id` varchar(32) NOT NULL PRIMARY KEY,
  `comment_type` tinyint(4) DEFAULT '0',
  `content` text,
  `create_time` datetime DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL,
  `t_id` varchar(32) DEFAULT NULL,
  FOREIGN KEY(u_id) REFERENCES user(id),
  FOREIGN KEY(t_id) REFERENCES task(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `image`
--

CREATE TABLE `image` (
  `id` varchar(32) NOT NULL PRIMARY KEY,
  `t_id` varchar(32) DEFAULT NULL,
  `u_id` varchar(32) DEFAULT NULL,
  `url` text,
    FOREIGN KEY(u_id) REFERENCES user(id),
  FOREIGN KEY(t_id) REFERENCES task(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- 表的结构 `message`
--

CREATE TABLE `message` (
  `id` varchar(32) NOT NULL PRIMARY KEY,

  `content` text,
  `create_time` datetime DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT NULL,
  `to_user_id` varchar(32) DEFAULT NULL,
    FOREIGN KEY(to_user_id) REFERENCES user(id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------



--
-- 表的结构 `user_task`
--

CREATE TABLE `user_task` (
  `u_id` varchar(32),
  `t_id` varchar(32),
  `user_status` tinyint(4) DEFAULT '1' COMMENT '用户状态 1正常 0请假',
  `break_reason` varchar(64) DEFAULT NULL COMMENT '请假原因',
  `refuse_reason` varchar(64) DEFAULT NULL COMMENT '驳回请假请求的原因',
   FOREIGN KEY(u_id) REFERENCES user(id),
  FOREIGN KEY(t_id) REFERENCES task(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `user_taskflow`
--

CREATE TABLE `user_taskflow` (
  `u_id` varchar(32) ,
  `tf_id` varchar(32) ,
  `role` tinyint(4) DEFAULT '0' COMMENT '用户对于此任务流的角色 1leader 0member',
  `is_favor` tinyint(4) DEFAULT '0' COMMENT '是否星标 1是 0否',
   FOREIGN KEY(u_id) REFERENCES user(id),
  FOREIGN KEY(tf_id) REFERENCES task_flow(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
