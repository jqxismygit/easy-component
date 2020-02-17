---
order: 0
title: 开始使用
type: Getting Started
time: 2019-07-19
---

## 前序准备

你的本地环境需要安装 [yarn](https://yarnpkg.com)、[node](http://nodejs.org/) 和 [git](https://git-scm.com/)。

## 安装

```
// yarn
yarn add easy-component

// npm
npm install -D easy-component
```

## 使用

```
import React form 'react';
import { Button } form 'easy-component';

class Example extends React.Component {
  render() {
    return (
      <div>
        <Button />
      </div>
    )
  }
}

```
