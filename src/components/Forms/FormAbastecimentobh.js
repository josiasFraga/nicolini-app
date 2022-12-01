import React, {Component, useRef, useState, useEffec} from 'react';
import {reduxForm, Field} from 'redux-form';
import {
  ScrollView,
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  Button,
  Modal,
} from 'react-native';
import {Icon} from 'react-native-elements';
import GlobalStyle from '@styles/global';
import FieldTextInputRound from './Fields/FieldTextInputRound';
import AnimatedLoader from '@components/Loader';
import CompressImage from 'react-native-compress-image';

import DocReader from '@components/Modals/DocReader';

const options = {
  title: 'Selecione uma imagem',
  cancelButtonTitle: 'Cancelar',
  takePhotoButtonTitle: 'Tirar uma Foto',
  chooseFromLibraryButtonTitle: 'Escolher da sua Galeria',
  chooseWhichLibraryTitle: 'Infretes - Escolher Foto',
  customButtons: [{name: 'docReader', title: 'Usar o Scanner'}],
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
  },
};

import ImagePicker from 'react-native-image-picker';

type Props = {};
class FormAbastecimento extends Component<Props> {
  state = {
    modalVisible: false,
    imagem: '',
    choosingImage: false,
    modalScannerVisible: false,
  };
  constructor(props) {
    super(props);
  }

  setImage = image => {
    this.setState({imagem: image});
  }

  setChoosingImage = choosing => {
    this.setState({choosingImage: choosing});
  }

  openImagePicker = () => {
    var _this = this;
    _this.setState({choosingImage: true});
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
        console.log(response.uri);

        CompressImage.createCompressedImage(
          fileUri,
          '@assets/imgs/compressedImages/',
        )
          .then(responseCompress => {
            const source = {
              uri: responseCompress.uri,
              type: fileType,
              name: fileName,
            };
            this.setState({
              imagem: source,
              choosingImage: false,
            });
          })
          .catch(err => {
            console.log(err);
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.log('Erro a o comprimir a imagem');

            _this.setState({choosingImage: false});
          });
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    });
  };

  openModal() {
    this.setState({modalVisible: true});
  }

  closeModal = () => {
    this.setState({modalVisible: false});
  };

  openScannerModal() {
    this.setState({modalScannerVisible: true});
  }

  closeScannerModal = () => {
    this.setState({modalScannerVisible: false});
  }

  render() {
    const {handleSubmit} = this.props;
    const submit = values => {
      if (this.state.choosingImage) {
        return false;
      }

      if (this.state.imagem == '') {
        alert('Selecione uma imagem!');
        return false;
      }

      let fields = Object.assign(
        {gps_lat: this.props.latitude},
        {gps_lng: this.props.longitude},
        this.props.addressData,
        {anexo: this.state.imagem},
        values,
      );
      this.props.submitForm(fields);
    };

    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <Modal
            visible={this.state.modalScannerVisible}
            animationType={'slide'}
            coverScreen={true}
            hasBackdrop={true}
            backdropColor='#000'
            onRequestClose={() => this.closeScannerModal()}>
            <View style={styles.modalContainer}>
              <DocReader
                setChoosingImage={this.setChoosingImage}
                setImage={this.setImage}
                imagem={this.state.imagem}
                fechaModal={this.closeScannerModal}
              />
            </View>
          </Modal>
          {this.props.header}
          <View>
            <View style={GlobalStyle.spaceExtraSmall} />
            <View style={[GlobalStyle.secureMargin]}>
              <View style={GlobalStyle.row}>
                <Text
                  style={[
                    GlobalStyle.labelMarker,
                    GlobalStyle.textCenterVertically,
                  ]}>
                  ■
                </Text>
                <Text
                  style={[styles.labelDesc, GlobalStyle.textCenterVertically]}>
                  Posto:
                </Text>
                <Field
                  name="posto"
                  component={FieldTextInputRound}
                  placeholder=""
                  labelText="Posto"
                  keyboardType="default"
                  maxLength={50}
                  multiline={false}
                  returnKeyType="next"
                  withRef
                  ref={componentRef => (this.field1 = componentRef)}
                  refField="field1"
                  forwardRef
                  onEnter={() => {
                    this.field2.getRenderedComponent().refs.field2.focus();
                  }}
                />
              </View>
            </View>

            <View style={GlobalStyle.spaceSmall} />

            <View style={[GlobalStyle.secureMargin]}>
              <View style={GlobalStyle.row}>
                <Text
                  style={[
                    GlobalStyle.labelMarker,
                    GlobalStyle.textCenterVertically,
                  ]}>
                  ■
                </Text>
                <Text
                  style={[styles.labelDesc, GlobalStyle.textCenterVertically]}>
                  Valor:
                </Text>
                <Field
                  name="valor"
                  component={FieldTextInputRound}
                  placeholder=""
                  labelText="Valor"
                  keyboardType="decimal-pad"
                  maxLength={20}
                  multiline={false}
                  returnKeyType="next"
                  withRef
                  mask="money"
                  ref={componentRef => (this.field2 = componentRef)}
                  refField="field2"
                  forwardRef
                  onEnter={() => {
                    this.field3.getRenderedComponent().refs.field3.focus();
                  }}
                />
              </View>
            </View>

            <View style={GlobalStyle.spaceSmall} />

            <View style={GlobalStyle.row}>
              <View
                style={[
                  GlobalStyle.secureMargin,
                  {
                    flex: 1,
                    borderTopWidth: 1,
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    paddingVertical: 7,
                  },
                ]}>
                <Text style={styles.label2}>Litragem</Text>
                <Field
                  name="litragem"
                  component={FieldTextInputRound}
                  placeholder=""
                  labelText="Litragem"
                  keyboardType="decimal-pad"
                  maxLength={20}
                  multiline={false}
                  returnKeyType="next"
                  withRef
                  ref={componentRef => (this.field3 = componentRef)}
                  refField="field3"
                  forwardRef
                  onEnter={() => {
                    this.field4.getRenderedComponent().refs.field4.focus();
                  }}
                />
              </View>
              <View
                style={[
                  GlobalStyle.secureMargin,
                  {
                    flex: 1,
                    borderTopWidth: 1,
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    paddingVertical: 7,
                  },
                ]}>
                <Text style={styles.label2}>KM</Text>
                <Field
                  name="km"
                  component={FieldTextInputRound}
                  placeholder=""
                  labelText="KM"
                  keyboardType="decimal-pad"
                  maxLength={20}
                  multiline={false}
                  returnKeyType="next"
                  withRef
                  ref={componentRef => (this.field4 = componentRef)}
                  refField="field4"
                  forwardRef
                  onEnter={() => {
                    this.field5.getRenderedComponent().refs.field5.focus();
                  }}
                />
              </View>
              <View
                style={[
                  GlobalStyle.secureMargin,
                  {
                    flex: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    paddingVertical: 7,
                  },
                ]}>
                <Text style={styles.label2}>Média</Text>
                <Text style={styles.fieldValue}>0,0 KM/L</Text>
              </View>
            </View>

            <View style={GlobalStyle.spaceSmall} />

            <View style={[GlobalStyle.secureMargin]}>
              <View style={GlobalStyle.row}>
                <Text
                  style={[
                    GlobalStyle.labelMarker,
                    GlobalStyle.textCenterVertically,
                  ]}>
                  ■
                </Text>
                <Text
                  style={[styles.labelDesc, GlobalStyle.textCenterVertically]}>
                  Valor Arla:
                </Text>
                <Field
                  name="valor_arla"
                  component={FieldTextInputRound}
                  placeholder=""
                  labelText="Valor Arla"
                  keyboardType="decimal-pad"
                  maxLength={20}
                  multiline={false}
                  returnKeyType="next"
                  withRef
                  mask="money"
                  ref={componentRef => (this.field5 = componentRef)}
                  refField="field5"
                  forwardRef
                  onEnter={() => {
                    this.field5.getRenderedComponent().refs.field6.focus();
                  }}
                />
              </View>
            </View>

            <View style={GlobalStyle.spaceSmall} />

            <View style={[GlobalStyle.secureMargin]}>
              <View style={GlobalStyle.row}>
                <Text
                  style={[
                    GlobalStyle.labelMarker,
                    GlobalStyle.textCenterVertically,
                  ]}>
                  ■
                </Text>
                <Text
                  style={[styles.labelDesc, GlobalStyle.textCenterVertically]}>
                  Litragem Arla:
                </Text>
                <Field
                  name="litragem_arla"
                  component={FieldTextInputRound}
                  placeholder=""
                  labelText="Litragem Arla"
                  keyboardType="decimal-pad"
                  maxLength={20}
                  multiline={false}
                  returnKeyType="next"
                  withRef
                  ref={componentRef => (this.field6 = componentRef)}
                  refField="field6"
                  forwardRef
                />
              </View>
            </View>

            <View style={GlobalStyle.spaceSmall} />

            <View style={[GlobalStyle.secureMargin]}>
              <View
                style={[GlobalStyle.row, {alignContent: 'center', alignItems: 'center'}]}
                onPress={() => this.openImagePicker()}>
                <Icon
                  name="upload"
                  type="feather"
                  //color={}
                  style={{alignSelf: 'center'}}
                  containerStyle={{
                    alignSelf: 'center',
                    flex: 1
                  }}
                  size={40}
                  onPress={() => this.openImagePicker()}
                />
              </View>
            </View>
            <View style={GlobalStyle.spaceSmall} />
          </View>
        </ScrollView>

        {
          //formStates.filter((state) => this.props[state]).map((state) => {
          //  return <Text key={state}> - { state }</Text>
          //})
        }
        {!this.props.isRequesting && (
          <TouchableHighlight
            onPress={handleSubmit(submit)}
            style={{...GlobalStyle.defaultButton, opacity: this.state.choosingImage ? 0.5 : 1}}>
            <Text style={GlobalStyle.defaultButtonText}>Salvar</Text>
          </TouchableHighlight>
        )}
        {this.props.isRequesting && (
          <TouchableWithoutFeedback>
            <View style={GlobalStyle.buttonContainerLoading}>
              <AnimatedLoader visible={true} speed={1} />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textTermos: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#5b5f70',
  },
  innerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    width: '80%',
    alignSelf: 'center',
    padding: 15,
  },
  modalTitle: {
    fontSize: 20,
    width: '100%',
  },
  modalText: {
    color: '#999',
  },
  label2: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
    color: '#333',
  },
  fieldValue: {
    color: '#999',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
  },
});

let InitializeFromStateForm = reduxForm({
  form: 'formAbastecimento',
  validate: values => {
    const errors = {};
    errors.valor = !values.valor ? 'Obrigatório' : undefined;
    errors.litragem = !values.litragem ? 'Obrigatório' : undefined;
    errors.km = !values.km ? 'Obrigatório' : undefined;

    return errors;
  },
})(FormAbastecimento);

export default InitializeFromStateForm;
