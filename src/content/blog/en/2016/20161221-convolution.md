---
title: "Convolution Need Not 'Convolve'"
description: "Convolution as superposition without flipping"
pubDate: 2016-12-21T10:47:27.000Z
tags: []
lang: en
slug: 20161221-convolution
---

Source: [Convolution without “convolving”](http://blog.sciencenet.cn/blog-4909-426493.html) (Chinese).

# Convolution

Convolution is defined by:

∫(-∞,∞) h(t−τ) f(τ) dτ = g(t)

In German math literature (at least since 1903) it appears as Faltung/convolution, with a “folding” meaning. The usual teaching: to get the result at time t, flip h(τ) to h(−τ), shift to h(t−τ), multiply by f(τ), and integrate. That flip is where “convolve” comes from.

# Convolution without flipping

That view is correct mathematically. But in engineering (e.g. signal processing), must the impulse response or input actually be flipped in time? No. So we can use another view: shift h by τ to get h(t−τ), multiply by f(τ), and sum over τ. That’s the superposition view—convolution need not “convolve.”

(We’re just changing the perspective: before we fixed t and varied τ; now we think of t as variable and τ as the time index. No flip, just a natural superposition.)

This view also matches how we compute: for two finite sequences, convolution is like long multiplication.

Example: h(n) = {2, 5, 3}, f(n) = {3, 0, 12, 4}. Layout:

```
h(n):           2   5   3
f(n):           3   0  12  4
-----------------------------------
                6  15   9
                    0   0   0
                        24  60  36
    +                       8  20  12
-----------------------------------
g(n):           6  15  33  68  56  12
```

The same no-flip approach is used in discrete convolution, image processing (filtering, segmentation), and convolutional neural networks.
