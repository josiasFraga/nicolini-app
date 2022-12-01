 // Formik x React Native example

 import React, { useState, useEffect } from 'react';

 import { AsyncStorage, TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

 import { Formik } from 'formik';
 import GlobalStyle from '@styles/global';
 import AlertHelper from '@components/Alert/AlertHelper';
import { useDispatch } from 'react-redux';

 export const FormSaveBarCode = (props) => {

    const dispatch = useDispatch();
    const [n_itens, setNItens] = useState(0);
    const backToScanner = props.backToScanner;

    let db_table = "CODIGOS_AVULSOS";

    if ( props.origin && props.origin == "separacao_central") {
       db_table = "CODIGOS_CENTRAL";
    }

    let _contaItens = async (code) => {
        try {
          const value = await AsyncStorage.getItem(db_table);
          if (value !== null) {
            // We have data!!
            let codigos = JSON.parse(value)
            let nitens = 0;
            for(let codigo of codigos) {
                if (codigo.barcodescanned == code) {
                    nitens += parseFloat(codigo.qtd);
                }
            }
            setNItens(nitens);
          }
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao contar os dados',
            );
        }
    };

    const _checkCodeExistsInFile = async (bar_code) => {
        try {
          const value = await AsyncStorage.getItem('UPLOADED_FILE_CENTRAL_COLLECTION');

          if (value !== null) {
            let produtos = JSON.parse(value);

            const product = produtos.filter((produto) => {
                return produto.cod_barras == bar_code;
            })

            if ( product.length == 0 ) {
                return false;
            }

            return product[0];
     
          } else {
            return false;
          }
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao ler os dados do arquivo.',
            );
            return false;
        }
    };

    const _checkQtdInFile = async (read_product, bar_code, qtd) => {
        try {
          const value = await AsyncStorage.getItem(db_table);
          let qtd_collected = 0;

          if (value !== null) {
            let produtos = JSON.parse(value);

            //procura o codigo de barras nos produtos  ja lidos para verificar a quantidade
            const product_collected = produtos.filter((produto) => {
                return produto.barcodescanned == bar_code;
            });

            //se achou, significa que o operador ja leu, ai setamos aquantidade lida para comparar com o arquivo
            if ( product_collected.length > 0 ) {
                qtd_collected = product_collected[0].qtd;
            }

     
          } 

          const limit = parseFloat(read_product.qtd);
          const limit_max = limit + (( 50*limit) / 100 );
          const new_total = parseFloat(qtd_collected) + parseFloat(qtd);

          if ( new_total >  limit_max ) {
              return limit_max;
          }

          return false;

        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao ler os dados das coletas anteriores.',
            );
            return true;
        }

    }
    
     let _storeData = async (item, file_register) => {
        try {

            const value = await AsyncStorage.getItem(db_table);
            let codigos = [];

            if (value !== null) {
                // We have data!!
                codigos = JSON.parse(value)
            }

            if ( file_register.loja && file_register.pedido ) {
                item = file_register;
                item.barcodescanned = item.cod_barras;
                delete item.cod_barras;
            }

            codigos.push(item);

            
            //adiciona a quantidade nos duplicados se houver
            let aggrupedItens = []
            aggrupedItens = Object.values(codigos.reduce((acc, item) => {
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
            }, {}))

            await AsyncStorage.setItem(
                db_table,
                JSON.stringify(aggrupedItens)
            );
            
            dispatch({
                type: 'LOAD_SINGLE_COLLECTION_DATA',
                payload: {}
            })
            
            dispatch({
                type: 'LOAD_CENTRAL_COLLECTION_DATA',
                payload: {}
            })

            props.setSaved();
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao salvar',
            );
        }

    };

    _contaItens(props.barcodescanned);

    return(

   <Formik

     initialValues={{ qtd: '1' }}

     onSubmit={async (values) => {
         let bcs = props.barcodescanned;
         let file_exists = {};
         if ( db_table == "CODIGOS_CENTRAL") {
            file_exists = await _checkCodeExistsInFile(bcs);
            if ( !file_exists ) {

                AlertHelper.show(
                    'info',
                    'Atenção!',
                    'O produto ' + bcs + ' não existe na lista',
                );
                return false;

            }
            const check_qtd = await _checkQtdInFile(file_exists,bcs,values.qtd);

            if ( check_qtd !== false ) {
    
                AlertHelper.show(
                    'info',
                    'Atenção!',
                    'O produto ' + bcs + ' | ' + file_exists.produto + ' excede o limite de ' + Math.floor(check_qtd) + ' itens',
                );
                return false;

            }
         } 

         _storeData({'qtd': values.qtd, 'barcodescanned': bcs}, file_exists)
    }}

   >

     {({ handleChange, handleBlur, handleSubmit, values }) => (

       <View style={[GlobalStyle.secureMargin, GlobalStyle.fullyScreem]}>
           <View style={[GlobalStyle.contentVerticalMiddle, GlobalStyle.fullyScreem, GlobalStyle.row]}>
            <View style={{flex: 1}}>
                <Text style={styles.barcode}>{props.barcodescanned} - {n_itens}</Text>
                <View style={[GlobalStyle.column, {alignItems: 'center', marginTop: 30}]}>
                    <View>                        

                        <TextInput
                            name={"qtd"}
                            onChangeText={handleChange("qtd")}
                            onBlur={handleBlur("qtd")}
                            value={values.qtd}
                            autoFocus
                            keyboardType={"numeric"}
                            maxLength={6}
                            placeholder={'Digite a quatidade'}
                            returnKeyType="next"
                            style={{ height: 70, width:80, borderColor: 'gray', borderWidth: 1, textAlign: 'center', fontSize: 35, borderRadius: 30 }}


                        />
                    </View>

                </View>

				<View style={GlobalStyle.spaceSmall} />
                <View>
                    <TouchableOpacity
                    onPress={()=>{handleSubmit()}} 
                    style={GlobalStyle.defaultButton}
					>
                    <Text style={GlobalStyle.defaultButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                    onPress={()=>{backToScanner()}} 
                    style={[GlobalStyle.clearCircleButton, {alignSelf: 'center', paddingHorizontal: 30, borderRadius: 15, height: 50}]}
                    >
                    <Text style={[GlobalStyle.clearCircleButtonText, {borderRadius: 3}]}>Cancelar</Text>
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
