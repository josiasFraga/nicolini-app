import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	Modal,
  StyleSheet,  
} from 'react-native';
import {Icon} from 'react-native-elements';
import GlobalStyle from '@styles/global';
import FieldTextInputRound from './Fields/FieldTextInputRound';
import AnimatedLoader from '@components/Loader';
import { connect} from 'react-redux';
import CompressImage from 'react-native-compress-image';
import * as mime from 'react-native-mime-types';

import RNPickerSelect from 'react-native-picker-select';

import DocReader from '@components/Modals/DocReader';

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

import ImagePicker from 'react-native-image-picker';
import COLORS from '@constants/colors';

type Props = {};
class FormMotorista extends Component<Props> {
	state = {
		imagem: '',
		choosingImage: false,
    	modalScannerVisible: false,
    	empresa_id:  '',
		tipo: '',
		caminhao: '',
	};

	constructor(props) {
		super(props);
	}

	componentDidMount = () => {
		this.props.buscarCaminhoes();
		if ( typeof(this.props.dados) != 'undefined' && this.props.dados != null ) {
			let dados = this.props.dados;
			this.props.setData2Edit({item: 'motorista', data: dados});
			setTimeout(()=>{
				this.setState({caminhao: this.props.initialValues.caminhao})
			

			}, 500)
		}
	}

	componentWillUnmount = () => {
		this.props.setData2Edit({item: 'motorista', data: {}});
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
			if (fileType == null){
				fileType = mime.lookup(responseCompress.name);
			}
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
	
	
	
		  let fields = Object.assign(
			values,
			{img: this.state.imagem},
			{step: this.props.step},
			{caminhao: this.state.caminhao},
		  );

		
		  if (this.props.step == 5) {
			this.props.setModalVisible(false);
		  }

		  if ( typeof(this.props.dados) != 'undefined' && this.props.dados ) {
			fields = Object.assign(
				{id: this.props.dados.id},
				fields,
			);
		  }

		  this.props.sendFormMotorista(fields);
		};



		return (
			<ScrollView /*keyboardShouldPersistTaps={'handled'}*/>

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

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Nome</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Digite o nome do motorista</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="nome"
							component={FieldTextInputRound}
							placeholder="Nome"
							labelText="Nome"
							maxLength={100}
							minLength={1}
							multiline={false}
							returnKeyType="next"
							withRef
							//mask="money"
							ref={componentRef => (this.field_nome = componentRef)}
							refField="field_nome"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
								setTimeout(()=>{
									this.field_ddd.getRenderedComponent().refs.field_ddd.focus();
								},800)
							}}
							/>
						</View>
					</View>
					
				</View>)}

				{this.props.step == 1 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Telefone</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Dgite o telefone do motorista</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>
							<Field
							name="ddd"
							component={FieldTextInputRound}
							placeholder="DDD"
							labelText="DDD"
							keyboardType="phone-pad"
							maxLength={2}
							minLength={2}
							multiline={false}
							returnKeyType="next"
							withRef
							ref={componentRef => (this.field_ddd = componentRef)}
							refField="field_ddd"
							forwardRef
							onEnter={() => {
								this.field_telefone.getRenderedComponent().refs.field_telefone.focus();
							}}
							/>
						</View>
						<View style={{flex: 2}}>
							<Field
							name="telefone"
							component={FieldTextInputRound}
							placeholder="Telefone"
							labelText="Telefone"
							keyboardType="phone-pad"
							maxLength={9}
							minLength={9}
							multiline={false}
							returnKeyType="next"
							withRef
							ref={componentRef => (this.field_telefone = componentRef)}
							refField="field_telefone"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
								setTimeout(()=>{
									this.field_senha.getRenderedComponent().refs.field_senha.focus();
								},800)
							}}
							/>
						</View>
					</View>
					
				</View>)}
				
				{this.props.step == 2 && (typeof(this.props.dados) == 'undefined' || this.props.dados == null) && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Senha</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Digite a senha para que o motorista possa acessar o app</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="senha"
						component={FieldTextInputRound}
						placeholder="Senha"
						labelText="Senha"
						keyboardType="default"
						secureTextEntry={true}
						maxLength={15}
						minLength={1}
						multiline={false}
						returnKeyType="next"
						withRef
						ref={componentRef => (this.field_senha = componentRef)}
						refField="field_senha"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
							/*setTimeout(()=>{
								this.field_placa_carreta.getRenderedComponent().refs.field_placa_carreta.focus();
							},800)*/
						}}
						/>
					</View>
				</View>

				</View>)}
				
				{this.props.step == 2 && typeof(this.props.dados) != 'undefined' && this.props.dados != null && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Senha</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Se não deseja alterar a senha, deixe em branco</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="senha_alterar"
						component={FieldTextInputRound}
						placeholder="Senha"
						labelText="Senha"
						keyboardType="default"
						secureTextEntry={true}
						maxLength={15}
						minLength={1}
						multiline={false}
						returnKeyType="next"
						withRef
						ref={componentRef => (this.field_senha = componentRef)}
						refField="field_senha"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
							/*setTimeout(()=>{
								this.field_placa_carreta.getRenderedComponent().refs.field_placa_carreta.focus();
							},800)*/
						}}
						/>
					</View>
				</View>

				</View>)}

				{this.props.step == 3 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>{typeof(this.props.dados) != 'undefined' && this.props.dados != null ? 'Alterar foto do motorista?' : 'Foto do motorista' }</Text>
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

				{this.props.step == 4 && (<View>
					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Caminhão?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}></Text>
						<RNPickerSelect
						placeholder={{
							label: 'não obrigatório...',
							value: '',
						}}
						value={this.state.caminhao}
						onValueChange={(value) => { this.setState({caminhao: value})}}
						items={this.props.caminhoes}
						/>

					
				</View>)}

				{this.props.step == 5 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Finalizando cadastro do motorista</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Clique em salvar abaixo para finalizar</Text>
					<View style={GlobalStyle.spaceSmall} />
					
				</View>)}


				<View style={GlobalStyle.spaceSmall} />
			<View>
			<TouchableOpacity
				onPress={handleSubmit(submit)} style={{opacity: this.props.isRequesting ? 0.6 : 1}}  disabled={this.props.isRequesting}
				style={GlobalStyle.defaultButton}
                ref={TouchableOpacity => this.buttonNext = TouchableOpacity}
			>
				<Text style={GlobalStyle.defaultButtonText}>{this.props.step < 5 ? 'Próximo' : 'Salvar'}</Text>
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

FormMotorista = reduxForm({
	form: 'FormMotorista',
	enableReinitialize : true, // this is needed!!
	validate: values => {
		const errors = {};
		errors.nome = !values.nome ? 'Obrigatório preencher este campo' : undefined;
		errors.ddd = !values.ddd ? 'Obrigatório preencher este campo' : undefined;
		errors.telefone = !values.telefone ? 'Obrigatório preencher este campo' : undefined;
		errors.senha = !values.senha ? 'Obrigatório preencher este campo' : undefined;

		return errors;
	},
})(FormMotorista);


const mapDispatchToProps = dispatch => ({
    sendFormMotorista(fields) {
        dispatch({
            type: 'SAVE_MOTORISTA',
            payload: fields
        })
    },
    setData2Edit(payload) {
        dispatch({
            type: 'SET_DATA_TO_EDIT',
            payload: payload
        })
    },
	buscarCaminhoes() {
	  dispatch({
		type: 'BUSCA_CAMINHOES_LIST',
		payload: {}
	  });
	},
})

const mapStateToProps = state => ({
	initialValues: state.appReducer.data_motorista_to_edit,
	isRequesting: state.appReducer.savingMotorista,
	step: state.appReducer.stepMotorista,
	caminhoes: state.appReducer.caminhoes_list,
	//motoristasList: state.appReducer.motoristas_list
	//latitude: state.appReducer.user_lat,
	//longitude: state.appReducer.user_lng
	//caminhao: state.appReducer.caminhao_selected
});


export default connect(mapStateToProps, mapDispatchToProps)(FormMotorista);