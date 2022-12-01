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
class FormSenha extends Component<Props> {
	constructor(props) {
		super(props);
	}

	render() {
        const {handleSubmit} = this.props;
        const submit = values => {

          if (values.password != '') {
            this.props.setModalVisible('false');
          }

          this.props.alteraSenha(values.password);
        };

		return (
			<ScrollView /*keyboardShouldPersistTaps={'handled'}*/>

				<View style={GlobalStyle.spaceSmall} />
				<View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Field
                        name="password"
                        component={FieldTextInputRound}
                        placeholder=""
                        labelText="Senha"
                        keyboardType="default"
                        secureTextEntry={true}
                        maxLength={20}
                        multiline={false}
                        returnKeyType="next"
                        withRef
                        ref={componentRef => (this.field3 = componentRef)}
                        refField="field3"
                        forwardRef
                        />
                    </View>
				</View>


				<View style={GlobalStyle.spaceSmall} />
                <View>
                    <TouchableOpacity
                    onPress={handleSubmit(submit)} style={{opacity: this.props.isRequesting ? .8 : 1}}  disabled={this.props.isRequesting}
                    style={GlobalStyle.defaultButton}>
                    <Text style={GlobalStyle.defaultButtonText}>Alterar Senha</Text>
                    </TouchableOpacity>
					<View style={GlobalStyle.spaceSmall} />
                </View>

			</ScrollView>
	
		);
	}
}

let InitializeFromStateForm = reduxForm({
	form: 'alterarsenha',
	validate: values => {
		const errors = {};
		errors.password = !values.password ? '*' : undefined;

		return errors;
	},
})(FormSenha);

const mapDispatchToProps = dispatch => ({
    alteraSenha(password) {
        dispatch({
            type: 'ALTERAR_SENHA',
            payload: {
                password,
            }
        })
    }
})

const mapStateToProps = state => ({
	isRequesting: state.appReducer.is_changing_password,
});

export default connect(mapStateToProps, mapDispatchToProps)(InitializeFromStateForm);