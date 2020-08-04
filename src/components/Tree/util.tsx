import { TreeData } from './tree';

// 对象深拷贝
export const cloneObj = (obj: any): any => {
  if (!obj) { return obj; }
  let newObj: any = {};
  if (obj instanceof Array) {
    newObj = [];
  }
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let val = obj[key];
      newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
    }
  }
  return newObj;
}

// 深度遍历树，需要传入待执行callback操作
export const traver = (treeObj: TreeData | TreeData[], cb: (node: TreeData) => boolean, level?: number): boolean => {
  let flag = level === undefined ? true : level;
  if (!treeObj) return false;
  if (treeObj instanceof Array) {
    for (let node of treeObj) {
      if (node && !traver(node, cb, level)) {
        return false;
      }
    }
  } else {
    if (flag && cb(treeObj)) {
      if (treeObj.haschild && treeObj.childs) {
        traver(treeObj.childs, cb, flag === true ? undefined : flag - 1);
      }
    } else {
      return false;
    }
  }
  return true;
}

