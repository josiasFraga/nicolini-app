import React, {Component} from 'react';
import {StyleSheet, View, ScrollView } from 'react-native';
import {Text, Icon} from 'react-native-elements';

import {Actions} from 'react-native-router-flux';


import ModalAbastecimento from '@components/Modals/ModalAbastecimento';

import GlobalStyle from '@styles/global';
import COLORS from '@constants/colors';

import {TouchableOpacity, Alert, Linking } from 'react-native';



type Props = {};
export default class ModalInfoAbastecimento extends Component<Props> {

  state = {
      modalAbastecimentoVisible: false,
  };

  constructor(props) {
    super(props);
    this.setModalAbastecimentoVisible = this.setModalAbastecimentoVisible.bind(this);
  }

  componentDidMount() {
    if ( this.props.loadData ) {
      //this.props.carregaDadosViagem();
    } 
  }

  setModalAbastecimentoVisible(visible) {
    this.setState({modalAbastecimentoVisible: visible});
  }


  render() {

    return (

        <View
          style={{
            flex: 1,
          }}>

          <ModalAbastecimento
            modalVisible={this.state.modalAbastecimentoVisible}
            setModalVisible={this.setModalAbastecimentoVisible}
            dados={this.props.item.Abastecimento}
          />
            <ScrollView style={styles.scrollView}>
              <View style={GlobalStyle.secureMargin}>

                <View style={GlobalStyle.spaceSmall} />

                <View>
                    <Text style={GlobalStyle.modalTitle}>Resumo do Abastecimento</Text>
                </View>

                <View style={GlobalStyle.spaceExtraSmall} />

                <View style={GlobalStyle.row}>
                    <Text style={GlobalStyle.textCenterVertically}>Posto: </Text>
                    <Text style={[GlobalStyle.title, GlobalStyle.textCenterVertically]}> {this.props.item.Abastecimento['posto']}</Text>
                </View>

                <View style={GlobalStyle.row}>
                    <Text style={GlobalStyle.textCenterVertically}>Data: </Text>
                    <Text style={[GlobalStyle.title, GlobalStyle.textCenterVertically]}> {this.props.item.Abastecimento['data_abastecimento_br']}</Text>
                </View>

                <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between'}]}>
                  <View style={GlobalStyle.row}>
                      <Text style={GlobalStyle.textCenterVertically}>Valor: </Text>
                      <Text style={[GlobalStyle.title, GlobalStyle.textCenterVertically]}> R${this.props.item.Abastecimento['valor_tanque']}</Text>
                  </View>
                  <View style={GlobalStyle.row}>
                      <Text style={GlobalStyle.textCenterVertically}>Litragem: </Text>
                      <Text style={[GlobalStyle.title, GlobalStyle.textCenterVertically]}> {this.props.item.Abastecimento['litragem']}l</Text>
                  </View>
                </View>

                <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between'}]}>
                  <View style={GlobalStyle.row}>
                      <Text style={GlobalStyle.textCenterVertically}>Valor (Arla): </Text>
                      <Text style={[GlobalStyle.title, GlobalStyle.textCenterVertically]}> R${this.props.item.Abastecimento['valor_arla_br']}</Text>
                  </View>
                  <View style={GlobalStyle.row}>
                      <Text style={GlobalStyle.textCenterVertically}>Litragem (Arla): </Text>
                      <Text style={[GlobalStyle.title, GlobalStyle.textCenterVertically]}> {this.props.item.Abastecimento['litragem_arla']}l</Text>
                  </View>
                </View>
                
                <View style={GlobalStyle.spaceSmall} />

                <View style={GlobalStyle.row}>
                    <Text style={[GlobalStyle.title, GlobalStyle.textCenterVertically]}>Valor Total: </Text>
                    <Text style={[GlobalStyle.title, GlobalStyle.textCenterVertically]}> R$ {this.props.item.Abastecimento['valor_total']}</Text>
                </View>

                <View style={GlobalStyle.spaceBig} />

                <View style={[GlobalStyle.row, {alignContent: 'center', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                    <View style={{flex: 1}}>
                    </View>
                          
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(this.props.item.Abastecimento.anexo).catch((err) => console.error('An error occurred', err));
                      }}
                    >
                    <View style={{flex: 1, marginRight: 60}}>
                        <View style={[GlobalStyle.row, {justifyContent: 'center'}]}>
                            <Icon
                                name="attach-file"
                                type="material"
                                color={COLORS.primary}
                                size={30}
                                //onPress={() => Actions[cenaToOpen].call()}
                                containerStyle={{backgroundColor: 'transparent'}}
                            />
                        </View>
                        <Text style={[{color: COLORS.primary}, GlobalStyle.textCenter]}>Anexo</Text>
                    </View>
                    
                    </TouchableOpacity>
                          
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalAbastecimentoVisible(true)
                      }}
                    >
                    <View style={{flex: 1, marginLeft: 60}}>
                        <View style={[GlobalStyle.row, {justifyContent: 'center'}]}>
                            <Icon
                                name="edit"
                                type="feather"
                                color={COLORS.primary}
                                size={30}
                                //onPress={() => Actions[cenaToOpen].call()}
                                containerStyle={{backgroundColor: 'transparent'}}
                            />
                        </View>
                        <Text style={[{color: COLORS.primary}, GlobalStyle.textCenter]}>Alterar</Text>
                    </View>
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                    </View>
                </View>

                
              </View>
              
              <View style={GlobalStyle.spaceBig} />

              <View style={GlobalStyle.secureMargin}>
                  <TouchableOpacity            
                  onPress={() => Actions.pop()}
                  style={GlobalStyle.defaultButton}>
                  <Text style={GlobalStyle.defaultButtonText}>Fechar</Text>
                  </TouchableOpacity>
              </View>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonAddCartTotal: {
    color: '#999',
  }
});
