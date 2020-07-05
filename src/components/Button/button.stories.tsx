import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './button';

const defaultButton = () => (
  <div>
    <Button onClick={action('clicked')}>default button</Button>
  </div>
);

const buttonsWithSize = () => (
  <div>
    <Button size="lg">large button</Button>
    <Button size="sm">small button</Button>
  </div>
)

const buttonsWithType = () => (
  <div>
    <Button btnType="primary">primary button</Button>
    <Button btnType="danger">danger button</Button>
    <Button btnType="link">link button</Button>
  </div>
)

storiesOf('Button', module)
  .add('Button', defaultButton)
  .add('不同尺寸的 Button', buttonsWithSize)
  .add('不同类型的 Button', buttonsWithType)
