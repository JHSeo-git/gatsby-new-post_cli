# Gatsby New Post CLI

- version: 0.0.1 : init
- version: 0.0.2 : date-fns reinstall
- version: 0.0.3 : minor fix
- version: 0.0.4 : readme update
- version: 0.0.5 : date format fix

## Theme

- [gatsby-starter-lumen](https://github.com/alxshelepenok/gatsby-starter-lumen)

## How to use

### Preview

- content path

```bash
content
└── posts
    └── 2020-04
        └── 2020-04-24---new-post-title.md
```

- frontMatter

```text
---
title: TIL
date: "2020-04-02 20:14:11.224"
template: "post"
draft: false
slug: "til"
category: "TIL"
tags:
  - "Blog"
  - "TIL"
description: "Today I Learned"
comments: true
---
```

### Install

- npm

```bash
npm install gatsby-new-post-cli
```

### Usage

- run script

```bash
post
```

- cli input item

0. run

![run](./assets/gatsby-new-post-cli.gif)
