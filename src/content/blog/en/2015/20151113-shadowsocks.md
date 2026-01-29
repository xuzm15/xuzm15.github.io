---
title: "Shadowsocks"
description: "Using Shadowsocks on Windows and Ubuntu"
pubDate: 2015-11-12T16:00:00.000Z
tags: ["Shadowsocks"]
lang: en
slug: 20151113-shadowsocks
---

Shadowsocks is a proxy setup I like: simple client and stable nodes. Here is how to use it on Windows and Ubuntu.

# Install

**Windows 7:** Download the Windows client from your Shadowsocks provider. The client supports global and PAC modes without extra browser proxy plugins.

**Ubuntu 15.10:** `sudo apt-get install shadowsocks`

# Run

**Windows 7:** The client is straightforward; choose PAC (auto proxy) mode.

**Ubuntu 15.10:** Edit config: `sudo gedit /etc/shadowsocks/config.json`

Set parameters from your account:

*   `server` — server IP (IPv4/IPv6)
*   `server_port` — server port
*   `local_port` — local port
*   `password` — password
*   `timeout` — timeout in seconds
*   `method` — e.g. "bf-cfb", "aes-256-cfb", "des-cfb", "rc4". Default is insecure; "aes-256-cfb" is recommended.

Save and run: `sudo sslocal -c /etc/shadowsocks/config.json`

Then configure your browser proxy. For Firefox, the Pan add-on also filters ads.

## Run in background

In `/etc/shadowsocks/`: `nohup sslocal -c /etc/shadowsocks/config.json &`

2015-11-13
