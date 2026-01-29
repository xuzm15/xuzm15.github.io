---
title: "Git Commands Summary"
description: "Common Git commands reference"
pubDate: 2015-11-09T16:00:00.000Z
tags: ["Git"]
lang: en
slug: 20151110-git-commands
---

A short reference of common Git commands for GitHub.

# Platform

Ubuntu 15.10

## Install

```
sudo apt-get install git
sudo apt-get install git-core
```

## Config

### SSH

```
ssh-keygen -C "email" -t rsa
ssh -v git@github.com
```

Bind your GitHub account.

# Windows

In Git Bash: `ssh-keygen`, add key to GitHub, then:

```
ssh -T git@github.com
git config --global user.name "yourname"
git config --global user.email "youremail@email.com"
```

# Git operations

## New repo

```
git init
```

## Push to GitHub

```
git add .
git status
git commit -m "commit message"
git remote add origin git@github.com:UserName/Repository
git push -u origin master
```

## Clone

```
git clone https://……
```

## Branches

Create and switch: `git checkout -b branchname`  
Same: `git branch branchname` then `git checkout branchname`  
List: `git branch`  
Switch: `git checkout branchname`  
Merge: `git merge otherbranchname`  
Delete: `git branch -d otherbranchname`

Push local as remote: `git push origin localbranch:remotebranch`  
Delete remote: `git push origin :newbranch`

## Tags

`git tag tagname`  
`git tag -a tagname 7-char-hash`  
`git tag`  
`git show tagname`  
`git tag -d tagname`  
`git push origin tagname` or `git push origin --tags`

## Log

```
git log --pretty=format:"%h %an %ar %s" -3
```

2015-11-10
