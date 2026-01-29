---
title: "Deploy JavaWeb to NetEase Docker"
description: "Steps to deploy a JavaWeb project on NetEase Docker"
pubDate: 2016-11-11T01:31:40.000Z
tags: ["Docker", "Deploy"]
lang: en
slug: 20161111-netease-deploy
---

Steps to deploy a JavaWeb project on NetEase Docker.

# Create Docker JavaWeb

Choose image: javaweb:latest

# Install vim

```
apt-get update
apt-get install vim
```

# Database

```
mysql
set password for root@localhost = password('123456');
set password for root@'127.0.0.1' = password('123456');
```

(Initial MySQL password is empty. Then create DBs as usual.)

# Clone project

```
git clone https://github.com/userName/projectName.git
```

# Deploy to root (IP:8080)

From the project `target` directory:

```
cp projectName.war /var/lib/tomcat7/webapps/ROOT.war
```

# Debug (view logs)

```
find / -name "Catalina.out"
cd to that directory
tail -n 20 catalina.out
```

# OOM fix

Edit `/usr/share/tomcat7/bin/catalina.sh`. Under "OS specific support" add:

`JAVA_OPTS="-Xms256m -Xmx512m -Xss1024K -XX:PermSize=128m -XX:MaxPermSize=256m"`

Then `service tomcat7 restart`.
