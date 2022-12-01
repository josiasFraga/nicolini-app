import React from 'react';
import {StyleSheet, PixelRatio} from 'react-native';
import {Scene, Router, Stack, Modal} from 'react-native-router-flux';

import CenaHome from '@scenes/CenaHome';
import CenaSplash from '@scenes/CenaSplash';
import CenaColetagemAvulsa from '@scenes/CenaColetagemAvulsa';
import CenaSeparacaoCentral from '@scenes/CenaSeparacaoCentral';
import ModalBarcodeReader from '@components/Modals/ModalBarcodeReader';
import ModalExportar from '@components/Modals/ModalExportar';

class Routes extends React.Component {
  render() {
    return (
      <Router navigationBarStyle={styles.navigationBarStyle} style={styles.container}>
        <Stack key="root" style={styles.container}>

          <Scene
            key="splash"
            title="Splash"
            component={CenaSplash}
            hideNavBar={true}
          />

          <Scene
            key="home"
            title="Home"
            component={CenaHome}
            hideNavBar={true}
          />

          <Scene
            key="coletagemAvulsa"
            title="Coleagem Avulsa"
            component={CenaColetagemAvulsa}
            hideNavBar={true}
          />

          <Scene
            key="separacaoCentral"
            title="Coleagem Central"
            component={CenaSeparacaoCentral}
            hideNavBar={true}
          />

          <Modal key="modalBarcodeReader" hideNavBar={true} lazy={true}>
            <Scene
              key="root"
              title="Barcode Reader"
              component={ModalBarcodeReader}
              hideNavBar={true}
              lazy={true}
              hideTabBar={true}
            />
          </Modal>

          <Modal key="modalExportar" hideNavBar={true} lazy={true}>
            <Scene
              key="root"
              title="Exportar"
              component={ModalExportar}
              hideNavBar={true}
              lazy={true}
              hideTabBar={true}
            />
          </Modal>

        </Stack>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    borderTopColor: 'darkgrey',
    borderTopWidth: 1 / PixelRatio.get(),
    backgroundColor: '#ccc',
    flex: 1,
    flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: 'space-between',
    //opacity: 0.98,
  },
  navigationBarStyle: {
    backgroundColor: '#FFF',
  },
  navigationBarTitleStyle: {
    color: 'white',
  },
});

export default Routes;
