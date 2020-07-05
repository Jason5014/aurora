import React from 'react'
import { config } from 'react-transition-group'
import { render, RenderResult, fireEvent, wait } from '@testing-library/react'
import AutoComplete, { AutoCompleteProps } from './autoComplete';

config.disabled = true;

const prefixCls = 'au-auto-complete';

const testArray = [
  {value: 'ab', number: 11},
  {value: 'abc', number: 1},
  {value: 'b', number: 4},
  {value: 'c', number: 15},
];

const testProps: AutoCompleteProps = {
  fetchSuggestions: (query) => {return testArray.filter(item => item.value.includes(query))},
  onSelect: jest.fn(),
  placeholder: 'auto-complete'
}

let wrapper: RenderResult, inputNode: HTMLInputElement
describe('test AutoComplete component', () => {
  beforeEach(() => {
    wrapper = render(<AutoComplete {...testProps}/>)
    inputNode = wrapper.getByPlaceholderText('auto-complete') as HTMLInputElement
  })
  it('test basic AutoComplete behavior', async () => {
    fireEvent.change(inputNode, { target: { value: 'a' }});
    await wait(() => {
      expect(wrapper.queryByText('ab')).toBeInTheDocument();
    });
    expect(wrapper.container.querySelectorAll(`.${prefixCls}-suggestion-item`).length).toBe(2);
    fireEvent.click(wrapper.getByText('ab'));
    expect(testProps.onSelect).toHaveBeenCalledWith({ value: 'ab', number: 11 });
    expect(wrapper.queryByText('ab')).not.toBeInTheDocument();
    expect(inputNode.value).toBe('ab');
  })
  it('should provide keyboard support', async () => {
    fireEvent.change(inputNode, { target: { value: 'a' }});
    await wait(() => {
      expect(wrapper.queryByText('ab')).toBeInTheDocument();
    });
    const firstResult = wrapper.queryByText('ab');
    const secondResult = wrapper.queryByText('abc');
    // arrow down
    fireEvent.keyDown(inputNode, { keyCode: 40 });
    expect(firstResult).toHaveClass('is-active');
    // arrow down
    fireEvent.keyDown(inputNode, { keyCode: 40 });
    expect(secondResult).toHaveClass('is-active');
    // arrow up
    fireEvent.keyDown(inputNode, { keyCode: 38 });
    expect(firstResult).toHaveClass('is-active');
    // press enter
    fireEvent.keyDown(inputNode, { keyCode: 13 });
    expect(testProps.onSelect).toHaveBeenCalledWith({value: 'ab', number: 11});
    expect(wrapper.queryByText('ab')).not.toBeInTheDocument();
  })
  it('click outside should hide the dropdown', async () => {
    fireEvent.change(inputNode, { target: { value: 'a' }});
    await wait(() => {
      expect(wrapper.queryByText('ab')).toBeInTheDocument();
    });
    // click outside
    fireEvent.click(document);
    expect(wrapper.queryByText('ab')).not.toBeInTheDocument();
  })
  it('renderOption should generate the right template', () => {

  })
  it('async fetchSuggestions should works fine', () => {

  })
})