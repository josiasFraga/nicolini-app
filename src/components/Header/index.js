import React from 'react';
import {
    View,
    Text
  } from 'react-native';

import BackButton from '@components/Buttons/BackButton';
import NewButton from '@components/Buttons/NewButton';
import EditButton from '@components/Buttons/EditButton';
import GlobalStyle from '@styles/global';
import CONFIG from '@constants/configs';


type Props = {};
export default class Header extends React.Component<Props> {
  render() {
    return (
        <View
          style={[
            GlobalStyle.header,
            GlobalStyle.paddingStatusBar,
            {
              height: CONFIG.ORIGINAL_HEADER_HEIGHT
            },
            this.props.styles
          ]}>
          <View style={GlobalStyle.row}>
            <View style={{flex: 1}}>
              {this.props.backButton &&(
                <BackButton backScene='pop' iconColor={this.props.iconColor} />
              )}
            </View>
            <View style={{flex: 6}}><Text style={[GlobalStyle.pageTitle, this.props.titleStyle]}>{this.props.titulo}</Text></View>
            <View style={{flex: 1}}>
              {this.props.righElement && this.props.righElement == 'new' && this.props.newSceneType == 'modal' && (
                <NewButton newSceneOpenFunction={this.props.functionOpenNewScene} newSceneType="modal" iconColor={this.props.iconColor} />
              )}

              {this.props.righElement && this.props.righElement == 'edit' && this.props.newSceneType == 'modal' && (
                <EditButton newSceneOpenFunction={this.props.functionOpenNewScene} newSceneType="modal" iconColor={this.props.iconColor} />
              )}
            </View>
          </View>
        </View>
    );
  }
}
