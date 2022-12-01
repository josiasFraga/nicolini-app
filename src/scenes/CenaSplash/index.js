import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Image,
	StatusBar,
	Text
} from 'react-native';
import {Actions,ActionConst} from 'react-native-router-flux';
import IMAGES from '@constants/images';
import NetInfo from "@react-native-community/netinfo";


type Props = {};
export default class CenaSplash extends Component<Props> {

	componentDidMount = async () => {
		

		const networkStatus = await NetInfo.fetch();
		if (!networkStatus.isConnected) { // @INVERNTER !!!
			console.log("Sem internet");
			setTimeout(() => {
				Actions.home({type: ActionConst.RESET});
			},5000);			
		} else {
			console.log("tem internet");
			setTimeout(() => {
				Actions.home({type: ActionConst.RESET});
			},5000);								
		}



	}
	render() {
		return (
			<View style={styles.container}>
				<StatusBar
					translucent={true}
					backgroundColor={'transparent'}
					barStyle={'dark-content'}
				/>

				<View style={styles.imageContainer}>
					<Image source={IMAGES.LOGO} style={{ width: 200, height: 160 }} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	container: {
		flex: 1,
	}
});


