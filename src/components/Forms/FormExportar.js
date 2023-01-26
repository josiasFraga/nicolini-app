 // Formik x React Native example

 import React, { useState, useEffect } from 'react';

 import { TextInput, View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid } from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';

 import {Actions} from 'react-native-router-flux';
 import { Formik } from 'formik';
 import GlobalStyle from '@styles/global';
 import AlertHelper from '@components/Alert/AlertHelper';
 var RNFS = require('react-native-fs');
 import moment from "moment";
 import Share from 'react-native-share';
 import _ from "lodash";

 const requestWriteStoragePermission = async () => {
     try {
       const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
         {
           title: "Precisamos de acesso ao seu armazenamento",
           message:
             "Para poder salvar o arquivo gerado",
           buttonNeutral: "Depois",
           buttonNegative: "Cancelar",
           buttonPositive: "OK"
         }
       );
       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         return true;
       } else {
         return false;
       }
     } catch (err) {
       console.warn(err);
       return false;
     }
 };

 const requestReadStoragePermission = async () => {
     try {
       const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
         {
           title: "Precisamos de acesso ao seu armazenamento",
           message:
             "Para poder ler o arquivo gerado",
           buttonNeutral: "Depois",
           buttonNegative: "Cancelar",
           buttonPositive: "OK"
         }
       );
       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         return true;
       } else {
         return false;
       }
     } catch (err) {
       console.warn(err);
       return false;
     }
 };

 export const FormExportar = (props) => {

    let db_table = "CODIGOS_AVULSOS";

    if ( props.origin && props.origin == "separacao_central") {
       db_table = "CODIGOS_CENTRAL";
    }

    if ( props.origin && props.origin == "coletagem_invert") {
       db_table = "CODIGOS_INVERT";
    }
 
     let _exportData = async (nota='') => {
    
        try {
          const value = await AsyncStorage.getItem(db_table);
          if (value !== null) {
            // We have data!!
            let codigos = JSON.parse(value)
            let texto = '';
            let countCodes = 1;
            //let codesToFile = codigos;
            var codesToFile = [];
            
            codesToFile = Object.values(codigos.reduce((acc, item) => {
                if (!acc[item.barcodescanned]) {
                    acc[item.barcodescanned] = {
                        barcodescanned: item.barcodescanned,
                        qtd: parseFloat(item.qtd),
                    };
                } else {
                    acc[item.barcodescanned].qtd += parseFloat(item.qtd);
                }
                return acc;
            }, {}));

            for(let codigo of codesToFile) {

                let qtd = codigo.qtd;
                qtd = _.padStart(qtd, 6, '0');
                let barCd = codigo.barcodescanned;
                barCd = _.padStart(barCd, 13, '0');
                
                if ( nota != '' ) {
                    let notastr = _.padStart(nota, 5, '0');
                    notastr = notastr+'00000000';
                    texto += notastr+barCd+qtd+'.00000000';
                } else {                    
                    texto += '0000100000000'+barCd+qtd+'.00000000';
                }

                
                if ( countCodes < codigos.length) {
                    texto += '\r\n';
                }
                countCodes++;
                
            }

            let filename = '';
            if ( nota != '' )
                filename = 'COMPRA01.txt';
            else {
                filename = 'COMPRA01.txt';
            }

            let path = RNFS.DownloadDirectoryPath + '/'+filename;
            console.log(RNFS.DownloadDirectoryPath + '/aaaaaaaaaaaaaa.txt','hffghfgh','utf8');

            RNFS.writeFile(path, texto, 'utf8')
            .then((success) => {
                AlertHelper.show(
                    'success',
                    'Tudo Certo',
                    'Arquivo Exportado Com Sucesso!',
                );
                Share.open({
                    title: "Compartilhar Arquivo ",
                    url: "file://"+path,
                })
                
                Actions.pop();
            })
            .catch((err) => {
                console.log(err);

                AlertHelper.show(
                    'error',
                    'Erro',
                    'Ocorreu um erro ao escrever o arquivo a',
                );
            });
   
          } else {

            AlertHelper.show(
                'info',
                'Informação',
                'Nenhum item cadastrado!',
            );
            Actions.pop();
          }
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao exportar os dados',
            );
        }

    };
 
    let _exportDataCentral = async () => {
       try {
         const value = await AsyncStorage.getItem(db_table);
         if (value !== null) {
           // We have data!!
           let codigos = JSON.parse(value)
           let texto = '';
           let countCodes = 1;
           //let codesToFile = codigos;
           var codesToFile = [];
           
           codesToFile = Object.values(codigos.reduce((acc, item) => {

               if (!acc[item.barcodescanned]) {
                   acc[item.barcodescanned] = {
                       barcodescanned: item.barcodescanned,
                       qtd: parseFloat(item.qtd),
                       loja: item.loja,
                       pedido: item.pedido,
                   };
               } else {
                   acc[item.barcodescanned].qtd += parseFloat(item.qtd);
               }
               return acc;
           }, {}));

           for(let codigo of codesToFile) {

            console.log(codigo);

                let qtd = codigo.qtd;
                qtd = _.padStart(qtd, 6, '0');
                let barCd = codigo.barcodescanned;
                barCd = _.padStart(barCd, 13, '0');               
                      
                texto += codigo.loja + codigo.pedido + '000000000' + barCd + qtd + '.00000000';

               if ( countCodes < codigos.length) {
                   texto += '\r\n';
               }

               countCodes++;
               
           }

           let filename = 'PEDIDOCF.txt';

           let path = RNFS.DownloadDirectoryPath + '/'+filename;
           console.log(path);
           

           RNFS.writeFile(path, texto, 'utf8')
           .then((success) => {
               AlertHelper.show(
                   'success',
                   'Tudo Certo',
                   'Arquivo Exportado Com Sucesso!',
               );
               Share.open({
                   title: "Compartilhar Arquivo ",
                   url: "file://"+path,
               })
               
               Actions.pop();
           })
           .catch((err) => {
                console.log(err);
               AlertHelper.show(
                   'error',
                   'Erro',
                   'Ocorreu um erro ao escrever o arquivo',
               );
           });
  
         } else {

           AlertHelper.show(
               'info',
               'Informação',
               'Nenhum item cadastrado!',
           );
           Actions.pop();
         }
       } catch (error) {
           console.log(error);
           AlertHelper.show(
               'error',
               'Erro',
               'Ocorreu um errro ao exportar os dados',
           );
       }

   };
 
   let _exportDataInvert = async () => {
      try {
        const value = await AsyncStorage.getItem(db_table);
        if (value !== null) {
          // We have data!!
          let codigos = JSON.parse(value)
          let texto = '';
          let countCodes = 1;
          //let codesToFile = codigos;
          var codesToFile = [];
          
          codesToFile = Object.values(codigos.reduce((acc, item) => {

              if (!acc[item.barcodescanned]) {
                  acc[item.barcodescanned] = {
                      barcodescanned: item.barcodescanned,
                      qtd: parseFloat(item.qtd),
                  };
              } else {
                  acc[item.barcodescanned].qtd += parseFloat(item.qtd);
              }
              return acc;
          }, {}));

          for(let codigo of codesToFile) {


               let qtd = codigo.qtd;
               qtd = _.padStart(qtd, 6, '0');
               let barCd = codigo.barcodescanned;
               barCd = _.padStart(barCd, 14, '0');               
                     
               texto += barCd + qtd + '.00';

              if ( countCodes < codigos.length) {
                  texto += '\r\n';
              }

              countCodes++;
              
          }

          let filename = 'inv006michaelA.txt';

          let path = RNFS.DownloadDirectoryPath + '/'+filename;
          console.log(path);
          

          RNFS.writeFile(path, texto, 'utf8')
          .then((success) => {
              AlertHelper.show(
                  'success',
                  'Tudo Certo',
                  'Arquivo Exportado Com Sucesso!',
              );
              Share.open({
                  title: "Compartilhar Arquivo ",
                  url: "file://"+path,
              })
              
              Actions.pop();
          })
          .catch((err) => {
               console.log(err);
              AlertHelper.show(
                  'error',
                  'Erro',
                  'Ocorreu um erro ao escrever o arquivo',
              );
          });
 
        } else {

          AlertHelper.show(
              'info',
              'Informação',
              'Nenhum item cadastrado!',
          );
          Actions.pop();
        }
      } catch (error) {
          console.log(error);
          AlertHelper.show(
              'error',
              'Erro',
              'Ocorreu um errro ao exportar os dados',
          );
      }

  };


    return(

   <Formik

     initialValues={{ nota: '' }}

     onSubmit={async (values) => {

        const _requestWriteStoragePermission = await requestWriteStoragePermission();

        if ( !_requestWriteStoragePermission ) {
            AlertHelper.show(
                'error',
                'Erro',
                'Sem permissão de escrita no armazenamento',
            );
        }

        const _requestReadStoragePermission = await requestReadStoragePermission();

        if ( !_requestReadStoragePermission ) {
            AlertHelper.show(
                'error',
                'Erro',
                'Sem permissão de leitura no armazenamento',
            );
        }

        if ( db_table == "CODIGOS_AVULSOS" ) {
            _exportData(values.nota)

        } else if ( db_table == "CODIGOS_INVERT" ) {
            _exportDataInvert()

        } else {
            _exportDataCentral()            
        }
    }}

   >

     {({ handleChange, handleBlur, handleSubmit, values }) => (

       <View style={[GlobalStyle.secureMargin, GlobalStyle.fullyScreem]}>
           <View style={[GlobalStyle.contentVerticalMiddle, GlobalStyle.fullyScreem, GlobalStyle.row]}>
            <View style={{flex: 1}}>
                <Text style={styles.barcode}>Exportar Registros</Text>
                <View style={[GlobalStyle.column, {alignItems: 'center', marginTop: 30}]}>
                    {db_table == "CODIGOS_AVULSOS" && 
                    <View>                        

                        <TextInput

                        onChangeText={handleChange('nota')}

                        onBlur={handleBlur('nota')}

                        value={values.nota}

                        autoFocus

                        keyboardType={"decimal-pad"}

                        maxLength={80}

                        placeholder={'Digite o nº da nota'}
                        returnKeyType="next"
                        style={{ height: 70, width: '100%', borderColor: 'gray', borderWidth: 1, textAlign: 'center', fontSize: 35, borderRadius: 30 }}


                        />
                    </View>}

                </View>

				<View style={GlobalStyle.spaceSmall} />
                <View>
                    <TouchableOpacity
                    onPress={()=>{handleSubmit()}} 
                    style={GlobalStyle.defaultButton}
					>
                    <Text style={GlobalStyle.defaultButtonText}>Exportar</Text>
                    </TouchableOpacity>
					<View style={GlobalStyle.spaceSmall} />
                </View>


            </View>

           </View>

       </View>

     )}

   </Formik>

 )};

 const styles = StyleSheet.create({
    barcode: {
        fontSize: 20,
        textAlign: 'center'
    }
 });