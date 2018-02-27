/* tslint:disable:jsx-no-multiline-js */
import * as React from 'react';
import RNStepsItem from './StepsItem.native';
import { View, StyleSheet } from 'react-native';
import StepStyle, { IStepsStyle } from './style/index.native';

export interface StepsProps {
  direction?: 'vertical' | 'horizontal';
  current?: number;
  width?: number;
  size?: string;
  finishIcon?: string;
  styles?: any;
}

export interface IStepsNativeProps extends StepsProps {
  styles?: IStepsStyle;
}

const StepStyles = StyleSheet.create<any>(StepStyle);

export default class Steps extends React.Component<IStepsNativeProps, any> {
  static Step: any;

  static defaultProps = {
    direction: '',
    styles: StepStyles,
  };

  constructor(props) {
    super(props);
    this.state = {
      wrapWidth: 0,
    };
  }

  onLayout = (e) => {
    this.setState({
      wrapWidth: e.nativeEvent.layout.width,
    });
  }

  render() {
    const children = this.props.children as any;
    const direction = this.props.direction === 'horizontal' ? 'row' : 'column';
    const styles = this.props.styles!;
    return (
      <View style={{ flexDirection: direction }} onLayout={(e) => {this.onLayout(e); }}>
      {
        React.Children.map(children, (ele: any, idx) => {
          let errorTail = -1;
          if (idx < (children as Array<any>).length - 1) {
            const status = children[idx + 1].props.status;
            if (status === 'error') {
              errorTail = idx;
            }
          }
          return React.cloneElement(ele, {
            index: idx,
            last: idx === (children as Array<any>).length - 1,
            direction: this.props.direction,
            current: this.props.current,
            width: 1 / ((children as Array<any>).length - 1) * this.state.wrapWidth,
            size: this.props.size,
            finishIcon: this.props.finishIcon,
            errorTail,
            styles,
          });
        })
      }
      </View>
    );
  }
}

Steps.Step = RNStepsItem;
