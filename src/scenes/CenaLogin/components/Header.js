import React from 'react';
import {
    View,
  } from 'react-native';

import BackButton from '@components/Buttons/BackButton';
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
              height: CONFIG.ORIGINAL_HEADER_HEIGHT,
              backgroundColor: GlobalStyle.secondary
            },
          ]}>
          <View style={GlobalStyle.row}>
            <View style={{flex: 1}}>
              <BackButton backScene='pop' />
            </View>
            <View style={{flex: 6}} />
            <View style={{flex: 1}} />
          </View>
        </View>
    );
  }
}
