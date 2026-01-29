---
title: "GitHub Guide"
description: "Using GitHub on Ubuntu and Windows"
pubDate: 2015-11-09T16:00:00.000Z
tags: ["GitHub"]
lang: en
slug: 20151110-github-guide
---

An incomplete guide to using GitHub on Ubuntu.

# Ubuntu

Ubuntu 15.10

## Install

```
sudo apt-get install git
sudo apt-get install git-core
```

## Config

### Generate SSH key

```
ssh-keygen -C "email" -t rsa
```

Log in to GitHub, add your SSH key, then verify:

```
ssh -v git@github.com
```

Bind your account as needed.

# Windows

In Git Bash, generate `id_rsa.pub`:

```
ssh-keygen
```

Add the key to your GitHub account, then test:

```
ssh -T git@github.com
```

Set user:

```
git config --global user.name "yourname"
git config --global user.email "youremail@email.com"
```

# Git workflow

## New local repo

```
git init
```

## Push to GitHub

Stage changes (`.` = all; or list files):

```
git add .
git status   " optional: see changes
```

Commit:

```
git commit -m "commit message"
```

Add remote and push:

```
git remote add origin git@github.com:UserName/Repository
git push -u origin master
```

## Clone

```
git clone https://……
```

## Branches

### Local

Create and switch:

```
git checkout -b branchname
```

Same as:

```
git branch branchname
git checkout branchname
```

List branches: `git branch`

Switch: `git checkout branchname`

Merge: `git merge otherbranchname`

Delete: `git branch -d otherbranchname`

### Remote

Push local branch as remote branch:

```
git push origin localbranch:remotebranch
```

Delete remote branch (nothing before `:`):

```
git push origin :newbranch
```

## Tags

Create: `git tag tagname`  
Create for past commit: `git tag -a tagname 7-char-hash`  
List: `git tag`  
Show: `git show tagname`  
Delete: `git tag -d tagname`  
Push tag: `git push origin tagname` or `git push origin --tags`

## Log

Last 3 commits (short hash, author, date, message):

```
git log --pretty=format:"%h %an %ar %s" -3
```

2015-11-10
