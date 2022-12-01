import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,

} from 'react-native';
import {SocialIcon, Button} from 'react-native-elements';
import GlobalStyle from '@styles/global';
import FieldTextInput from './Fields/FieldTextInput';

import RNPickerSelect from 'react-native-picker-select';
import AnimatedLoader from '@components/Loader';
import { connect } from 'react-redux';

const dados = {
  nome: "juca"
}
type Props = {};
class FormCadastro extends Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {
    tipoCadastro: '',
    empresa_id: '',
    tipoCavalo: '',
  };
  componentDidMount = () => {
		this.props.buscarEmpresas();
	}

  componentWillUnmount = () => {
		this.props.resetStep();
  } 

  render() {
    const {handleSubmit} = this.props;
    const submit = values => {
      let fields = Object.assign(
        {empresa_id: this.state.empresa_id},
        {tipoCadastro: this.state.tipoCadastro},
        {step: this.props.step},
        {tipoCavalo: this.state.tipoCavalo},
        values,
      );

      this.props.registrar(fields);
    };

    return (
      <ScrollView /*keyboardShouldPersistTaps={'handled'}*/>

        <View style={GlobalStyle.spaceSmall} />

        {this.props.step == 0 && (<View>
          <Text>Vamos fazer o seu cadastro - Passo 1 de 3</Text>
          <View style={GlobalStyle.spaceSmall} />

          <View>
            <Field
              name="nome"
              component={FieldTextInput}
              placeholder=""
              labelText="Nome do frotista"
              keyboardType="default"
              maxLength={80}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field1 = componentRef)}
              refField="field1"
              forwardRef
              onEnter={() => {
                this.field4.getRenderedComponent().refs.field4.focus();
              }}
            />
          </View>

          <View>
            <Text
              style={[GlobalStyle.text, GlobalStyle.label, styles.labelStyle]}>
              Tipo de Cadastro
            </Text>
            <RNPickerSelect
              placeholder={{
                label: 'selecione uma opção...',
                value: '',
              }}
              onValueChange={(value) => { this.setState({tipoCadastro: value})}}
              value={this.state.isManutencao}
              items={[{label: 'Pessoa Jurídica', value: 'PJ'}, {label: 'Pessoa Física', value: 'PF'}]}

            />
          </View>

          {this.state.tipoCadastro == 'PF' && (<View>
            <Field
              name={'cpf'}
              component={FieldTextInput}
              placeholder=""
              labelText="Seu CPF"
              keyboardType="numeric"
              maxLength={14}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field3 = componentRef)}
              refField="field3"
              forwardRef
              mask="cpf"
              onEnter={() => {
                this.field4.getRenderedComponent().refs.field4.focus();
              }}
            />
          </View>)}

          {this.state.tipoCadastro == 'PJ' && (<View>
            <Field
              name={'cnpj'}
              component={FieldTextInput}
              placeholder=""
              labelText="Digite o CNPJ da empresa"
              keyboardType="numeric"
              maxLength={18}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field3 = componentRef)}
              refField="field3"
              forwardRef
              mask="cnpj"
              onEnter={() => {
                this.field4.getRenderedComponent().refs.field4.focus();
              }}
            />
          </View>)}

          <View>
            <Field
              name={'nomeempresa'}
              component={FieldTextInput}
              placeholder=""
              labelText="Nome da empresa"
              keyboardType="default"
              maxLength={40}
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

          <View style={GlobalStyle.row}>
            <View style={{flex: 1}}>
              <Field
                name={'ddd'}
                component={FieldTextInput}
                placeholder=""
                labelText="DDD"
                keyboardType="phone-pad"
                maxLength={2}
                multiline={false}
                returnKeyType="next"
                withRef
                ref={componentRef => (this.field5 = componentRef)}
                refField="field5"
                forwardRef
                onEnter={() => {
                  this.field6.getRenderedComponent().refs.field6.focus();
                }}
              /> 
              
            </View>
            <View style={{flex: 3}}>
              <Field
                name={'telefone'}
                component={FieldTextInput}
                placeholder=""
                labelText="Telefone"
                keyboardType="phone-pad"
                maxLength={9}
                multiline={false}
                returnKeyType="next"
                withRef
                ref={componentRef => (this.field6 = componentRef)}
                refField="field6"
                forwardRef
                onEnter={() => {
                  this.field7.getRenderedComponent().refs.field7.focus();
                }}
              />
            </View>
          </View>
          
          <View>
            <Field
              name={'frota'}
              component={FieldTextInput}
              placeholder=""
              labelText="Frota"
              keyboardType="default"
              maxLength={20}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field7 = componentRef)}
              refField="field7"
              forwardRef
              onEnter={() => {
                this.field8.getRenderedComponent().refs.field8.focus();
              }}
            />
          </View>
          
          <View>
            <Field
              name={'email'}
              component={FieldTextInput}
              placeholder=""
              labelText="Email"
              keyboardType="email-address"
              maxLength={60}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field8 = componentRef)}
              refField="field8"
              forwardRef
              onEnter={() => {
                this.field9.getRenderedComponent().refs.field9.focus();
              }}
            />
          </View>

          <View>
            <Field
              name={'senha'}
              component={FieldTextInput}
              placeholder=""
              labelText="Senha"
              secureTextEntry
              keyboardType="default"
              maxLength={20}
              multiline={false}
              returnKeyType="done"
              withRef
              ref={componentRef => (this.field9 = componentRef)}
              refField="field9"
              textContentType="password"
              forwardRef
              onEnter={() => {
							  this.buttonNext.props.onPress();
              }}
            />
          </View>

          <View>
            <Text
              style={[GlobalStyle.text, GlobalStyle.label, styles.labelStyle]}>
              Em qual dessas empresas você trabalha?
            </Text>
            <RNPickerSelect
              placeholder={{
                label: 'selecione uma opção...',
                value: '',
              }}
              onValueChange={(value) => { this.setState({empresa_id: value})}}
              items={this.props.empresasList}

            />
          </View>

        </View>)}

        {this.props.step == 1 && (<View>
          <Text>Cadastro complementar - Passo 2 de 3</Text>
          <View style={GlobalStyle.spaceSmall} />

          <View>
            <Field
              name="motorista_nome"
              component={FieldTextInput}
              placeholder=""
              labelText="Nome do motorista"
              keyboardType="default"
              maxLength={80}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field10 = componentRef)}
              refField="field10"
              forwardRef
              onEnter={() => {
                this.field11.getRenderedComponent().refs.field11.focus();
              }}
            />
          </View>

          <View style={GlobalStyle.row}>
            <View style={{flex: 1}}>
              <Field
                name={'motorista_ddd'}
                component={FieldTextInput}
                placeholder=""
                labelText="DDD"
                keyboardType="phone-pad"
                maxLength={2}
                multiline={false}
                returnKeyType="next"
                withRef
                ref={componentRef => (this.field11 = componentRef)}
                refField="field11"
                forwardRef
                onEnter={() => {
                  this.field12.getRenderedComponent().refs.field12.focus();
                }}
              /> 
              
            </View>
            <View style={{flex: 3}}>
              <Field
                name={'motorista_telefone'}
                component={FieldTextInput}
                placeholder=""
                labelText="Telefone do Motorista"
                keyboardType="phone-pad"
                maxLength={9}
                multiline={false}
                returnKeyType="next"
                withRef
                ref={componentRef => (this.field12 = componentRef)}
                refField="field12"
                forwardRef
                onEnter={() => {
                  this.field13.getRenderedComponent().refs.field13.focus();
                }}
              />
            </View>
          </View>

          <View>
            <Field
              name={'motorista_senha'}
              component={FieldTextInput}
              placeholder=""
              labelText="Senha (Será a senha de acesso do motorista)"
              secureTextEntry
              keyboardType="default"
              maxLength={20}
              multiline={false}
              returnKeyType="done"
              withRef
              ref={componentRef => (this.field13 = componentRef)}
              refField="field13"
              textContentType="password"
              forwardRef
              onEnter={() => {
                this.field14.getRenderedComponent().refs.field14.focus();
              }}
            />
          </View>

          <View>
            <Field
              name="placa_cavalo"
              component={FieldTextInput}
              placeholder=""
              labelText="Placa do cavalo"
              keyboardType="default"
              maxLength={10}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field14 = componentRef)}
              refField="field14"
              forwardRef
              onEnter={() => {
                this.field15.getRenderedComponent().refs.field15.focus();
              }}
            />
          </View>

          <View>
            <Field
              name="placa_reboque"
              component={FieldTextInput}
              placeholder=""
              labelText="Placa do reboque"
              keyboardType="default"
              maxLength={10}
              multiline={false}
              returnKeyType="done"
              withRef
              ref={componentRef => (this.field15 = componentRef)}
              refField="field15"
              forwardRef
              onEnter={() => {                
							  this.buttonNext.props.onPress();
              }}
            />
          </View>

          <View>
            <Text
              style={[GlobalStyle.text, GlobalStyle.label, styles.labelStyle]}>
              Cavalo Trucado ou Toco?
            </Text>
            <RNPickerSelect
              placeholder={{
                label: 'selecione uma opção...',
                value: '',
              }}
              onValueChange={(value) => { this.setState({tipoCavalo: value})}}
              value={this.state.tipoCavalo}
              items={[{label: 'Trucado', value: 'Trucado'}, {label: 'Toco', value: 'Toco'}]}

            />
          </View>

        </View>)}
        
        {this.props.step == 2 && (<View>
          <Text>Indique para algum conhecido para testar GRATUITAMENTE - Passo 3 de 3</Text>
          <View style={GlobalStyle.spaceSmall} />

          <View>
            <Field
              name="indicacao1_nome"
              component={FieldTextInput}
              placeholder=""
              labelText="Nome da indicação 1"
              keyboardType="default"
              maxLength={80}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field20 = componentRef)}
              refField="field20"
              forwardRef
              onEnter={() => {
                this.field21.getRenderedComponent().refs.field21.focus();
              }}
            />
          </View>

          <View style={GlobalStyle.row}>
            <View style={{flex: 1}}>
              <Field
                name={'indicacao1_ddd'}
                component={FieldTextInput}
                placeholder=""
                labelText="DDD"
                keyboardType="phone-pad"
                maxLength={2}
                multiline={false}
                returnKeyType="next"
                withRef
                ref={componentRef => (this.field21 = componentRef)}
                refField="field21"
                forwardRef
                onEnter={() => {
                  this.field22.getRenderedComponent().refs.field22.focus();
                }}
              /> 
              
            </View>
            <View style={{flex: 3}}>
              <Field
                name={'indicacao1_telefone'}
                component={FieldTextInput}
                placeholder=""
                labelText="Telefone da indicação 1"
                keyboardType="phone-pad"
                maxLength={9}
                multiline={false}
                returnKeyType="next"
                withRef
                ref={componentRef => (this.field22 = componentRef)}
                refField="field22"
                forwardRef
                onEnter={() => {
                  this.field23.getRenderedComponent().refs.field23.focus();
                }}
              />
            </View>
          </View>

          <View>
            <Field
              name="indicacao2_nome"
              component={FieldTextInput}
              placeholder=""
              labelText="Nome da indicação 2"
              keyboardType="default"
              maxLength={80}
              multiline={false}
              returnKeyType="next"
              withRef
              ref={componentRef => (this.field23 = componentRef)}
              refField="field23"
              forwardRef
              onEnter={() => {
                this.field24.getRenderedComponent().refs.field24.focus();
              }}
            />
          </View>

          <View style={GlobalStyle.row}>
            <View style={{flex: 1}}>
              <Field
                name={'indicacao2_ddd'}
                component={FieldTextInput}
                placeholder=""
                labelText="DDD"
                keyboardType="phone-pad"
                maxLength={2}
                multiline={false}
                returnKeyType="next"
                withRef
                ref={componentRef => (this.field24 = componentRef)}
                refField="field24"
                forwardRef
                onEnter={() => {
                  this.field25.getRenderedComponent().refs.field25.focus();
                }}
              /> 
              
            </View>
            <View style={{flex: 3}}>
              <Field
                name={'indicacao2_telefone'}
                component={FieldTextInput}
                placeholder=""
                labelText="Telefone da indicação 2"
                keyboardType="phone-pad"
                maxLength={9}
                multiline={false}
                returnKeyType="done"
                withRef
                ref={componentRef => (this.field25 = componentRef)}
                refField="field25"
                forwardRef
                onEnter={() => {
							    this.buttonNext.props.onPress();
                }}
              />
            </View>
          </View>

        </View>)}

        <View style={GlobalStyle.spaceSmall} />
        {
          //formStates.filter((state) => this.props[state]).map((state) => {
          //  return <Text key={state}> - { state }</Text>
          //})
        }
        {!this.props.isRequesting && (
          <View>
            <View
              style={[
                GlobalStyle.row,
                {
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={styles.textTermos}>
                Continuando, eu confirmo que li os termos abaixo{' '}
              </Text>
              <Text style={GlobalStyle.fontDark}>Termos e Condições</Text>
              <Text> e </Text>
              <Text>Política de Privacidade</Text>
            </View>
            <View style={GlobalStyle.spaceSmall} />

              <TouchableOpacity
                onPress={handleSubmit(submit)} 
                style={{opacity: this.props.isRequesting ? 0.6 : 1}} 
                disabled={this.props.isRequesting}
                style={GlobalStyle.defaultButton}
                ref={TouchableOpacity => this.buttonNext = TouchableOpacity}
              >
                <Text style={GlobalStyle.defaultButtonText}>{this.props.step < 2 ? 'Próximo Passo' : 'Finalizar Cadastro'}</Text>
              </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textTermos: {
    color: '#999',
  },
  labelStyle: {
    
  }
});

let InitializeFromStateForm = reduxForm({
  form: 'cadastro',
  validate: values => {
    const errors = {};
    errors.nome = !values.nome ? 'Obrigatório' : undefined;
    errors.cpf = !values.cpf ? 'Obrigatório' : undefined;
    errors.cnpj = !values.cnpj ? 'Obrigatório' : undefined;
    errors.nomeempresa = !values.nomeempresa ? 'Obrigatório' : undefined;
    errors.ddd = !values.ddd ? 'Obrigatório' : undefined;
    errors.telefone = !values.telefone ? 'Obrigatório' : undefined;
    errors.frota = !values.frota ? 'Obrigatório' : undefined;
    errors.email = !values.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email) ? 'Email inválido!' : undefined;
    errors.senha = !values.senha ? 'Obrigatório' : undefined;
    errors.tipoCadastro = !values.tipoCadastro ? 'Obrigatório' : undefined;

    errors.motorista_nome = !values.motorista_nome ? 'Obrigatório' : undefined;
    errors.motorista_ddd = !values.motorista_ddd ? 'Obrigatório' : undefined;
    errors.motorista_telefone = !values.motorista_telefone ? 'Obrigatório' : undefined;
    errors.motorista_senha = !values.motorista_senha ? 'Obrigatório' : undefined;
    errors.placa_cavalo = !values.placa_cavalo ? 'Obrigatório' : undefined;
    errors.placa_reboque = !values.placa_reboque ? 'Obrigatório' : undefined;
    return errors;
  },
})(FormCadastro);

const mapDispatchToProps = dispatch => ({
  resetStep() {
    dispatch({
      type: 'RESET_STEP_CADASTRO',
      payload: {}
    });
  },
  buscarEmpresas() {
    dispatch({
      type: 'BUSCA_EMPRESAS',
      payload: {}
    });
  },
  registrar(fields) {
    dispatch({
        type: 'REGISTRAR',
        payload: fields
    })
  }
});


const mapStateToProps = state => ({
  step: state.appReducer.stepCadastro,
  isRequesting: state.appReducer.is_cadastrando,
  empresasList: state.appReducer.empresas,
})

InitializeFromStateForm = connect(mapStateToProps, mapDispatchToProps)(InitializeFromStateForm);



export default InitializeFromStateForm;