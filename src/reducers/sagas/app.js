import {AsyncStorage, PermissionsAndroid, Platform} from 'react-native';
import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {callApi} from '@services/api';
import AlertHelper from '@components/Alert/AlertHelper';
import {Actions, ActionConst} from 'react-native-router-flux';
import CONFIG from '@constants/configs';
import NetInfo from "@react-native-community/netinfo";

import qs from 'qs';

function* updateToken({payload}) {
  console.log('[UPDATE TOKEN]');

  yield put({
    type: 'UPDATE_TOKEN',
    payload: payload,
  });
}

function* registrar({payload}) {
	
	console.log('[SAGA] - SALVANDO CADASTRO');

	if ( payload.step < 2 ){

		if ( payload.step == 0 ) {
			if ( typeof(payload.tipoCadastro) == 'undefined' || payload.tipoCadastro == '' ) {
				yield AlertHelper.show(
					'warning',
					'Atenção',
					'Selecione o tipo de cadastro antes de acontinuar',
				);
				return false;
			}
		}

		if ( payload.step == 1 ) {
			if ( typeof(payload.tipoCavalo) == 'undefined' || payload.tipoCavalo == '' ) {
				yield AlertHelper.show(
					'warning',
					'Atenção',
					'Selecione o tipo de cavalo antes de acontinuar',
				);
				return false;
			}
		}

		let next_step = payload.step+1;

		yield put({
			type: 'SET_STEP_CADASTRO',
			payload: next_step
		});
		return false;
	}

	var data = new FormData();

	data.append("cnpj", typeof(payload.cnpj) == 'undefined' ? null : payload.cnpj);
	data.append("cpf", typeof(payload.cpf) == 'undefined' ? null : payload.cpf);
	data.append("ddd", payload.ddd);
	data.append("email", payload.email);
	data.append("senha", payload.senha);
	data.append("empresa", payload.empresa_id);
	data.append("frota", payload.frota);
	data.append("indicacao1_ddd", payload.indicacao1_ddd);
	data.append("indicacao1_nome", payload.indicacao1_nome);
	data.append("indicacao1_telefone", payload.indicacao1_telefone);
	data.append("indicacao2_ddd", payload.indicacao2_ddd);
	data.append("indicacao2_nome", payload.indicacao2_nome);
	data.append("indicacao2_telefone", payload.indicacao2_telefone);
	data.append("motorista_ddd", payload.motorista_ddd);
	data.append("motorista_nome", payload.motorista_nome);
	data.append("motorista_senha", payload.motorista_senha);
	data.append("motorista_telefone", payload.motorista_telefone);
	data.append("nome", payload.nome);
	data.append("nomeempresa", payload.nomeempresa);
	data.append("placa_cavalo", payload.placa_cavalo);
	data.append("placa_reboque", payload.placa_reboque);
	data.append("telefone", payload.telefone);
	data.append("tipoCadastro", payload.tipoCadastro);
	data.append("tipoCavalo", typeof(payload.tipoCavalo) == 'undefined' ? null : payload.tipoCavalo);


	//console.log(dados);
	yield put({
		type: 'SET_IS_CADASTRANDO',
		payload: true,
	});


	try {

		const response = yield call(callApi, {
			endpoint: CONFIG.url+'/Usuarios/cadastrar/',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		if (response.status == 200) {
			if (response.data.status == 'ok') {
				//yield put({ type: 'SET_TOKEN', payload: response.data.token});
				yield AlertHelper.show(
					'success',
					'Sucesso',
					'Seu cadastro foi realizado com sucesso!',
				);

				yield put({
					type: 'SET_STEP_CADASTRO',
					payload: 0
				});

				yield call(Actions.replace, 'login');
			} else {
				yield AlertHelper.show('error', 'Erro ao registrar', response.data.msg);
			}
		} else {
		yield AlertHelper.show('error', 'Erro', 'Ocorreu um erro ao registrar.');
		}
		yield put({
			type: 'SET_IS_CADASTRANDO',
			payload: false,
		});
	} catch ({message, response}) {
		console.warn('[ERROR : REGISTRAR]', {message, response});
		yield AlertHelper.show('error', 'Erro', message);
		yield put({
			type: 'SET_IS_CADASTRANDO',
			payload: false,
		});
	}
}

function* login({payload}) {

  var ddd = payload.ddd;
  var celular = payload.celular;
  var password = payload.password;

  if ( typeof ddd != 'undefined' && ddd.length == 2 && typeof celular != 'undefined' && celular.length == 9 ) {	  
	if ( typeof password == 'undefined' ) {

		yield put({
			type: 'SET_DDD_CELLPHONE_OK',
			payload: true,
		});

		return false;
	}
  }

  try {
    yield put({
      type: 'SET_IS_REQUESTING',
      payload: true,
    });

    const response = yield call(callApi, {
      endpoint: CONFIG.url + '/Usuarios/login/',
      method: 'GET',
      params: {
        ddd: payload.ddd,
        celular: payload.celular,
        password: payload.password,
      },
    });

	console.log('[LOGIN]', response);

    if (response.data.status == 'ok') {
	  AlertHelper.show('success', 'Sucesso', 'Logado com sucesso.');
	  
      yield AsyncStorage.setItem(
        'token',
        JSON.stringify(response.data.dados.Token),
      );
      yield AsyncStorage.setItem(
        'usuario',
        JSON.stringify(response.data.dados.Usuario),
      );
	
	  yield verificaViagem({payload: {redireciona : true, buscar_caminhoes : true}});
    } else if(response.data.status == 'financial_blockade') {
		yield Actions.pendenciaFinanceira({phone: response.data.phone});
	} else if(response.data.status == 'blocked_by_admin') {
		yield Actions.bloqueadoAdmin();
	}	
	else {
      AlertHelper.show('error', 'Erro', response.data.status);
    }

    yield put({
      type: 'SET_IS_REQUESTING',
      payload: false,
    });
  } catch ({message, response}) {
    if (response.status == 401) {
      AlertHelper.show('error', 'Falha', 'Login e/ou senha inválidos.');
    } else {
      console.warn('[ERROR : LOGIN_TRIGGER]', {message, response});
      AlertHelper.show('error', 'Erro', message);
    }

    yield put({
      type: 'SET_IS_REQUESTING',
      payload: false,
    });
  }
}

function* verificaViagem({payload}) {
	// @Todo, o login chama essa função. Precisamos ver se quem está logando é o mesmo dono da viagem no storage.
	if ( payload.buscar_caminhoes )
		yield buscaCaminhoesUsuario({payload: change_selected = true});

	try {
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
		const veiculo_id = yield AsyncStorage.getItem('caminhao_selected');

		const response = yield call(callApi, {
			endpoint: CONFIG.url+'/Viagens/viagem_ativa/',
			method: 'GET',
			params: {
				token: token,
				phone: phone,
				veiculo_id: veiculo_id,
			}
		});


		if (response.data.status == 'ok') {

			yield AsyncStorage.setItem('viagem_ativa', JSON.stringify(response.data.dados));

			yield put({
				type: 'SET_VIAGEM_ATIVA',
				payload: response.data.dados
			});

			if ( payload.redireciona ) {
				if (response.data.dados.length == 0) {
					console.log('entrou aqui');
					Actions.cenaTabs({type: ActionConst.RESET});
					Actions.dashboard()
				} else {
					Actions.cenaTabs({type: ActionConst.RESET});
					Actions.emViagem()
				}

			}
			
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}
		
	} catch ({message, response}) {
		console.warn('[ERROR : VERIFICA_VIAGEM]', { message, response });
		AlertHelper.show('error', 'Erro', message);
	}

	
}

function* redirectViagem({payload}) {
	if (!payload.emViagem) {
		yield put({
			type: 'SET_VIAGEM_ATIVA',
			payload: []
		});
		Actions.semViagem();
	} else {
		yield put({
			type: 'SET_VIAGEM_ATIVA',
			payload: payload.viagem
		});
		Actions.emViagem();
	}
}

function* iniciarViagem({payload}) {
	console.log('[SAGA] - INICIANDO VIAGEM');
	console.log(payload);

	if ( payload.step < 3 ){
		yield put({
			type: 'SET_STEP_INICIAR_VIAGEM',
			payload: payload.step+1
		});
		return false;
	}

	try {
		yield put({
			type: 'SET_IS_STARTING_VIAGEM',
			payload: true
		});

		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/Viagens/viagem_iniciar/',
		 	method: 'GET',
		 	params: {
				token: token,
				phone: phone,
				valor_frete: payload.valor, 
				valor_adiantamento:	payload.adiantamento, 
				destino: payload.destino, 
				km: payload.km, 
				veiculo_id: payload.caminhao
			}
		});


		console.log('[INICIAR_VIAGEM]', response);

		if (response.data.status == 'ok') {
			yield verificaViagem({payload: {redireciona : true, buscar_caminhoes : false}});

			yield put({
				type: 'SET_STEP_INICIAR_VIAGEM',
				payload: 0
			});
		} else if (response.data.status == 'warning') {
			AlertHelper.show('warning', 'Atenção', response.data.msg);
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

		yield put({
			type: 'SET_IS_STARTING_VIAGEM',
			payload: false
		});

	} catch ({message, response}) {
		console.warn('[ERROR : INICIAR_VIAGEM]', { message, response });
		AlertHelper.show('error', 'Erro', message);

		yield put({
			type: 'SET_IS_STARTING_VIAGEM',
			payload: false
		});
	}
}

function* salvaAbastecimento({payload}) {
	console.log('[SAGA] - SALVANDO ABASTECIMENTO');
	console.log(payload);

	if ( payload.step < 7 ){
		let next_step = payload.step+1;
		if ( payload.step == 3 && (typeof payload.litros_arla == 'undefined' || payload.litros_arla == '')){
			next_step++;
		}

		yield put({
			type: 'SET_STEP_SAVE_ABASTECIMENTO',
			payload: next_step
		});
		return false;
	}

	const response = yield sendAbastecimento(payload);

    if (response.status == 200) {
      	if (response.data.status == 'ok') {
			console.log('[SAVE_ABASTECIMENTO]');
			
			yield put({
				type: 'SET_STEP_SAVE_ABASTECIMENTO',
				payload: 0
			});
			yield AlertHelper.show(
				'success',
				'Tudo certo',
				response.data.msg,
			);

			if ( typeof(payload.id) != 'undefined' && payload.id ) {
				Actions.pop();
			}
			const viagem_id = JSON.parse(yield AsyncStorage.getItem('viagem_ativa')).Viagem.id;
			yield bAbastecimentos({payload: {viagem_id: viagem_id}});
		} else {
			yield AlertHelper.show('error', 'Erro', response.data.msg);
		}

      	yield put({
        	type: 'SET_SAVING_ABASTECIMENTO',
        	payload: false,
      	});
    }
}

function* pararViagem({payload}) {
	const networkStatus = yield NetInfo.fetch();

	if (!networkStatus.isConnected) {
		yield AlertHelper.show(
			'warn',
			'Sem conexão',
			'Você só pode parar uma viagem quando estiver com internet.',
		  );
		  return true;
	}


	console.log('[SAGA] - PARANDO VIAGEM');
	console.log(payload);

	try {
		yield put({
			type: 'SET_IS_STOPPING_VIAGEM',
			payload: true
		});

		const usuario = JSON.parse(yield AsyncStorage.getItem('usuario'));
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const viagem = JSON.parse(yield AsyncStorage.getItem('viagem_ativa'));

		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/Viagens/viagem_finalizar/',
		 	method: 'GET',
		 	params: {
				token: token,
				phone: usuario.telefone,
				viagem_id: viagem.Viagem.id,
				km: payload.km
			}
		});

		console.log('[PARAR_VIAGEM]', response);

		if (response.data.status == 'ok') {
			yield database().ref(`/veiculos/`+usuario.id).remove();			
			yield verificaViagem({payload: {redireciona : true, buscar_caminhoes : false}});
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

		yield put({
			type: 'SET_IS_STOPPING_VIAGEM',
			payload: false
		});

	} catch ({message, response}) {
		console.warn('[ERROR : PARAR_VIAGEM]', { message, response });
		AlertHelper.show('error', 'Erro', message);

		yield put({
			type: 'SET_IS_STOPPING_VIAGEM',
			payload: false
		});
	}
}

function* buscaEmpresas({payload}) {
	console.log('[SAGA] - BUSCANDO EMPRESAS');

	try {

		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/empresas/index/',
		 	method: 'GET',
		 	params: {}
		});

		if (response.data.status == 'ok') {
			yield put({
				type: 'SET_EMPRESAS',
				payload: response.data.dados
			});
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

	} catch ({message, response}) {
		console.warn('[ERROR : BUSCANDO_EMPRESAS]', { message, response });
		AlertHelper.show('error', 'Erro', message);


	}
}

function* buscaCaminhoes({payload}) {
	console.log('[SAGA] - BUSCANDO CAMINHOES');
	yield put({
		type: 'SET_IS_LOADING_CAMINHOES',
		payload: true
	});

	try {

		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/Veiculos/index/',
		 	method: 'GET',
		 	params: {
				token: token,
				phone: phone
			}
		});

		//console.log(response.data.list);
		if (response.data.status == 'ok') {
			yield put({
				type: 'SET_CAMINHOES',
				payload: response.data.dados
			});
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}
		yield put({
			type: 'SET_IS_LOADING_CAMINHOES',
			payload: false
		});

	} catch ({message, response}) {
		console.warn('[ERROR : BUSCANDO_CAMINHOES]', { message, response });
		AlertHelper.show('error', 'Erro', message);
		yield put({
			type: 'SET_IS_LOADING_CAMINHOES',
			payload: false
		});
	}
}

function* buscaCaminhoesList({payload}) {
	console.log('[SAGA] - BUSCANDO CAMINHÕES LIST');

	try {

		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/Veiculos/veiculos_list/',
		 	method: 'GET',
		 	params: {
				token: token,
				phone: phone
			}
		});

		//console.log(response.data.list);
		if (response.data.status == 'ok') {
			yield put({
				type: 'SET_CAMINHOES_LIST',
				payload: response.data.dados
			});
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

	} catch ({message, response}) {
		console.warn('[ERROR : BUSCANDO_CAMINHOES_LIST]', { message, response });
		AlertHelper.show('error', 'Erro', message);

	}
}

function* buscaMotoristasList({payload}) {
	console.log('[SAGA] - BUSCANDO MOTORISTAS LIST');

	try {

		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/Usuarios/motoristas_list/',
		 	method: 'GET',
		 	params: {
				token: token,
				phone: phone
			}
		});

		//console.log(response.data.list);
		if (response.data.status == 'ok') {
			yield put({
				type: 'SET_MOTORISTAS_LIST',
				payload: response.data.dados
			});
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

	} catch ({message, response}) {
		console.warn('[ERROR : BUSCANDO_MOTORISTAS_LIST]', { message, response });
		AlertHelper.show('error', 'Erro', message);

	}
}

function* buscaMotoristas({payload}) {
	console.log('[SAGA] - BUSCANDO MOTORISTAS');

	yield put({
		type: 'SET_LOADING_MOTORISTAS',
		payload: true,
	});

	try {

		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/Usuarios/index/',
		 	method: 'GET',
		 	params: {
				token: token,
				phone: phone
			}
		});

		//console.log(response.data.list);
		if (response.data.status == 'ok') {
			yield put({
				type: 'SET_MOTORISTAS',
				payload: response.data.dados
			});
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

		yield put({
			type: 'SET_LOADING_MOTORISTAS',
			payload: false,
		})

	} catch ({message, response}) {
		console.warn('[ERROR : BUSCANDO_MOTORISTAS]', { message, response });
		AlertHelper.show('error', 'Erro', message);
		yield put({
			type: 'SET_LOADING_MOTORISTAS',
			payload: false,
		})

	}
}

function* buscaCaminhoesUsuario({payload}) {
	console.log('[SAGA] - BUSCANDO CAMINHOES DO USUÁRIO');

	try {
		yield put({
			type: 'SET_IS_REQUESTING',
			payload: true
		});

		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/Viagens/veiculos_user/',
		 	method: 'GET',
		 	params: {
				token: token,
				phone: phone
			}
		});

		console.log('[BUSCANDO_CAMINHOES]', response);
		//console.log(response.data.list);
		if (response.data.status == 'ok') {

			yield put({
				type: 'SET_CAMINHOES_USUARIO',
				payload: response.data.list
			});

			if ( typeof(payload.change_selected) == 'undefined' || payload.change_selected === null || payload.change_selected === '' || payload.change_selected === true ) {
				yield put({
					type: 'SET_CAMINHAO_SELECTED',
					payload: response.data['list'][0]['value']
				});

				yield AsyncStorage.setItem(
					'caminhao_selected',
					response.data['list'][0]['value'],
				);
			}
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

		yield put({
			type: 'SET_IS_REQUESTING',
			payload: false
		});
	} catch ({message, response}) {
		console.warn('[ERROR : BUSCANDO_CAMINHOES_USUARIO]', { message, response });
		AlertHelper.show('error', 'Erro', message);

		yield put({
			type: 'SET_IS_REQUESTING',
			payload: false
		});
	}
}

function* selecionaCaminhao({payload}) {
	console.log('[SAGA] - SELECIONANDO CAMINHÃO');
	yield put({
		type: 'SET_CAMINHAO_SELECTED',
		payload: payload.value
	});

	yield AsyncStorage.setItem(
		'caminhao_selected',
		payload.value,
	);
	yield verificaViagem({payload: {redireciona : false, buscar_caminhoes : false}});
}

function* saveCarregamentoDescarregamento({payload}) {
  yield put({
    type: 'CHANGE_IS_LOADING_SAVING_CAR_DESCAR',
    payload: true,
  });

  try {
    const networkStatus = yield NetInfo.fetch();

	  	if (!networkStatus.isConnected) {
	  		var car_des_sync = yield AsyncStorage.getItem('car_des_sync');
	  		if (car_des_sync !== null) {
				car_des_sync = JSON.parse(car_des_sync);
	  		} else {
				car_des_sync = [];
	  		}

	  		car_des_sync.push({...payload.fields, _uniqid: guidGenerator()});

	  		yield AsyncStorage.setItem('car_des_sync', JSON.stringify(car_des_sync));
	  		console.log(yield AsyncStorage.getItem('car_des_sync'));

	  		yield AlertHelper.show(
				'warn',
				'Sem conexão',
				'Carregamento/Descarregamento cadastrado com sucesso, porém, faça a sincronização assim que possível.',
			);
			Actions.pop();

	  		yield put({
				type: 'CHANGE_IS_LOADING_SAVING_CAR_DESCAR',
				payload: false,
			});

			yield calcularItensSincronizar();

	  		return true;
	  	}

		const response = yield sendCarregamentoDescarregamento(payload.fields);

    console.log('[SAVE_CARREGAMENTO_DESCARREGAMENTO]', response);

    console.log(response.data);
    if (response.status == 200) {
      if (response.data.status == 'ok') {
        console.log('[SAVE_CARREGAMENTO_DESCARREGAMENTO]');
        yield AlertHelper.show(
          'success',
          'Tudo certo',
          'Carregamento/Descarregamento cadastrado com sucesso!',
        );
        Actions.pop();
        
      } else {
        yield AlertHelper.show('error', 'Erro', response.data.msg);
      }

      console.log(response.data);

      yield put({
        type: 'CHANGE_IS_LOADING_SAVING_CAR_DESCAR',
        payload: false,
      });
    }
  } catch ({message, response}) {
    console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});

    yield put({
      type: 'CHANGE_IS_LOADING_SAVING_CAR_DESCAR',
      payload: false,
    });

    yield AlertHelper.show('error', 'Erro', message);
  }
}

function* buscaViagens() {
	console.log('[SAGA] - BUSCANDO VIAGENS');

	try {
		yield put({
			type: 'SET_IS_VIAGENS_LOADING',
			payload: true
		});

		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
		const veiculo_id = yield AsyncStorage.getItem('caminhao_selected');

		console.log('veiculo_id');
		console.log(veiculo_id);

		var data = new FormData();
		const dados = {
			token: token,
			phone: phone,
			veiculo_id: veiculo_id
		};

		const response = yield call(callApi, {
			endpoint: CONFIG.url+'/Viagens/historico_viagem/',
			method: 'GET',
			params: dados,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		//console.log('[BUSCANDO_VIAGENS]', response);

		if (response.data.status == 'ok') {
			yield put({
				type: 'SET_VIAGENS',
				payload: response.data.dados
			});
		} else if (response.data.status == 'warning') {
			//AlertHelper.show('info', 'Informação', response.data.msg);
			yield put({
				type: 'SET_VIAGENS',
				payload: []
			});
		}else{
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

		yield put({
			type: 'SET_IS_VIAGENS_LOADING',
			payload: false
		});
	} catch ({message, response}) {
		console.warn('[ERROR : BUSCANDO_VIAGENS]', { message, response });
		AlertHelper.show('error', 'Erro', message);

		yield put({
			type: 'SET_IS_VIAGENS_LOADING',
			payload: false
		});
	}
}

function* alterarSenha({payload}) {
	console.log('[SAGA] - ALTERANDO_SENHA');

	yield put({
		type: 'SET_CHANGING_PASSWORD',
		payload: true
	});

	try {

		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		var data = new FormData();
		const dados = {
			token: token,
			phone: phone,
			password: payload.password
		};

		data.append('dados', JSON.stringify(dados));
		console.log(data);
		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/usuarios/altera_senha/',
		 	method: 'POST',
		 	data: data
		});

		console.log('[ALTERANDO_SENHA]', response);

		if (response.data.status == 'ok') {
			AlertHelper.show('success', 'Sucesso', 'Senha alterada com sucesso.');

		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}

		yield put({
			type: 'SET_CHANGING_PASSWORD',
			payload: false
		});
	} catch ({message, response}) {
		console.warn('[ERROR : ALTERANDO_SENHA]', { message, response });
		AlertHelper.show('error', 'Erro', message);

		yield put({
			type: 'SET_CHANGING_PASSWORD',
			payload: false
		});
	}
}

function* buscaManutencoes() {
	console.log('[SAGA] - BUSCANDO MANUTENÇÕES');

	try {
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		var data = new FormData();
		const dados = {
			token: token,
			phone: phone
		};

		data.append('dados', JSON.stringify(dados));
		console.log(data);
		const response = yield call(callApi, { 
			endpoint: CONFIG.url+'/Viagens/historico_manutencao/',
		 	method: 'POST',
		 	data: data
		});

		console.log('[BUSCANDO_MANUTENCOES]', response);

		if (response.data.status == 'ok') {
			yield put({
				type: 'SET_MANUTENCOES',
				payload: response.data.dados
			});
			console.log(response.data.dados);
		} else {
			AlertHelper.show('error', 'Erro', response.data.msg);
		}
	} catch ({message, response}) {
		console.warn('[ERROR : BUSCANDO_MANUTENCOES]', { message, response });
		AlertHelper.show('error', 'Erro', message);
	}
}

function* saveManutencao({payload}) {
  yield put({
    type: 'SET_SAVING_MANUTENCAO',
    payload: true,
  });

  try {
	const networkStatus = yield NetInfo.fetch();

	if (!networkStatus.isConnected) {
		var manutencoes_sync = yield AsyncStorage.getItem('manutencoes_sync');
		if (manutencoes_sync !== null) {
			despesas_sync = JSON.parse(manutencoes_sync);
		} else {
			manutencoes_sync = [];
		}

		manutencoes_sync.push({...payload.fields, _uniqid: guidGenerator()});

		yield AsyncStorage.setItem('manutencoes_sync', JSON.stringify(manutencoes_sync));
		console.log(yield AsyncStorage.getItem('manutencoes_sync'));

		yield AlertHelper.show(
			'warn',
			'Sem conexão',
			'Manutenção cadastrada com sucesso, porém, faça a sincronização assim que possível.',
	  	);
	  	Actions.pop();

		yield put({
		  type: 'SET_SAVING_MANUTENCAO',
		  payload: false,
		  });
		  
		yield calcularItensSincronizar();

		return true;
	}

    const response = yield sendManutencao(payload.fields);
	
    console.log(response.data); 
    if (response.status == 200) {
      if (response.data.status == 'ok') {
        console.log('[SAVE_MANUTENCAO]');
        yield AlertHelper.show(
          'success',
          'Tudo certo',
          'Manutenção cadastrada com sucesso!',
        );
        Actions.pop();

      } else {
        yield AlertHelper.show('error', 'Erro', response.data.msg);
      }

      //console.log(response.data);

      yield put({
        type: 'SET_SAVING_MANUTENCAO',
        payload: false,
      });
    }
  } catch ({message, response}) {
    //console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});

    yield put({
      type: 'SET_SAVING_MANUTENCAO',
      payload: false,
    });

    yield AlertHelper.show('error', 'Erro', message);
  }
}

function* sendDespesa(despesa) {
	const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	const viagem_id = JSON.parse(yield AsyncStorage.getItem('viagem_ativa')).Viagem.id;

	var data = new FormData();
	var { anexo, ...formWithoutAnexo } = despesa;
	const dados = {
		despesa: { ...formWithoutAnexo },
		token: token,
		phone: phone,
		viagem_id: viagem_id
	};

	data.append('anexo', anexo);
	data.append('dados', JSON.stringify(dados));
	
	var endpoint = CONFIG.url + '/Viagens/despesa/';
	if ( typeof(dados.despesa.id) != 'undefined' && dados.despesa.id ) {
		endpoint = CONFIG.url + '/despesas/altera/';
	}

	const response = yield call(callApi, {
		endpoint: endpoint,
		method: 'POST',
		data: data,
		headers: {
			'content-type': 'multipart/form-data',
		},
	});
	return response;
}

function* sendCarregamentoDescarregamento(car_des) {
	const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	const viagem_id = JSON.parse(yield AsyncStorage.getItem('viagem_ativa')).Viagem.id;

	var data = new FormData();
	var { anexo, ...formWithoutAnexo } = car_des;
	const dados = {
		carga_descarga: { ...formWithoutAnexo },
		token: token,
		phone: phone,
		viagem_id: viagem_id
	};

	data.append('anexo', anexo);
	data.append('dados', JSON.stringify(dados));

	const response = yield call(callApi, {
		endpoint: CONFIG.url + '/Viagens/carregamento_descarregamento/',
		method: 'POST',
		data: data,
		headers: {
			'content-type': 'multipart/form-data',
		},
	});
	return response;
}

function* sendAbastecimento(abastecimento) {
	const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	const viagem_id = JSON.parse(yield AsyncStorage.getItem('viagem_ativa')).Viagem.id;

	var data = new FormData();
	var { anexo, ...formWithoutAnexo } = abastecimento;
	const dados = {
		abastecimento: { ...formWithoutAnexo },
		token: token,
		phone: phone,
		viagem_id: viagem_id
	};

	data.append('anexo', anexo);
	data.append('dados', JSON.stringify(dados));
	
	var endpoint = CONFIG.url + '/Viagens/abastecimento/';
	if ( typeof(dados.abastecimento.id) != 'undefined' && dados.abastecimento.id ) {
		endpoint = CONFIG.url + '/abastecimentos/altera/';
	}
	const response = yield call(callApi, {
		endpoint: endpoint,
		method: 'POST',
		data: data,
		headers: {
			'content-type': 'multipart/form-data',
		},
	});
	return response;
}

function* sendManutencao(manutencao) {
	const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	const viagem_id = JSON.parse(yield AsyncStorage.getItem('viagem_ativa')).Viagem.id;

	var data = new FormData();
	var { anexo, ...formWithoutAnexo } = manutencao;
	const dados = {
		manutencao: { ...formWithoutAnexo },
		token: token,
		phone: phone,
		viagem_id: viagem_id
	};
	
	data.append('anexo', anexo);
	data.append('dados', JSON.stringify(dados));
	console.log(data);
	const response = yield call(callApi, {
		endpoint: CONFIG.url + '/Viagens/manutencao/',
		method: 'POST',
		data: data,
		headers: {
			'content-type': 'multipart/form-data',
		},
	});
	return response;
}

function* sincronizar() {
	yield put({
		type: 'SET_SYNCING',
		payload: true,
	});

	const networkStatus = yield NetInfo.fetch();

	if (!networkStatus.isConnected) {
		yield AlertHelper.show(
			'error',
			'Erro',
			'Você está sem conexão a internet, por favor, verifique e tente novamente.',
		);
		yield put({
			type: 'SET_SYNCING',
			payload: false,
		});
		return true;
	}

	var total_items = 0;
	var synced_items = 0;
	
	// DESPESAS
	var despesas_sync = yield AsyncStorage.getItem('despesas_sync');

	if (despesas_sync !== null) {
		despesas_sync = JSON.parse(despesas_sync);

		if (despesas_sync.length > 0) {
			total_items += despesas_sync.length;

			for (const despesa_item of despesas_sync) {
				try {
					var response = yield sendDespesa(despesa_item);				
					console.log(despesa_item);
					if (response.status == 200) {
						if (response.data.status == 'ok') {
							despesas_sync = yield despesas_sync.filter(item => { return item._uniqid !== despesa_item._uniqid});
							synced_items++;
						} else {
							console.warn('[ERROR : SYNCING DESPESAS]', response);
						}
					}
				} catch ({message, response}) {
					console.warn('[ERROR : SYNCING DESPESAS]', {message, response});

				}
			}

			yield AsyncStorage.setItem('despesas_sync', JSON.stringify(despesas_sync));

		} else {
			console.log("nenhuma despesa para sync!");
		}
	} else {
		console.log("nenhuma despesa para sync!");
	}

	// ABASTECIMENTOS
	var abastecimentos_sync = yield AsyncStorage.getItem('abastecimentos_sync');

	if (abastecimentos_sync !== null) {
		abastecimentos_sync = JSON.parse(abastecimentos_sync);

		if (abastecimentos_sync.length > 0) {
			total_items += abastecimentos_sync.length;

			for (const abastecimento_item of abastecimentos_sync) {
				try {
					var response = yield sendAbastecimento(abastecimento_item);				

					if (response.status == 200) {
						if (response.data.status == 'ok') {
							abastecimentos_sync = yield abastecimentos_sync.filter(item => { return item._uniqid !== abastecimento_item._uniqid});
							synced_items++;
						} else {
							console.warn('[ERROR : SYNCING ABASTECIMENTOS]', response);
						}
					}
				} catch ({message, response}) {
					console.warn('[ERROR : SYNCING ABASTECIMENTOS]', {message, response});

				}
			}

			yield AsyncStorage.setItem('abastecimentos_sync', JSON.stringify(abastecimentos_sync));

		} else {
			console.log("nenhum abastecimento para sync!");
		}
	} else {
		console.log("nenhum abastecimento para sync!");
	}


	// MANUTENÇÕES
	var manutencoes_sync = yield AsyncStorage.getItem('manutencoes_sync');

	if (manutencoes_sync !== null) {
		manutencoes_sync = JSON.parse(manutencoes_sync);

		if (manutencoes_sync.length > 0) {
			total_items += manutencoes_sync.length;

			for (const manutencao_item of manutencoes_sync) {
				try {
					var response = yield sendManutencao(manutencao_item);				

					if (response.status == 200) {
						if (response.data.status == 'ok') {
							manutencoes_sync = yield manutencoes_sync.filter(item => { return item._uniqid !== manutencao_item._uniqid});
							synced_items++;
						} else {
							console.warn('[ERROR : SYNCING MANUTENÇÕES]', response);
						}
					}
				} catch ({message, response}) {
					console.warn('[ERROR : SYNCING MANUTENÇÕES]', {message, response});

				}
			}

			yield AsyncStorage.setItem('manutencoes_sync', JSON.stringify(manutencoes_sync));

		} else {
			console.log("nenhuma manutenção para sync!");
		}
	} else {
		console.log("nenhuma manutenção para sync!");
	}


	// CARREGAMENTOS/DESCARREGAMENTOS
	var car_des_sync = yield AsyncStorage.getItem('car_des_sync');

	if (car_des_sync !== null) {
		car_des_sync = JSON.parse(car_des_sync);

		if (car_des_sync.length > 0) {
			total_items += car_des_sync.length;

			for (const car_des_item of car_des_sync) {
				try {
					var response = yield sendCarregamentoDescarregamento(car_des_item);				

					if (response.status == 200) {
						if (response.data.status == 'ok') {
							car_des_sync = yield car_des_sync.filter(item => { return item._uniqid !== car_des_item._uniqid});
							synced_items++;
						} else {
							console.warn('[ERROR : SYNCING CARREGAMENTOS/DESCARREGAMENTOS]', response);
						}
					}
				} catch ({message, response}) {
					console.warn('[ERROR : SYNCING CARREGAMENTOS/DESCARREGAMENTOS]', {message, response});

				}
			}

			yield AsyncStorage.setItem('car_des_sync', JSON.stringify(car_des_sync));

		} else {
			console.log("nenhum carregamento/descarregamento para sync!");
		}
	} else {
		console.log("nenhuma carregamento/descarregamento para sync!");
	}

	

	if (total_items == 0) {
		yield AlertHelper.show(
			'info',
			'Aviso',
			'Não há registros para sincronizar!',
		);
	} else if (total_items > 0 && synced_items != total_items) {
		yield AlertHelper.show(
			'error',
			'Erro',
			'Foi sincronizado apenas ' + synced_items + ' de ' + total_items + ' registro(s).',
		);
	} else {
		yield AlertHelper.show(
			'success',
			'Sucesso',
			'Foi sincronizado ' + synced_items + ' de ' + total_items + ' registro(s)!',
		);
	}

	yield put({
		type: 'SET_SYNCING',
		payload: false,
	});
	
	yield calcularItensSincronizar();
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function* calcularItensSincronizar() {
	let qtd_itens_sincronizar = 0;

	var despesas_sync = yield AsyncStorage.getItem('despesas_sync');
	qtd_itens_sincronizar += despesas_sync !== null ? JSON.parse(despesas_sync).length : 0;

	var abastecimentos_sync = yield AsyncStorage.getItem('abastecimentos_sync');
	qtd_itens_sincronizar += abastecimentos_sync !== null ? JSON.parse(abastecimentos_sync).length : 0;
	
	var manutencoes_sync = yield AsyncStorage.getItem('manutencoes_sync');
	qtd_itens_sincronizar += manutencoes_sync !== null ? JSON.parse(manutencoes_sync).length : 0;
	
	var car_des_sync = yield AsyncStorage.getItem('car_des_sync');
	qtd_itens_sincronizar += car_des_sync !== null ? JSON.parse(car_des_sync).length : 0;
	

	yield put({
		type: 'SET_ITENS_SINCRONIZAR',
		payload: qtd_itens_sincronizar
	});
}

function* saveDespesa({payload}) {
	
	console.log('[SAGA] - SALVANDO DESPESA');
	console.log(payload);

	if ( payload.step < 5 ){
		let next_step = payload.step+1;
		if ( payload.step == 3 && !payload.isManutencao ){
			next_step++;
		}

		yield put({
			type: 'SET_STEP_SAVE_DESPESA',
			payload: next_step
		});
		return false;
	}

	yield put({
		type: 'SET_SAVING_DESPESA',
		payload: true,
	});

	yield put({
		type: 'SET_STEP_SAVE_DESPESA',
		payload: 0
	});

	
  	try {
	  	console.log("enviando desp");
		const response = yield sendDespesa(payload);
    	//console.log('[SAVE_DESPESA]', response);

	    if (response.status == 200) {
			if (response.data.status == 'ok') {

				yield AlertHelper.show(
					'success',
					'Tudo certo',
					response.data.msg
				);

				if ( typeof(payload.id) != 'undefined' && payload.id ) {
					Actions.pop();
				}

				const viagem_id = JSON.parse(yield AsyncStorage.getItem('viagem_ativa')).Viagem.id;
				yield bDespesas({payload: {viagem_id: viagem_id}});


			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

			//console.log(response.data);

			yield put({
				type: 'SET_SAVING_DESPESA',
				payload: false,
			});
		}
	} catch ({message, response}) {
		//console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});

		yield put({
			type: 'SET_SAVING_DESPESA',
			payload: false,
		});

		yield AlertHelper.show('error', 'Erro', message);
	}
}

function* saveCaminhao({payload}) {
	
	console.log('[SAGA] - SALVANDO CAMINHÃO');
	console.log(payload);

	if ( payload.step < 12 ){
		let next_step = payload.step+1;

		yield put({
			type: 'SET_STEP_CAMINHAO',
			payload: next_step
		});
		return false;
	}

	yield put({
		type: 'SET_SAVING_CAMINHAO',
		payload: true,
	});

	yield put({
		type: 'SET_STEP_CAMINHAO',
		payload: 0
	});

	const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	
  	try {
	
		var data = new FormData();
		data.append("img", payload.img);
		data.append("empresa_id", payload.empresa_id);
		data.append("frota", payload.frota);
		data.append("km", payload.km);
		data.append("placa", payload.placa);
		data.append("placa_carreta", payload.placa_carreta);
		data.append("tanque", payload.tanque);
		data.append("tanque_arla", payload.tanque_arla);
		data.append("tanque_litragem_inicial", payload.tanque_litragem_inicial);
		data.append("tanque_arla_litragem_inicial", payload.tanque_arla_litragem_inicial);
		data.append("tipo", payload.tipo);
		data.append("motorista", payload.motorista);
		data.append("phone", phone);
		data.append("token", token);
		
		var endpoint = CONFIG.url + '/Veiculos/cadastrar/';
		if ( typeof(payload.id) != 'undefined' && payload.id ) {
			data.append("id", payload.id);
			endpoint = CONFIG.url + '/Veiculos/altera/';
		}
	
		const response = yield call(callApi, {
			endpoint: endpoint,
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

	    if (response.status == 200) {
			if (response.data.status == 'ok') {

				yield buscaCaminhoesUsuario({payload: change_selected = false});
				yield buscaCaminhoes({});

				yield AlertHelper.show(
					'success',
					'Tudo certo',
					response.data.msg
				);

				if ( typeof(payload.id) != 'undefined' && payload.id ) {
					Actions.pop();
				}



			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

			//console.log(response.data);

			yield put({
				type: 'SET_SAVING_CAMINHAO',
				payload: false,
			});
		}
	} catch ({message, response}) {
		//console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});

		yield put({
			type: 'SET_SAVING_CAMINHAO',
			payload: false,
		});

		yield AlertHelper.show('error', 'Erro', message);
	}
}

function* saveMotorista({payload}) {
	
	console.log('[SAGA] - SALVANDO MOTORISTA');
	console.log(payload);

	if ( payload.step < 5 ){
		let next_step = payload.step+1;

		yield put({
			type: 'SET_STEP_MOTORISTA',
			payload: next_step
		});
		return false;
	}

	yield put({
		type: 'SET_SAVING_MOTORISTA',
		payload: true,
	});

	const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	
  	try {
	
		var data = new FormData();
		data.append("img", payload.img);
		data.append("nome", payload.nome);
		data.append("ddd", payload.ddd);
		data.append("telefone", payload.telefone);
		data.append("senha", payload.senha);
		data.append("senha_alterar", payload.senha_alterar);
		data.append("caminhao", payload.caminhao);
		data.append("phone", phone);
		data.append("token", token);
		
		var endpoint = CONFIG.url + '/Usuarios/cadastrar_motorista/';
		if ( typeof(payload.id) != 'undefined' && payload.id ) {
			data.append("id", payload.id);
			endpoint = CONFIG.url + '/Usuarios/altera_motorista/';
		}
	
		const response = yield call(callApi, {
			endpoint: endpoint,
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

	    if (response.status == 200) {
			if (response.data.status == 'ok') {

				yield buscaCaminhoesUsuario({payload: change_selected = false});
				yield buscaMotoristas({});

				yield AlertHelper.show(
					'success',
					'Tudo certo',
					response.data.msg
				);

				yield put({
					type: 'SET_STEP_MOTORISTA',
					payload: 0
				});

				if ( typeof(payload.id) != 'undefined' && payload.id ) {
					Actions.pop();
				}

			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

			//console.log(response.data);

			yield put({
				type: 'SET_SAVING_MOTORISTA',
				payload: false,
			});
		}
	} catch ({message, response}) {
		//console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});

		yield put({
			type: 'SET_SAVING_MOTORISTA',
			payload: false,
		});

		yield AlertHelper.show('error', 'Erro', message);
	}
}

function* carregaDadosViagem({payload}) {

	// demos fazer a requisicao
	yield put({
		type: 'SET_LOADING_VIAGEM',
		payload: true,
	});

	try {   
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
		let viagem_id = '';

		if ( typeof(payload.trip_id) != 'undefined' ) {
			viagem_id = payload.trip_id;
		} else {			
			viagem_id = JSON.parse(yield AsyncStorage.getItem('viagem_ativa')).Viagem.id;
		}

		const dados = {
			token: token,
			phone: phone,
			viagem_id: viagem_id
		};
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/Viagens/viagem_info/',
			method: 'GET',
			params: dados,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		console.log('[BUSCA_VIAGEM]', response);
		
		if (response.status == 200) {
			if (response.data.status == 'ok') {
				yield put({
					type: 'SET_VIAGEM_DADOS',
					payload: response.data.dados
				});
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}
			yield put({
				type: 'SET_LOADING_VIAGEM',
				payload: false,
			});
		}
  } catch ({message, response}) {
    //console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});
	yield put({
		type: 'SET_LOADING_VIAGEM',
		payload: false,
	});

    yield AlertHelper.show('error', 'Erro', message);
  }
}

function* buscaPeneus({payload}) {
	// demos fazer a requisicao

	/*yield put({
    type: 'SET_SAVING_ABASTECIMENTO',
    payload: true,
  });*/
	

	try {   
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
		const placa = JSON.parse(yield AsyncStorage.getItem('usuario')).Veiculo.placa;

		const dados = {
			token: token,
			phone: phone,
			placa: placa
		};

		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/Peneus/index',
			method: 'GET',
			params: dados,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		console.log('[BUSCA_PENEUS]', response);
		
		if (response.status == 200) {
			if (response.data.status == 'ok') {
				console.log('este sao os dados');
				console.log(response.data.dados);

				yield put({
					type: 'SET_PENEUS',
					payload: response.data.dados
				});
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

			/*
			yield put({
				type: 'SET_SAVING_ABASTECIMENTO',
				payload: false,
			});*/
		}
  } catch ({message, response}) {
    //console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});

    /*yield put({
      type: 'SET_SAVING_ABASTECIMENTO',
      payload: false,
    });*/

    yield AlertHelper.show('error', 'Erro', message);
  }
}

function* buscaDadosMotoristaCaminhao({payload}) {
	// demos fazer a requisicaos

	if ( payload.caminhao_id == null){

		yield put({
			type: 'SET_DADOS_MOTORISTA_CAMINHAO',
			payload: {				
				'kmL': '',
				'placa': '',
				'descricao': '',
				'placa_reboque': ''
			},
		});
		return false;
	}
	console.log('buscando os dados motorista/caminhão');
	console.log('caminhão id: ' + payload.caminhao_id);

	yield put({
    	type: 'SET_BUSCANDO_DADOS_MOTORISTA_CAMINHAO',
    	payload: true,
  	});
	

	try {   
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;

		const dados = {
			token: token,
			phone: phone,
			veiculo_id: payload.caminhao_id,
			viagem_id: payload.viagem_id
		};

		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/veiculos/dados_motorista_caminhao',
			method: 'GET',
			params: dados,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		//console.log('[BUSCA_DADOS_MOTORISTA_CAMINHAO]', response);
		
		if (response.status == 200) {
			if (response.data.status == 'ok') {			

				yield put({
					type: 'SET_DADOS_MOTORISTA_CAMINHAO',
					payload: response.data.dados,
				});
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

			yield put({
			  type: 'SET_BUSCANDO_DADOS_MOTORISTA_CAMINHAO',
			  payload: false,
			});
		}
  } catch ({message, response}) {
    console.warn('[ERROR : BUSCA_DADOS_MOTORISTA_CAMINHAO]', {message, response});

    yield put({
      type: 'SET_BUSCANDO_DADOS_MOTORISTA_CAMINHAO',
      payload: false,
    });

    yield AlertHelper.show('error', 'Erro', message);
  }
}

function* sProfilePhoto({payload}) {
	
	console.log('[SAGA] - ENVIANDO FOTO');
	console.log(payload);

  	try {
	  	console.log("enviando imagem");
		
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
		
		var { photo } = payload;
	
		var data = new FormData();
		const dados = {
			token: token,
			phone: phone,
		};
	
		data.append('foto', photo);
		data.append('dados', JSON.stringify(dados));
	
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/Usuarios/alteraFoto/',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});
  
	    if (response.status == 200) {
			if (response.data.status == 'ok') {

				console.log('[SEND_PHOTO]');

				yield AlertHelper.show(
					'success',
					'Tudo certo',
					'Sua foto foi alterada com sucesso!',
				);
	
				yield AsyncStorage.setItem(
					'usuario',
					JSON.stringify(response.data.dados.Usuario),
				);

			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}


		}
	} catch ({message, response}) {
		console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});
		console.log('[SEND_PHOTO]');
		yield AlertHelper.show(
		'error',
		'Erro',
		'Ocorreu um erro ao alterar sua foto!',
		);
	}
}

function* sVehiclePhoto({payload}) {
	
	console.log('[SAGA] - ENVIANDO FOTO');
	console.log(payload);

  	try {
	  	console.log("enviando imagem");
		
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
		
		var { photo, caminhao_id } = payload;
	
		var data = new FormData();
	
		data.append('foto', photo);
		data.append('token', token);
		data.append('phone', phone);
		data.append('caminhao_id', caminhao_id);
	
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/Veiculos/alteraFoto/',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});
  
	    if (response.status == 200) {
			if (response.data.status == 'ok') {

				yield buscaCaminhoes({});

				console.log('[SEND_PHOTO]');
				yield AlertHelper.show(
					'success',
					'Tudo certo',
					'A foto do caminhão foi alterada com sucesso!',
				);
	
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

		}
	} catch ({message, response}) {
		console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});
		console.log('[SEND_PHOTO]');
		yield AlertHelper.show(
		'error',
		'Erro',
		'Ocorreu um erro ao alterar a foto!',
		);
	}
}

function* sUserPhoto({payload}) {
	
	console.log('[SAGA] - ENVIANDO FOTO');
	console.log(payload);

  	try {
	  	console.log("enviando imagem");
		
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
		
		var { photo, usuario_id } = payload;
	
		var data = new FormData();
	
		data.append('foto', photo);
		data.append('token', token);
		data.append('phone', phone);
		data.append('usuario_id', usuario_id);
	
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/Usuarios/alteraFotoMotorista/',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});
  
	    if (response.status == 200) {
			if (response.data.status == 'ok') {

				yield buscaMotoristas({});

				console.log('[SEND_PHOTO]');
				yield AlertHelper.show(
					'success',
					'Tudo certo',
					'A foto do motorista foi alterada com sucesso!',
				);
	
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

		}
	} catch ({message, response}) {
		console.warn('[ERROR : SAVE_CAR_DESCAR_TRIGGER]', {message, response});
		console.log('[SEND_PHOTO]');
		yield AlertHelper.show(
		'error',
		'Erro',
		'Ocorreu um erro ao alterar a foto!',
		);
	}
}

function* vProfilePhoto({payload}) {
	
	console.log('[SAGA] - VERIFICANDO FOTO');
	console.log(payload.photo);

  	try {
	  	console.log("enviando imagem");
		
		const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
		const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
		
		var { photo } = payload;
	
		var data = new FormData();
		const dados = {
			token: token,
			phone: phone,
		};
	
		data.append('foto', photo);
		data.append('dados', JSON.stringify(dados));
	
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/Usuarios/verificaFoto/',
			method: 'POST',
			data: data,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});
  
	    if (response.status == 200) {
			if (response.data.status == 'ok') {

				if ( response.data.isSame == 'no' ) {
					yield AsyncStorage.setItem(
						'usuario',
						JSON.stringify(response.data.dados.Usuario),
					);
				}


			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

		}
	} catch ({message, response}) {
		console.warn('[ERROR : VERIFY_PHOTO]', {message, response});
		console.log('[VERIFY_PHOTO]');

	}
}

function* resetStateCadastroSaga() {
	yield put({
		type: 'SET_STEP_CADASTRO',
		payload: 0,
	});
}

function* resetStateDespesaSaga() {
	yield put({
		type: 'SET_STEP_SAVE_DESPESA',
		payload: 0,
	});
}

function* resetStateAbastecimentoSaga() {
	yield put({
		type: 'SET_STEP_SAVE_ABASTECIMENTO',
		payload: 0,
	});
}

function* resetStateViagemSaga() {
	yield put({
		type: 'SET_STEP_INICIAR_VIAGEM',
		payload: 0,
	});
}

function* resetStateCaminhao() {
	yield put({
		type: 'SET_STEP_CAMINHAO',
		payload: 0,
	});
}

function* resetStateMotorista() {
	yield put({
		type: 'SET_STEP_MOTORISTA',
		payload: 0,
	});
}

function* resetStateLogin() {
	yield put({
		type: 'SET_DDD_CELLPHONE_OK',
		payload: false,
	});
}

function* bAbastecimentos({payload}) {
	// demos fazer a requisicao

	console.log('buscando os abastecimentos');
	const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	let dados = [];
	if ( typeof(payload.viagem_id) != 'undefined' && payload.viagem_id != null){
		console.log('viagem id: ' + payload.viagem_id);

		dados = {
			token: token,
			phone: phone,
			viagem_id: payload.viagem_id
		};
	} else {

		dados = {
			token: token,
			phone: phone
		};

	}

	yield put({
    	type: 'SET_BUSCANDO_ABASTECIMENTOS',
    	payload: true,
  	});

	try {
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/abastecimentos/index',
			method: 'GET',
			params: dados,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		//console.log('[BUSCA_DADOS_MOTORISTA_CAMINHAO]', response);		
		if (response.status == 200) {
			if (response.data.status == 'ok') {	

				yield put({
					type: 'SET_ABASTECIMENTOS_LIST',
					payload: response.data.dados,
				});
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

			yield put({
			  type: 'SET_BUSCANDO_ABASTECIMENTOS',
			  payload: false,
			});
		}
  } catch ({message, response}) {
    console.warn('[ERROR : BUSCAR_ABASTECIMENTOS]', {message, response});

    yield put({
      type: 'SET_BUSCANDO_ABASTECIMENTOS',
      payload: false,
    });

    yield AlertHelper.show('error', 'Erro', message);
  }
}

function* bDespesas({payload}) {
	// demos fazer a requisicao

	console.log('buscando os despesas');
	const token = JSON.parse(yield AsyncStorage.getItem('token')).token;
	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	let dados = [];

	if ( typeof(payload.viagem_id) != 'undefined' && typeof(payload.viagem_id) != undefined && payload.viagem_id != null){
		console.log('viagem id: ' + payload.viagem_id);

		dados = {
			token: token,
			phone: phone,
			viagem_id: payload.viagem_id
		};
	} else {

		dados = {
			token: token,
			phone: phone
		};

	}

	yield put({
    	type: 'SET_BUSCANDO_DESPESAS',
    	payload: true,
  	});

	try {
		console.log('buscando os despesas');
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/despesas/index',
			method: 'GET',
			params: dados,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});

		//console.log('[BUSCA_DADOS_MOTORISTA_CAMINHAO]', response);
		
		if (response.status == 200) {
			if (response.data.status == 'ok') {	

				yield put({
					type: 'SET_DESPESAS_LIST',
					payload: response.data.dados,
				});
			} else {
				yield AlertHelper.show('error', 'Erro', response.data.msg);
			}

			yield put({
			  type: 'SET_BUSCANDO_DESPESAS',
			  payload: false,
			});
		}
  } catch ({message, response}) {
    console.warn('[ERROR : BUSCAR_DESPESAS]', {message, response});

    yield put({
      type: 'SET_BUSCANDO_DESPESAS',
      payload: false,
    });

    yield AlertHelper.show('error', 'Erro', message);
  }
}

function* setDataToEdit({payload}){

	console.log('setando dados para alterar');
	if (payload.item == 'abastecimento') {
		yield put({
			type: 'SET_DATA_ABASTECIMENTO_TO_EDIT',
			payload: {
				id: payload.data.id,
				posto: payload.data.posto,
				valor: payload.data.valor_tanque,
				litros: payload.data.litragem,
				litros_arla: payload.data.litragem_arla == 0 ? '' : payload.data.litragem_arla,
				valor_arla: payload.data.valor_arla_br,
				km: payload.data.km,
			},
		});
	}

	else if (payload.item == 'despesa') {
		
		yield put({
			type: 'SET_DATA_DESPESA_TO_EDIT',
			payload: {
				id: payload.data.id,
				titulo: payload.data.titulo,
				valor: payload.data.valor_br,
			},
		});
	}

	else if (payload.item == 'caminhao') {

		if ( typeof(payload.data.Veiculo) == 'undefined' ) {
			yield put({
				type: 'SET_DATA_CAMINHAO_TO_EDIT',
				payload: {},
			});
		} else {
		
			yield put({
				type: 'SET_DATA_CAMINHAO_TO_EDIT',
				payload: {
					id: payload.data.Veiculo.id,
					frota: payload.data.Veiculo.frota,
					empresa_id: payload.data.Veiculo.empresa_id,
					placa: payload.data.Veiculo.placa,
					km: payload.data.Veiculo.km,
					placa_carreta: payload.data.Reboque.placa,
					tipo: payload.data.Veiculo.categoria,
					tanque: payload.data.Veiculo.tanque,
					tanque_litragem_inicial: payload.data.Veiculo.tanque_litragem_inicial,
					tanque_arla: payload.data.Veiculo.tanque_arla,
					tanque_arla_litragem_inicial: payload.data.Veiculo.tanque_arla_litragem_inicial,
					motorista: payload.data.Veiculo.usuario_id,
				},
			});

		}
	}

	else if (payload.item == 'motorista') {

	

		if ( typeof(payload.data.Usuario) == 'undefined' ) {
			yield put({
				type: 'SET_DATA_MOTORISTA_TO_EDIT',
				payload: {},
			});
		} else {

			let telefone = payload.data.Usuario.telefone;
			let dados = {};

			if ( typeof(payload.data.Veiculos) != 'undefined' && typeof(payload.data.Veiculos[0]) != 'undefined' && typeof(payload.data.Veiculos[0]['id']) != 'undefined' && payload.data.Veiculos[0]['id'] != null ) {
				dados = {
					id: payload.data.Usuario.id,
					nome: payload.data.Usuario.nome,
					ddd: telefone.substring(1, 3),
					telefone: telefone.substring(5, 90).replace('-',''),
					caminhao: payload.data.Veiculos[0]['id'],
				};

			} else {
				dados = {
					id: payload.data.Usuario.id,
					nome: payload.data.Usuario.nome,
					ddd: telefone.substring(1, 3),
					telefone: telefone.substring(5, 90).replace('-',''),
					caminhao: '',
				};
			}
			
			yield put({
				type: 'SET_DATA_MOTORISTA_TO_EDIT',
				payload: dados,
			});

		}
	}
}

function* verificaPendenciasFinanceiras({payload}) {

	console.log('verificando pendências financeiras');

	const phone = JSON.parse(yield AsyncStorage.getItem('usuario')).telefone;
	dados = {
		phone: phone
	};

	try {
		const response = yield call(callApi, {
			endpoint: CONFIG.url + '/Usuarios/verifica_pendencia_financeira',
			method: 'GET',
			params: dados,
			headers: {
				'content-type': 'multipart/form-data',
			},
		});
		
		if (response.status == 200) {
			if (response.data.status == 'ok') {	

				let tem_pendencias = '';

				if ( response.data.possui_pendencias == 1 ) {
					console.log("Pendencias financeiras OK, verificando se o usuário está em viagem.");
					yield verificaViagem({payload: {redireciona : true, buscar_caminhoes : true}});
				}
				 else if ( response.data.possui_pendencias == 2 ) {
					tem_pendencias = true;
					yield Actions.pendenciaFinanceira({phone: payload.phone});
				}

	
			} else {
				
				AlertHelper.show(
					'error',
					'Erro',
					'Impossível vefificar pendências financeiras',
				);

				AsyncStorage.clear();
				Actions.reset("home");
			}
		}
  } catch ({message, response}) {
    console.warn('[ERROR : BUSCAR_PENDENCIAS]', {message, response});
				
	AlertHelper.show(
		'error',
		'Erro',
		'Impossível vefificar pendências financeiras',
	);

	AsyncStorage.clear();
	Actions.reset("home");
  }
}

function* loadSingleCollectionData({payload}) {

	console.log('carregando dados da coletagem avulsa');
	const value = yield AsyncStorage.getItem('CODIGOS_AVULSOS');

	if (value !== null) {
	  // We have data!!
	  let codigos = JSON.parse(value);
	  let total_itens = 0;
	  let uniqe_itens = 0;

	  let aggrupedItens = []
	  aggrupedItens = Object.values(codigos.reduce((acc, item) => {
		if (!acc[item.barcodescanned]) {
			acc[item.barcodescanned] = {
				barcodescanned: item.barcodescanned,
				qtd: parseFloat(item.qtd),
			};
		} else {
			acc[item.barcodescanned].qtd += parseFloat(item.qtd);
		}
		return acc;
	  }, {}))

		

		yield aggrupedItens.map( async (codigo) => {
			total_itens += codigo.qtd;
		});

		uniqe_itens = aggrupedItens.length;

		yield put({
			type: 'SET_SINGLE_COLLECTION_DATA',
			payload: {
				n_itens: total_itens,
				n_uniqe_itens: uniqe_itens,
			},
		});

	} else {
		yield put({
			type: 'SET_SINGLE_COLLECTION_DATA',
			payload: {
				n_itens: 0,
				n_uniqe_itens: 0,
			},
		});
	}


}

function* loadCentralCollectionData({payload}) {

	console.log('carregando dados da coletagem central');
	const value = yield AsyncStorage.getItem('CODIGOS_CENTRAL');

	if (value !== null) {
	  // We have data!!
	  let codigos = JSON.parse(value);
	  let total_itens = 0;
	  let uniqe_itens = 0;

	  let aggrupedItens = []
	  aggrupedItens = Object.values(codigos.reduce((acc, item) => {
		if (!acc[item.barcodescanned]) {
			acc[item.barcodescanned] = {
				barcodescanned: item.barcodescanned,
				qtd: parseFloat(item.qtd),
			};
		} else {
			acc[item.barcodescanned].qtd += parseFloat(item.qtd);
		}
		return acc;
	  }, {}))

		

		yield aggrupedItens.map( async (codigo) => {
			total_itens += codigo.qtd;
		});

		uniqe_itens = aggrupedItens.length;

		yield put({
			type: 'SET_CENTRAL_COLLECTION_DATA',
			payload: {
				n_itens: total_itens,
				n_uniqe_itens: uniqe_itens,
			},
		});

	} else {
		yield put({
			type: 'SET_CENTRAL_COLLECTION_DATA',
			payload: {
				n_itens: 0,
				n_uniqe_itens: 0,
			},
		});
	}


}

export default function* () {
	yield takeLatest('REGISTRAR', registrar);
	yield takeLatest('LOGIN_TRIGGER', login);
	yield takeLatest('VERIFICA_VIAGEM', verificaViagem);
	yield takeLatest('ALTERAR_SENHA', alterarSenha);
	yield takeLatest('SEND_PROFILE_PHOTO', sProfilePhoto);
	yield takeLatest('SEND_VEHICLE_PHOTO', sVehiclePhoto);
	yield takeLatest('SEND_USER_PHOTO', sUserPhoto);
	yield takeLatest('VERIFY_PROFILE_PHOTO', vProfilePhoto);
	yield takeLatest('BUSCA_ABASTECIMENTOS', bAbastecimentos);
	yield takeLatest('BUSCA_DESPESAS', bDespesas);

	yield takeLatest('INICIAR_VIAGEM', iniciarViagem);
	yield takeLatest('BUSCA_CAMINHOES_USUARIO', buscaCaminhoesUsuario);
	yield takeLatest('BUSCA_CAMINHOES', buscaCaminhoes);
	yield takeLatest('BUSCA_CAMINHOES_LIST', buscaCaminhoesList);
	yield takeLatest('BUSCA_MOTORISTAS_LIST', buscaMotoristasList);
	yield takeLatest('BUSCA_MOTORISTAS', buscaMotoristas);
	yield takeLatest('BUSCA_EMPRESAS', buscaEmpresas);
	yield takeLatest('SELECIONA_CAMINHAO', selecionaCaminhao);
	yield takeLatest('BUSCA_DADOS_MOTORISTA_CAMINHAO', buscaDadosMotoristaCaminhao);
	yield takeLatest('PARAR_VIAGEM', pararViagem);
	yield takeLatest('BUSCA_VIAGENS', buscaViagens);
	yield takeLatest('BUSCA_MANUTENCOES', buscaManutencoes);
	yield takeLatest('SAVE_MANUTENCAO', saveManutencao);
	yield takeLatest('SAVE_ABASTECIMENTO', salvaAbastecimento);
	yield takeLatest('SAVE_DESPESA', saveDespesa);
	yield takeLatest('SAVE_CAMINHAO', saveCaminhao);
	yield takeLatest('SAVE_MOTORISTA', saveMotorista);
	yield takeLatest('RESET_STEP_CADASTRO', resetStateCadastroSaga);
	yield takeLatest('RESET_STEP_DESPESA', resetStateDespesaSaga);
	yield takeLatest('RESET_STEP_ABASTECIMENTO', resetStateAbastecimentoSaga);
	yield takeLatest('RESET_STEP_START_TRIP', resetStateViagemSaga);
	yield takeLatest('RESET_STEP_LOGIN', resetStateLogin);
	yield takeLatest('RESET_STEP_CAMINHAO', resetStateCaminhao);
	yield takeLatest('RESET_STEP_MOTORISTA', resetStateMotorista);
	yield takeLatest('SINCRONIZAR', sincronizar);
	yield takeLatest('DADOS_VIAGEM', carregaDadosViagem);
	yield takeLatest('VERIFICA_PENDENCIAS_FINANCEIRAS', verificaPendenciasFinanceiras);

	yield takeLatest('REDIRECT_VIAGEM', redirectViagem);

	yield takeLatest('CALCULAR_ITENS_SINCRONIZAR', calcularItensSincronizar);
	yield takeLatest('BUSCA_PENEUS', buscaPeneus);

	yield takeLatest('SET_DATA_TO_EDIT', setDataToEdit);

	yield takeLatest(
	'LOAD_SINGLE_COLLECTION_DATA',
	loadSingleCollectionData,
	);

	yield takeLatest(
	'LOAD_CENTRAL_COLLECTION_DATA',
	loadCentralCollectionData,
	);

}