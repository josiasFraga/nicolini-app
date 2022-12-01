import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Picker,
  TouchableHighlight,
} from 'react-native';
import GlobalStyle from '@styles/global';

import FieldPicker from './Fields/FieldPicker';
import FieldTextInputRound from './Fields/FieldTextInputRound';
import AnimatedLoader from '@components/Loader';

type Props = {};
class FormCarregamentoDescarregamento extends Component<Props> {
  constructor(props) {
    super(props);
  }

  state = {
    modalVisible: false,
  };

  openModal() {
    this.setState({modalVisible: true});
  }

  closeModal() {
    this.setState({modalVisible: false});
  }

  render() {
    const {handleSubmit} = this.props;
    
    const submit = values => {
      let fields = Object.assign(
          {gps_lat: this.props.latitude},
          {gps_lng: this.props.longitude},
          values,
        );
        this.props.submitForm(fields);
    };

    return (
      <View style={{flex:1}}>
        <ScrollView>
          {this.props.header}
          <View style={GlobalStyle.divider} />
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
                  Título:
                </Text>
                <Field
                  name="titulo"
                  component={FieldPicker}
                  placeholder=""
                  labelText="Título"
                  keyboardType="default"
                  maxLength={20}
                  multiline={false}
                  returnKeyType="next"
                  withRef
                  ref={componentRef => (this.field1 = componentRef)}
                  refField="field1"
                  forwardRef
                  onEnter={() => {
                    this.field2.getRenderedComponent().refs.field2.focus();
                  }}>
                  <Picker.Item label="Selecione.." value="" />
                  <Picker.Item label="Carregamento" value="1" />
                  <Picker.Item label="Descarregamento" value="2" />
                </Field>
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
                  Cidade:
                </Text>
                <Field
                  name="cidade"
                  component={FieldTextInputRound}
                  placeholder=""
                  labelText="Cidade"
                  keyboardType="default"
                  maxLength={20}
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

            <View style={[GlobalStyle.secureMargin]}>
              <View>
                <View style={GlobalStyle.row}>
                  <Text
                    style={[
                      GlobalStyle.labelMarker,
                      GlobalStyle.textCenterVertically,
                    ]}>
                    ■
                  </Text>
                  <Text
                    style={[
                      styles.labelDesc,
                      GlobalStyle.textCenterVertically,
                    ]}>
                    Descrição da Carga/Descarga:
                  </Text>
                </View>
                <Field
                  name="descricao"
                  component={FieldTextInputRound}
                  placeholder=""
                  labelText="Descrição da Carga/Descarga"
                  keyboardType="default"
                  maxLength={200}
                  multiline={true}
                  returnKeyType="next"
                  withRef
                  ref={componentRef => (this.field3 = componentRef)}
                  refField="field3"
                  forwardRef
                  onEnter={() => {
                    this.field1.getRenderedComponent().refs.field1.focus();
                  }}
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
            style={GlobalStyle.defaultButton}>
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
  form: 'FormCarregamentoDescarregamento',
  validate: values => {
    const errors = {};
    errors.titulo = !values.titulo ? 'Obrigatório' : undefined;
    errors.cidade = !values.cidade ? 'Obrigatório' : undefined;
    errors.descricao = !values.descricao ? 'Obrigatório' : undefined;

    return errors;
  },
})(FormCarregamentoDescarregamento);

export default InitializeFromStateForm;
