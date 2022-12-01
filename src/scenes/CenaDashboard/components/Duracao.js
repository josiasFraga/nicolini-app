import React from 'react';
import {
    View,
  } from 'react-native';

import {Text } from 'react-native-elements';

import GlobalStyle from '@styles/global';

import moment from "moment";

type Props = {};
export default class Duracao extends React.Component<Props> {
    constructor (props) {

        super(props);
        this.state = {
        duracao_dias: '',
        duracao_horas: '',
        };
  }


    componentDidMount = () => {

        if ( typeof(this.props.viagemAtiva.Viagem) != 'undefined' && this.props.viagemAtiva ) {

            let interval = setInterval(() => {
              if ( typeof(this.props.viagemAtiva.Viagem) != 'undefined' && this.props.viagemAtiva ) {
                var date1 = moment().utcOffset('-03:00:00');
                var date2 = moment(this.props.viagemAtiva.Viagem.data_viagem_ini).utcOffset('-03:00:00');
                var diffD = date1.diff(date2, 'days');
                var diffH = date1.diff(date2, 'hours');
                var diffM = date1.diff(date2, 'minutes');
                var diffS = date1.diff(date2, 'seconds');
                this.setState({duracao_dias: diffD});
                this.setState({duracao_horas: Math.floor(diffH % 24)+ ':'+Math.floor(diffM % 60) + ':' + Math.floor(diffS % 60)});
              } else {
                clearInterval(interval)
              }
            },1000);
            

        }
    };
  render() {

    return (
        <View>
            <Text style={[GlobalStyle.title, {color: '#FFF'}]}>{this.props.viagemAtiva.Viagem ? this.state.duracao_dias + ' dias': ''} </Text>
            <Text style={[GlobalStyle.title, {color: '#FFF'}]}>{this.props.viagemAtiva.Viagem ? this.state.duracao_horas : ''}</Text>
            {this.props.viagemAtiva.Viagem && (<Text style={[{color: '#FFF'}]}>Duração</Text>)}
        </View>
    );
  }
}
