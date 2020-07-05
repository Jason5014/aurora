import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Alert, { AlertProps } from './alert';

jest.mock('../Icon/icon', () => {
  return (props: any) => (<span>{props.icon}</span>)
})

const prefixCls = 'au-alert';

const defaultProps: AlertProps = {
  title: 'alert',
  onClick: jest.fn()
}

const testProps: AlertProps = {
  title: 'alert',
  type: 'success',
}

const specialProps: AlertProps = {
  title: 'alert',
  description: 'description',
}

const disabledProps: AlertProps = {
  title: 'alert',
  closable: false,
  onClick: jest.fn()
}

describe('test Alert component', () => {
  it('should render a default alert', () => {
    const { getByText, container, queryByText } = render(<Alert {...defaultProps} />);
    expect(queryByText('alert')).toBeInTheDocument();
    const element = container.querySelector(`.${prefixCls}`);
    expect(element).toHaveClass(`${prefixCls}-default`);
    fireEvent.click(getByText('times-circle'));
    expect(defaultProps.onClick).toHaveBeenCalled();
    expect(element).toHaveClass('hide');
  });
  it('should render a correct component based on diffent props', () => {
    const { container, queryByText } = render(<Alert {...testProps} />);
    expect(queryByText('alert')).toBeInTheDocument();
    const element = container.querySelector(`.${prefixCls}`);
    expect(element).toHaveClass(`${prefixCls}-success`);
  });
  it('should render a special alert with description', () => {
    const { getByText, queryByText } = render(<Alert {...specialProps} />);
    expect(queryByText('alert')).toBeInTheDocument();
    expect(queryByText('description')).toBeInTheDocument();
    expect(getByText('alert')).toHaveClass('bold-title');
  });
  it('should render a disabled closed alert', () => {
    const { queryByText } = render(<Alert {...disabledProps} />);
    expect(queryByText('alert')).toBeInTheDocument();
    expect(queryByText('times-circle')).not.toBeInTheDocument();
  });
})