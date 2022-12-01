import React from 'react';
import {Icon} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import COLORS from '@constants/colors';

type Props = {};
export default class EditButton extends React.Component<Props> {
  render() {
    let cenaToOpen = this.props.newScene;
    let newSceneType = this.props.newSceneType;
    let newSceneOpenFunction = this.props.newSceneOpenFunction;

    return (
      <Icon
        name="edit"
        type="AntDesign"
        color={
          typeof this.props.iconColor != 'undefined'
            ? this.props.iconColor
            : COLORS.backButton
        }
        size={30}
        onPress={() => {
          if ( newSceneType != 'modal' )
            Actions[cenaToOpen].call({item: item});
          else
            newSceneOpenFunction(true);
        }}
        containerStyle={{backgroundColor: 'transparent'}}
      />
    );
  }
}
