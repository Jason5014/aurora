import React from 'react';
import { storiesOf } from '@storybook/react';
import Progress from './progress';

const SimpleProgress = () => (
  <Progress precent={30} />
);

const progressWithTheme = () => (
  <div>
    <Progress precent={20} theme="success" />
    <Progress precent={40} theme="info" />
    <Progress precent={60} theme="secondary" />
    <Progress precent={80} theme="warning" />
  </div>
)

storiesOf('Progress', module)
  .add('Progress', SimpleProgress)
  .add('不同主题的 Progress', progressWithTheme)