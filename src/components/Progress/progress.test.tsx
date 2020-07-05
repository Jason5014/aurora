import React from 'react';
import { render } from '@testing-library/react';
import Progress from './progress';

const prefixCls = 'au-progress';

describe('test Progress component', () => {
  it('should render the correct default Progress', () => {
    const wrapper = render(<Progress precent={30} />);
    expect(wrapper.queryByText('30%')).toBeInTheDocument();
    const innerBar = wrapper.container.querySelector(`.${prefixCls}-bar-inner`);
    expect(innerBar).toHaveStyle('width: 30%');
  });
  it('should render the progress without text when showText set to false ', () => {
    const wrapper = render(<Progress precent={30} showText={false} />);
    expect(wrapper.queryByText('30%')).not.toBeInTheDocument();
    const innerBar = wrapper.container.querySelector(`.${prefixCls}-bar-inner`);
    expect(innerBar).toHaveStyle('width: 30%');
  });
});
