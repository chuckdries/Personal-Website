---
title: Medication Tracking Solution
categories:
  - Projects
layout: project
cover: screenshot.png
date: 2018-03-22 16:02:17
tags:
award: 1st Place
awardSub: OHack '17
---
A system to help a foster home track medications given to children.

<!-- more -->
Winner: Opportunity Hack 20XX

A foster home needed to track the medication parents gave their kids and generate reports for DCS compliance. We split the application front end into two parts: a client for their health administrator to manage perscriptions, and a client for foster parents to log medications taken.

I focused on the health administrator dashboard. This client was designed for a skilled user who knows exactly what their data needs to look like. My goal was to stay out of the way, to give them as much clear, straightforward access to the database as possible.

![The table UI](screenshot.png)

My biggest challenge in this project was the relationship between parents and homes. In the backend, this is a many-to-many relationship; every child who needs medication is assigned a home, but multiple homes can share parents, and a foster parent can be assigned to multiple homes.

In the database, this is stored as its own table, but to a non-programmer, the idea of a separate table for this relationship might be confusing, and keeping track of it seemed like a hurdle. My problem was this: how do I let the user edit this table without exposing it directly?

My solution seems obvious in retrospect: I parse the table and synthesize a multi-value attribute on the Homes table and on the Parents table. This way,a the administrator can assign a parent to a home through the parent list or through the home list, whichever is easiest.

I make this process easier by looking up all foreign keys as I do the synthesis so I can present a list of check boxes.

![A many-to-many relationship editor](screenshot.png)

This client was written in Typescript with Vue.js and Bootstrap.
