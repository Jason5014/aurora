import React, { FC, ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes, CSSProperties } from 'react';
import classnames from 'classnames';

export type ButtonSize = 'lg' | 'sm';

export type ButtonType = 'primary' | 'default' | 'danger' | 'link';

export interface BaseButtonProps {
  children?: ReactNode;
  /** 设置 Button 的类型 */
  btnType?: ButtonType;
  /** 设置 Button 的尺寸 */
  size?: ButtonSize;
  /** 设置 link Button 的链接地址 */
  href?: string;
  /** 设置 Button 的禁用 */
  disabled?: boolean;
}

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;

type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>;

export interface ButtonProps extends Partial<NativeButtonProps & AnchorButtonProps> {
  /** 组件类名的前缀 */
  prefixCls?: string;
  /** 自定义类名 */
  className?: string;
  style?: CSSProperties;
};

/**
 * 这是我们的第一个 Button 组件
 */
export const Button: FC<ButtonProps> = (props) => {
  const { prefixCls, className, btnType, size, href, disabled, children, ...restProps } = props;
  const classname = classnames(prefixCls, {
    [`${prefixCls}-${btnType}`]: btnType,
    [`${prefixCls}-${size}`]: size,
    'disabled': btnType === 'link' && disabled
  }, className);
  if (btnType === 'link') {
    return (
      <a
        className={classname}
        href={href}
        {...restProps}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      className={classname}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  prefixCls: 'au-btn',
  disabled: false,
  btnType: 'default'
}

export default Button;