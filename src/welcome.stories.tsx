import React from 'react';
import { storiesOf } from '@storybook/react';

const Welcome = () => (
  <>
    <h1>欢迎来到 Aurora 组件库</h1>
    <p>aurora 是基于react打造的一套组件库</p>
    <h3>尝试安装它吧</h3>
    <code>
      npm install @jason5014/aurora --save
    </code>
    <div>或者</div>
    <code>
      yarn add @jason5014/aurora
    </code>
  </>
);

storiesOf('Welcome page', module)
  .add('Welcome', Welcome, { info: { disabled: true  }});
