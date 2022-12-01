import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';
import { RNCamera } from 'react-native-camera';
import { FormSaveBarCode } from '@components/Forms/FormSaveBarCode';
import { FromEnterBarcode } from '@components/Forms/FromEnterBarcode';
import COLORS from '@constants/colors';
import GlobalStyle from '@styles/global';
import { Actions } from 'react-native-router-flux';

export default function ModalBarcodeReader(props) {

  const [scanned, setScanned] = useState(false);
  const [barcodescanned, setbarCodeScanned] = useState(null);
  const [typeEntreBarcode, setTypeEntreBarcode] = useState(1);
  const [flashMode, setFlashMode] = useState(1);

  let [camera, setCamera] = useState(
    {
      type: RNCamera.Constants.Type.back,
      flashMode: RNCamera.Constants.FlashMode.auto,
    }
  );

  const handleBarCodeScanned = ({ type, data }) => {
    console.log(data);
    setScanned(true);
    setbarCodeScanned(data);
  };

  const backToScanner = () => {
    setScanned(false);
    setbarCodeScanned(null);
    setTypeEntreBarcode(1);
  };

  if ( !scanned && typeEntreBarcode == 1) {
    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
              camera = ref;
            }}
            defaultTouchToFocus
            flashMode={camera.flashMode}
            mirrorImage={false}
            onBarCodeRead={handleBarCodeScanned}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            permissionDialogTitle={'Permissão para usar a câmera'}
            permissionDialogMessage={'Precisamos da sua permissão para usar o telefone com câmera'}
            style={styles.preview}
            type={camera.type}
        />
        <View style={[styles.overlay, styles.topOverlay]}>
          <Text style={styles.scanScreenMessage}>Mire a câmera em um código de barras.</Text>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          <Button
            onPress={() => { Actions.pop(); }}
            buttonStyle={styles.enterBarcodeManualButton}
            titleStyle={styles.enterBarcodeManualButtonTitle}
            title="< Voltar"
          />
          <Button
            onPress={() => { setTypeEntreBarcode(2) }}
            buttonStyle={styles.enterBarcodeManualButton}
            titleStyle={styles.enterBarcodeManualButtonTitle}
            title="Digitar manualmente"
          />
        </View>
      </View>
    );
  
  } else if (!scanned && typeEntreBarcode == 2){
    return (
      <SafeAreaView style={{flex: 1}}>
        <FromEnterBarcode setScanned={() => {setScanned(false)}} handleBarCodeScanned={handleBarCodeScanned} backToScanner={backToScanner} origin={props.origin} />
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <FormSaveBarCode barcodescanned={barcodescanned} setSaved={() => {setScanned(false)}} origin={props.origin} backToScanner={backToScanner} />
      </SafeAreaView>
    )
  }
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 10,
    backgroundColor: "#f7f7f7"
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
    color: COLORS.primary
  },
  enterBarcodeManualButtonTitle: {
    color: COLORS.primary
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
};
