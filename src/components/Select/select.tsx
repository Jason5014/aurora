import React, { FC, useState, useRef, FunctionComponentElement, createContext, CSSProperties, KeyboardEvent } from 'react';
import classnames from 'classnames';

import Transition from '../Transition/transition';
import Icon from '../Icon/icon';
import useClickOutside from '../../Hooks/useClickOutside';
import { SelectOptionProps } from './option';

export interface ISelectContext {
  selected: string[];
  multiple?: boolean;
  highlightIndex?: number;
  onSelect?: (select: string, isSelected: boolean, label?: string) => void;
}

export interface SelectOptionData {
  index: number;
  value: string;
  label: string;
}

export interface SelectPropsType {
  /** 是否允许多选 */
  multiple?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 指定默认选中的条目 可以是字符串或者字符串数组 */
  defaultValue?: string | string[];
  /** 指定选中的条目 可以是字符串或者字符串数组 */
  value?: string | string[];
  /** 选择框默认提示文字 */
  placeholder?: string;
  /** 下拉菜单显示隐藏时触发回调 */
  onVisibleChange?: (visible: boolean) => void;
  /** 选中值发生变化时触发回调 */
  onChange?: (selectedValue: string, selectedValues: string[]) => void;
}

export interface SelectProps extends SelectPropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const SelectContext = createContext<ISelectContext>({ selected: [] });

export const Select: FC<SelectProps> = ({ prefixCls, className, style, disabled, multiple, defaultValue, placeholder, onVisibleChange, onChange, children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHightlightIndex] = useState(-1);
  const [selectedValues, setSelectedValues] = useState<string[]>(Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []);
  const optionsRef = useRef<SelectOptionData[]>(selectedValues.map((v, i) => ({ index: i, value: v, label: v })));
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => {
    changeVisible(false);
  });
  const changeVisible = (visible: boolean) => {
    if (disabled) return;
    setShowDropdown(visible);
    setHightlightIndex(-1);
    if (onVisibleChange) {
      onVisibleChange(visible);
    }
  }
  const highlight = (index: number) => {
    const maxLength = optionsRef.current.length;
    index = (index + maxLength) % maxLength;
    setHightlightIndex(index);
  }
  const handleSelect = (selected: string, isSelected: boolean) => {
    let newSelectedValues: string[] = [];
    if (multiple) {
      newSelectedValues = isSelected ? selectedValues.filter(v => v !== selected) : [...selectedValues, selected];
    } else {
      newSelectedValues = isSelected ? [] : [selected];
      changeVisible(false);
    }
    setSelectedValues(newSelectedValues);
    if (onChange) {
      onChange(selected, selectedValues);
    }
  }
  const handleDelete = (deleteValue: string) => {
    setSelectedValues(selectedValues.filter(v => v !== deleteValue));
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('on key down', e.keyCode);
    switch(e.keyCode) {
      case 13: // Enter
        if (optionsRef.current[highlightIndex]) {
          const { value } = optionsRef.current[highlightIndex];
          const isSelected = selectedValues.includes(value);
          handleSelect(value, isSelected);
        }
        break;
      case 38: // UP
        highlight(highlightIndex - 1);
        break;
      case 40: // DOWN
        highlight(highlightIndex + 1);
        break;
      case 27: // ESC
        changeVisible(false);
        break;
      default:
        break;
    }
  }
  const renderSelectedValues = () => {
    const groupCls = classnames(`${prefixCls}-input-tags-group`, {
      'is-multiple': multiple,
    });
    return (
      <ul className={groupCls}>
        {placeholder && <span className={`${prefixCls}-input-placeholder${selectedValues.length === 0 ? '' : ' hidden'}`}>{placeholder}</span>}
        {optionsRef.current.map(option => {
          const checked = selectedValues.includes(option.value);
          const tagCls = classnames(`${prefixCls}-input-tag`);
          return (
            <Transition in={checked} timeout={300} animation="zoom-in-left" key={option.value} >
              <li className={tagCls} >
                {option.label}
                {multiple && <Icon icon="times" onClick={() => handleDelete(option.value)} />}
              </li>
            </Transition>
          );
        })}
      </ul>
    )
  }
  const generateOptions = () => {
    const dpCls = classnames(`${prefixCls}-dropdown`, {
      'is-multiple': multiple,
    });
    optionsRef.current = [];
    return (
      <Transition in={showDropdown} timeout={300} animation="zoom-in-top">
        <ul className={dpCls}>
          {React.Children.map(children, (child, index) => {
            const childElement = child as FunctionComponentElement<SelectOptionProps>;
            if (childElement.type.displayName !== 'SelectOption') {
              console.warn('TypeError: Select got a child which is not a select option component.');
              return;
            }
            optionsRef.current.push({
              index,
              value: childElement.props.value,
              label: childElement.props.label || childElement.props.value,
            });
            return React.cloneElement(childElement, {
              index,
            });
          })}
        </ul>
      </Transition>
    );
  }
  const selectContext: ISelectContext = {
    selected: selectedValues,
    multiple,
    highlightIndex,
    onSelect: handleSelect,
  };
  const cls = classnames(prefixCls, {
    'is-opened': showDropdown,
  }, className);
  const inputCls = classnames(`${prefixCls}-input`, {
    'is-disabled': disabled,
    'is-focus': showDropdown,
  });
  return (
    <div className={cls} style={style} tabIndex={0} ref={containerRef} onKeyDown={handleKeyDown}>
      <div className={inputCls} onClick={() => changeVisible(true)}>
        {renderSelectedValues()}
        <span className={`${prefixCls}-input-arrow`} ><Icon icon="angle-down" /></span>
      </div>
      <SelectContext.Provider value={selectContext}>
        {generateOptions()}
      </SelectContext.Provider>
    </div>
  );
}

Select.defaultProps = {
  prefixCls: 'au-select',
  defaultValue: [],
}

export default Select;
