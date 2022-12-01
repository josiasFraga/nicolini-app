import React, {Component} from 'react';
import {StyleSheet, View, FlatList, ScrollView } from 'react-native';
import {Text, Icon, ListItem} from 'react-native-elements';

import {Actions} from 'react-native-router-flux';

import NumberFormat from 'react-number-format';

import GlobalStyle from '@styles/global';
import COLORS from '@constants/colors';

import {TouchableOpacity, Alert, Linking } from 'react-native';
import { connect } from 'react-redux';


type Props = {};
export class ModalInfoViagem extends Component<Props> {

  componentDidMount() {
    if ( this.props.loadData ) {
      let trip_id = this.props.trip_id != 'undefined' ? this.props.trip_id : '';
      this.props.carregaDadosViagem(trip_id);
    } 
  }

  renderAbastecimentos = ({item}) => (
    <ListItem
      title={item.titulo}
      titleStyle={{fontWeight: 'bold', color: '#333'}}
      subtitle={
        <View style={GlobalStyle.row}>
            <NumberFormat
              value={item.litragem}
              displayType={'text'}
              suffix={' L'}
              decimalScale={2}
              fixedDecimalScale={true}
              decimalSeparator={','}
              thousandSeparator={'.'}
              renderText={value => <Text style={styles.itemDesc}>{value}</Text>}
            />

            <NumberFormat
              value={item.valor}
              displayType={'text'}
              prefix={'R$ '}
              decimalScale={2}
              fixedDecimalScale={true}
              decimalSeparator={','}
              thousandSeparator={'.'}
              renderText={value => (
                <Text style={styles.itemDesc}> | {value}</Text>
              )}
            />
        </View>
      }
      rightElement={

        <TouchableOpacity
          onPress={() => {
            Linking.openURL(item.anexo).catch((err) => console.error('An error occurred', err));
          }}
        >
          <Icon
            name="attach-file"
            type="material"
            color={COLORS.primary}
            size={30}
            //onPress={() => Actions[cenaToOpen].call()}
            containerStyle={{backgroundColor: 'transparent'}}
          />
        </TouchableOpacity>

      }
      bottomDivider
    />
  );

  renderDespesas = ({item}) => (
    <ListItem
      title={item.titulo_despesa}
      titleStyle={{fontWeight: 'bold', color: '#333'}}
      subtitle={
        <View style={GlobalStyle.row}>
          <NumberFormat
            value={item.valor}
            displayType={'text'}
            prefix={'R$ '}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator={','}
            thousandSeparator={'.'}
            renderText={value => <Text style={styles.itemDesc}>{value}</Text>}
          />
        </View>
      }
      rightElement={

        <TouchableOpacity
          onPress={() => {
            Linking.openURL(item.anexo).catch((err) => console.error('An error occurred', err));
          }}
        >
          <Icon
            name="attach-file"
            type="material"
            color={COLORS.primary}
            size={30}
            //onPress={() => Actions[cenaToOpen].call()}
            containerStyle={{backgroundColor: 'transparent'}}
          />
        </TouchableOpacity>

      }
      bottomDivider
    />
  );

  render() {
    if ( this.props.loadData ) {

      return (
        <View
          style={{
            flex: 1,
          }}>
            <ScrollView style={styles.scrollView}>
              <View style={GlobalStyle.secureMargin}>

                <View style={GlobalStyle.spaceSmall} />

                <View>
                    <Text style={GlobalStyle.modalTitle}>Resumo de Viagem</Text>
                </View>

                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{fontWeight: "bold", color: COLORS.quaternary}}>Início: {this.props.viagem['Viagem']['data_viagem_ini']}</Text>
                </View>

                <View>
                    <Text style={[GlobalStyle.title, {fontWeight: 'bold'}]}>{this.props.viagem['Viagem']['destino']}</Text>
                </View>

                <View style={GlobalStyle.spaceSmall} />

                  <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                      <Text style={{fontWeight: 'bold'}}>Frete</Text>
                      <Text style={{fontWeight: 'bold'}}>{this.props.viagem['Viagem']['valor_frete']}</Text>
                  </View>

                  <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                      <Text style={{fontWeight: 'bold'}}>Adiantamento</Text>
                      <Text style={{fontWeight: 'bold'}}>{this.props.viagem['Viagem']['valor_adiantamento']}</Text>
                  </View>

                  <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                      <Text style={{fontWeight: 'bold'}}>Saldo Adiantamento</Text>
                      <Text style={{fontWeight: 'bold'}}>{this.props.viagem['Viagem']['saldo_viagem']}</Text>
                  </View>

                  <View style={[GlobalStyle.spaceSmall]} />

                  <View>
                      
                      <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.props.viagem.Abastecimento}
                        renderItem={this.renderAbastecimentos}
                        ListEmptyComponent={
                          <View>
                            <View style={[GlobalStyle.spaceSmall]} />
                            <Text  style={[GlobalStyle.textSmall, GlobalStyle.textCenter]}>Nenhum abastecimento registrado.</Text>
                          </View>
                        }
                        ListHeaderComponent={
                          <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                              <Text style={{fontWeight: 'bold'}}>Abastecimentos</Text>
                              <Text style={{fontWeight: 'bold'}}>{this.props.viagem['Viagem']['total_abastecimentos']}</Text>
                          </View>
                        }
                      />
                  </View>

                  <View style={[GlobalStyle.spaceSmall]} />

                  <View>                    
                      <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.props.viagem.Despesa}
                        renderItem={this.renderDespesas}
                        ListEmptyComponent={
                          <View>
                            <View style={[GlobalStyle.spaceSmall]} />
                            <Text style={GlobalStyle.textSmall}>Nenhuma despesa registrada.</Text>
                          </View>
                        }
                        ListHeaderComponent={
                          <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                              <Text style={{fontWeight: 'bold'}}>Despesas</Text>
                              <Text style={{fontWeight: 'bold'}}>{this.props.viagem['Viagem']['total_despesas']}</Text>
                          </View>
                        }
                      />
                  </View>

                  <View style={GlobalStyle.spaceBig} />

                  <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                      <View style={{flex: 1, marginRight: 10}}>
                          <View style={[GlobalStyle.row, {justifyContent: 'center'}]}>
                              <Icon
                                  name="local-gas-station"
                                  type="material-icons"
                                  color={COLORS.primary}
                                  size={30}
                                  //onPress={() => Actions[cenaToOpen].call()}
                                  containerStyle={{backgroundColor: 'transparent'}}
                              />
                              <View style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginLeft: 10}}>
                                  <Text style={[GlobalStyle.title2, {fontWeight: 'bold'}]}>{this.props.viagem['Viagem']['km_l']}</Text>
                              </View>
                          </View>
                          <Text style={[{color: COLORS.primary}, GlobalStyle.textCenter]}>Média de Consumo</Text>
                      </View>
                      <View style={{flex: 1, marginLeft: 10}}>
                          <View style={[GlobalStyle.row, {justifyContent: 'center'}]}>
                              <Icon
                                  name="clock"
                                  type="feather"
                                  color={COLORS.primary}
                                  size={30}
                                  //onPress={() => Actions[cenaToOpen].call()}
                                  containerStyle={{backgroundColor: 'transparent'}}
                              />
                              <View style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginLeft: 10}}>
                                  <Text style={[GlobalStyle.title2, {fontWeight: 'bold'}]}>{this.props.viagem['Viagem']['duracao_dias'] > 0 ? this.props.viagem['Viagem']['duracao_dias']+" dia(s)" : ''} {this.props.viagem['Viagem']['duracao_horas']}</Text>
                              </View>
                          </View>
                          <Text style={[{color: COLORS.primary}, GlobalStyle.textCenter]}>Duração</Text>
                      </View>
                  </View>
              </View>
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
    return (

        <View
          style={{
            flex: 1,
          }}>
            <ScrollView style={styles.scrollView}>
              <View style={GlobalStyle.secureMargin}>

                <View style={GlobalStyle.spaceSmall} />

                <View>
                    <Text style={GlobalStyle.modalTitle}>Resumo de Viagem</Text>
                </View>

                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{fontWeight: "bold", color: COLORS.quaternary}}>Início: {this.props.viagem['Viagem']['data_viagem_ini']}</Text>
                </View>

                <View>
                    <Text style={[GlobalStyle.title, {fontWeight: 'bold'}]}>{this.props.item['Viagem']['destino']}</Text>
                </View>

                <View style={GlobalStyle.spaceSmall} />

                <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                    <Text style={{fontWeight: 'bold'}}>Frete</Text>
                    <Text style={{fontWeight: 'bold'}}>{this.props.item['Viagem']['valor_frete']}</Text>
                </View>

                <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                    <Text style={{fontWeight: 'bold'}}>Adiantamento</Text>
                    <Text style={{fontWeight: 'bold'}}>{this.props.item['Viagem']['valor_adiantamento']}</Text>
                </View>

                <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                    <Text style={{fontWeight: 'bold'}}>Abastecimentos</Text>
                    <Text style={{fontWeight: 'bold'}}>{this.props.item['Viagem']['abastecimentos']}</Text>
                </View>

                <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                    <Text style={{fontWeight: 'bold'}}>Despesas</Text>
                    <Text style={{fontWeight: 'bold'}}>{this.props.item['Viagem']['despesas']}</Text>
                </View>

                <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                    <Text style={{fontWeight: 'bold'}}>Saldo Adiantamento</Text>
                    <Text style={{fontWeight: 'bold'}}>{this.props.item['Viagem']['saldo_viagem']}</Text>
                </View>

                <View style={GlobalStyle.spaceBig} />

                <View style={[GlobalStyle.row, {alignContent: 'space-between', justifyContent: 'space-between', paddingHorizontal: 15}]}>
                    <View style={{flex: 1, marginRight: 10}}>
                        <View style={[GlobalStyle.row, {justifyContent: 'center'}]}>                        
                            <Icon
                                name="local-gas-station"
                                type="material-icons"
                                color={COLORS.primary}
                                size={30}
                                //onPress={() => Actions[cenaToOpen].call()}
                                containerStyle={{backgroundColor: 'transparent'}}
                            />
                            <View style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginLeft: 10}}>
                                <Text style={[GlobalStyle.title2, {fontWeight: 'bold'}]}>{this.props.item['Viagem']['km_l']}</Text>
                            </View>
                        </View>
                        <Text style={[{color: COLORS.primary}, GlobalStyle.textCenter]}>Média de Consumo</Text>
                    </View>
                    <View style={{flex: 1, marginLeft: 10}}>
                        <View style={[GlobalStyle.row, {justifyContent: 'center'}]}>
                            <Icon
                                name="clock"
                                type="feather"
                                color={COLORS.primary}
                                size={30}
                                //onPress={() => Actions[cenaToOpen].call()}
                                containerStyle={{backgroundColor: 'transparent'}}
                            />
                            <View style={{alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginLeft: 10}}>
                                <Text style={[GlobalStyle.title2, {fontWeight: 'bold'}]}>{this.props.item['Viagem']['duracao']}</Text>
                            </View>
                        </View>
                        <Text style={[{color: COLORS.primary}, GlobalStyle.textCenter]}>Duração</Text>
                    </View>
                </View>
              </View>
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

const mapStateToProps = state => ({
  viagem: state.appReducer.dados_viagem,
  isLoading: state.appReducer.is_loading_viagem
});

const mapDispatchToProps = dispatch => ({
  carregaDadosViagem(trip_id) {
    dispatch({
      type: 'DADOS_VIAGEM',
      payload: {
        'trip_id': trip_id
      },
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalInfoViagem);
