import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';

import Input from './input';
import { useState } from '@storybook/addons';

const defaultInput = () => (
  <Input defaultValue="基本Input" placeholder="请输入" />
);

const inputsWithSize = () => (
  <div>
    <Input placeholder="大号 Input" size="lg" />
    <br />
    <Input placeholder="小号 Input" size="sm" />
  </div>
);

const disabledInput = () => (
  <div>
    <Input placeholder="Disabled Input" disabled />
    <br/>
    <Input defaultValue="Readonly Input" readOnly />
  </div>
);

const inputWithIcon = () => (
  <Input defaultValue="Input 带图标" icon="search" />
);

const inputsWithExtra = () => (
  <Input defaultValue="baidu" prepend="https://" append=".com" />
);

const ControlledInput = () => {
  const [value, setValue] = useState('Controlled Input');
  return (
    <Input value={value} onChange={e => setValue(e.target.value)} />
  );
}

storiesOf('Input', module)
  .add('Input', defaultInput)
  .add('不同大小的 Input', inputsWithSize)
  .add('不同状态的 Input', disabledInput)
  .add('带图标的 Input', inputWithIcon)
  .add('带前缀后缀的 Input', inputsWithExtra)
  .add('数据受控的 Input', ControlledInput)
