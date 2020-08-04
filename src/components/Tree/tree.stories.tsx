import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'
import Button from '../Button';
import Tree, { TreeData } from './tree';
import { useState } from '@storybook/addons';

const defaultDatas = [{
  childs: [{ haschild: false, isopen: false, key: '11', name: '内部留言' }],
  haschild: true,
  isopen: true,
  key: '1',
  name: '日常工作-这是一个很长很长很长很长很长很长的标题\n日常工作-这是一个很长很长很长很长很长很长的标题',
},
{
  childs: [{ haschild: true, isopen: true, key: '21', name: '系统提醒工作流', childs: [{ haschild: true, isopen: true, key: '211', name: '内部留言', childs: [{ haschild: false, isopen: false, key: '2111', name: '内部留言' }] }] }],
  haschild: true,
  isopen: true,
  counts: 3,
  key: '2',
  name: '默认流程',
},
{
  haschild: true,
  isopen: false,
  key: '3',
  name: '生活日常',
},
{
  haschild: true,
  isopen: false,
  key: '4',
  name: '其他事项',
}];

const mockData = (node: TreeData) => new Promise<TreeData[]>((resolve) => {
  // 使用定时器模拟axios异步获取数据
  const timer = setTimeout(() => {
    const key = node.key;
    const data = [{
      childs: [{ haschild: false, isopen: false, key: `${key}-11`, name: '内部留言' }],
      haschild: true,
      isopen: true,
      key: `${key}-1`,
      name: '日常工作',
    },
    {
      childs: [{ haschild: true, isopen: true, key: `${key}-21`, name: '系统提醒工作流', childs: [{ haschild: true, isopen: true, key: `${key}-211`, name: '内部留言', childs: [{ haschild: false, isopen: false, key: `${key}-2111`, name: '内部留言' }, { haschild: false, isopen: false, key: `${key}-2112`, name: '外部留言' }] }] }],
      haschild: true,
      isopen: true,
      counts: 3,
      key: `${key}-2`,
      name: '默认流程',
    }];
    resolve(data);
    clearTimeout(timer);
  }, 1000);
})

export const DefaultTree: FC = () => {
  const [checkedNodeKeys, setCheckedNodeKeys] = useState<string[]>([]);
  const [expandedNodeKeys, setExpandedNodeKeys] = useState<string[]>([]);
  const handleClick = () => {
    setCheckedNodeKeys(['1', '11', '2', '21']);
    setExpandedNodeKeys(['1', '11', '2', '21']);
  }
  const isCheckDisabled = (node: TreeData) => {
    
  }
  const renderTitle = (node: TreeData) => {
    const { name } = node;
    if (node.haschild) {
      return name;
    }
    return (
      <div className="custom-tree-node-title">
        <p>{name}</p>
        <p>备注：仅总部使用</p>
        <p>描述:我是很长的描述内容我是很长的描述内容我是很长的描述内容</p>
      </div>
    );
  }
  return (
    <>
    <Button btnType="primary" onClick={handleClick}>数据受控</Button>
    <Tree
      multiple
      async
      isInline={false}
      onAsyncSelect={mockData}
      datas={defaultDatas as TreeData[]}
      checkable={1}
      checkedAll
      checkedFather
      disabledCheck={isCheckDisabled}
      checkedNodeKeys={checkedNodeKeys}
      expandedNodeKeys={expandedNodeKeys}
      // icon={<Icon icon="ellipsis-h" />}
      renderTitle={renderTitle}
      onExpanded={(...arg) => {
        setExpandedNodeKeys(arg[0]);
        action('on expanded')(...arg);
      }}
      onChecked={(...arg) => {
        setCheckedNodeKeys(arg[0])
        action('on checked')(...arg);
      }}
      onChange={action('on change')}
    />
    </>
  );
}

const orgData = [
  {
    id: '0',
    type: '0',
    name: 'E9TEST',
    isParent: true,
    canClick: false,
    disabledCheck: true,
    subs: [
      {
        canClick: false,
        id: "1",
        isParent: true,
        name: "Default",
        type: "1",
      },
      {
        canClick: false,
        id: "2",
        isParent: true,
        name: "韦森集团",
        type: "1",
      },
      {
        canClick: false,
        id: "3",
        isParent: true,
        name: "哈哈哈集团",
        type: "1",
      }
    ]
  }
];

export const OrginazeTree: FC = () => {
  // 深度遍历树，需要传入待执行callback操作
  const traver = (tree: TreeData) => {
    if (!tree) { return ; }
    let newTree;
    if (tree instanceof Array) {
      newTree = [];
      tree.map((node) => {
        newTree.push(traver(node));
      });
    } else {
      newTree = fixTreeNode(tree);
    }
    return newTree;
  }
  const fixTreeNode = (tree: TreeData) => {
    const newTree = { ...tree };
    newTree.checkable = tree.canClick || tree.checkable;
    newTree.haschild = tree.isParent || tree.haschild;
    newTree.childs = traver(tree.subs || tree.children || tree.childs);
    if (newTree.type) {
      newTree.key = `${newTree.type}-${newTree.id}`;
    } else {
      newTree.key = newTree.id;
    }
    delete newTree.subs;
    delete newTree.children;
    return newTree;
  };
  const formatTreeData = (datas: TreeData | TreeData[]): TreeData[] => {
    datas = datas || [];
    if (!Array.isArray(datas)) {
      datas = [datas];
    }
    return traver(datas);
  }
  const [treeData] = useState<TreeData[]>(() => formatTreeData(orgData));
  const [checkedNodeKeys, setCheckedNodeKeys] = useState<string[]>([]);
  const [expandedNodeKeys, setExpandedNodeKeys] = useState<string[]>([]);
  const [checkStrictly, setCheckStrictly] = useState(true);
  const isCheckDisabled = (node: TreeData) => {
    if (node.disabledCheck) {
      return true;
    }
    if (node.canClick) {
      return false;
    }
    if (!checkStrictly && !node.canClick && node.haschild) {
      return false;
    }
    return true;
  }
  return (
    <>
      <Button
        btnType="primary"
        onClick={() => setCheckStrictly(!checkStrictly)}
      >
        {checkStrictly ? '包含下级' : '不包含下级'}
      </Button>
      <Tree
        async
        multiple
        checkedAll
        checkable={1}
        onAsyncSelect={(node: TreeData) => new Promise<TreeData[]>(resolve => {
          const timmer = setTimeout(() => {
            clearTimeout(timmer);
            const key = node.key;
            const datas = [{
              canClick: true,
              id: `${key}1`,
              isParent: false,
              name: `dept${key}1`,
              type: "2",
            },{
              canClick: true,
              id: `${key}2`,
              isParent: false,
              name: `dept${key}2`,
              type: "2",
            }];
            resolve(formatTreeData(datas));
          }, 300);
        })}
        datas={treeData}
        disabledCheck={isCheckDisabled}
        checkedNodeKeys={checkedNodeKeys}
        expandedNodeKeys={expandedNodeKeys}
        onExpanded={(...arg) => {
          setExpandedNodeKeys(arg[0]);
          action('on expanded')(...arg);
        }}
        onChecked={(...arg) => {
          setCheckedNodeKeys(arg[0])
          action('on checked')(...arg);
        }}
      />
    </>
  )
}

export const PerformanceTest: FC = () => {
  const [treeData] = useState(() => {
    const datas = { domid: 'root', key: '0', haschild: true, isopen: true, name: 'TreeRoot', childs: [] };
    for (let i = 1; i < 5000; i += 1) {
      datas.childs.push({
        domid: `node-${i}`,
        key: `${i}`,
        haschild: true,
        name: `TreeNode${i}`,
      });
    }
    return datas;
  });
  return (
    <Tree
      multiple
      async
      checkedAll
      extendIcon={1}
      rowKey="domid"
      onAsyncSelect={mockData}
      datas={treeData}
      checkable={1}
      onExpanded={action('on expanded')}
      onChecked={action('on checked')}
    />
  );
}

PerformanceTest.story = {
  parameters: { info: { inline: false, header: false } }
}

export default {
  title: 'Tree',
  Component: Tree
}
