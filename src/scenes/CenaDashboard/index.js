import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import {ListItem, Text, Icon, Image } from 'react-native-elements';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import AnimatedLoader from '@components/Loader';

import {connect} from 'react-redux';

import GlobalStyle from '@styles/global';
import COLORS from '@constants/colors';
import MenuButton from '@components/Buttons/MenuButton';
import Caminhoes from '@components/Pickers/Caminhoes';
import LeftMenu from '@components/Navigation/LeftMenu';
import IMAGES from '@constants/images';
import Duracao from './components/Duracao';
import database from '@react-native-firebase/database';

import ModalIniciarViagem from '@components/Modals/ModalIniciarViagem';
import ModalFinalizarViagem from '@components/Modals/ModalFinalizarViagem';
import {Actions} from 'react-native-router-flux';

// -30.981632, longitude: -54.677230
type Props = {};


class CenaDashboard extends Component<Props> {
  watchId = null;

  state = {
    modalVisible: false,
    modalPararVisible: false,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
    latitude: null,
    longitude: null,
    foto_perfil: '',
    motorista_id: null,
  };

  constructor(props) {
    super(props);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.setModalPararVisible = this.setModalPararVisible.bind(this);
  }

  componentDidMount = () => {
    this.buscaLocalizacaoMotorista()
  }

  shouldComponentUpdate = async(nextProps, nextState) => {
    let motorista_id = await  AsyncStorage.getItem('veiculo_selecionado_motorista_id');

    if ( nextState.motorista_id != motorista_id ) {
      this.buscaLocalizacaoMotorista();
    }

  }
  
  buscaLocalizacaoMotorista = async() => {
    let dados_usuario = await AsyncStorage.getItem("usuario");
    let usuario = JSON.parse(dados_usuario);

    if (  usuario != null && typeof(usuario.nome)  != 'undefined') {
        if ( usuario.admin_id == null ) {
          let motorista_id = await  AsyncStorage.getItem('veiculo_selecionado_motorista_id');
          console.log('motorista_id 2 ' + motorista_id)
          this.setState({motorista_id: motorista_id});
          if ( motorista_id != null  && typeof(motorista_id)  != 'undefined' ) {
            let ref = database().ref('/veiculos/'+motorista_id);
            ref.on('value', snapshot => {
              console.log(snapshot.val());
              if ( snapshot.val() !== null ) {
                this.setState({ latitude: snapshot.val().lat, longitude: snapshot.val().lng })
              }  else {
                this.setState({ latitude: 1, longitude: 1 });

              }
            })
          } else {
            this.setState({ latitude: 0, longitude: 0, motorista_id: null });              
          }

        
        } 

    }
  }


  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setModalPararVisible(visible) {
    this.setState({modalPararVisible: visible});
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

  renderMap() {
    
    if ( (this.props.latitude == 0 && this.props.longitude == 0) && (this.state.latitude == null && this.state.longitude == null) ) {
      return (
        <AnimatedLoader
          visible={true}
          bg={'#FFF'}
          speed={1}
        />
        );
     } else if  ( (this.props.latitude == 0 && this.props.longitude == 0) && (this.state.latitude == 0 && this.state.longitude == 0) ) {
      return (
        <View style={{justifyContent:'center', flex: 1, marginBottom: 120}}>
          <View style={GlobalStyle.secureMargin}>
            <View style={GlobalStyle.spaceMedium} />
            <View style={GlobalStyle.spaceMedium} />
            <Text style={GlobalStyle.emptyListText}>Nenhum motorista selecionado para este veículo</Text>
          </View>
        </View>
      );

     }  else if  ( (this.props.latitude == 0 && this.props.longitude == 0) && (this.state.latitude == 1 && this.state.longitude == 1) ) {
      return (
        <View style={{justifyContent:'center', flex: 1, marginBottom: 120}}>
          <View style={GlobalStyle.secureMargin}>
            <View style={GlobalStyle.spaceMedium} />
            <View style={GlobalStyle.spaceMedium} />
            <Text style={GlobalStyle.emptyListText}>O motorista ainda não logou no plicativo ou não permitiu o aplicativo compartilhar a localização dele.</Text>
          </View>
        </View>
      );

     }    
     else {
       let latitude = this.props.latitude == 0 ? this.state.latitude :  this.props.latitude;
       let longitude = this.props.longitude == 0 ? this.state.longitude : this.props.longitude;

      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: this.state.latitudeDelta ? this.state.latitudeDelta : 0,
          longitudeDelta: this.state.longitudeDelta ? this.state.longitudeDelta : 0
          }}
        >
          <Marker
            coordinate={{latitude: latitude, longitude: longitude}}
            title={'title'}
            description={'description'}
          />

        </MapView>
      );
     }
  }


  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />

        <ModalIniciarViagem
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible}
          openActionSheet={this.openActionSheet}
        />

        <ModalFinalizarViagem
          modalVisible={this.state.modalPararVisible}
          setModalVisible={this.setModalPararVisible}
          openActionSheet={this.openActionSheet}
        />

        <View style={[styles.container]}>
          <View style={[GlobalStyle.row, {flex: 1}]}>
            <View style={{flex: 3}}>
 
              <View style={[GlobalStyle.paddingStatusBar, {alignItems: 'center'}]}>
                <MenuButton />
                
                <View style={GlobalStyle.spaceMedium} />
                
                <Image source={IMAGES.LOGO_ROTATED} style={{ width: 50, height: 116 }} />
                
                <View style={GlobalStyle.spaceMedium} />
                <View style={GlobalStyle.spaceMedium} />
                <View style={GlobalStyle.spaceMedium} />

                <LeftMenu viagemAtiva={this.props.viagem_ativa.Viagem} />

              </View>
            </View>
            <View style={[{flex: 8, flexDirection: 'column', alignItems: 'stretch', backgroundColor: 'yelllow'}]}>
              <View style={GlobalStyle.topBoxRight}>
                <View style={[GlobalStyle.marginStatusBar, GlobalStyle.secureMargin, {flexDirection: 'column'}]}>

                  <View style={{alignItems: 'flex-end'}}>
                    <View>
                      <Caminhoes />
                    </View>
                  </View>

                  <View style={GlobalStyle.spaceMedium} />

                  <View style={[GlobalStyle.row, {justifyContent: 'space-between'}]}>
                    <View>
                      {this.props.viagem_ativa.Viagem && (<Image source={IMAGES.ICON_TRIP} style={{ width: 50, height: 50 }} />)}
                      {this.props.viagem_ativa.Viagem && (<Text style={[{color: '#FFF'}]}>Destino</Text>)}
                      <Text style={[GlobalStyle.title, {color: '#FFF'}]}>{this.props.viagem_ativa.Viagem ? this.props.viagem_ativa.Viagem.destino : 'Nenhuma ativa'}</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Duracao viagemAtiva={this.props.viagem_ativa} />
                    </View>
                  </View>

                  <View style={GlobalStyle.spaceMedium} />

                  <View style={{alignItems: 'flex-end'}}>
                    {this.props.viagem_ativa.Viagem && (
                    <TouchableOpacity onPress={() => { Actions.modalViagemInfo({item: this.props.viagem_ativa, loadData: true}); }}>
                      <Text style={[{color: '#FFF'}]}>Resumo da Viagem</Text>
                    </TouchableOpacity>)}
                  </View>

                  <View style={GlobalStyle.spaceMedium} />

                  {!this.props.viagem_ativa.Viagem && this.props.caminhaoSelecionado != null && (
                  <View>
                    <View style={{position: 'absolute', borderStyle: 'solid', borderColor: '#FFF', borderWidth: 4, borderRadius: 40, left: 15, bottom: -33, backgroundColor: COLORS.primary, elevation: 3, zIndex: 999}} >
                    <TouchableOpacity
                      style={{padding: 10, zIndex: 9999999}}
                      onPress={() => this.setModalVisible(true)}>
                      <Icon
                        name="controller-play"
                        type="entypo"
                        color={'#FFF'}
                        size={40}
                        //onPress={() => Actions[cenaToOpen].call()}
                        containerStyle={{backgroundColor: 'transparent'}}
                      />
                    </TouchableOpacity>
                    </View>
                    <Text style={[{color: '#FFF', alignSelf: 'flex-end', marginRight: 50}]}>Iniciar uma viagem</Text>

                  </View>
                  )}
                  

                  {this.props.viagem_ativa.Viagem && (<View>
                    <View style={{position: 'absolute', borderStyle: 'solid', borderColor: '#FFF', borderWidth: 4, borderRadius: 40, left: 15, bottom: -33, backgroundColor: COLORS.primary, elevation: 3, zIndex: 999}}>

                      <TouchableOpacity
                      style={{padding: 10, zIndex: 9999999}}
                          onPress={() => this.setModalPararVisible(true)}>
                        <Icon
                          name="controller-stop"
                          type="entypo"
                          color={'#FFF'}
                          size={40}
                          //onPress={() => Actions[cenaToOpen].call()}
                          containerStyle={{backgroundColor: 'transparent'}}
        
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={[{color: '#FFF', alignSelf: 'flex-end', marginRight: 50}]}>Encerrar viagem</Text>

                    </View>)}

                </View>           

              </View>
              
              { this.renderMap() }

            </View>
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
  map: {
    flex:1,
    bottom: 0,
    //top: -20,
  },
});

const mapStateToProps = state => ({
  latitude: state.appReducer.user_lat,
  longitude: state.appReducer.user_lng,
  viagem_ativa: state.appReducer.viagem_ativa,
  itens_sincronizar: state.appReducer.itens_sincronizar,
  caminhaoSelecionado: state.appReducer.caminhao_selected,
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

export default connect(mapStateToProps, mapDispatchToProps)(CenaDashboard);