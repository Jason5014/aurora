import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Menu from './menu';
import Item from './menuItem';
import SubMenu from './subMenu';

export const defaultMenu = () => (
  <Menu defaultIndex='0' onSelect={action('selected!')} >
    <Item>
      cool link
    </Item>
    <Item>
      cool link 2
    </Item>
    <Item disabled>
      disabled
    </Item> 
    <SubMenu title="下拉选项">
      <Item>
        下拉选项一
      </Item>
      <Item>
        下拉选项二
      </Item>    
    </SubMenu>
  </Menu>
)
export const clickMenu = () => (
  <Menu defaultIndex='0' onSelect={action('selected!')} mode="vertical">
    <Item>
      cool link
    </Item>
    <Item>
      cool link 2
    </Item>
    <SubMenu title="点击下拉选项">
      <Item>
        下拉选项一
      </Item>
      <Item>
        下拉选项二
      </Item>    
    </SubMenu>
  </Menu>
)
export const openedMenu = () => (
  <Menu defaultIndex='0' onSelect={action('selected!')} mode="vertical" defaultOpenSubMenus={['2']}>
    <Item>
      cool link
    </Item>
    <Item>
      cool link 2
    </Item>
    <SubMenu title="默认展开下拉选项">
      <Item>
        下拉选项一
      </Item>
      <Item>
        下拉选项二
      </Item>    
    </SubMenu>
  </Menu>
)

storiesOf('Menu', module)
.add('Menu', defaultMenu )
.add('纵向的 Menu', clickMenu)
.add('默认展开的纵向 Menu', openedMenu)