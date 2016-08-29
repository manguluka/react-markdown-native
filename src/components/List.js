import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

class List extends Component {
  static childContextTypes = {
    type: React.PropTypes.string
  };

  getChildContext() {
    return {
      type: this.props.type
    };
  }

  render() {
    const { children, type } = this.props;

    return <View>{children}</View>;
  }
}

export default List
