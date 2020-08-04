import React, { FC, useState } from 'react';
import Tree, { Node } from 'react-virtualized-tree';

import 'react-virtualized/styles.css';
import 'react-virtualized-tree/lib/main.css';

export interface TreeListData {
  id: string;
  name: any;
  children?: TreeListData[];
}

export interface TreeListProps {
  datas: TreeListData[];
}

export const TreeList: FC<TreeListProps> = (props) => {
  const [treeData, setTreeData] = useState(props.datas);
  const handleChange = (nodes: Node[]) => {
    setTreeData(nodes as TreeListData[]);
  }
  return (
    <Tree nodes={treeData} onChange={handleChange}>
      {({ style, node, ...rest}) => (<div style={style}></div>)}
    </Tree>
  );
}


export default TreeList;