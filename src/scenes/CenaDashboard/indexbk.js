import React, {Component, Fragment} from 'react';
import {StyleSheet, View, Image, StatusBar, AsyncStorage, TouchableHighlight} from 'react-native';
import {Text, Avatar, Badge} from 'react-native-elements';
import GlobalStyle from '@styles/global';
import ModalMenu from '@components/Modals/ModalMenu';
import ActionSheet from 'rn-actionsheet-module';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { connect } from 'react-redux';
import IMAGES from '@constants/images';
import AnimatedLoader from '@components/Loader';
import {Actions, ActionConst} from 'react-native-router-flux';

type Props = {};
class CenaEmViagem extends Component<Props> {
  state = {
    modalVisible: false,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
    foto_perfil: '',
  };

  constructor(props) {
    super(props);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentDidMount = async() => {
    this.props.calcularItensSincronizar();

    AsyncStorage.getItem("usuario", (err, result) => {
      var usuario = JSON.parse(result);
      this.setState({'foto_perfil': usuario.img});
    });
  }

  renderMap() {
    if (this.props.latitude == 0 && this.props.longitude == 0) {
      return (
        <AnimatedLoader
          visible={true}
          bg={'#FFF'}
          speed={1}
        />
        );
     } else {
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
          latitude: this.props.latitude ? this.props.latitude : 0,
          longitude: this.props.longitude ? this.props.longitude : 0,
          latitudeDelta: this.state.latitudeDelta ? this.state.latitudeDelta : 0,
          longitudeDelta: this.state.longitudeDelta ? this.state.longitudeDelta : 0
        }}
        >
          <Marker
            coordinate={{latitude: this.props.latitude ? this.props.latitude : 0, longitude: this.props.longitude ? this.props.longitude : 0}}
            title={'title'}
            description={'description'}
          />

        </MapView>
      );
     }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  openActionSheet = () => {
    ActionSheet(
      {
        title: 'Deseja finalizar essa viagem?',
        optionsIOS: ['Sim, finalizar essa viagem!', 'Não'],
        optionsAndroid: ['Sim, finalizar essa viagem!', 'Não'],
        destructiveButtonIndex: null, // undefined // 1, 2, etc.,
        cancelButtonIndex: 1, //
        onCancelAndroidIndex: 3, // android doesn't need any cancel option but back button or outside click will return onCancelAndroidIndex
      },
      index => {
        switch (index) {
          case 0: {
            // Aqui devemos chamar o parar viagem
            this.setState({modalVisible: false});
            this.props.pararViagem();
            break;
          }
          case 1: {
            break;
          }
          case 3: {
            break;
          }
          default: {
          }
        }
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />

        <ModalMenu
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible}
          openActionSheet={this.openActionSheet}
        />

        <View style={styles.container}>
          <View style={{flex: 10}}>
          { this.renderMap() }
            <View
              style={{
                position: 'absolute',
                top: 40,
                right: 30,
                zIndex: 99,
              }}>
            <TouchableHighlight onPress={Actions.perfil}>
                <Fragment>
              <Avatar
                source={{
                  uri: this.state.foto_perfil,
                }}
                rounded
                containerStyle={{
                  width: 70,
                  height: 70,
                  borderWidth: 2,
                  borderColor: '#FFF',
                }}
              />
              <Badge
                status="success"
                value={this.props.itens_sincronizar}
                containerStyle={{
                  position: 'absolute',
                  top: 52,
                  left: -5,
                  zIndex: 999,
                }}
              />
              </Fragment>
              </TouchableHighlight>
            </View>
            <View style={[GlobalStyle.row, {position: 'absolute', bottom: 20}]}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Avatar
                  rounded
                  icon={{
                    name: 'clock',
                    size: 30,
                    type: 'feather',
                    justifyContent: 'center',
                    color: '#333',
                  }}
                  size="medium"
                  overlayContainerStyle={{backgroundColor: '#FFF'}}
                  onPress={() => {
                    Actions.viagemDetalhe();
                  }}
                />
              </View>
              <View style={{flex: 2, alignItems: 'center'}}>
                <Avatar
                  rounded
                  size="large"
                  title="Registrar"
                  titleStyle={{
                    color: '#365f7d',
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}
                  overlayContainerStyle={{
                    backgroundColor: '#FFF',
                    borderWidth: 2,
                    borderColor: '#f4f3f3',
                  }}
                  containerStyle={{borderWidth: 3, borderColor: '#FFF'}}
                  onPress={() => {
                    this.setModalVisible(true);
                  }}
                />
              </View>
              <View style={{flex: 1}} />
            </View>
          </View>
          <View
            style={{flex: 1, backgroundColor: '#FFF', flexDirection: 'column'}}>
          { Object.keys(this.props.viagem_ativa).length > 0 &&
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                fontWeight: 'bold',
                flex: 1,
                textAlignVertical: 'center',
              }}>

              Você está em viagem para ({this.props.viagem_ativa.Viagem.destino})
            
            
            </Text>
          }
          
          </View>
        </View>
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
   map: {
   ...StyleSheet.absoluteFillObject,
   flex:1
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
  latitude: state.appReducer.user_lat,
  longitude: state.appReducer.user_lng,
  viagem_ativa: state.appReducer.viagem_ativa,
  itens_sincronizar: state.appReducer.itens_sincronizar
})

const mapDispatchToProps = dispatch => ({
  calcularItensSincronizar() {
    dispatch({
      type: 'CALCULAR_ITENS_SINCRONIZAR',
      payload: {}
    });
  },
  getLocationUpdates(update_db) {
    dispatch({
      type: 'GET_LOCATION_UPDATES',
      payload: {
        'update_db': update_db
      },
    });
  },
  pararViagem() {
    dispatch({
      type: 'PARAR_VIAGEM',
      payload: {},
    });
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(CenaEmViagem);