import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, TouchableHighlight} from 'react-native';
import {Text, Image, Icon} from 'react-native-elements';

import GlobalStyle from '@styles/global';
import {Modal} from 'react-native';
import COLORS from '@constants/colors';
import IMAGES from '@constants/images';

type Props = {};
export default class ModalPneus extends Component<Props> {

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        presentationStyle={'overFullScreen'}
        visible={this.props.modalVisible}
        onRequestClose={() => {
          //Alert.alert('Modal has been closed.');
        }}>
        <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#FFF'}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            
            <Image source={IMAGES.QUATRO_EIXOS} style={{ width: 110, height: 599 }} />

          </View>
          <View style={GlobalStyle.secureMargin}>
            
            <TouchableHighlight
            onPress={() => {
              this.props.setModalVisible(!this.props.modalVisible);
            }} style={{opacity: this.props.isRequesting ? .8 : 1}}  disabled={this.props.isRequesting}
            style={GlobalStyle.defaultButton}>
            <Text style={GlobalStyle.defaultButtonText}>Fechar</Text>
            </TouchableHighlight>
            
          </View>
        </View>
      </Modal>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roundedTop: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  text: {
    fontFamily: 'Mitr-Regular',
    lineHeight: 18,
  },
  textMedium: {
    fontFamily: 'Mitr-Medium',
    marginBottom: 3,
  },
  centerFully: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 7,
  },
  innerSpace: {
    padding: 15,
  },
  discountBox: {
    borderWidth: 0.5,
    borderColor: '#dfdfdf',
    padding: 15,
    borderRadius: 15,
    margin: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonVisitante: {
    marginTop: 15,
  },
  buttonCadastrarText: {
    textAlign: 'center',
    color: '#FFF',
  },
});
