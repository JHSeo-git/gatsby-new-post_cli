# Gatsby New Post CLI

- version: 0.0.1 : init
- version: 0.0.2 : date-fns reinstall
- version: 0.0.3 : minor fix
- version: 0.0.4 : readme update
- version: 0.0.5 : date format fix
- version: 0.1.0 : major fix update
- version: 0.1.1, 0.1.2 : date format fix
- version: 0.1.3 : readme image fix

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
title: new post title
date: "2020-04-24 20:14:11.224"
template: "post"
draft: false
slug: "new-post-title"
category: "Blog"
tags:
  - "Blog"
  - "TIL"
description: "new post title"
comments: true
---
```

### Install

- npm

```bash
npm install gatsby-new-post-cli
```

- yarn

```bash
yarn add gatsby-new-post-cli
```

### Usage

- run script

```bash
post
```

- cli input item

0. run

<img src="../gatsby-new-post-cli/assets/run_capture.png" />
