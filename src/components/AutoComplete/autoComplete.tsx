import React, { FC, useState, ChangeEvent, ReactElement, useEffect, KeyboardEvent, useRef, CSSProperties } from 'react';
import classnames from 'classnames';

import Input, { InputProps } from '../Input/input';
import Icon from '../Icon/icon';
import useDebounce from '../../Hooks/useDebounce';
import useClickOutside from '../../Hooks/useClickOutside';
import Transition from '../Transition/transition';

export interface DataSourceObject {
  value: string;
}

export type DataSourceType<T = {}> = T & DataSourceObject;

export interface AutoCompletePropsType extends Omit<InputProps, 'onSelect'> {
  /** 根据输入内容获取可填充值，支持异步返回 */
  fetchSuggestions: (keyword: string) => DataSourceType[] | Promise<DataSourceType[]>;
  /** 点击下拉项触发的回调事件 */
  onSelect?: (item: DataSourceType) => void;
  /** 自定义渲染下拉项 */
  renderOption?: (item: DataSourceType) => ReactElement;
}

export interface AutoCompleteProps extends AutoCompletePropsType {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
}

export const AutoComplete: FC<AutoCompleteProps> = ({ prefixCls, className, style, value, fetchSuggestions, onSelect, renderOption, ...restProps}) => {
  const [inputValue, setInputValue] = useState(value as string);
  const [suggestions, setSuggestions] = useState<DataSourceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const triggerSearch = useRef(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(inputValue, 500);
  useClickOutside(componentRef, () => {
    setShowDropdown(false);
    setSuggestions([]);
  });
  useEffect(() => {
    if (debouncedValue && triggerSearch.current) {
      const results = fetchSuggestions(debouncedValue);
      if (results instanceof Promise) {
        setLoading(true);
        results.then(data => {
          setLoading(false);
          setShowDropdown(true);
          setSuggestions(data);
        }).catch(e => {
          setLoading(false);
          setShowDropdown(false);
        });
      } else {
        setShowDropdown(true);
        setSuggestions(results);
      }
    } else {
      setShowDropdown(false);
      setSuggestions([]);
    }
    setHighlightIndex(-1);
  }, [debouncedValue, fetchSuggestions]);
  const highlight = (index: number) => {
    if (index < 0) index += suggestions.length;
    if (index >= suggestions.length) {
      index = index % suggestions.length;
    }
    setHighlightIndex(index);
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    triggerSearch.current = true;
    const value = e.target.value;
    setInputValue(value);
  }
  const handleSelect = (item: DataSourceType) => {
    triggerSearch.current = false;
    setInputValue(item.value);
    setShowDropdown(false);
    setSuggestions([]);
    if (onSelect) {
      onSelect(item);
    }
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch(e.keyCode) {
      case 13: // Enter
        if (suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex]);
        }
        break;
      case 38: // UP
        highlight(highlightIndex - 1);
        break;
      case 40: // DOWN
        highlight(highlightIndex + 1);
        break;
      case 27: // ESC
        setShowDropdown(false);
        setSuggestions([]);
        break;
      default:
        break;
    }
  }
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value;
  }
  const generateDropdown = () => {
    return (
      <Transition
        in={showDropdown || loading}
        animation="zoom-in-top"
        timeout={300}
        onExited={() => setSuggestions([])}
      >
        <ul className={`${prefixCls}-suggestion-list`}>
          {loading && <div className={`${prefixCls}-loading`}><Icon icon="spinner" spin /></div>}
          {suggestions.map((item, index) => {
            const sCls = classnames(`${prefixCls}-suggestion-item`, {
              'is-active': index === highlightIndex,
            });
            return (
              <li className={sCls} key={index} onClick={() => handleSelect(item)}>
                {renderTemplate(item)}
              </li>
            );
          })}
          {suggestions.length === 0 && !loading && <li className={`${prefixCls}-is-empty`}>没有匹配到数据</li>}
        </ul>
      </Transition>
    );
  }
  const cls = classnames(prefixCls, {}, className);
  return (
    <div className={cls} style={style} ref={componentRef}>
      <Input value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} {...restProps} />
      {generateDropdown()}
    </div>
  );
}

AutoComplete.defaultProps = {
  prefixCls: 'au-auto-complete',
}

export default AutoComplete;
