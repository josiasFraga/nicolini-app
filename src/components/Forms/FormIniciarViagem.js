import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet
} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import GlobalStyle from '@styles/global';
import FieldTextInput from './Fields/FieldTextInput';
import FieldTextInputRound from './Fields/FieldTextInputRound';
import AnimatedLoader from '@components/Loader';
import {Actions} from 'react-native-router-flux';
import { connect} from 'react-redux';


import COLORS from '@constants/colors';

type Props = {};
class FormIniciarViagem extends Component<Props> {
	constructor(props) {
		super(props);
	}

	render() {
    	const {handleSubmit} = this.props;

		return (
			<ScrollView /*keyboardShouldPersistTaps={'handled'}*/>

				{this.props.step == 0 && (<View>

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Carregou para onde?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual o destino final da carga?</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="destino"
							component={FieldTextInputRound}
							placeholder=""
							labelText="Destino"
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

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Qual o frete?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual o valor do frete da carga?</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>					
							<Field
							name="valor"
							component={FieldTextInputRound}
							placeholder=""
							labelText="Valor do Frete"
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

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Qual o KM atual?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Qual o KM do Odômetro no inicio da viagem?</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>
							<Field
							name="km"
							component={FieldTextInputRound}
							placeholder=""
							labelText="KM"
							keyboardType="numeric"
							maxLength={10}
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

					<Text style={[GlobalStyle.modalSubtitle, GlobalStyle.textCenter]}>Recebeu adiantamento?</Text>
					<Text style={[GlobalStyle.textCenter, {color: COLORS.quaternary}]}>Se recebeu, digite o valor abaixo, senão deixe em branco</Text>

					<View style={GlobalStyle.spaceSmall} />
					<View style={{flexDirection: 'row'}}>
						<View style={{flex: 1}}>
							<Field
							name="adiantamento"
							component={FieldTextInputRound}
							placeholder=""
							labelText="Valor de Adiantamento"
							keyboardType="decimal-pad"
							maxLength={20}
							minLength={1}
							multiline={false}
							returnKeyType="done"
							withRef
							mask="money"
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


				<View style={GlobalStyle.spaceSmall} />
                <View>
                    <TouchableOpacity
                    onPress={handleSubmit((values) => this.props.iniciaViagem(this.props.step, values.destino, values.valor, values.km, values.adiantamento, this.props.caminhao))} 
					style={{opacity: this.props.isRequesting ? .8 : 1}}  
					disabled={this.props.isRequesting}
                    style={GlobalStyle.defaultButton}
					ref={TouchableOpacity => this.buttonNext = TouchableOpacity}
					>
                    <Text style={GlobalStyle.defaultButtonText}>Iniciar Viagem</Text>
                    </TouchableOpacity>
					<View style={GlobalStyle.spaceSmall} />
                </View>

			</ScrollView>
	
		);
	}
}


let InitializeFromStateForm = reduxForm({
	form: 'iniciarviagem',
	validate: values => {
		const errors = {};
		errors.destino = !values.destino ? '*' : undefined;
		errors.valor = !values.valor ? '*' : undefined;
		errors.km = !values.km ? '*' : undefined;

		return errors;
	},
})(FormIniciarViagem);



const mapDispatchToProps = dispatch => ({
    iniciaViagem(step, destino, valor, km, adiantamento, caminhao) {
        dispatch({
            type: 'INICIAR_VIAGEM',
            payload: {
				step,
				destino,
				valor,
				km,
				adiantamento,
				caminhao
            }
        })
    }
})

const mapStateToProps = state => ({
	isRequesting: state.appReducer.is_starting_viagem,
	step: state.appReducer.stepIniciarViagem,
	caminhao: state.appReducer.caminhao_selected
});


export default connect(mapStateToProps, mapDispatchToProps)(InitializeFromStateForm);