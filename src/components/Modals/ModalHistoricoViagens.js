import React, {Component} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {Text, ListItem} from 'react-native-elements';

import NumberFormat from 'react-number-format';

import GlobalStyle from '@styles/global';

import {Modal, TouchableHighlight, Alert} from 'react-native';
import {connect} from 'react-redux';


type Props = {};
class ModalHistoricoViagens extends Component<Props> {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.modalVisible && !prevProps.modalVisible) {
      this.props.buscaViagens();
    }
  }
  renderItem = ({item}) => (
    <ListItem
      title={
        <View style={[GlobalStyle.row, {justifyContent: 'space-between'}]}>
          <Text style={GlobalStyle.listItemTitle}>{item.Viagem.destino}</Text>
          <Text style={[GlobalStyle.listItemTitle, {fontWeight: 'normal', color: '#999'}]}>{item.Viagem.data_viagem}</Text>
        </View>
      }
      keyExtractor={(item, index) => index.toString()}
      subtitle={
        <View>
          <View style={[GlobalStyle.row]}>
            <Text style={[GlobalStyle.listItemSubtitleText, {flex: 1}]}>
              Frete
            </Text>
            <NumberFormat
              value={item.Viagem.valor_frete}
              displayType={'text'}
              prefix={'R$ '}
              decimalScale={2}
              fixedDecimalScale={true}
              decimalSeparator={','}
              thousandSeparator={'.'}
              renderText={value => (
                <Text style={styles.buttonAddCartTotal}>{value}</Text>
              )}
            />
          </View>

          <View style={[GlobalStyle.row]}>
            <Text style={[GlobalStyle.listItemSubtitleText, {flex: 1}]}>
              Comissão
            </Text>
            <NumberFormat
              value={item.Viagem._comissao}
              displayType={'text'}
              prefix={'R$ '}
              decimalScale={2}
              fixedDecimalScale={true}
              decimalSeparator={','}
              thousandSeparator={'.'}
              renderText={value => (
                <Text style={styles.buttonAddCartTotal}>{value}</Text>
              )}
            />
          </View>

        </View>
      }
      bottomDivider
    />
  );

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        presentationStyle="overFullScreen">
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.props.viagens}
            renderItem={this.renderItem}
            ListHeaderComponent={
              <View>
                <Text style={GlobalStyle.modalTitle}>Histórico de Viagens</Text>
              </View>
            }
          />
          <View style={GlobalStyle.secureMargin}>
            <TouchableHighlight
              onPress={() => {
                this.props.setModalVisible(!this.props.modalVisible);
              }}
              style={GlobalStyle.clearCircleButton}>
              <Text style={GlobalStyle.clearCircleButtonText}>
                VOLTAR
              </Text>
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
  viagens: state.appReducer.viagens,
})

const mapDispatchToProps = dispatch => ({
  buscaViagens() {
    dispatch({
      type: 'BUSCA_VIAGENS',
      payload: {}
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalHistoricoViagens);