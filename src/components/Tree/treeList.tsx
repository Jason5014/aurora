import React, { FC, useContext } from 'react';
import { VariableSizeTree as Tree, VariableSizeNodeComponentProps } from 'react-vtree';
import { TreeData, TreeContext } from './tree';
import TreeNode from './treeNode';

export interface IStack {
  defaultHeight: string;
  id: any;
  name: any,
  isLeaf: boolean;
  isOpenByDefault: boolean;
  nestingLevel: number;
}
export interface TreeListProps {
  datas: TreeData[];
}

// Node component receives current node height as a prop
export const Node: FC<VariableSizeNodeComponentProps<any>> = ({data: node, style, toggle}) => {
  const treeContext = useContext(TreeContext);
  const { treeIcon, getCheckable, renderIcon, renderTitle, renderLeaf, renderNode, decorator, handleChecked, handleExpand, handleDecorator } = treeContext;
  const { treeKey, level } = node;
  console.log(node);
  return (
    <TreeNode
      style={style}
      {...node}
      handleExpand={handleExpand}
      handleChecked={handleChecked}
      name={renderTitle ? renderTitle(node, treeKey, level) : node.name}
      checkable={getCheckable?.(node) ? (node.checkable ? node.checkable : true) : false}
      treeIcon={renderIcon ? renderIcon(node.icon, node) || treeIcon : treeIcon}
      renderLeaf={(renderLeaf && !node.haschild) ? renderLeaf(node, treeKey, level) : undefined}
      renderNode={renderNode ? renderNode(node, treeKey, level) : undefined}
      decorator={decorator ? handleDecorator(node, treeKey) : undefined}
    />
  );
}

export const TreeList: FC<TreeListProps> = (props) => {
  const treeContext = useContext(TreeContext);
  const { datas } = props;

  // 渲染树子节点
  const formatNodeData = (node: TreeData, level: number = 1, parent?: TreeData): any => {
    const { treeNodeMap, checkedNodeKeys, expandedNodeKeys, getKey } = treeContext;
    const treeKey = getKey?.(node) || node.key;
    const pos = parent ? `${parent.treeKey}-${treeKey}` : treeKey;
    const checked = (checkedNodeKeys || []).indexOf(treeKey) !== -1;
    const isopen = (expandedNodeKeys || []).indexOf(treeKey) !== -1;
    node.treeKey = treeKey;
    node.pos = pos;
    node.checked = checked;
    node.isopen = isopen;
    node.level = level;
    if (treeNodeMap) treeNodeMap[treeKey] = node;
    return node;
  }

  function* treeWalker(refresh: boolean) {
    const stack = [];

    datas.forEach(node =>
      stack.push({
        nestingLevel: 0,
        node: formatNodeData(node, 1)
      })
    );
  
    while (stack.length !== 0) {
      const { node, nestingLevel } = stack.pop() as any;

      const isOpened = yield refresh
        ? {
            // The only difference VariableSizeTree `treeWalker` has comparing to
            // the FixedSizeTree is the `defaultHeight` property in the data
            // object.
            defaultHeight: 30,
            id: node.treeKey,
            name: node.name,
            nestingLevel,
            isOpenByDefault: true,
            ...node,
          }
        : node.treeKey;
      
      if (node.childs && node.childs.length !== 0 && isOpened) {
          for (let i = node.childs.length - 1; i >= 0; i--) {
          // for (let i = 0; i< node.childs.length; i++) {
            stack.push({
              nestingLevel: nestingLevel + 1,
              node: formatNodeData(node.childs[i], nestingLevel + 2, node),
            });
          }
        }
    }
  }

  return (
    <Tree treeWalker={treeWalker} height={500}>
      {Node}
    </Tree>
  );
};
