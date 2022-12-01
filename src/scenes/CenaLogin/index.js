import React, {Component} from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableNativeFeedback,
  TouchableOpacity,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import AnimatedLoader from '@components/Loader';
import {Image} from 'react-native-elements';
import FormLogin from '@components/Forms/FormLogin';

import GlobalStyle from '@styles/global';
import IMAGES from '@constants/images';
import { connect } from 'react-redux';


import Header from './components/Header';

type Props = {};
export class CenaLogin extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: GlobalStyle.secondary}}>
        <StatusBar
          translucent={true}
          backgroundColor={GlobalStyle.secondary}
          barStyle={'dark-content'}
        />

        <Header />

        <ScrollView style={{flex: 1}}>
        {!this.props.dddCelualrOk && (
          <View style={[GlobalStyle.secureMargin, {flex: 1}]}>
            <View style={styles.imageContainer}>            
              <Image source={IMAGES.LOGIN_ICON_USER} style={{ width: 100, height: 73 }} />
            </View>

            <View style={GlobalStyle.spaceMedium}></View>

            <View style={{flex: 1}}>
              <Text style={[GlobalStyle.textSmall, GlobalStyle.textCenter]}>Coloque o número de celular cadastrado pela sua empresa.</Text>
            </View>

            <View style={GlobalStyle.spaceMedium}></View>
          </View>
        )}
        {this.props.dddCelualrOk && (
          <View style={[GlobalStyle.secureMargin, {flex: 1}]}>

            <View style={{flex: 1}}>
              <Text style={[GlobalStyle.title, GlobalStyle.textCenter]}>Digite a sua senha</Text>
            </View>

            <View style={GlobalStyle.spaceSmall}></View>

            <View style={{flex: 1}}>
              <Text style={[GlobalStyle.title, GlobalStyle.textCenter, { color: '#27AE60', fontWeight: 'bold'}]}>* * * * * *</Text>
            </View>

            <View style={GlobalStyle.spaceSmall}></View>

            <View style={{flex: 1}}>
              <Text style={[GlobalStyle.textSmall, GlobalStyle.textCenter]}>Sua empresa te deu um código  de acesso digite ele no campo abaixo:</Text>
            </View>

            <View style={GlobalStyle.spaceMedium}></View>
          </View>
        )}

          <View style={GlobalStyle.shadowContainer}>
            <FormLogin />
          </View>

          <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={Actions.resetSenha}>
              <Text style={styles.esqueciAsenhaText}>Não tenho esse código</Text>
            </TouchableOpacity>
          </View>         
 
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButtonContainer: {
    marginRight: 10,
    marginTop: 10,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  tagButtonInactive: {
    backgroundColor: '#eee',
  },
  tagButtonActive: {
    backgroundColor: '#a60000',
  },
  tagButtonTextActive: {
    color: '#FFF',
  },
  buttonLimpar: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonLimparText: {
    textAlign: 'center',
  },
  buttonFiltrar: {
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#A60000',
  },
  buttonFiltrarText: {
    textAlign: 'center',
    color: '#FFF',
  },
	imageContainer: { 
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
});

const mapStateToProps = state => ({
	/*initialValues: {
		user: '53999475519',
    	password: 'zap123'
  	},*/
	dddCelualrOk: state.appReducer.ddd_cellhpone_ok
});


export default connect(mapStateToProps, null)(CenaLogin);