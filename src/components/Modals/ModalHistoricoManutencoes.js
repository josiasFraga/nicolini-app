import React, {Component} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {Text, ListItem} from 'react-native-elements';
import {connect} from 'react-redux';

import GlobalStyle from '@styles/global';


import {Modal, TouchableHighlight, Alert} from 'react-native';

type Props = {};
class ModalHistoricoManutencoes extends Component<Props> {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.modalVisible && !prevProps.modalVisible) {
      this.props.buscaManutencoes();
    }
  }

  renderItem = ({item}) => (
    <ListItem
      title={item.Manutencao.titulo}
      keyExtractor={(item, index) => index.toString()}
      subtitle={
        <View>
          <Text style={GlobalStyle.listItemSubtitleText}>KM {item.Manutencao.km}</Text>
          <Text style={GlobalStyle.listItemSubtitleText}>
            Valor: {item.Manutencao.valor}
          </Text>
        </View>
      }
      titleStyle={GlobalStyle.listItemTitle}
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
            data={this.props.manutencoes}
            renderItem={this.renderItem}
            ListHeaderComponent={
              <View>
                <Text style={GlobalStyle.modalTitle}>
                  Histórico de Manutenções
                </Text>
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
});


const mapStateToProps = state => ({
  manutencoes: state.appReducer.manutencoes,
})
const mapDispatchToProps = dispatch => ({
  buscaManutencoes() {
    dispatch({
      type: 'BUSCA_MANUTENCOES',
      payload: {}
    });
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalHistoricoManutencoes)