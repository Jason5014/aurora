import React, { FC, CSSProperties } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export type ThemeProps = 'primary' | 'secondary' | 'success' | 'info' | 'warning';

export interface IconProps extends FontAwesomeIconProps {
  /** 组件类名的前缀 */
  prefixCls?: string;
  /** 设置 Icon 的类型 */
  theme?: ThemeProps;
  className?: string;
  style?: CSSProperties;
}

/**
 * 提供了一套常用的图标集合 基于 react-fontawesome。
 * 
 * 支持 react-fontawesome的所有属性 可以在这里查询 https://github.com/FortAwesome/react-fontawesome#basic
 * 
 * 支持 fontawesome 所有 free-solid-icons，可以在这里查看所有图标 https://fontawesome.com/icons?d=gallery&s=solid&m=free
 * 
 */
export const Icon: FC<IconProps> = ({ prefixCls, className, theme, ...restProps }) => {
  const cls = classnames(prefixCls, {
    [`icon-${theme}`]: theme,
  }, className);
  return (
    <FontAwesomeIcon className={cls} {...restProps} />
  );
}

Icon.defaultProps = {
  prefixCls: 'au-icon',
}

export default Icon;