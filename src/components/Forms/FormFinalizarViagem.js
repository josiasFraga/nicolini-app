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
class FormFinalizarViagem extends Component<Props> {
	constructor(props) {
		super(props);
	}

	render() {
    	const {handleSubmit} = this.props;

		return (
			<ScrollView /*keyboardShouldPersistTaps={'handled'}*/>

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
						returnKeyType="done"
						withRef
						ref={componentRef => (this.field1 = componentRef)}
						refField="field1"
						forwardRef
						onEnter={() => {
							this.buttonNext.props.onPress();
						}}
						/>
					</View>
				</View>


				<View style={GlobalStyle.spaceSmall} />
                <View>
                    <TouchableOpacity
                    onPress={handleSubmit((values) => this.props.paraViagem(values.km))} style={{opacity: this.props.isRequesting ? .8 : 1}}  disabled={this.props.isRequesting}
                    style={GlobalStyle.defaultButton}					
					ref={TouchableOpacity => this.buttonNext = TouchableOpacity}
					>
                    <Text style={GlobalStyle.defaultButtonText}>Finalizar Viagem</Text>
                    </TouchableOpacity>
					<View style={GlobalStyle.spaceSmall} />
                </View>

			</ScrollView>
	
		);
	}
}


let InitializeFromStateForm = reduxForm({
	form: 'finalizarviagem',
	validate: values => {
		const errors = {};
		errors.km = !values.km ? '*' : undefined;

		return errors;
	},
})(FormFinalizarViagem);



const mapDispatchToProps = dispatch => ({
    paraViagem(km) {
        dispatch({
            type: 'PARAR_VIAGEM',
            payload: {
                km,
            }
        })
    }
})

const mapStateToProps = state => ({
	isRequesting: state.appReducer.is_stopping_viagem,
});


export default connect(mapStateToProps, mapDispatchToProps)(InitializeFromStateForm);