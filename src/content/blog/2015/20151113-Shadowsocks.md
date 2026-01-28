---
title: "Shadowsocks"
description: "Shadowsocks"
pubDate: 2015-11-12T16:00:00.000Z
tags: [" Shadowsocks"]
---

Shadowsocks是我比较喜欢的一套win下科学上网方式，客户端很简洁，节点也比较稳定，这里记录了在win下和Ubuntu下的Shadowsocks使用方式。

# 安装

Windows7：可以直接在购买Shadowsocks的网站下载Win7对应版本的客户端，该客户端提供了全局模式和PAC模式，不需要额外的浏览器插件设置代理。

Ubuntu 15.10：运行代码：`sudo apt-get install shadowsocks`

# 运行

Windows7：Shadowsocks的Win客户端很简明易懂，最后选择PAC模式，即自动切换代理模式即可，在这里不多介绍。

Ubuntu 15.10：配置文件，切换到/etc/shadowsocks/目录下：`sudo gedit /etc/shadowsocks/config.json`

根据购买的账号修改各项参数：

*   server服务器IP(IPv4/IPv6)，注意这也将是服务端监听的IP地址
    
*   server\_port服务器端口
    
*   local\_port本地端端口
    
*   password用来加密的密码
    
*   timeout超时时间（秒）
    
*   method加密方法，可选择“bf-cfb”,“aes-256-cfb”,“des-cfb”,“rc4”,等等。默认是一种不安全的加密，推荐用“aes-256-cfb”。
    

保存退出，运行：`sudo sslocal –c /etc/shadowsocks/config.json`

至此，命令行配置完成，在浏览器设置好代理配置即可，FireFox 代理插件推荐Pan，还可以提供广告的过滤功能。

## 后台运行

切换到/etc/shadowsocks/目录下执行：`nohup sslocal –c /etc/shadowsocks/coig.json &`

2015-11-13