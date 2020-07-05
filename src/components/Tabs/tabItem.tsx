import React, { ReactElement } from 'react';

export interface BaseTabItemProps {
  label?: string | ReactElement;
  disabled?: boolean;
}

export interface TabItemProps extends BaseTabItemProps {
  prefixCls?: string;
}

export const TabItem: React.FC<TabItemProps> = ({ prefixCls, children }) => {
  return (
    <div className={prefixCls}>
      {children}
    </div>
  )
}

TabItem.displayName = 'TabItem';
TabItem.defaultProps = {
  prefixCls: 'au-tab-panel'
}

export default TabItem;