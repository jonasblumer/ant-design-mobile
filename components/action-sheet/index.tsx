/* tslint:disable:jsx-no-multiline-js */
import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from 'rmc-dialog';
import classnames from 'classnames';
import getDataAttr from '../_util/getDataAttr';
import TouchFeedback from 'rmc-feedback';

const NORMAL = 'NORMAL';
const SHARE = 'SHARE';
function noop() { }
const queue: any[] = [];

function createActionSheet(flag, config, callback) {
  const props = {
    prefixCls: 'am-action-sheet',
    cancelButtonText: '取消',
    ...config,
  };
  const { prefixCls, className, transitionName, maskTransitionName, maskClosable = true } = props;

  let div: any = document.createElement('div');
  document.body.appendChild(div);

  queue.push(close);

  function close() {
    if (div) {
      ReactDOM.unmountComponentAtNode(div);
      div.parentNode.removeChild(div);
      div = null;
      const index = queue.indexOf(close);
      if (index !== -1) {
        queue.splice(index, 1);
      }
    }
  }

  function cb(index, rowIndex = 0) {
    const res = callback(index, rowIndex);
    if (res && res.then) {
      res.then(() => {
        close();
      });
    } else {
      close();
    }
  }

  const { title, message, options, destructiveButtonIndex, cancelButtonIndex, cancelButtonText } = props;
  const titleMsg = [
    title ? <h3 key="0" className={`${prefixCls}-title`}>{title}</h3> : null,
    message ? <div key="1" className={`${prefixCls}-message`}>{message}</div> : null,
  ];
  let children: React.ReactElement<any> | null = null;
  let mode = 'normal';
  switch (flag) {
    case NORMAL:
      mode = 'normal';
      children = (<div {...getDataAttr(props)}>
        {titleMsg}
        <div className={`${prefixCls}-button-list`} role="group">
          {options.map((item, index) => {
            const itemProps = {
              className: classnames(`${prefixCls}-button-list-item`, {
                [`${prefixCls}-destructive-button`]: destructiveButtonIndex === index,
                [`${prefixCls}-cancel-button`]: cancelButtonIndex === index,
              }),
              onClick: () => cb(index),
              role: 'button',
            };
            let bItem = (
              <TouchFeedback key={index} activeClassName={`${prefixCls}-button-list-item-active`}>
                <div {...itemProps}>{item}</div>
              </TouchFeedback>
            );
            if (cancelButtonIndex === index || destructiveButtonIndex === index) {
              bItem = (
                <TouchFeedback key={index} activeClassName={`${prefixCls}-button-list-item-active`}>
                  <div {...itemProps}>
                    {item}
                    {cancelButtonIndex === index ?
                    <span className={`${prefixCls}-cancel-button-mask`} /> : null}
                  </div>
                </TouchFeedback>
              );
            }
            return bItem;
          })}
        </div>
      </div>);
      break;
    case SHARE:
      mode = 'share';
      const multipleLine = options.length && Array.isArray(options[0]) || false;
      const createList = (item, index, rowIndex = 0) => (
        <div className={`${prefixCls}-share-list-item`} role="button" key={index} onClick={() => cb(index, rowIndex)}>
          <div className={`${prefixCls}-share-list-item-icon`}>{item.icon}</div>
          <div className={`${prefixCls}-share-list-item-title`}>{item.title}</div>
        </div>
      );
      children = (<div {...getDataAttr(props)}>
        {titleMsg}
        <div className={`${prefixCls}-share`}>
          {multipleLine ? options.map((item, index) => (
            <div key={index} className={`${prefixCls}-share-list`}>
              {item.map((ii, ind) => createList(ii, ind, index))}
            </div>
          )) : (
            <div className={`${prefixCls}-share-list`}>
                {options.map((item, index) => createList(item, index))}
            </div>
          )}
          <TouchFeedback activeClassName={`${prefixCls}-share-cancel-button-active`}>
            <div className={`${prefixCls}-share-cancel-button`} role="button" onClick={() => cb(-1)}>
              {cancelButtonText}
            </div>
          </TouchFeedback>
        </div>
      </div>);
      break;
    default:
      break;
  }

  const rootCls = classnames(`${prefixCls}-${mode}`, className);

  ReactDOM.render(
    <Dialog
      visible
      title=""
      footer=""
      prefixCls={prefixCls}
      className={rootCls}
      transitionName={transitionName || `am-slide-up`}
      maskTransitionName={maskTransitionName || `am-fade`}
      onClose={() => cb(cancelButtonIndex || -1)}
      maskClosable={maskClosable}
      wrapProps={props.wrapProps || {}}
    >
      {children}
    </Dialog>,
    div,
  );

  return {
    close,
  };
}

export default {
  showActionSheetWithOptions(config, callback = noop) {
    createActionSheet(NORMAL, config, callback);
  },
  showShareActionSheetWithOptions(config, callback = noop) {
    createActionSheet(SHARE, config, callback);
  },
  close() {
    queue.forEach(q => q());
  },
};
