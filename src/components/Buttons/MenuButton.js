import React from 'react';
import {Icon} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import COLORS from '@constants/colors';
import { View } from 'react-native';

type Props = {};
export default class MenuButton extends React.Component<Props> {
  render() {

    return (
      <View>

      </View>
    );
  }
}
/*
      <Icon
        name="menu"
        type="feather"
        color={
          typeof this.props.iconColor != 'undefined'
            ? this.props.iconColor
            : COLORS.quaternary
        }
        size={40}
        //onPress={() => Actions[cenaToOpen].call()}
        containerStyle={{backgroundColor: 'transparent'}}
      />*/