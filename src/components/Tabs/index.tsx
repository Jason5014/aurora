import { FC } from 'react';
import Tabs, { TabsProps } from './tabs';
import Item, { TabItemProps } from './tabItem';

export type ITabsComponent = FC<TabsProps> & {
  Item: FC<TabItemProps>,
}

const TransTabs = Tabs as ITabsComponent;

TransTabs.Item = Item;

export default TransTabs;
