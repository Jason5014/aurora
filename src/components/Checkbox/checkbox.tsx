import React, { FC, useState, ChangeEvent } from 'react';
import classnames from 'classnames';

export interface OnChangeParams {
  target: {
    checked: boolean;
  };
}

export interface CheckboxPropsType {
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (params: OnChangeParams) => void;
}

export interface CheckboxProps extends CheckboxPropsType {
  prefixCls?: string;
  className?: string;
  name?: string;
  wrapLabel?: boolean;
  style?: React.CSSProperties;
}

export const Checkbox: FC<CheckboxProps> = (props) => {
  const { prefixCls, className, style, defaultChecked, disabled, onChange } = props;
  const [checked, setChecked] = useState(defaultChecked);
  if ('checked' in props && props.checked !== checked) {
    setChecked(props.checked);
  }
  const handleClick = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    onChange?.(e);
  }
  const cls = classnames(prefixCls, {}, className);
  const cbxCls = classnames(`${prefixCls}-inner`, {
    'is-disabled': disabled,
    'is-checked': checked
  });
  return (
    <div className={cls} style={style}>
      <input type="checkbox" className={cbxCls} onChange={handleClick} checked={checked} />
    </div>
  );
}

Checkbox.defaultProps = {
  prefixCls: 'au-checkbox',
}

export default Checkbox;
