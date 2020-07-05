import React, { FC, Children, MouseEvent, FunctionComponentElement, cloneElement, useContext, useState, useRef, CSSProperties } from 'react';
import classnames from 'classnames';
import Icon from '../Icon/icon';
import Transition from '../Transition/transition';

import { MenuContext } from './menu';
import { MenuItemProps } from './menuItem';
import useClickOutside from '../../Hooks/useClickOutside';

export interface SubMenuPropsType {
  /** 选项的 active key 值 */
  index?: string;
  /** 下拉菜单选项的文字 */
  title?: string;
}

export interface SubMenuProps extends SubMenuPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const SubMenu: FC<SubMenuProps> = ({ prefixCls, className, style, index, title, children }) => {
  const context = useContext(MenuContext);
  const openSubMenus = context.defaultOpenSubMenus as Array<string>;
  const isOpend = index && context.mode === 'vertical'
    ? openSubMenus.includes(index)
    : false;
  const [menuOpen, setOpen] = useState(isOpend);
  const componentRef = useRef<HTMLLIElement>(null);
  const cls = classnames(`${context.menuItemPrefixCls} ${prefixCls}-item`, {
    'is-active': context.index === index,
    'is-opened': menuOpen,
    'is-vertical': context.mode === 'vertical',
  }, className);
  useClickOutside(componentRef, () => {
    setOpen(false);
  });
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    setOpen(!menuOpen);
  };
  let timer: any;
  const handleMouse = (e: MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 300);
  };
  const clickEvents = context.mode === 'vertical'
    ? { onClick: handleClick }
    : {};
  const hoverEvents = context.mode !== 'vertical'
    ? {
      onMouseEnter: (e: MouseEvent) => { handleMouse(e, true); },
      onMouseLeave: (e: MouseEvent) => { handleMouse(e, false); }
    } : {};
  const renderChildren = () => {
    const subMenuCls = classnames(prefixCls, {
      'menu-opened': menuOpen
    });
    const childrenComponent = Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>;
      if (childElement.type.displayName === 'MenuItem') {
        return cloneElement(childElement, {
          index: `${index}-${i}`
        });
      } else {
        console && console.error('Warning: SubMenu has a child which is not a MenuItem component.');
      }
    });
    return (
      <Transition
        in={menuOpen}
        timeout={300}
        animation="zoom-in-top"
      >
        <ul className={subMenuCls}>
          {childrenComponent}
        </ul>
      </Transition>
    )
  }
  return (
    <li className={cls} style={style} {...hoverEvents} ref={componentRef}>
      <div className={`${prefixCls}-title`} {...clickEvents}>
        {title}
        <Icon icon="angle-down" className="arrow-icon" />
      </div>
      {renderChildren()}
    </li>
  )
}
SubMenu.displayName = 'SubMenu';
SubMenu.defaultProps = {
  prefixCls: 'au-submenu',
}

export default SubMenu;