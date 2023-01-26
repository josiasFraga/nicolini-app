import React from 'react';
import {Icon, Text} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import COLORS from '@constants/colors';
import {StyleSheet, View, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalAbastecimento from '@components/Modals/ModalAbastecimento';
import ModalDespesa from '@components/Modals/ModalDespesa';
import ModalPneus from '@components/Modals/ModalPneus';
import GlobalStyle from '@styles/global';

type Props = {};
export default class LeftMenu extends React.Component<Props> {

    state = {
        modalAbastecimentoVisible: false,
        modalDespesaVisible: false,
        modalPneusVisible: false,
        admin_id: ''
    };

    constructor(props) {
      super(props);
      this.setModalAbastecimentoVisible = this.setModalAbastecimentoVisible.bind(this);
      this.setModalDespesaVisible = this.setModalDespesaVisible.bind(this);
      this.setModalPneusVisible = this.setModalPneusVisible.bind(this);
    }

    setModalAbastecimentoVisible(visible) {
      this.setState({modalAbastecimentoVisible: visible});
    }

    setModalDespesaVisible(visible) {
      this.setState({modalDespesaVisible: visible});
    }

    setModalPneusVisible(visible) {
      this.setState({modalPneusVisible: visible});
    }

  
    componentDidMount = async() => {
      await AsyncStorage.getItem("usuario", (err, result) => {
        if (  err == null ) {
          let usuario = JSON.parse(result);
          if (  usuario != null && typeof(usuario.nome)  != 'undefined') {
            this.setState({admin_id: usuario.admin_id});
          }

        }
  
      });
    }

  render() {

    return (
        
        <ScrollView>

        <ModalAbastecimento
          modalVisible={this.state.modalAbastecimentoVisible}
          setModalVisible={this.setModalAbastecimentoVisible}
          dados={{}}
        />

        <ModalDespesa
          modalVisible={this.state.modalDespesaVisible}
          setModalVisible={this.setModalDespesaVisible}
          dados={{}}
        />

        <ModalPneus
          modalVisible={this.state.modalPneusVisible}
          setModalVisible={this.setModalPneusVisible}
        />
        <View style={defaultStyles.navContainer}>
            {this.props.viagemAtiva && (
              <View>
                <View style={defaultStyles.navItem}>
                    <View style={defaultStyles.navItemIcon}>
                        <Icon
                          name="local-gas-station"
                          type="material-icons"
                          color={COLORS.quaternary}
                          size={50}
                          onPress={() => this.setModalAbastecimentoVisible(true)}
                          containerStyle={{backgroundColor: 'transparent'}}
                        />
                    </View>
                    <View style={defaultStyles.navItemTextContainer}><Text style={defaultStyles.navItemText}>Abastecimentos</Text></View>
                </View>
    
                <View style={GlobalStyle.spaceSmall} />
    
                <View style={defaultStyles.navItem}>
                    <View style={defaultStyles.navItemIcon}>
                        <Icon
                          name="attach-money"
                          type="material-icons"
                          color={COLORS.quaternary}
                          size={50}
                          onPress={() => this.setModalDespesaVisible(true)}
                          containerStyle={{backgroundColor: 'transparent'}}
                        />
                    </View>
                    <View style={defaultStyles.navItemTextContainer}><Text style={defaultStyles.navItemText}>Despesas</Text></View>
                </View>
              </View>
            )}
            {this.state.admin_id === null && (
              <View>
                <View style={defaultStyles.navItem}>
                    <View style={defaultStyles.navItemIcon}>
                        <Icon
                          name="truck"
                          type="feather"
                          color={COLORS.quaternary}
                          size={50}
                          onPress={() => Actions.caminhoes()}
                          containerStyle={{backgroundColor: 'transparent'}}
                        />
                    </View>
                    <View style={defaultStyles.navItemTextContainer}><Text style={defaultStyles.navItemText}>Caminhões</Text></View>
                </View>
    
                <View style={GlobalStyle.spaceSmall} />

                <View style={defaultStyles.navItem}>
                    <View style={defaultStyles.navItemIcon}>
                        <Icon
                          name="users"
                          type="feather"
                          color={COLORS.quaternary}
                          size={50}
                          onPress={() => Actions.motoristas()}
                          containerStyle={{backgroundColor: 'transparent'}}
                        />
                    </View>
                    <View style={defaultStyles.navItemTextContainer}><Text style={defaultStyles.navItemText}>Motoristas</Text></View>
                </View>
    
                <View style={GlobalStyle.spaceSmall} />

                <View style={defaultStyles.navItem}>
                    <View style={defaultStyles.navItemIcon}>
                        <Icon
                          name="credit-card"
                          type="entypo"
                          color={COLORS.quaternary}
                          size={45}
                          onPress={() => Actions.financeiro()}
                          containerStyle={{backgroundColor: 'transparent'}}
                        />
                    </View>
                    <View style={defaultStyles.navItemTextContainer}><Text style={defaultStyles.navItemText}>Financeiro</Text></View>
                </View>
              </View>

            )}
            {1 == 0 && (
            <View style={defaultStyles.navItem}>
                <View style={defaultStyles.navItemIcon}>
                    <Icon
                      name="tools"
                      type="entypo"
                      color={COLORS.quaternary}
                      size={50}
                      //onPress={() => Actions[cenaToOpen].call()}
                      containerStyle={{backgroundColor: 'transparent'}}
                    />
                </View>
                <View style={defaultStyles.navItemTextContainer}><Text style={defaultStyles.navItemText}>Manutenções</Text></View>
            </View>
            )}
            {1==2 && (<View style={defaultStyles.navItem}>
                <View style={defaultStyles.navItemIcon}>
                    <Icon
                      name="circle-slice-8"
                      type="material-community"
                      color={COLORS.quaternary}
                      size={50}
                      onPress={() => this.setModalPneusVisible(true)}
                      containerStyle={{backgroundColor: 'transparent'}}
                    />
                </View>
                <View style={defaultStyles.navItemTextContainer}><Text style={defaultStyles.navItemText}>Pneus</Text></View>
            </View>)}

        </View>
        </ScrollView>
    );
  }
}

const defaultStyles = StyleSheet.create({
    navContainer: {
        marginBottom: 50
    },
    navItem: {
        marginBottom: 15,
        alignItems: 'center'
    },
    navItemText: {
        color: COLORS.quaternary,
        fontSize: 12,
        fontWeight: "bold"
    }
});
