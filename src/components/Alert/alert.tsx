import React, { FC, MouseEvent, HTMLAttributes, useState, CSSProperties } from 'react';
import classnames from 'classnames';
import Icon from '../Icon/icon';
import Transition from '../Transition/transition';

export type AlertType = 'success' | 'default' | 'danger' | 'warning';

export type AlertPosition = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface AlertPropsType {
  /** 设置 Alert 的类型 */
  type: AlertType;
  /** 设置 Alert 是否可关闭 */
  closable?: boolean;

  /** 设置 Alert 的显示内容或标题 */
  title?: string;
  /** 设置 Alert 的详细信息 */
  description?: string;
  /** 设置 Alert 显示的位置 */
  position?: AlertPosition;
  /** 关闭事件回调函数 */
  onClose?: (e?: MouseEvent) => void;
}

export interface AlertProps extends Partial<AlertPropsType & HTMLAttributes<HTMLElement>> {
  /** 组件类名的前缀 */
  prefixCls?: string;
  /** 自定义类名 */
  className?: string;
  style?: CSSProperties;
};

/** 
 * 用于页面中展示重要的提示信息。 点击右侧的叉提示自动消失
*/
export const Alert: FC<AlertProps> = (props) => {
  const [hide, setHide] = useState(false);
  const { prefixCls, className, type, title, description, position, closable, onClose, ...restProps } = props;
  const cls = classnames(prefixCls, {
    hide,
    [`${position}`]: position,
    [`${prefixCls}-${type}`]: type
  }, className);
  const titleCls = classnames(`${prefixCls}-title`, {
    'bold-title': description
  });
  const handleClose = (e: MouseEvent) => {
    setHide(true);
    if (onClose) {
      onClose(e);
    }
  }
  return (
    <Transition in={!hide} timeout={1000} animation="zoom-in-right">
      <div className={cls} {...restProps}>
        <div className={`${prefixCls}-content`}>
          <div className={titleCls}>{title}</div>
          {description && <div className={`${prefixCls}-description`}>{description}</div>}
        </div>
        {closable && <span className={`${prefixCls}-close`} onClick={handleClose}><Icon icon="times-circle" /></span>}
      </div>
    </Transition>
  );
}

Alert.defaultProps = {
  prefixCls: 'au-alert',
  closable: true,
  position: 'top-right',
  type: 'default',
}

export default Alert;