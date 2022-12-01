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
import FieldTextInputRound from './Fields/FieldTextInputRound';
import AnimatedLoader from '@components/Loader';
import {Actions} from 'react-native-router-flux';
import { connect} from 'react-redux';

type Props = {};
class FormLogin extends Component<Props> {
	constructor(props) {
		super(props);
	}
	
	componentDidMount = () => {
		this.props.resetStep();
	}

	render() {
    	const {handleSubmit} = this.props;

		return (
			<ScrollView /*keyboardShouldPersistTaps={'handled'}*/>

				<View style={GlobalStyle.spaceSmall} />
				{!this.props.dddCelualrOk && (
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="ddd"
						component={FieldTextInputRound}
						placeholder="DDD"
						labelText="DDD"
						keyboardType="numeric"
						maxLength={2}
						minLength={2}
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
					<View style={{flex: 2}}>					
						<Field
						name="celular"
						component={FieldTextInputRound}
						placeholder="Celular"
						labelText="CELULAR"
						keyboardType="numeric"
						maxLength={9}
						minLength={9}
						multiline={false}
						returnKeyType="next"
						withRef
						ref={componentRef => (this.field2 = componentRef)}
						refField="field2"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
						}}
						/>
					</View>
				</View>
				)}
				{this.props.dddCelualrOk && (
				<View style={{flex: 4}}>
					<Field
					name="password"
					component={FieldTextInputRound}
					placeholder="Senha"
					labelText="Senha"
					keyboardType="default"
					secureTextEntry={true}
					maxLength={20}
					multiline={false}
					returnKeyType="done"
					withRef
					ref={componentRef => (this.field3 = componentRef)}
					refField="field3"
					forwardRef
					onEnter={() => {						
						this.buttonNext.props.onPress();
					}}
					/>
				</View>
				)}
				<View style={GlobalStyle.spaceSmall} />
				<View>
					<TouchableOpacity 
						onPress={handleSubmit((values) => this.props.login(values.ddd, values.celular, values.password))} 
						style={{opacity: this.props.isRequesting ? .8 : 1}}
						disabled={this.props.isRequesting}
						ref={component => this.buttonNext = component}
					>
						<SocialIcon
							button
							type=""
							title={this.props.dddCelualrOk  ? 'Entrar' : 'Próximo'}
							style={{backgroundColor: '#c43638'}}
						/>
					</TouchableOpacity>
					<View style={GlobalStyle.spaceSmall} />
				</View>

			</ScrollView>
	
		);
	}
}
const styles = StyleSheet.create({
	esqueciAsenhaText: {
		color: '#2e5878',
		alignSelf: 'center',
		fontSize: 18,
	},
})

let InitializeFromStateForm = reduxForm({
	form: 'endereco',
	validate: values => {
		const errors = {};
		errors.ddd = !values.ddd ? ' ' : undefined;
		errors.celular = !values.celular ? ' ' : undefined;
		//errors.password = !values.password ? ' ' : undefined;

		var ddd = values.ddd;
		if ( typeof ddd != 'undefined' ) {
			errors.ddd = ddd.length < 2 ? ' ' : undefined;
		}

		var celular = values.celular;
		if ( typeof celular != 'undefined' ) {
			errors.celular = celular.length < 9 ? ' ' : undefined;
		}
		return errors;
	},
})(FormLogin);



const mapDispatchToProps = dispatch => ({
    resetStep() {
        dispatch({
            type: 'RESET_STEP_LOGIN',
        })
    },
    login(ddd, celular, password) {
        dispatch({
            type: 'LOGIN_TRIGGER',
            payload: {
              ddd,
			  celular,
			  password
            }
        })
    }
})

const mapStateToProps = state => ({
	/*initialValues: {
		user: '53999475519',
    	password: 'zap123'
  	},*/
	isRequesting: state.appReducer.is_requesting,
	dddCelualrOk: state.appReducer.ddd_cellhpone_ok
});


export default connect(mapStateToProps, mapDispatchToProps)(InitializeFromStateForm);