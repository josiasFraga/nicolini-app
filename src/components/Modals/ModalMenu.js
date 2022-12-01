import React, {Component} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {Icon, Text, ListItem} from 'react-native-elements';
import {Actions, ActionConst} from 'react-native-router-flux';

import GlobalStyle from '@styles/global';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {Modal, TouchableHighlight, Alert} from 'react-native';

type Props = {};
export default class ModalMenu extends Component<Props> {
  MENU = [
    {
      titulo: 'Abastecimento',
      icon: 'gas-station',
      iconType: 'material-community',
      bCallback: () => {
        this.props.setModalVisible(!this.props.modalVisible);
        Actions.abastecimento()
      },
    },
    {
      titulo: 'Despesa',
      icon: 'attach-money',
      iconType: 'material',
      bCallback: () => {
        this.props.setModalVisible(!this.props.modalVisible);
        Actions.despesa()
      },
    },
    {
      titulo: 'Manutenção',
      icon: 'wrench',
      iconType: 'foundation',
      bCallback: () => {
        this.props.setModalVisible(!this.props.modalVisible);
        Actions.manutencao()
      },
    },
    {
      titulo: 'Carregamento/Descarregamento',
      icon: 'truck-loading',
      iconType: 'FontAwesome5',
      bCallback: () => {
        this.props.setModalVisible(!this.props.modalVisible);
        Actions.carregamentoDescarregamento()
      },
    },
    {
      titulo: 'Finalizar Viagem',
      icon: 'flag-checkered',
      iconType: 'FontAwesome5',
      bCallback: this.props.openActionSheet,
    },
  ];

  renderItem = ({item}) => (
    <ListItem
      onPress={item.bCallback}
      title={item.titulo}
      keyExtractor={(item, index) => index.toString()}
      //subtitle={item.subtitle}
      //leftAvatar={{source: {uri: item.avatar_url}}}
      leftIcon={() => {
        if (item.iconType == 'FontAwesome5') {
          return (
            <FontAwesome5
              name={item.icon}
              containerStyle={{backgroundColor: 'transparent'}}
              size={17}
            />
          );
        } else {
          return (
            <Icon
              name={item.icon}
              type={item.iconType}
              containerStyle={{backgroundColor: 'transparent'}}
            />
          );
        }
      }}
      bottomDivider
      //chevron
    />
  );

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.MENU}
            renderItem={this.renderItem}
          />
          <View>
            <TouchableHighlight
              onPress={() => {
                this.props.setModalVisible(!this.props.modalVisible);
              }}
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
