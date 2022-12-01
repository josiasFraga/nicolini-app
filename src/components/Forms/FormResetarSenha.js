import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import GlobalStyle from '@styles/global';
import FieldTextInputRound from './Fields/FieldTextInputRound';
import AnimatedLoader from '@components/Loader';

type Props = {};
class FormResetarSenha extends Component<Props> {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    this.props.initialize({n: this.props.addressData.n});
  }

  render() {
    const {handleSubmit} = this.props;
    const submit = values => {
      let fields = Object.assign(
        {token: this.props.accessToken},
        this.props.addressData,
        values,
      );
      this.props.submitForm(fields);
    };

    return (
      <ScrollView /*keyboardShouldPersistTaps={'handled'}*/>
        <View style={GlobalStyle.spaceSmall} />

				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<Field
						name="ddd"
						component={FieldTextInputRound}
						placeholder=""
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
					<View style={{flex: 3}}>					
						<Field
						name="celular"
						component={FieldTextInputRound}
						placeholder=""
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
							this.field3.getRenderedComponent().refs.field3.focus();
						}}
						/>
					</View>
				</View>
        <View style={GlobalStyle.spaceSmall} />
        {
          //formStates.filter((state) => this.props[state]).map((state) => {
          //  return <Text key={state}> - { state }</Text>
          //})
        }
        {!this.props.isRequesting && (
          <TouchableOpacity onPress={() => alert("Em manutenção..")}>
            <SocialIcon button type="" title="Enviar código" style={{backgroundColor: '#2E5878'}} />
          </TouchableOpacity>
        )}
        {this.props.isRequesting && (
          <TouchableWithoutFeedback>
            <View style={GlobalStyle.buttonContainerLoading}>
              <AnimatedLoader visible={true} speed={1} />
            </View>
          </TouchableWithoutFeedback>
        )}
      </ScrollView>
    );
  }
}

let InitializeFromStateForm = reduxForm({
  form: 'endereco',
  validate: values => {
    const errors = {};
    errors.ddd = !values.ddd ? '' : undefined;
    errors.celular = !values.celular ? '' : undefined;
    

    return errors;
  },
})(FormResetarSenha);

export default InitializeFromStateForm;
