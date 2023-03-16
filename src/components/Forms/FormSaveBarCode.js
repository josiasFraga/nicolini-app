 // Formik x React Native example

 import React, { useState, useEffect } from 'react';

 import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import { Input } from 'react-native-elements';

 import { Formik } from 'formik';
 import GlobalStyle from '@styles/global';
 import AlertHelper from '@components/Alert/AlertHelper';
import { useDispatch } from 'react-redux';

 export const FormSaveBarCode = (props) => {
    const input = React.createRef();

    const dispatch = useDispatch();
    const [n_itens, setNItens] = useState(0);
    const [productName, setProductName] = useState("");
    const backToScanner = props.backToScanner;

    let db_table = "CODIGOS_AVULSOS";

    if ( props.origin && props.origin == "separacao_central") {
       db_table = "CODIGOS_CENTRAL";
    }

    if ( props.origin && props.origin == "coletagem_invert") {
       db_table = "CODIGOS_INVERT";
    }

    useEffect(async () => {

        if ( props.barcodescanned == null || props.barcodescanned == "" ) {
            return false;
        }

        if ( db_table == "CODIGOS_CENTRAL" ) {

            try {
                const value = await AsyncStorage.getItem('UPLOADED_FILE_CENTRAL_COLLECTION');
      
                if (value !== null) {
                  let produtos = JSON.parse(value);
      
                  const product = produtos.filter((produto) => {
                      return produto.cod_barras == props.barcodescanned;
                  })
      
                  if ( product.length == 0 ) {
                    setProductName("");
                  } else {
                    setProductName(product[0]["produto"]);
                  }                  
                  
           
                } else {
                    setProductName("");
                }
              } catch (error) {
                  console.log(error);
                  setProductName("");
              }
        }

        if ( db_table == "CODIGOS_INVERT" ) {

            try {
                const value = await AsyncStorage.getItem('UPLOADED_FILE_INVERT_COLLECTION');
      
                if (value !== null) {
                  let produtos = JSON.parse(value);
      
                  const product = produtos.filter((produto) => {
                      return produto.cod_barras == props.barcodescanned;
                  })
      
                  if ( product.length == 0 ) {
                    setProductName("");
                  } else {
                    setProductName(product[0]["produto"]);
                  }                  
                  
           
                } else {
                    setProductName("");
                }
              } catch (error) {
                  console.log(error);
                  setProductName("");
              }
        }
    }, [props.barcodescanned]);

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

            let file_name = 'UPLOADED_FILE_CENTRAL_COLLECTION';

            if ( props.origin && props.origin == "coletagem_invert") {
                file_name = "UPLOADED_FILE_INVERT_COLLECTION";
            }
    
          const value = await AsyncStorage.getItem(file_name);

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
            const qtd_digitada = item.qtd;

            if (value !== null) {
                // We have data!!
                codigos = JSON.parse(value)
            }

            if ( db_table != "CODIGOS_AVULSOS" ) {
                item = file_register;
                item.barcodescanned = item.cod_barras;
                delete item.cod_barras;
            }            

            //procura o código de barras na lista lida
            const searchCodeInList = codigos.filter((item_lista, index) => {
                return item_lista.barcodescanned == item.barcodescanned;
            });

            //se não achou o produto, adiciona na lista lida
            if ( searchCodeInList.length == 0 ) {

                if ( parseFloat(qtd_digitada) < 0 ) {
                    AlertHelper.show(
                        'warning',
                        'Atenção',
                        'A quantidade não pode ser inferior a 0',
                    );
                    return false;

                }

                console.log('não achou o produto na lista, adicionando - ' + item.barcodescanned + ' - ' + parseFloat(qtd_digitada));
                
                let itemToAdd = {
                    barcodescanned: item.barcodescanned,
                    qtd: parseFloat(qtd_digitada),
                };

                if ( item.loja ) {
                    itemToAdd.loja = item.loja;
                }

                if ( item.pedido ) {
                    itemToAdd.pedido = item.pedido;
                }

                if ( item.produto ) {
                    itemToAdd.produto = item.produto;
                }
    
                codigos.push(itemToAdd);

            } //se achou o item na lista lida, atualiza a quantidade
            else {
                
                let stop_code = false;
                codigos = codigos.map((item_lista) => {

                    if ( item_lista.barcodescanned == item.barcodescanned ) {

                        const new_qtd = item_lista.qtd + parseFloat(qtd_digitada);
        
                        if (  new_qtd < 0 ) {
                            AlertHelper.show(
                                'warning',
                                'Atenção',
                                'A quantidade não pode ser inferior a 0',
                            );
                            stop_code = true;
                        }
        
                        item_lista.qtd = new_qtd;

                    }
                    return item_lista;
                });

                if ( stop_code ) {
                    return false;
                }
            }

            await AsyncStorage.setItem(
                db_table,
                JSON.stringify(codigos)
            );
            
            dispatch({
                type: 'LOAD_SINGLE_COLLECTION_DATA',
                payload: {}
            })
            
            dispatch({
                type: 'LOAD_CENTRAL_COLLECTION_DATA',
                payload: {}
            })
            
            dispatch({
                type: 'LOAD_INVERT_COLLECTION_DATA',
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

     initialValues={{ qtd: '' }}

     onSubmit={async (values) => {
         let bcs = props.barcodescanned.trim();
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
         if ( db_table == "CODIGOS_INVERT") {
            file_exists = await _checkCodeExistsInFile(bcs);
            if ( !file_exists ) {

                AlertHelper.show(
                    'info',
                    'Atenção!',
                    'O produto ' + bcs + ' não existe na lista',
                );
                return false;

            }

         }

         input.current.blur();

         console.log(values.qtd);
         console.log(file_exists);

         _storeData({'qtd': values.qtd, 'barcodescanned': bcs}, file_exists)
    }}

   >

     {({ handleChange, handleBlur, handleSubmit, values }) => (

       <View style={[GlobalStyle.secureMargin, GlobalStyle.fullyScreem]}>
           <View style={[GlobalStyle.contentVerticalMiddle, GlobalStyle.fullyScreem, GlobalStyle.row]}>
            <View style={{flex: 1}}>
                {productName != "" && 
                <Text style={styles.barcode}>{productName}</Text>
                }
                <Text style={styles.barcode}>{props.barcodescanned} - {n_itens}</Text>
                <View style={[GlobalStyle.column, {alignItems: 'center', marginTop: 5}]}>
                    <View>

                        <Input
                            name={"qtd"}
                            onChangeText={handleChange("qtd")}
                            onBlur={handleBlur("qtd")}
                            value={values.qtd}
                            ref={input}
                            autoFocus
                            //showSoftInputOnFocus={false}
                            keyboardType={"numeric"}
                            maxLength={db_table == "CODIGOS_AVULSOS" ? 7 : 6}
                            placeholder={'Digite a quatidade'}
                            returnKeyType="next"
                            inputContainerStyle={{ height: 70, width:80, borderColor: 'gray', borderWidth: 1, textAlign: 'center', fontSize: 35, borderRadius: 30 }}


                        />
                    </View>

                </View>
                <View>
                    <TouchableOpacity
                    onPress={()=>{
                        Keyboard.dismiss();
                        input.current.blur();
                        handleSubmit()
                    }} 
                    style={GlobalStyle.defaultButton}
					>
                    <Text style={GlobalStyle.defaultButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                    onPress={()=>{
                        Keyboard.dismiss();
                        input.current.blur();
                        backToScanner()
                    }} 
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
        fontSize: 16,
        textAlign: 'center'
    }
 });
