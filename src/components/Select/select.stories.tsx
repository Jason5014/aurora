import React from 'react';
import { storiesOf } from '@storybook/react';
import Select from './select';
import Option from './option';

const dataSource = [
  { value: 'nihao' },
  { value: 'nihao2' },
  { value: 'nihao3' },
  { value: 'disabled', disabled: true },
  { value: 'nihao5' },
];

const defaultSelect = () => (
  <Select placeholder="请选择">
    {dataSource.map(d => (
      <Option {...d} />
    ))}
  </Select>
);

const multipleSelect = () => (
  <Select placeholder="请选择" multiple>
    {dataSource.map(d => (
      <Option {...d} />
    ))}
  </Select>
);

const disabledSelect = () => (
  <Select defaultValue="nihao" disabled>
    {dataSource.map(d => (
      <Option {...d} />
    ))}
  </Select>
);

storiesOf('Select', module)
  .add('Select', defaultSelect)
  .add('支持多选的 Select', multipleSelect)
  .add('被禁用的 Select', disabledSelect)