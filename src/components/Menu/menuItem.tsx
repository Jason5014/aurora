import React, { FC, CSSProperties, useContext } from 'react';
import classnames from 'classnames';

import { MenuContext } from './menu';

export interface MenuItemPropsType {
  /** 选项的 active key 值 */
  index?: string;
  /** 选项是否被禁用 */
  disabled?: boolean;
}

export interface MenuItemProps extends MenuItemPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const MenuItem: FC<MenuItemProps> = ({ prefixCls, className, style, index, disabled, children }) => {
  const context = useContext(MenuContext);
  context.menuItemPrefixCls = prefixCls;
  const cls = classnames(prefixCls, {
    'is-disabled': disabled,
    'is-active': context.index === index,
  }, className);
  const handleClick = () => {
    if (context.onSelect && !disabled && typeof index === 'string') {
      context.onSelect(index);
    }
  }
  return (
    <li className={cls} style={style} onClick={handleClick}>
      {children}
    </li>
  )
}
MenuItem.displayName = 'MenuItem';
MenuItem.defaultProps = {
  prefixCls: 'au-menu-item',
}

export default MenuItem;