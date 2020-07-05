import React, { FC, CSSProperties } from 'react';
import classnames from 'classnames';

import { ThemeProps } from '../Icon/icon';

export interface ProgressPropsType {
  precent: number;
  storkeHight?: number;
  showText?: boolean;
  theme?: ThemeProps;
}

export interface ProgressProps extends ProgressPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const Progress: FC<ProgressProps> = ({ prefixCls, className, style, precent, storkeHight, showText, theme }) => {
  const cls = classnames(prefixCls, {}, className);
  return (
    <div className={cls} style={style}>
      <div className={`${prefixCls}-outer`} style={{ height: storkeHight }}>
        <div className={`${prefixCls}-inner color-${theme}`} style={{ width: `${precent}%` }}>
          {showText && <span className={`${prefixCls}-inner-text`}>{`${precent}%`}</span>}
        </div>
      </div>
    </div>
  );
}

Progress.defaultProps = {
  prefixCls: 'au-progress-bar',
  storkeHight: 15,
  showText: true,
  theme: 'primary'
};

export default Progress;
