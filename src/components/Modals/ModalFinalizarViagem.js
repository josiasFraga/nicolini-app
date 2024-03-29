import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, Icon} from 'react-native-elements';

import GlobalStyle from '@styles/global';
import {Modal} from 'react-native';
import COLORS from '@constants/colors';
import FormFinalizarViagem from '@components/Forms/FormFinalizarViagem';

type Props = {};
export default class ModalFinalizarViagem extends Component<Props> {

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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
            <View
            style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                width: "95%",
                borderRadius: 30,
                backgroundColor: '#FFF'
            }}>
                <View style={GlobalStyle.secureMargin}>
                  <View style={[GlobalStyle.row, {justifyContent: 'space-between', alignItems: 'center'}]}>
                    <View style={{flex: 1}}>
                    </View>
                    <View style={{flex: 4}}>                        
                      <Text style={[GlobalStyle.modalTitle, GlobalStyle.textCenter]}>Finalizando a viagem</Text>
                    </View>
                    
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                        onPress={() => this.props.setModalVisible(false)}>
                          <Icon
                              name="closecircleo"
                              type="antdesign"
                              color={COLORS.quaternary}
                              size={30}
                              //onPress={() => Actions[cenaToOpen].call()}
                              containerStyle={{backgroundColor: 'transparent'}}
                          />
                        </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Qual foi a KM final?</Text>
                  <Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual o KM do Odômetro no final da viagem?</Text>
                  <FormFinalizarViagem />
                </View>

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
