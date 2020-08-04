import React, { FC, useRef, MouseEvent, useContext, CSSProperties } from 'react';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import { TreeData, CustomRender, TreeContext } from './tree';
import Transition from '../Transition';

// 树节点类型
export interface TreeNodePropsType extends TreeData {
  treeIcon?: CustomRender;
  renderLeaf?: CustomRender;
  renderNode?: CustomRender;
  decorator?: (content: CustomRender, node?: TreeData, key?: string) => CustomRender;
}

export interface TreeNodeProps extends TreeNodePropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export type MouseEventPoxy<T = Element> = MouseEvent<T> & {
  target: EventTarget & T
}

export const TreeNode: FC<TreeNodeProps> = (props) => {
  const treeContext = useContext(TreeContext);
  const { decorator, handleExpand: onExpand, handleChecked: onCheck, } = treeContext;
  const { prefixCls, treeKey, isopen, haschild, checkable, renderLeaf, renderNode, children } = props;
  const treeNodeRef = useRef(null);

  const handleExpand = (e: MouseEventPoxy<HTMLInputElement>) => {
    if (e.target.type === 'checkbox') { return ; }
    onExpand?.(treeKey);
  }

  const renderExtendIcon = () => {
    const { extendIcon, loading } = props;
    let type;
    if (loading) {
      type = <Icon icon="spinner" />
    } else {
      switch (extendIcon || 0) {
        case 1: type = (<Icon icon={isopen ? 'arrow-alt-down' : 'arrow-alt-right'}/>); break;
        default: type = (<Icon icon={isopen ? 'minus' : 'plus'}/>); break;
      }
    }
    return type;
  }

  const renderContent = () => {
    const { freeze, isInline, indentLength } = treeContext;
    const { level = 0, extra, name, checked, treeIcon } = props;
    let filling;
    let checkbox;
    let nodeIcon;
    if (haschild || (!haschild && !freeze)) {
      filling = <span className={`${prefixCls}-filling`} style={{ width: level * (indentLength || 14) }} />;
    }
    if (checkable) {
      checkbox = (
        <Checkbox
          className={`${prefixCls}-checkbox`}
          checked={checked}
          onChange={() => onCheck?.(treeKey)}
        />
      );
    }
    if (treeIcon) {
      nodeIcon = (
        <span className={`${prefixCls}-icon-wrap`}>
          <span className={`${prefixCls}-icon`}>{treeIcon}</span>
        </span>
      );
    }
    return (
      <div className={`${prefixCls}-line ${isInline ? 'inline' : ''}`} onClick={handleExpand} ref={treeNodeRef}>
        {filling}
        <span className={`${prefixCls}-extend`} >
          {haschild && renderExtendIcon()}
        </span>
        {checkable === 'left' && checkbox}
        {nodeIcon}
        <span className={`${prefixCls}-title`}>
          {name}{extra}
        </span>
        {checkable && checkable !== 'left' && checkbox}
      </div>
    );
  }

  let content: CustomRender = renderLeaf || renderNode || renderContent();
  if (decorator) {
    content = decorator(content);
  }
  let childrenCom;
  if (haschild) {
    if (isopen) {
      childrenCom = (
        <div className={`${prefixCls}-list`} key={treeKey}>
          {children}
        </div>
      );
    }
    childrenCom = childrenCom && (
      <Transition
        in={isopen}
        timeout={300}
        animation="zoom-in-top"
      >
        {childrenCom}
      </Transition>
    );
  }
  return (
    <div className={`${prefixCls}-li`}>
      {content}
      {childrenCom}
    </div>
  );
}

TreeNode.defaultProps = {
  prefixCls: 'au-tree',
};

export default TreeNode;
