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
class FormCaminhao extends Component<Props> {
	state = {
		imagem: '',
		choosingImage: false,
    	modalScannerVisible: false,
    	empresa_id:  '',
		tipo: '',
		motorista: '',
	};

	constructor(props) {
		super(props);
	}

	componentDidMount = () => {
		this.props.buscarEmpresas();
		this.props.buscarMotoristas();
		if ( typeof(this.props.dados) != 'undefined' && this.props.dados != null ) {
			let dados = this.props.dados;
			this.props.setData2Edit({item: 'caminhao', data: dados});
			setTimeout(()=>{
				this.setState({empresa_id: this.props.initialValues.empresa_id, tipo: this.props.initialValues.tipo, motorista: this.props.initialValues.motorista})
			

			}, 500)
		}
	}

	componentWillUnmount = () => {
		this.props.setData2Edit({item: 'caminhao', data: {}});
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
	
		  if (this.state.tipo == '' && this.props.step == 5 && ( typeof(this.props.dados) == 'undefined' || !this.props.dados || this.props.dados == null )) {
			alert('Selecione o tipo de cavalo!');
			return false;
		  }
	
		  /*if (this.state.imagem == '' && this.props.step == 10 && ( typeof(this.props.dados) == 'undefined' || !this.props.dados || this.props.dados == null )) {
			alert('Selecione uma imagem!');
			return false;
		  }*/
	
		  let fields = Object.assign(
			values,
			{img: this.state.imagem},
			{step: this.props.step},
			{motorista: this.state.motorista},
			{tipo: this.state.tipo},
			{empresa_id: this.state.empresa_id},
		  );
		
		  if (this.props.step == 12) {
			this.props.setModalVisible(false);
		  }

		  if ( typeof(this.props.dados) != 'undefined' && this.props.dados ) {
			fields = Object.assign(
				{id: this.props.dados.id},
				fields,
			);
		  }

		  this.props.sendFormCaminhao(fields);
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
					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Empresa?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}></Text>
						<RNPickerSelect
						placeholder={{
							label: 'não obrigatório...',
							value: '',
						}}
						value={this.state.empresa_id}
						onValueChange={(value) => { this.setState({empresa_id: value})}}
						items={this.props.empresasList}
						/>
					
				</View>)}

				{this.props.step == 1 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Frota</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Digite o número da frota</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="frota"
							component={FieldTextInputRound}
							keyboardType="numeric"
							placeholder="Frota"
							labelText="Frota"
							maxLength={10}
							minLength={1}
							multiline={false}
							returnKeyType="next"
							withRef
							//mask="money"
							ref={componentRef => (this.field_frota = componentRef)}
							refField="field_frota"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
								setTimeout(()=>{
									this.field_placa.getRenderedComponent().refs.field_placa.focus();
								},800)
							}}
							/>
						</View>
					</View>
					
				</View>)}

				{this.props.step == 2 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Placa</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Dgite a placa do cavalo</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="placa"
							component={FieldTextInputRound}
							placeholder="Placa"
							labelText="Placa"
							maxLength={10}
							minLength={1}
							multiline={false}
							returnKeyType="next"
							withRef
							ref={componentRef => (this.field_placa = componentRef)}
							refField="field_placa"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
								setTimeout(()=>{
									this.field_km.getRenderedComponent().refs.field_km.focus();
								},800)
							}}
							/>
						</View>
					</View>
					
				</View>)}
				
				{this.props.step == 3 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Qual o KM atual?</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual o KM do Odômetro?</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="km"
						component={FieldTextInputRound}
						placeholder=""
						labelText="KM atual"
						keyboardType="numeric"
						maxLength={15}
						minLength={1}
						multiline={false}
						returnKeyType="next"
						withRef
						ref={componentRef => (this.field_km = componentRef)}
						refField="field_km"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
							setTimeout(()=>{
								this.field_placa_carreta.getRenderedComponent().refs.field_placa_carreta.focus();
							},800)
						}}
						/>
					</View>
				</View>

				</View>)}

				{this.props.step == 4 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Placa da Carreta</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Dgite a placa da carreta</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="placa_carreta"
							component={FieldTextInputRound}
							placeholder="Placa da Carreta"
							labelText="Placa da Carreta"
							maxLength={10}
							minLength={1}
							multiline={false}
							returnKeyType="next"
							withRef
							ref={componentRef => (this.field_placa_carreta = componentRef)}
							refField="field_placa_carreta"
							forwardRef
							onEnter={() => {
								this.buttonNext.props.onPress();
							}}
							/>
						</View>
					</View>
					
				</View>)}

				{this.props.step == 5 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Tipo de Cavalo?</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Selecione o tipo de cavalo</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
					
					<RNPickerSelect
						placeholder={{
							label: 'Cavalo trucado ou toco?',
							value: '',
						}}
						onValueChange={(value) => { this.setState({tipo: value})}}
						value={this.state.tipo}
						items={[{label: 'Trucado', value: 'Trucado'}, {label: 'Toco', value: 'Toco'}]}                
					/>
					</View>
				</View>
				
				</View>)}

				{this.props.step == 6 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Tanque</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Digite a capacidade do tanque</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="tanque"
						component={FieldTextInputRound}
						placeholder="Capacidade do tanque"
						labelText="KM"
						keyboardType="numeric"
						maxLength={10}
						minLength={1}
						multiline={false}
						returnKeyType="next"
						withRef
						ref={componentRef => (this.field_tanque = componentRef)}
						refField="field_tanque"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
							setTimeout(()=>{
								this.field_tanque_litragem_inicial.getRenderedComponent().refs.field_tanque_litragem_inicial.focus();
							},800)
						}}
						/>
					</View>
				</View>

				</View>)}

				{this.props.step == 7 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Litragem Atual</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Digite a quantidade de combustível que há no tanque +ou-</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="tanque_litragem_inicial"
						component={FieldTextInputRound}
						placeholder="Litragem do tanque"
						labelText="Litragem do tanque"
						keyboardType="numeric"
						maxLength={10}
						minLength={1}
						multiline={false}
						returnKeyType="next"
						withRef
						ref={componentRef => (this.field_tanque_litragem_inicial = componentRef)}
						refField="field_tanque_litragem_inicial"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
							setTimeout(()=>{
								this.field_tanque_arla.getRenderedComponent().refs.field_tanque_arla.focus();
							},800)
						}}
						/>
					</View>
				</View>

				</View>)}

				{this.props.step == 8 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Tanque (Arla)</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Digite a capacidade do tanque da arla</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="tanque_arla"
						component={FieldTextInputRound}
						placeholder="Capacidade do tanque da arla"
						labelText="Capacidade do tanque da arla"
						keyboardType="numeric"
						maxLength={10}
						minLength={1}
						multiline={false}
						returnKeyType="next"
						withRef
						ref={componentRef => (this.field_tanque_arla = componentRef)}
						refField="field_tanque_arla"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
							setTimeout(()=>{
								this.field_tanque_arla_litragem_inicial.getRenderedComponent().refs.field_tanque_arla_litragem_inicial.focus();
							},800)
						}}
						/>
					</View>
				</View>

				</View>)}

				{this.props.step == 9 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Litragem Atual (Arla)</Text>
				<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Digite a quantidade de combustível que há na arla +ou-</Text>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="tanque_arla_litragem_inicial"
						component={FieldTextInputRound}
						placeholder="Litragem da arla"
						labelText="Litragem da arla"
						keyboardType="numeric"
						maxLength={10}
						minLength={1}
						multiline={false}
						returnKeyType="next"
						withRef
						ref={componentRef => (this.field_tanque_arla_litragem_inicial = componentRef)}
						refField="field_tanque_arla_litragem_inicial"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
						}}
						/>
					</View>
				</View>

				</View>)}

				{this.props.step == 10 && (<View>

				<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>{typeof(this.props.dados) != 'undefined' && this.props.dados != null ? 'Alterar foto do veículo?' : 'Foto do veículo' }</Text>
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

				{this.props.step == 11 && (<View>
					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Motorista?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}></Text>
						<RNPickerSelect
						placeholder={{
							label: 'não obrigatório...',
							value: '',
						}}
						value={this.state.motorista}
						onValueChange={(value) => { this.setState({motorista: value})}}
						items={this.props.motoristasList}
						/>
					
				</View>)}

				{this.props.step == 12 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Finalizando cadastro do veículo</Text>
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
				<Text style={GlobalStyle.defaultButtonText}>{this.props.step < 12 ? 'Próximo' : 'Salvar'}</Text>
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

FormCaminhao = reduxForm({
	form: 'FormCaminhao',
	enableReinitialize : true, // this is needed!!
	validate: values => {
		const errors = {};
		errors.frota = !values.frota ? 'Obrigatório preencher este campo' : undefined;
		errors.placa = !values.placa ? 'Obrigatório preencher este campo' : undefined;
		errors.km = !values.km ? 'Obrigatório preencher este campo' : undefined;
		errors.placa_carreta = !values.placa_carreta ? 'Obrigatório preencher este campo' : undefined;
		errors.tipo = !values.tipo ? 'Obrigatório preencher este campo' : undefined;
		errors.tanque = !values.tanque ? 'Obrigatório preencher este campo' : undefined;
		errors.tanque_arla = !values.tanque_arla ? 'Obrigatório preencher este campo' : undefined;
		errors.tanque_litragem_inicial = !values.tanque_litragem_inicial ? 'Obrigatório preencher este campo' : undefined;
		errors.tanque_arla_litragem_inicial = !values.tanque_arla_litragem_inicial ? 'Obrigatório preencher este campo' : undefined;
		errors.tanque_arla_litragem_inicial = !values.tanque_arla_litragem_inicial ? 'Obrigatório preencher este campo' : undefined;

		return errors;
	},
})(FormCaminhao);


const mapDispatchToProps = dispatch => ({
    sendFormCaminhao(fields) {
        dispatch({
            type: 'SAVE_CAMINHAO',
            payload: fields
        })
    },
    setData2Edit(payload) {
        dispatch({
            type: 'SET_DATA_TO_EDIT',
            payload: payload
        })
    },
	buscarEmpresas() {
	  dispatch({
		type: 'BUSCA_EMPRESAS',
		payload: {}
	  });
	},
	buscarMotoristas() {
	  dispatch({
		type: 'BUSCA_MOTORISTAS_LIST',
		payload: {}
	  });
	},
})

const mapStateToProps = state => ({
	initialValues: state.appReducer.data_caminhao_to_edit,
	isRequesting: state.appReducer.savingCaminhao,
	step: state.appReducer.stepCaminhao,
	empresasList: state.appReducer.empresas,
	motoristasList: state.appReducer.motoristas_list
	//latitude: state.appReducer.user_lat,
	//longitude: state.appReducer.user_lng
	//caminhao: state.appReducer.caminhao_selected
});


export default connect(mapStateToProps, mapDispatchToProps)(FormCaminhao);