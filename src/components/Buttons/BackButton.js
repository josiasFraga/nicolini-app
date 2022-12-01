import React from 'react';
import {Icon} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import COLORS from '@constants/colors';

type Props = {};
export default class BackButton extends React.Component<Props> {
  render() {
    let cenaToOpen = this.props.backScene;

    return (
      <Icon
        name="chevron-small-left"
        type="entypo"
        color={
          typeof this.props.iconColor != 'undefined'
            ? this.props.iconColor
            : COLORS.backButton
        }
        size={30}
        onPress={() => Actions[cenaToOpen].call()}
        containerStyle={{backgroundColor: 'transparent'}}
      />
    );
  }
}
