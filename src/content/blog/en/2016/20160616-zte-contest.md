---
title: "ZTE 2016 Programming Contest"
description: "ZTE 2016 algorithm contest experience and problem notes"
pubDate: 2016-06-15T16:00:00.000Z
tags: ["Algorithms", "Contest"]
lang: en
slug: 20160616-zte-contest
---

I saw a poster for ZTE’s programming contest and signed up on a whim. I hadn’t done algorithm contests in a long time and knew I was rusty, but thought I could still pass the first round. I didn’t get a callback for the next round, which stung a bit.

Looking back, two main issues: (1) Rust—I’d barely written code that year. (2) First time doing an online contest with a webcam; the page lagged and I got disconnected once. Submitting only one function per problem felt different from OI. I knew my solution had bugs but submitted early anyway. Something to work on.

Here are the problems.

# Round 1

## Perfect floor plan

Given an n×m 0–1 matrix, find the number of connected components of 1s such that: (1) at least 2 cells, (2) only 4-connected, (3) all 8-neighbors of the component are 0.

I did two passes: first, DFS to label 4-connected 1-components (starting from 2); second, for each component check that every neighbor is 0 or the same component id. Decrement the count when a component fails the neighbor check. Output the count.

## Binary tree path sum

Given a binary tree, find the minimum sum of root-to-leaf path weights.

Standard DFS. For NULL, check before recursing and return 0; no need for a special sentinel value (I used -1 and had to handle it in the caller).

2016-06-16

---

# Interview

I got the interview invite during exam week. It was first in Beijing (conflicted with an exam), then moved to Changchun. I went right after the information theory exam.

The interview was video-based, about 20 minutes. I’d prepared algorithm review, but they focused on projects (graduate students that day). I ended up talking about a small project I was doing. No idea about the result. Takeaways: speak at a steady pace and structure what you say.

I also threw together a one-hour resume from a template and really felt the power of templates.

# Afterward

I never heard back. Upperclassmen said the contest eventually led to offers for some grads. Oh well.

2016-07-01
