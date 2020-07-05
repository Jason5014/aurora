import React, { FC, useContext, MouseEvent, CSSProperties } from "react";
import classnames from 'classnames';

import Icon from '../Icon/icon';
import { SelectContext } from "./select";

export interface SelectOptionPropsType {
  index?: number;
  /** 默认根据此属性进行筛选，该值不能相同 */
  value: string;
  /** 选项的标签，若不设置则默认与 value 相同 */
  label?: string;
  /** 是否禁用该选项 */
  disabled?: boolean;
}

export interface SelectOptionProps extends SelectOptionPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const SelectOption: FC<SelectOptionProps> = ({ prefixCls, className, style, index, value, label, disabled, children }) => {
  const { selected, multiple, highlightIndex, onSelect, } = useContext(SelectContext);
  const checked = selected.includes(value);
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (onSelect) {
      onSelect(value, checked, label);
    }
  }
  const cls = classnames(prefixCls, {
    'is-highlighted': highlightIndex === index,
    'is-disabled': disabled,
    'is-active': checked,
  }, className);
  return (
    <li key={value} className={cls} style={style} onClick={handleClick}>
      {children || label || value}
      {multiple && checked && <Icon icon="check" />}
    </li>
  );
}

SelectOption.displayName = 'SelectOption';
SelectOption.defaultProps = {
  prefixCls: 'au-select-option',
};

export default SelectOption;