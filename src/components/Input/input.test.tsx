import React from 'react';
import Input, { InputProps } from './input';
import { render, fireEvent } from '@testing-library/react';

const prefixCls = 'au-input';

const defaultProps: InputProps = {
  placeholder: "test-input",
  onChange: jest.fn()
}

describe('test Input component', () => {
  it('should render the correct default Input', () => {
    const wrapper = render(<Input {...defaultProps} />);
    const testNode = wrapper.getByPlaceholderText('test-input');
    expect(testNode).toBeInTheDocument();
    expect(testNode).toHaveClass(`${prefixCls}-inner`);
    fireEvent.change(testNode, { target: { value: '23' } });
    expect(defaultProps.onChange).toHaveBeenCalled();
    expect(testNode.value).toEqual('23');
  });
  it('should render the disabled Input on disabled property', () => {
    const wrapper = render(<Input placeholder="disabled" disabled />);
    const testNode = wrapper.getByPlaceholderText('disabled');
    expect(testNode).toBeInTheDocument();
    expect(testNode.disabled).toBeTruthy();
    fireEvent.focus(testNode);
    expect(testNode).not.toHaveFocus();
  });
  it('should render different input size on size property', () => {
    const wrapper = render(<Input placeholder="sizes" size="lg" />);
    const testContainer = wrapper.container.querySelector(`.${prefixCls}-wrap`);
    expect(testContainer).toHaveClass(`${prefixCls}-lg`);
  });
  it('should render prepand and append element on prepand/append property', () => {
    const { queryByText, container } = render(<Input placeholder="pend" prepend="https://" append=".com" />);
    const testContainer = container.querySelector(`.${prefixCls}-wrap`);
    expect(testContainer).toHaveClass(`${prefixCls}-group ${prefixCls}-group-append ${prefixCls}-group-prepend`);
    expect(queryByText('https://')).toBeInTheDocument();
    expect(queryByText('.com')).toBeInTheDocument();
  });
});
