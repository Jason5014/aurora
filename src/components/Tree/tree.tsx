import React, { CSSProperties, FC, useState, useRef, useEffect, createContext, Context, ReactElement } from 'react';
import { isEqual } from 'lodash';
import TreeNode from './treeNode';
import { cloneObj, traver } from './util';

// 树节点数据
export interface TreeDataBase {
  key: string;
  name: CustomRender;
  haschild?: boolean;
  isopen?: boolean;
  childs?: TreeData[];
  checkable?: boolean | string;
  checked?: boolean;
  extra?: CustomRender;
  icon?: CustomRender;
  extendIcon?: CustomRender;
}

export type TreeData = TreeDataBase & {
  treeKey: string;
  level?: number;
  isLoad?: boolean;
  isEmpty?: boolean;
  loading?: boolean;
  pos?: string;
}

export interface TreeNodeMap<T> {
  [key: string]: T
};

export type CustomRender = string | ReactElement | null | undefined;

export interface TreeContextProps {
  rowKey?: string;
  freeze?: boolean;
  isInline?: boolean;
  extendIcon?: number;
  indentLength?: number;
  treeIcon?: CustomRender;
  treeNodeMap?: TreeNodeMap<TreeData>;
  getKey?: (node: TreeData) => string;
  getCheckable?: (node: TreeData) => boolean;
  handleExpand?: (key: string) => void;
  handleChecked?: (key: string) => void;
  decorator?: (content: CustomRender, node?: TreeData, key?: string) => CustomRender;
}

// 树类型
export interface TreePropsType {
  datas: TreeData | TreeData[];
  multiple?: boolean;
  rowKey?: string;
  // search?: string;
  treeIcon?: CustomRender;
  extendIcon?: number;
  checkable?: number;
  checkedAll?: boolean;
  checkedFather?: boolean;
  checkedChild?: boolean;
  defaultExpandAllNode?: boolean;
  defaultCheckAllNode?: boolean;
  defaultExpandedNodeKeys?: string[];
  defaultCheckedNodeKeys?: string[];
  expandedNodeKeys?: string[];
  checkedNodeKeys?: string[];
  freeze?: boolean;
  async?: boolean;
  isInline?: boolean;
  indentLength?: number;
  onAsyncSelect?: (node: TreeData) => Promise<TreeData[]>;
  renderIcon?: (icon: CustomRender, node: TreeData) => CustomRender;
  disabledCheck?: (node: TreeData) => boolean;
  onChange?: (nodes: TreeData[]) => void;
  onChecked?: (keys: string[], nodes: TreeData[] | null, target: TreeData) => void;
  onExpanded?: (keys: string[], nodes: TreeData[] | null, target: TreeData) => void;
  decorator?: (content: CustomRender, node?: TreeData, key?: string) => CustomRender;
  renderLeaf?: (node: TreeData, key: string, level: number) => CustomRender;
  renderNode?: (node: TreeData, key: string, level: number) => CustomRender;
  renderTitle?: (node: TreeData, key: string, level: number) => CustomRender;
}

export interface TreeProps extends TreePropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

const useFouceUpdate = () => {
  const [, setCounter] = useState(0);
  return () => {
    setCounter(prev => prev + 1);
  };
}

export const TreeContext: Context<TreeContextProps> = createContext({});

export const Tree: FC<TreeProps> = (props) => {
  const { prefixCls, className, style, datas: treeData } = props;
  const treeNodeMap = useRef<TreeNodeMap<TreeData>>({});

  const fouceUpdate = useFouceUpdate();
  const [checkedNodeKeys, setCheckedNodeKeys] = useState<string[]>(props.defaultCheckedNodeKeys || []);
  const [expandedNodeKeys, setExpandedNodeKeys] = useState<string[]>(props.defaultCheckedNodeKeys || []);

  useEffect(() => {
    const { defaultExpandAllNode, defaultCheckAllNode } = props;
    const expandAllNode = !('expandedNodeKeys' in props) && defaultExpandAllNode;
    const checkAllNode = !('checkedNodeKeys' in props) && defaultCheckAllNode;
    if (expandAllNode || checkAllNode) {
      traver(treeData, (node: TreeData) => {
        let key = getKey(node);
        let newExpandedNodeKeys = [...expandedNodeKeys];
        let newCheckedNodeKeys = [...checkedNodeKeys];
        if (expandAllNode) {
          newExpandedNodeKeys.push(key);
        }
        if (checkAllNode) {
          newCheckedNodeKeys.push(key);
        }
        setExpandedNodeKeys(newExpandedNodeKeys);
        setCheckedNodeKeys(newCheckedNodeKeys);
        return true;
      });
    }
  }, []);

  if ('expandedNodeKeys' in props && !isEqual(props.expandedNodeKeys, expandedNodeKeys)) {
    setExpandedNodeKeys([ ...(props.expandedNodeKeys || []) ]);
  }
  if ('checkedNodeKeys' in props && !isEqual(props.checkedNodeKeys, checkedNodeKeys)) {
    setCheckedNodeKeys([ ...(props.checkedNodeKeys || []) ]);
  }

  // useEffect(() => {
  //   if ('expandedNodeKeys' in props) {
  //     setExpandedNodeKeys([ ...(props.expandedNodeKeys || []) ]);
  //   }
  //   if ('checkedNodeKeys' in props) {
  //     setCheckedNodeKeys([ ...(props.checkedNodeKeys || []) ]);
  //   }
  // }, [props.expandedNodeKeys, props.checkedNodeKeys]);

  // 反向遍历树
  const containChild = (treeObj: TreeData | TreeData[], key: string, cb: (node: TreeData) => void): boolean => {
    let result = false;
    if (treeObj instanceof Array) {
      for (let node of treeObj) {
        result = result || containChild(node, key, cb);
      }
    } else {
      if (getKey(treeObj) === key) {
        result = true;
      } else if (treeObj.haschild && treeObj.childs && treeObj.childs.length) {
        if (containChild(treeObj.childs, key, cb)) {
          cb(treeObj);
          result = true;
        }
      }
    }
    return result;
  }

  // 根据主键获取key值
  const getKey = (data: any) => {
    const { rowKey = 'key' } = props;
    if (data.hasOwnProperty(rowKey)) {
      return data[rowKey];
    }
    return data.key;
  }

  // 判断节点是否可选
  const getCheckable = (node: TreeData) => {
    const { checkable, disabledCheck } = props;
    if (typeof disabledCheck === 'function') {
      return !disabledCheck(node);
    } else if (checkable === 1) {
      return true;
    } else if (checkable === 2 && !node.haschild) {
      return true;
    } else if (checkable === 3 && node.checkable) {
      return true;
    }
    return false;
  }

  // 对树进行filter操作，需要传入filter判断函数
  const traverFilter = (treeObj: TreeData | TreeData[] | undefined, judge: (node: TreeData) => boolean): any => {
    let tree: TreeData[] | TreeData = [];
    if (!treeObj) { return ; }
    if (treeObj instanceof Array) {
      for (let node of treeObj) {
        let result = traverFilter(node, judge);
        if (result) {
          tree.push(result);
        }
      }
    } else {
      if (treeObj.haschild) { // 如果有子节点
        let childs = traverFilter(treeObj.childs, judge);
        treeObj.childs = childs;
        if ((childs && childs.length) || judge(treeObj)) {
          tree = treeObj;
        } else {
          return ;
        }
      } else if (judge(treeObj)) {    // 叶子结点
        tree = treeObj;
      } else {    // 去除不满足条件的节点
        return ;
      }
      tree.isEmpty =  tree.haschild;
    }
    return tree;
  }

  // 判断节点的子节点是否全选
  const isCheckedAllChildren = (datas: TreeData, checkedKey?: string[]) => {
    checkedKey = checkedKey || checkedNodeKeys;
    let checked = true;
    if (datas.childs && datas.childs.length) {
      const arr = checkedKey as string[];
      if (!arr.length) {
        checked = false;
      } else {
        traver(datas.childs, (node: TreeData) => {
          checked = arr.some(k => k === node.treeKey);
          return checked;
        });
      }
    }
    return checked;
  }

  // 展开节点
  const handleExpand = (key: string) => {
    const { async, onAsyncSelect, onExpanded } = props;
    const node: TreeData = treeNodeMap.current[key];
    if (!node) return;
    const { haschild, isLoad, childs, isEmpty } = node;
    const expanded = expandedNodeKeys.indexOf(key) !== -1;
    let newExpandedNodeKeys = [...expandedNodeKeys];
    let _isLoad = isLoad || (childs && childs.length > 0);
    if (!expanded && haschild && !_isLoad && !isEmpty && async && onAsyncSelect) {
      node.loading = true;
      fouceUpdate();
      onAsyncSelect(cloneObj(node))
        .then((data) => {
          node.childs = data;
          node.isLoad = true;
          node.loading = false;
          newExpandedNodeKeys.push(key);
          setExpandedNodeKeys(newExpandedNodeKeys);
          onExpanded?.(newExpandedNodeKeys, newExpandedNodeKeys.map(key => treeNodeMap.current[key]), node);
        });
    } else {
      if (expanded) {
        newExpandedNodeKeys = newExpandedNodeKeys.filter(k => key !== k);
      } else {
        newExpandedNodeKeys.push(key);
      }
      setExpandedNodeKeys(newExpandedNodeKeys);
      onExpanded?.(newExpandedNodeKeys, newExpandedNodeKeys.map(key => treeNodeMap.current[key]), node);
    }
    // onChange?.(treeData);
  }

  // 选中节点
  const handleChecked = (key: string) => {
    const { multiple, checkedAll, checkedFather, checkedChild, checkable, onChecked } = props;
    const target = treeNodeMap.current[key];
    if (!target) return;
    const checked = checkedNodeKeys.indexOf(key) !== -1;
    let newCheckedNodeKeys = [...checkedNodeKeys];
    if (multiple) {
      if (checked) {
        newCheckedNodeKeys = newCheckedNodeKeys.filter(k => k !== key);
      } else {
        newCheckedNodeKeys.push(key);
      }
      const { haschild, childs } = target;
      if (checkedAll && (checkable === 1 || checkable === 3)) {
        // 选中子节点
        if (haschild && childs && childs.length) {
          traver(childs, (item: TreeData) => {
            if (!getCheckable(item)) return true;
            if (checked) {
              newCheckedNodeKeys = newCheckedNodeKeys.filter(k => k !== item.treeKey);
            } else {
              newCheckedNodeKeys.push(item.treeKey || getKey(item));
            }
            return true;
          }, checkedChild ? 1 : undefined);
        }
        // 选中父节点
        if (checkedFather) {
          containChild(treeData, key, (item) => {
            if (checked) {
              newCheckedNodeKeys = newCheckedNodeKeys.filter(k => k !== item.treeKey);
            } else {
              if (getCheckable(item) && !newCheckedNodeKeys.some(k => k === item.treeKey) && isCheckedAllChildren(item, newCheckedNodeKeys)) {
                newCheckedNodeKeys.push(item.treeKey || getKey(item));
              }
            }
          });
        }
      }
    } else {
      newCheckedNodeKeys = checked ? [] : [key];
    }
    setCheckedNodeKeys(newCheckedNodeKeys);
    onChecked?.(newCheckedNodeKeys, newCheckedNodeKeys.map(k => treeNodeMap.current[k]), target);
  }

  // 节点自定义特殊处理
  const handleDecorator = (data: TreeData, key: string) => {
    const { decorator } = props;
    if (decorator) {
      return function(content: any) {
        return decorator(content, data, key);
      };
    } else {
      return undefined;
    }
  }

  // 渲染树子节点
  const renderTreeNode = (node: TreeData, level: number = 1, parent?: TreeData): any => {
    const { treeIcon, decorator, renderIcon, renderNode, renderLeaf, renderTitle } = props;
    const { childs, haschild } = node;
    const treeKey = getKey(node);
    const pos = parent ? `${parent.treeKey}-${treeKey}` : treeKey;
    const checked = checkedNodeKeys.indexOf(treeKey) !== -1;
    const isopen = expandedNodeKeys.indexOf(treeKey) !== -1;
    node.treeKey = treeKey;
    node.pos = pos;
    node.checked = checked;
    node.isopen = isopen;
    node.level = level;
    treeNodeMap.current[treeKey] = node;
    return (
      <TreeNode
        {...node}
        level={level}
        name={renderTitle ? renderTitle(node, treeKey, level) : node.name}
        checkable={getCheckable(node) ? (node.checkable ? node.checkable : true) : false}
        treeIcon={renderIcon ? renderIcon(node.icon, node) || treeIcon : treeIcon}
        renderLeaf={(renderLeaf && !haschild) ? renderLeaf(node, treeKey, level) : undefined}
        renderNode={renderNode ? renderNode(node, treeKey, level) : undefined}
        decorator={decorator ? handleDecorator(node, treeKey) : undefined}
      >
        {childs && childs.length > 0 && childs.map(c => renderTreeNode(c, level + 1, node)).filter(v => !!v)}
      </TreeNode>
    );
  }

  let newDatas;
  if (treeData instanceof Array) {
    newDatas = treeData;
  } else {
    newDatas = [treeData];
  }

  const treeContext: TreeContextProps = {
    freeze: props.freeze,
    rowKey: props.rowKey,
    treeIcon: props.treeIcon,
    indentLength: props.indentLength,
    isInline: props.isInline,
    treeNodeMap: treeNodeMap.current,
    getKey,
    getCheckable,
    handleExpand,
    handleChecked,
    decorator: props.decorator,
  };

  return (
    <TreeContext.Provider value={treeContext}>
      <div className={`${prefixCls}-wrapper ${className}`} style={style}>
        <div className={`${prefixCls}-list`}>
          {newDatas.map(data => renderTreeNode(data))}
        </div>
      </div>
    </TreeContext.Provider>
  );
}

Tree.defaultProps = {
  prefixCls: 'au-tree',
  rowKey: 'key',
  className: '',
  style: {},
  isInline: true,
};

export default Tree;
