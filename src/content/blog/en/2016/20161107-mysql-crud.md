---
title: "MySQL Commands Summary"
description: "Common MySQL commands reference"
pubDate: 2016-11-07T12:40:32.000Z
tags: ["MySQL"]
lang: en
slug: 20161107-mysql-crud
---

Common MySQL commands.

# Start / stop service

```
net start mysql
net stop mysql
```

# Login

```
mysql -u root -p
```

# Database

```
create database dbname character set utf8;
use dbname;
drop database dbname;
```

# Create table

```
create table students
(
    id int unsigned not null auto_increment primary key,
    name char(8) not null,
    sex char(4) not null,
    age tinyint unsigned not null,
    tel char(13) null default "-"
);
```

# CRUD

```
select * from tablename;
update tablename set col = ? where col = ?;
insert into tablename (col1, col2, col3) values(?, ?, ?);
delete from tablename where condition;
drop table tablename;
```

# Table info

```
show full columns from tablename;
```

# Change column

```
alter table tablename change colname colname new_type;
```

# Reset root password

```
set password for root@localhost = password('123456');
```

# Default charset (UTF-8)

MySQL: `show variables like '%character%';`

Linux: edit `/etc/mysql/my.cnf`, under `[mysqld]` add:

```
character_set_server=utf8
init_connect='SET NAMES utf8'
```

Then `service mysql restart`.
