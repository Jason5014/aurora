import React from 'react';
import { storiesOf } from '@storybook/react';

const markdownText = `

*** aurora 是基于 react 和 typescript 开发的一套组件库 ***

### 安装试试

~~~javascript
npm install @jason5014/aurora --save
~~~

### 使用

~~~javascript
// 加载样式
import '@jason5014/aurora/dist/index.css'
// 引入组件
import { Button } from 'vikingship'
~~~
`

storiesOf('Welcome page', module)
  .add('Welcome', () => {
    return <h2>欢迎来到 aurora 组件库</h2>
  }, { info: { text: markdownText, source: false, actions: false  }});
