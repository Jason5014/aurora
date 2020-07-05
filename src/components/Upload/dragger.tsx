import React, { FC, CSSProperties, useState, DragEvent } from 'react';
import classnames from 'classnames';

export interface DraggerPropsType {
  onFile: (files: FileList)  => void;
}

export interface DraggerProps extends DraggerPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const Dragger: FC<DraggerProps> = ({ prefixCls, className, style, children, onFile }) => {
  const [dragOver, setDragOver] = useState(false);
  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(false);
    onFile(e.dataTransfer.files)
  }
  const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
    e.preventDefault();
    setDragOver(over);
  }
  const cls = classnames(prefixCls, {
    'is-dragover': dragOver,
  }, className);
  return (
    <div
      className={cls}
      style={style}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}

Dragger.defaultProps = {
  prefixCls: 'au-dragger'
}

export default Dragger;
