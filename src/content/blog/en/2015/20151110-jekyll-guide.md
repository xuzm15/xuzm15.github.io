---
title: "Jekyll Guide"
description: "Setting up Jekyll for a GitHub blog"
pubDate: 2015-11-09T16:00:00.000Z
tags: ["Blog", "Jekyll"]
lang: en
slug: 20151110-jekyll-guide
---

When I first set up a blog on GitHub, I tried the official Jekyll setup. Here are the steps I used.

## Install Ruby

`sudo apt-get install ruby ruby-dev`

## Change Gem sources

```bash
sudo gem sources --remove https://rubygems.org/
sudo gem sources --remove http://rubygems.org/
sudo gem sources -a http://ruby.taobao.org/
sudo gem sources -l
```

You should see:

```
*** CURRENT SOURCES ***
http://ruby.taobao.org
```

## Install Jekyll and Markdown support

`sudo gem install jekyll`  
`sudo gem install rdiscount`

## Run Jekyll

`cd` to your site directory and run:

`jekyll server`

2015-11-10
