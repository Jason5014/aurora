import React from 'react';
import Tabs, { TabsProps } from './tabs';
import Item from './tabItem';
import { render, RenderResult, fireEvent } from '@testing-library/react';

const prefixCls = 'au-tabs';

const testProps: TabsProps = {
  defaultIndex: 0,
  onSelect: jest.fn(),
}

let wrapper: RenderResult, activeElement: HTMLElement, disabledElement: HTMLElement;
describe('test Tabs component', () => {
  beforeEach(() => {
    wrapper = render(
      <Tabs {...testProps}>
        <Item label='active'>active card</Item>
        <Item label='card'>two card</Item>
        <Item label='disabled' disabled>disabled card</Item>
      </Tabs>
    );
    const { getByText } = wrapper;
    activeElement = getByText('active');
    disabledElement = getByText('disabled');
  });
  it('should render correct Tabs and TabItems based on a default props', () => {
    const { container, queryByText } = wrapper;
    expect(container.querySelector(`.${prefixCls}-nav`)).toHaveClass(`${prefixCls}-line`);
    expect(container.querySelectorAll(':scope > ul > li').length).toEqual(3);
    expect(activeElement).toBeInTheDocument();
    expect(activeElement).toHaveClass(`${prefixCls}-nav-item is-active`);
    expect(queryByText('active card')).toBeInTheDocument();
    expect(disabledElement).toHaveClass(`${prefixCls}-nav-item disabled`);
  });
  it('click item should change active and call the callback with the right parameter', () => {
    const { getByText, queryByText } = wrapper;
    const clickElement = getByText('card');
    fireEvent.click(clickElement);
    expect(testProps.onSelect).toHaveBeenCalledWith(1);
    expect(queryByText('two card')).toBeInTheDocument();
    expect(queryByText('active card')).not.toBeInTheDocument();
    fireEvent.click(disabledElement);
    expect(testProps.onSelect).not.toHaveBeenCalledTimes(2);
  });
  it('should render pill tabs when mode is set to pill', () => {

  });
});
