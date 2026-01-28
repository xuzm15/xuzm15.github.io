---
title: "前端基础-JavaScript"
description: "前端基础-JavaScript"
pubDate: 2017-07-06T10:14:37.000Z
tags: [" JavaScript"]
---

前端基础-JavaScript。

# JavaScript

JavaScript是一种可以在浏览器中运行的脚本语言，用来实现在浏览器端的动作，主要作用于用户交互和数据处理。

JavaScript是一种解释型语言，源代码可以放在HTML里。

使用时，在head中定义函数  
  
  
  
  

document.write()是将值写入html，但是html的内容会在JS运行完之后才显示。

# 演示

<!DOCTYPE html>

  
  
myJS  
  
  
  
  
  
p：

alert(document.getElementsByName(“dacing”));/

alert(document.getElementsByid(“dacing”));id是属于哪一类，可重复；name是哪一个，唯一。  
_anchors\[\] forms\[\] images\[\] cookie titile bgColor fgColor linkColor alinkColor vlinkColor_ 事件  
onLoad/onUload  
onMouseOver/onMouseOut  
onClick/onDblClick  
onSubmit提交表单  
\*/  
  

  

# 闭包：

[原文链接](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)

闭包就是能够读取其他函数内部变量的函数。

Javascript语言特有的”链式作用域”结构（chain scope），子对象会一级一级地向上寻找所有父对象的变量。所以，父对象的所有变量，对子对象都是可见的，反之则不成立。由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成”定义在一个函数内部的函数”。

所以，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

闭包可以用在许多地方。它的最大用处有两个，一个是前面提到的可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。