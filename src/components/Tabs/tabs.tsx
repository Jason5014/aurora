import React, { CSSProperties, FC, Children, FunctionComponentElement, MouseEvent, useState } from 'react';
import classnames from 'classnames';
import { TabItemProps } from './tabItem';

export type SelectedCallback = (selectedIndex: number) => void;

export interface TabsPropsType {
  /** 默认激活 tab 面板的 index， 默认为0  */
  defaultIndex?: number;
  /** Tabs的样式，两种可选，默认为line */
  mode?: 'line' | 'pill';
  /** 点击 Tab 触发的回调函数 */
  onSelect?: SelectedCallback;
}

export interface TabsProps extends TabsPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * 选项卡切换组件。
 * 提供平级的区域将大块内容进行收纳和展现，保持界面整洁。
 */
export const Tabs: FC<TabsProps> = ({prefixCls, className, style, defaultIndex, mode, onSelect, children}) => {
  const [activeIndex, setActive] = useState(defaultIndex);
  const cls = classnames(prefixCls, className);
  const navCls = classnames(`${prefixCls}-nav`, {
    [`${prefixCls}-${mode === 'pill' ? 'pill' : 'line'}`]: true,
  });
  const handleClick = (e: MouseEvent, index: number) => {
    e.preventDefault();
    setActive(index);
    if (onSelect){
      onSelect(index);
    }
  }
  const renderNavLinks = () => {
    return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<TabItemProps>;
      const { displayName } = childElement.type;
      if (displayName === 'TabItem') {
        const { label, disabled } = childElement.props;
        const itemCls = classnames(`${prefixCls}-nav-item`, {
          'is-active': index === activeIndex,
          'disabled': disabled
        });
        return (
          <li
            className={itemCls}
            key={`nav-item-${index}`}
            onClick={disabled ? undefined : ((e) => handleClick(e, index))}
          >
            {label}
          </li>
        )
      } else {
        console && console.error('Warning: Tabs got a child which is not a TabItem.');
      }
    });
  };
  const renderContent = () => {
    return Children.map(children, (child, index) => {
      if (index === activeIndex) {
        return child;
      }
    })
  }
  return (
    <div className={cls} style={style}>
      <ul className={navCls}>
        {renderNavLinks()}
      </ul>
      <div className={`${prefixCls}-content`}>
        {renderContent()}
      </div>
    </div>
  );
}

Tabs.defaultProps = {
  prefixCls: 'au-tabs',
  mode: 'line'
};

export default Tabs;