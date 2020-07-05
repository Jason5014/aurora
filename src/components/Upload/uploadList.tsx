import React, { FC, CSSProperties } from 'react';
import classnames from 'classnames';

import { UploadFile } from './upload';
import Icon from '../Icon/icon';
import Progress from '../Progress/progress';

export interface UploadListPropsType {
  fileList: UploadFile[];
  onRemove: (_file: UploadFile) => void;
}

export interface UploadListProps extends UploadListPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const UploadList: FC<UploadListProps> = ({ prefixCls, className, style, fileList, onRemove }) => {
  const cls = classnames(prefixCls, {}, className);
  return (
    <ul className={cls} style={style}>
      {fileList.map(file => {
        return (
          <li className={`${prefixCls}-item`} key={file.uid}>
            <span className={`${prefixCls}-item-file-name is-${file.status}`}>
              <Icon icon="file-alt" theme="secondary" />
              {file.name}
            </span>
            <span className={`${prefixCls}-item-file-status`}>
              {(file.status === 'uploading' || file.status === 'ready') && <Icon icon="spinner" spin theme="primary" />}
              {file.status === 'success' && <Icon icon="check-circle" theme="success" />}
              {file.status === 'failed' && <Icon icon="times-circle" theme="warning" />}
            </span>
            <span className={`${prefixCls}-item-file-actions`}>
              <Icon icon="times" onClick={() => onRemove(file)} />
            </span>
            {file.status === 'uploading' && <Progress precent={file.percent || 0} />}
          </li>
        );
      })}
    </ul>
  );
}

UploadList.displayName = "UploadList";
UploadList.defaultProps = {
  prefixCls: 'au-upload-list',
}

export default UploadFile;