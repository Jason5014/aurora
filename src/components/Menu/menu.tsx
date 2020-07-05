import React, { FC, Children, FunctionComponentElement, CSSProperties, cloneElement, createContext, useState } from 'react';
import classnames from 'classnames';

import { MenuItemProps } from './menuItem';

export type MenuMode = 'horizontal' | 'vertical';

type SelectCallback = (selectedIndex: string) => void;

export interface IMenuContext {
  index: string;
  onSelect?: SelectCallback;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
  menuPrefixCls?: string;
  menuItemPrefixCls?: string;
}

export interface MenuPropsType {
  /** 默认 active 的菜单项的索引值 */
  defaultIndex?: string;
  /** 菜单类型 横向或者纵向 */
  mode?: MenuMode;
  /** 设置子菜单的默认打开 只有在纵向模式下生效 */
  defaultOpenSubMenus?: string[];
  /** 点击菜单项触发的回调函数 */
  onSelect?: SelectCallback;
}

export interface MenuProps extends MenuPropsType {
  /** 组件类名前缀 */
  prefixCls?: string;
  /** 自定义类名 */
  className?: string;
  style?: CSSProperties;
}

export const MenuContext = createContext<IMenuContext>({ index: '0' });

/**
 * 为网站提供高航功能的菜单。
 * 支持横向纵向两种模式，支持下拉菜单。
 */
export const Menu: FC<MenuProps> = ({ prefixCls, className, mode, style, defaultIndex, defaultOpenSubMenus, onSelect, children }) => {
  const [ currentActive, setActive ] = useState(defaultIndex);
  const cls = classnames(prefixCls, {
    [`${prefixCls}-vertical`]: mode === 'vertical',
    [`${prefixCls}-horizontal`]: mode !== 'vertical',
  }, className);
  const handleSelect = (index: string) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  }
  const passedContext: IMenuContext = {
    defaultOpenSubMenus,
    index: currentActive || '0',
    onSelect: handleSelect,
    mode,
  }
  const renderChildren = () => {
    return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return cloneElement(childElement, {
          index: `${index}`
        });
      } else {
        console && console.error('Warning: Menu has a child which is not a MenuItem component.')
      }
    });
  }
  return (
    <ul className={cls} style={style} data-testid="test-menu">
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  )
}

Menu.defaultProps = {
  defaultOpenSubMenus: [],
  prefixCls: 'au-menu',
  defaultIndex: '0',
  mode: 'horizontal',
}

export default Menu;