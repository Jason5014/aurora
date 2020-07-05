import React from 'react';
import Select, { SelectProps } from './select';
import { render, fireEvent } from '@testing-library/react';
import SelectOption from './option';

jest.mock('../Icon/icon', () => {
  return (props: any) => (<span onClick={props.onClick}>{props.icon}</span>);
});

jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props: any) => {
      return props.in ? props.children : null;
    }
  }
});

const prefixCls = 'au-select';

const testProps: SelectProps = {
  defaultValue: '',
  placeholder: 'test',
  onChange: jest.fn(),
  onVisibleChange: jest.fn()
}

const multipleProps: SelectProps = {
  ...testProps,
  multiple: true
}

describe('test Select component', () => {
  it('should render a correct default Select component', () => {
    const { getByText, container } = render(
      <Select {...testProps}>
        <SelectOption value="id1" label="nihao" />
        <SelectOption value="id2" label="nihao2" />
        <SelectOption value="id3" label="disabled" disabled />
      </Select>
    );
    const inputEle = container.querySelector(`.${prefixCls}-input`);
    expect(getByText('test')).toBeInTheDocument();
    expect(inputEle).toBeInTheDocument();
    fireEvent.click(inputEle);
    const firstItem = getByText('nihao');
    const disabledItem = getByText('disabled');
    expect(firstItem).toBeInTheDocument();
    expect(testProps.onVisibleChange).toHaveBeenCalledWith(true);
    expect(disabledItem).toBeInTheDocument();
    fireEvent.click(disabledItem);
    expect(testProps.onVisibleChange).toHaveBeenCalledTimes(1);
    fireEvent.click(firstItem);
    expect(firstItem).not.toBeInTheDocument();
    expect(testProps.onVisibleChange).toHaveBeenLastCalledWith(false);
    expect(testProps.onChange).toHaveBeenLastCalledWith('id1', ['id1']);
  });
  it('Select in multiple mode should works fine', () => {
    const { getByText, container } = render(<Select {...multipleProps}>
        <SelectOption value="id1" label="nihao" />
        <SelectOption value="id2" label="nihao2" />
        <SelectOption value="id3" label="disabled" disabled />
    </Select>);
    const inputEle = container.querySelector(`.${prefixCls}-input`);
    fireEvent.click(inputEle);
    const firstItem = getByText('nihao');
    const secondItem = getByText('nihao2');
    fireEvent.click(firstItem);
    expect(firstItem).toBeInTheDocument();
    expect(firstItem).toHaveClass('is-active');
    expect(getByText('check')).toBeInTheDocument();
    expect(multipleProps.onChange).toHaveBeenLastCalledWith('id1', ['id1']);
    expect(container.querySelectorAll(`.${prefixCls}-input-tag`).length).toEqual(1);
    fireEvent.click(secondItem);
    expect(secondItem).toHaveClass('is-active');
    expect(multipleProps.onChange).toHaveBeenLastCalledWith('id2', ['id1', 'id2']);
    expect(container.querySelectorAll(`.${prefixCls}-input-tag`).length).toEqual(2);
    fireEvent.click(secondItem);
    expect(secondItem).not.toHaveClass('is-active');
    expect(multipleProps.onChange).toHaveBeenLastCalledWith('id2', ['id1']);
    expect(container.querySelectorAll(`.${prefixCls}-input-tag`).length).toEqual(1);
    fireEvent.click(getByText('times'));
    expect(multipleProps.onChange).toHaveBeenLastCalledWith('id1', []);
    expect(container.querySelectorAll(`.${prefixCls}-input-tag`).length).toEqual(0);
    expect(getByText('test')).toBeInTheDocument();
  });
});
