import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	Modal
} from 'react-native';
import {Icon} from 'react-native-elements';
import GlobalStyle from '@styles/global';
import FieldTextInputRound from './Fields/FieldTextInputRound';
import AnimatedLoader from '@components/Loader';
import { connect} from 'react-redux';
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
import COLORS from '@constants/colors';

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

	componentDidMount() {
		if ( typeof(this.props.dados) != 'undefined' && this.props.dados != null ) {
			let dados = this.props.dados;
			this.props.setData2Edit({item: 'abastecimento', data: dados});
		}
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

		  if ( this.state.imagem == '' && this.props.step == 6 && ( typeof(this.props.dados) == 'undefined' || !this.props.dados || this.props.dados != null ) ) {
			alert('Selecione uma imagem!');
			return false;
		  }

		  let fields = Object.assign(
			{gps_lat: this.props.latitude},
			{gps_lng: this.props.longitude},
			{anexo: this.state.imagem},
			{step: this.props.step},
			values,
		  );

		  if (this.props.step == 7) {
			this.props.setModalVisible(false);
		  }

		  if ( typeof(this.props.dados) != 'undefined' && this.props.dados ) {
			fields = Object.assign(
				{id: this.props.dados.id},
				fields,
			);
		  }

		  this.props.sendFormAbastecimento(fields);
		};
		

		return (
			<ScrollView /*keyboardShouldPersistTaps={'handled'}*/ >

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

				{this.props.step == 0 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Qual o nome do posto?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual o nome do posto que você está abastecendo?</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="posto"
							component={FieldTextInputRound}
							placeholder="Nome do Posto"
							labelText="Nome do Posto"
							keyboardType="text"
							maxLength={100}
							minLength={1}
							multiline={false}
							returnKeyType="next"
							withRef
							ref={componentRef => (this.field1 = componentRef)}
							refField="field1"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
								setTimeout(()=>{
									this.field2.getRenderedComponent().refs.field2.focus();
								},500)
							}}
							/>
						</View>
					</View>
					
				</View>)}

				{this.props.step == 1 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Qual foi o valor?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual foi o valor do abastecimento?</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="valor"
							component={FieldTextInputRound}
							placeholder="Valor do Abastecimento"
							labelText="Valor do Abastecimento"
							keyboardType="decimal-pad"
							maxLength={20}
							minLength={1}
							multiline={false}
							returnKeyType="next"
							withRef
							mask="money"
							ref={componentRef => (this.field2 = componentRef)}
							refField="field2"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
								setTimeout(()=>{
									this.field3.getRenderedComponent().refs.field3.focus();
								},500)
							}}
							/>
						</View>
					</View>
					
				</View>)}

				{this.props.step == 2 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Quantos litros?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Quantos litros foram no abastecimento?</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>
							<Field
							name="litros"
							component={FieldTextInputRound}
							placeholder="Litros"
							labelText="Litros no Tanque"
							keyboardType="decimal-pad"
							maxLength={12}
							minLength={1}
							multiline={false}
							returnKeyType="next"
							withRef
							ref={componentRef => (this.field3 = componentRef)}
							refField="field3"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
								setTimeout(()=>{
									this.field4.getRenderedComponent().refs.field4.focus();
								},500)
							}}
							/>
						</View>
					</View>
					
				</View>)}

				{this.props.step == 3 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Abasteceu Arla?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Se não abasteceu, deixe em branco</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>
							<Field
							name="litros_arla"
							component={FieldTextInputRound}
							placeholder="Litros da Arla"
							labelText="Litros da Arla"
							keyboardType="decimal-pad"
							maxLength={12}
							minLength={1}
							multiline={false}
							returnKeyType="done"
							withRef
							ref={componentRef => (this.field4 = componentRef)}
							refField="field4"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
							}}
							/>
						</View>
					</View>
					
				</View>)}

				{this.props.step == 4 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Valor total arla?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual foi o valor do abastecimento da arla?</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="valor_arla"
							component={FieldTextInputRound}
							placeholder="Valor do abastecimento na arla"
							labelText="Valor do abastecimento na arla"
							keyboardType="decimal-pad"
							maxLength={20}
							minLength={1}
							multiline={false}
							returnKeyType="next"
							withRef
							mask="money"
							ref={componentRef => (this.field5 = componentRef)}
							refField="field5"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
								setTimeout(()=>{
									this.field6.getRenderedComponent().refs.field6.focus();
								},500)
							}}
							/>
						</View>
					</View>
					
				</View>)}

				
				{this.props.step == 5 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Qual o KM atual?</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual o KM do Odômetro no momento do abastecimento?</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="km"
						component={FieldTextInputRound}
						placeholder="KM do Caminhão"
						labelText="KM"
						keyboardType="numeric"
						maxLength={10}
						minLength={1}
						multiline={false}
						returnKeyType="done"
						withRef
						ref={componentRef => (this.field6 = componentRef)}
						refField="field6"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
						}}
						/>
					</View>
				</View>

				</View>)}

				{this.props.step == 6 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>{typeof(this.props.dados) != 'undefined' && this.props.dados != null ? 'Alterar Foto da Nota Fiscal?' : 'Foto da Nota Fiscal' }</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Selecionar foto ou Tirar foto</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>

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
							<View style={[GlobalStyle.spaceSmall]}></View>
							{this.state.imagem != '' && (
							<View>
								<Text>{this.state.imagem.name}</Text>
								<Icon
									name="checkcircle"
									type="antdesign"
									color={'green'}
									style={{alignSelf: 'center'}}
									containerStyle={{
										alignSelf: 'center',
										flex: 1
									}}
									size={40}
									onPress={() => this.openImagePicker()}
								/>
							</View>)}
							</View>
						</View>
					</View>
					
				</View>)}

				{this.props.step == 7 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Finalizando abastecimento</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Clique em salvar abaixo para finalizar</Text>

					<View style={GlobalStyle.spaceSmall} />

					
				</View>)}


				<View style={GlobalStyle.spaceSmall} />
                <View>
                    <TouchableOpacity
                    onPress={handleSubmit(submit)} style={{opacity: this.props.isRequesting ? .8 : 1}}  disabled={this.props.isRequesting}
                    style={GlobalStyle.defaultButton}
					ref={TouchableOpacity => this.buttonNext = TouchableOpacity}
					>
                    <Text style={GlobalStyle.defaultButtonText}>{this.props.step < 7 ? 'Próximo' : 'Salvar'}</Text>
                    </TouchableOpacity>
					<View style={GlobalStyle.spaceSmall} />
                </View>

			</ScrollView>
	
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

FormAbastecimento = reduxForm({
	form: 'FormAbastecimento',
	enableReinitialize : true, // this is needed!!
	validate: values => {
		const errors = {};
		errors.posto = !values.posto ? '*' : undefined;
		errors.valor = !values.valor ? '*' : undefined;
		errors.litros = !values.litros ? '*' : undefined;

		return errors;
	},
})(FormAbastecimento);



const mapDispatchToProps = dispatch => ({
    sendFormAbastecimento(fields) {
        dispatch({
            type: 'SAVE_ABASTECIMENTO',
            payload: fields
        })
    },
    setData2Edit(payload) {
        dispatch({
            type: 'SET_DATA_TO_EDIT',
            payload: payload
        })
    }
})

const mapStateToProps = state => {
	return {
		initialValues: state.appReducer.data_abastecimento_to_edit,
		isRequesting: state.appReducer.savingAbastecimento,
		step: state.appReducer.stepSaveAbastecimento,
		latitude: state.appReducer.user_lat,
		longitude: state.appReducer.user_lng,
		//caminhao: state.appReducer.caminhao_selected
	}
};


export default connect(mapStateToProps, mapDispatchToProps)(FormAbastecimento);