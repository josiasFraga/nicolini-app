import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, SectionList, StatusBar, Linking  } from 'react-native';
import {Text, Icon, ListItem} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';

import GlobalStyle from '@styles/global';
import COLORS from '@constants/colors';

import CompressImage from 'react-native-compress-image';
import * as mime from 'react-native-mime-types';

const options = {
  title: 'Selecione uma imagem',
  cancelButtonTitle: 'Cancelar',
  takePhotoButtonTitle: 'Tirar uma Foto',
  chooseFromLibraryButtonTitle: 'Escolher da sua Galeria',
  chooseWhichLibraryTitle: 'Infretes - Escolher Foto',
  //customButtons: [{name: 'docReader', title: 'Usar o Scanner'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
  },
};


import Header from '@components/Header';
import ModalCaminhao from '@components/Modals/ModalCaminhao';

import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';


type Props = {};
export class ModalInfoCaminhao extends Component<Props> {
  state = {
    caminhao_foto: '',
    modalVisible: false
  } 
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

	setImage = image => {
	  this.setState({usuario_foto: image});
	}

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

	//setChoosingImage = choosing => {
	  //this.setState({choosingImage: choosing});
	//}

	openImagePicker = () => {
    var _this = this;
    //_this.setState({choosingImage: true});
    ImagePicker.showImagePicker(options, response => {
      //console.log('Response = ', response);

      if (response.didCancel) {
      console.log('User cancelled image picker');
      } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
      if (response.customButton == 'docReader') {
        this.openScannerModal();
      }
      console.log('User tapped custom button: ', response.customButton);
      } else {
      let fileName = response.fileName;
      let fileType = response.type;
      let fileUri = response.uri;

      CompressImage.createCompressedImage(
        fileUri,
        '@assets/imgs/compressedImages/',
      )
        .then(responseCompress => {

        if (fileType == null){
          fileType = mime.lookup(responseCompress.name);
        }
        const source = {
          uri: responseCompress.uri,
          type: fileType,
          name: fileName,
        };
        this.setState({
          caminhao_foto: source.uri,
          //choosingImage: false,
        });
        this.props.sendVehiclePhoto(source, this.props.item.Veiculo.id);
        })
        .catch(err => {
        console.log(err);
        // Oops, something went wrong. Check that the filename is correct and
        // inspect err to get more details.
        console.log('Erro a o comprimir a imagem');

        //_this.setState({choosingImage: false});
        });
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    });
    };

  render() {
    let sectionsList = 
      [{
        title: 'Dados do Caminhão',
        data: [
          {title: this.props.item.Usuario['nome'], iconName: 'user', iconType: "antdesign"},
          {title: this.props.item.Veiculo['km'], iconName: 'highway', iconType: "material-community"},
          {title: this.props.item.Reboque['placa'], iconName: 'truck-trailer', iconType: "material-community"}
        ]
      }];

      if ( this.props.item.Anexos.length > 0 ) {
        for (let anexo of this.props.item.Anexos) {
          sectionsList.push(anexo);
        }

      }

      if ( this.props.item.Viagens.length > 0 ) {
          sectionsList.push(
            {
              title: 'Viagens',
              data: this.props.item.Viagens
            }
          );


      }

      if ( this.props.item.Manutencoes.length > 0 ) {
          sectionsList.push(
            {
              title: 'Manutenções',
              data: this.props.item.Manutencoes
            }
          );


      }

      return (
        <View
          style={{
            flex: 1,
          }}>
            
            <StatusBar
              translucent={true}
              backgroundColor={'transparent'}
              barStyle={'dark-content'}
            />

            <ModalCaminhao
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible}
              dados={this.props.item}
              //openActionSheet={this.openActionSheet}
            />

            <ScrollView style={styles.scrollView}>

                <Header titulo="Caminhões" backButton righElement='edit' newSceneType="modal" functionOpenNewScene={this.setModalVisible} />

                <View>
                    <ImageBackground 
                        source={{ uri: this.state.caminhao_foto == '' ? this.props.item.Veiculo.img : this.state.caminhao_foto }} 
                        style={{width: '100%', height: 220}}
                        resizeMode='contain' 
                    >
                        <View style={{position: 'absolute', bottom: 10, right:10}}>
                            <Text style={styles.subtitle}>Palca: {this.props.item.Veiculo.placa}</Text>
                            <Text style={styles.subtitle}>Frota: {this.props.item.Veiculo.frota}</Text>
                            
                            <TouchableOpacity
                              onPress={
                                () =>{
                                  this.openImagePicker()

                                }
                              }
                              style={GlobalStyle.defaultSmallButton}>
                                <Text style={GlobalStyle.defaultSmallButtonText}>Alterar Foto</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground> 
                </View>
                <SectionList
                    sections={sectionsList}
                    renderSectionHeader={({ section: { title } }) => (
                      <View style={GlobalStyle.sectionHeader}>                        
                        <Text style={[GlobalStyle.secureMargin, GlobalStyle.sectionHeaderText, GlobalStyle.textCenterVertically]}>{title}</Text>
                      </View>
                    )}
                    renderItem={({ item }) => {
                      return (
                        <ListItem
                          title={item.title}
                          leftElement={

                              <Icon
                                name={item.iconName}
                                type={item.iconType}
                                color={COLORS.primary}
                                size={30}
                                //onPress={() => Actions[cenaToOpen].call()}
                                containerStyle={{backgroundColor: 'transparent'}}
                              />

                          }
                          subtitle={() => {
                              if (typeof(item.rightContent) != 'undefined') {
                                return (
                                  <View style={GlobalStyle.row}>
                                    <Text>{'R$ ' + item.rightContent}</Text>
                                  </View>
                              )}                            
                          }}
                          chevron={
                            typeof(item.chevron) != 'undefined' &&  item.chevron
                          }
                          onPress={
                            () =>{
                              if (typeof(item.anexo) != 'undefined') {
                                Linking.openURL(item.anexo).catch((err) => console.error('An error occurred', err));
                              }
                              if (typeof(item.trip_id) != 'undefined') {
                                Actions.modalViagemInfo({trip_id: item.trip_id, loadData: true});
                              }

                            }
                          }
                          bottomDivider
                        />
                    )}}
                    //keyExtractor={item => item.Veiculo.id}
                    //extraData={selected}
                />

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
    textAlign: 'left',
    fontSize: 20,
    marginBottom: 7,
    color: "#f7f7f7", 
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
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


const mapDispatchToProps = dispatch => ({
  sendVehiclePhoto(photo, caminhao_id) {
    dispatch({
      type: 'SEND_VEHICLE_PHOTO',
      payload: {
        photo: photo,
        caminhao_id: caminhao_id
      }
    });
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(ModalInfoCaminhao);
