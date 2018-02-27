import * as React from 'react';
import classnames from 'classnames';
import List from '../list';
import Radio from './Radio';
import { RadioItemProps as BasePropsType } from './PropsType';

export interface RadioItemProps extends BasePropsType {
  prefixCls?: string;
  listPrefixCls?: string;
  className?: string;
}

const ListItem = List.Item;
function noop() { }

export default class RadioItem extends React.Component<RadioItemProps, any> {
  static defaultProps = {
    prefixCls: 'am-radio',
    listPrefixCls: 'am-list',
    radioProps: {},
  };

  render() {
    const { listPrefixCls, onChange, disabled, radioProps, onClick, ...otherProps } = this.props;
    const { prefixCls, className, children } = otherProps;
    const wrapCls = classnames(`${prefixCls}-item`, className, {
      [`${prefixCls}-item-disabled`]: disabled === true,
    });

    // Note: if not omit `onChange`, it will trigger twice on check listitem

    if (!disabled) {
      (otherProps as any).onClick = onClick || noop;
    }

    const extraProps: any = {};
    ['name', 'defaultChecked', 'checked', 'onChange', 'disabled'].forEach(i => {
      if (i in this.props) {
        extraProps[i] = this.props[i];
      }
    });

    return (
      <ListItem
        {...otherProps}
        prefixCls={listPrefixCls}
        className={wrapCls}
        extra={<Radio {...radioProps} {...extraProps} />}
      >
        {children}
      </ListItem>
    );
  }
}
