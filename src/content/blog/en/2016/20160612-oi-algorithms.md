---
title: "OI Contest Algorithm Ideas Summary"
description: "Brief notes on common OI algorithm ideas (no code)"
pubDate: 2016-06-11T16:00:00.000Z
tags: ["Algorithms"]
lang: en
slug: 20160612-oi-algorithms
---

I signed up for an informatics contest and brushed up on algorithms I’d only remembered by name. These are idea-level notes only, no implementations.

# Sorting

## Quicksort

Pick the middle value as pivot. From both ends, swap elements greater/less than the pivot until no more swaps. That gives left ≤ pivot ≤ right. Then recurse on the left and right segments.

# Trees

## Minimum spanning tree

### Prim

Start with one vertex in the tree. Repeatedly pick the minimum-weight edge from the tree to the rest, add that edge and vertex to the tree, update distances, and repeat until all vertices are in the tree.

# Graphs

## Shortest path

### SPFA

Initialize a queue with the source; dist[v] is the distance from source to v. Dequeue a vertex, relax all edges from it; if a distance improves, enqueue that vertex. Repeat until the queue is empty.

To be continued.
