import React, { ReactElement, InputHTMLAttributes, FC, CSSProperties } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classnames from 'classnames';
import Icon from '../Icon/icon';

export type InputSize = 'lg' | 'sm';
export interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
  /** 禁用 Input */
  disabled?: boolean;
  /** 设置 Input 的尺寸 */
  size?: InputSize;
  /** 设置 Input 的图标 */
  icon?: IconProp;
  /** 设置 Input 的前缀 */
  prepend?: string | ReactElement;
  /** 设置 Input 的后缀 */
  append?: string | ReactElement;
  /** 输入值内容发生变化触发的回调事件 */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: CSSProperties;
}

export interface InputProps extends BaseInputProps {
  /** 组件类名前缀 */
  prefixCls?: string;
}

/**
 * Input 输入框 通过鼠标或者键盘输入内容， 是最基础的表单域的包装
 */
export const Input: FC<InputProps> = ({ prefixCls, className, style, disabled, size, icon, prepend, append, ...restProps }) => {
  // 取出各种的属性
  // 根据属性计算不同的 className
  const cls = classnames(`${prefixCls}-wrap`, {
    'is-disabled': disabled,
    [`${prefixCls}-${size}`]: size,
    [`${prefixCls}-group-icon`]: icon,
    [`${prefixCls}-group`]: prepend || append,
    [`${prefixCls}-group-prepend`]: !!prepend,
    [`${prefixCls}-group-append`]: !!append,
  });
  const fixControlledValue = (value: any) => {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    return value;
  }
  if ('value' in restProps) {
    delete restProps.defaultValue;
    restProps.value = fixControlledValue(restProps.value);
  }
  return (
    // 根据属性判断是否要添加特定的节点
    <div className={cls} style={style}>
      {prepend && <div className={`${prefixCls}-prepend`}>{prepend}</div>}
      <input className={`${prefixCls}-inner`} disabled={disabled} {...restProps} />
      {icon && <div className={`${prefixCls}-icon-wrap`}><Icon icon={icon} /></div>}
      {append && <div className={`${prefixCls}-append`}>{append}</div>}
    </div>
  );
}

Input.defaultProps = {
  prefixCls: 'au-input',
}

export default Input;