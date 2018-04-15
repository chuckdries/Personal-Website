---
title: Rock Paper MMO
categories:
  - Projects
layout: project
cover: round-end.png
date: 2018-04-14 16:55:25
tags:
award:
awardSub:
portrait: true
---

A beautiful online Rock Paper Scissors tournament

<!-- more -->

<iframe height="450" src="https://www.youtube-nocookie.com/embed/lx1ApLFjP8M?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Created at Sunhacks 2018 with James Quigley.

I did the front end in VueJS, James did the back end in Node.

The following content is from our devpost submission.

### Inspiration

Our work does a rock paper scissors bracket every year at the holiday party. We wanted to build that into an automated game that scales with any number of players.

### What it does

RPMMO throws everyone into a bracket, and people match off until there is only one person left in the bracket. Rock paper scissors is a simple and surprisingly fun game to play in this manner.

### How we built it

We built a server-authoritative backend in Node and a dumb client in Vue that receives and emits game state events over Socket.io

### Challenges we ran into

State management in vue is easy but reasoning about the minimal game state the client needed was hard. Designing the backend was also challenging as it's essentially a cluster of dynamically instantiated state machines but they're all completely asynchronous.

### Accomplishments that we're proud of

Our UI is great and the game is a lot of fun.

[Github](https://github.com/James-Quigley/sunhacks-2018)
[Devpost](https://devpost.com/software/rock-paper-mmo)
