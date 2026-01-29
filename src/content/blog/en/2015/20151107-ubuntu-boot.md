---
title: "Skip Ubuntu Boot Menu (Dual Boot with Windows)"
description: "How to skip Ubuntu GRUB and keep only Windows boot loader"
pubDate: 2015-11-06T16:00:00.000Z
tags: ["Ubuntu"]
lang: en
slug: 20151107-ubuntu-boot
---

After installing Windows and Ubuntu dual boot, you may see both boot menus at startup. This post describes how to skip the Ubuntu (GRUB) boot menu and keep only the Windows boot loader.

# Platform

Windows 7 x64 Ultimate  
Ubuntu 15.10

# Steps

In Ubuntu terminal run: `sudo gedit /etc/default/grub`

**Ubuntu Kylin:** Find the three `GRUB_TIMEOUT=10` entries and change the two under the else block to `GRUB_TIMEOUT=0.1` (cannot be 0).

**Standard Ubuntu:** There is only one `GRUB_TIMEOUT=10` to change.

Save, exit, then run: `sudo update-grub`

Ubuntu’s boot menu will be skipped.

2015-11-07
