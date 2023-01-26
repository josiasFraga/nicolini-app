//import IMAGES from "@constants/images";

const INITIAL_STATE = {
  data: [],
  ddd_cellphone_ok: false,
  permission_geolocation: false,
  first_access_app: true,
  is_cadastrando: false,
  is_requesting: false,
  viagem_ativa: {},
  itens_sincronizar: 0,
  dados_viagem: {
	  Viagem: {
      valor_adiantamento: '',
      total_abastecimentos: '',
      total_despesas: '',
      saldo_viagem: '',
      data_viagem_ini: '',
      destino: '',
      valor_frete: '',
      valor_comissao: '',
      duracao_dias: '',
      duracao_horas: '',
      Abastecimento: [],
      Despesa: [],
	  }
  },
  caminhoes: [],
  caminhoes_list: [],
  motoristas_list: [],
  motoristas: [],
  caminhoes_usuario: [],
  empresas: [],
  caminhao_selected: null,
  is_stopping_viagem: false,
  is_starting_viagem: false,
  is_syncing: false,
  viagens: [],
  manutencoes: [],
  is_viagens_loading: false,
  user_lat: 0,
  user_lng: 0,
  token: '',
  notifications_id: '000',
  loading: false,
  loadingSearchFood: false,
  loadingSearchRestaurant: false,
  loadingFilters: false,

  restaurant_order: false,
  resultFoods: [],
  restaurant_payment_types: [],
  loadingDetailRestaurant: false,
  restaurant_highlights: [],
  loadingCardapio: false,
  restaurant_foods: [],
  restaurant_foods_categories: [],
  food_selected_options: '', //usei string pois não atualizava a tela quando adcionava um item em um section q já estava na array
  loading_food_options: false,
  food_options: [],
  savingCarregamento: false,
  savingManutencao: false,
  savingAbastecimento: false,
  savingDespesa: false,
  savingCaminhao: false,
  peneus: [],
  stepCadastro: 0,
  stepIniciarViagem: 0,
  stepSaveAbastecimento: 0,
  stepSaveDespesa: 0,
  stepCaminhao: 0,
  stepMotorista: 0,
  buscando_dados_motorista_caminhao: false,
  dados_motorista_caminhao: {
    'kmL': '',
    'placa': '',
    'descricao': '',
    'placa_reboque': ''
  },
  is_changing_password: false,
  is_loading_viagem: false,
  is_loading_abastecimentos: false,
  abastecimentos_list: [],
  is_loading_despesas: false,
  despesas_list: [],
  data_abastecimento_to_edit: {},
  data_despesa_to_edit: {},
  data_caminhao_to_edit: {},
  data_motorista_to_edit: {},
  ddd_cellhpone_ok: false,
  loadingCaminhoes: false,
  is_loading_motoristas: false,
  savingMotorista: false,
  single_collection_data: {
    n_itens: 0,
    n_uniqe_itens: 0,
  },
  central_collection_data: {
    n_itens: 0,
    n_uniqe_itens: 0,
  },
  invert_collection_data: {
    n_itens: 0,
    n_uniqe_itens: 0,
  }
};

export const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_DDD_CELLPHONE_OK':
		return {...state, ddd_cellhpone_ok: action.payload};
    case 'SET_PERMISSION_GEOLOCATION':
		return {...state, permission_geolocation: action.payload};
    case 'SET_IS_CADASTRANDO':
		return {...state, is_cadastrando: action.payload};
    case 'SET_VIAGEM_ATIVA':
		return {...state, viagem_ativa: action.payload};
    case 'SET_IS_REQUESTING':
		return {...state, is_requesting: action.payload};
    case 'SET_IS_STARTING_VIAGEM':
		return {...state, is_starting_viagem: action.payload};
    case 'SET_IS_STOPPING_VIAGEM':
		return {...state, is_stopping_viagem: action.payload};
    case 'SET_VIAGENS':
    return {...state, viagens: action.payload};
    case 'SET_MANUTENCOES':
		return {...state, manutencoes: action.payload};
    case 'SET_IS_VIAGENS_LOADING':
		return {...state, is_viagens_loading: action.payload};
    case 'SET_SAVING_MANUTENCAO':
		return {...state, savingManutencao: action.payload};
    case 'SET_SAVING_ABASTECIMENTO':
		return {...state, savingAbastecimento: action.payload};
    case 'SET_SAVING_DESPESA':
		return {...state, savingDespesa: action.payload};
    case 'SET_SAVING_MOTORISTA':
		return {...state, savingMotorista: action.payload};
    case 'SET_BUSCANDO_ABASTECIMENTOS':
		return {...state, is_loading_abastecimentos: action.payload};
    case 'SET_ABASTECIMENTOS_LIST':
		return {...state, abastecimentos_list: action.payload};
    case 'SET_BUSCANDO_DESPESAS':
		return {...state, is_loading_despesas: action.payload};
    case 'SET_DESPESAS_LIST':
		return {...state, despesas_list: action.payload};
    case 'SET_CHANGING_PASSWORD':
		return {...state, is_changing_password: action.payload};
    case 'SET_LOADING_VIAGEM':
		return {...state, is_loading_viagem: action.payload};
    case 'SET_SYNCING':
		return {...state, is_syncing: action.payload};
    case 'SET_IS_LOADING_CAMINHOES':
		return {...state, loadingCaminhoes: action.payload};
    case 'SET_CAMINHOES':
		return {...state, caminhoes: action.payload};
    case 'SET_CAMINHOES_USUARIO':
		return {...state, caminhoes_usuario: action.payload};
    case 'SET_CAMINHOES_LIST':
		return {...state, caminhoes_list: action.payload};
    case 'SET_LOADING_MOTORISTAS':
		return {...state, is_loading_motoristas: action.payload};
    case 'SET_MOTORISTAS':
		return {...state, motoristas: action.payload};
    case 'SET_MOTORISTAS_LIST':
		return {...state, motoristas_list: action.payload};
    case 'SET_EMPRESAS':
		return {...state, empresas: action.payload};
    case 'SET_CAMINHAO_SELECTED':
		return {...state, caminhao_selected: action.payload};
    case 'SET_BUSCANDO_DADOS_MOTORISTA_CAMINHAO':
		return {...state, buscando_dados_motorista_caminhao: action.payload};
    case 'SET_DADOS_MOTORISTA_CAMINHAO':
		return {...state, dados_motorista_caminhao: action.payload};
    case 'SET_USER_LAT':
		return {...state, user_lat: action.payload};
    case 'SET_USER_LNG':
		return {...state, user_lng: action.payload};
    case 'SET_VIAGEM_DADOS':
    return {...state, dados_viagem: action.payload};
    case 'SET_ITENS_SINCRONIZAR':
		return {...state, itens_sincronizar: action.payload};
    case 'UPDATE_TOKEN':
		return {...state, token: action.payload};
    case 'SET_TOKEN':
		return {...state, token: action.payload};
    case 'SET_PENEUS':
		return {...state, peneus: action.payload};
    case 'SET_STEP_CADASTRO':
		return {...state, stepCadastro: action.payload};
    case 'SET_STEP_INICIAR_VIAGEM':
		return {...state, stepIniciarViagem: action.payload};
    case 'SET_STEP_SAVE_ABASTECIMENTO':
		return {...state, stepSaveAbastecimento: action.payload};
    case 'SET_STEP_SAVE_DESPESA':
		return {...state, stepSaveDespesa: action.payload};
    case 'SET_STEP_CAMINHAO':
		return {...state, stepCaminhao: action.payload};
    case 'SET_STEP_MOTORISTA':
		return {...state, stepMotorista: action.payload};
    case 'SET_DATA_ABASTECIMENTO_TO_EDIT':
		return {...state, data_abastecimento_to_edit: action.payload};
    case 'SET_DATA_DESPESA_TO_EDIT':
		return {...state, data_despesa_to_edit: action.payload};
    case 'SET_DATA_CAMINHAO_TO_EDIT':
		return {...state, data_caminhao_to_edit: action.payload};
    case 'SET_DATA_MOTORISTA_TO_EDIT':
		return {...state, data_motorista_to_edit: action.payload};
    case 'SET_SINGLE_COLLECTION_DATA':
		return {...state, single_collection_data: action.payload};
    case 'SET_CENTRAL_COLLECTION_DATA':
		return {...state, central_collection_data: action.payload};
    case 'SET_INVERT_COLLECTION_DATA':
		return {...state, invert_collection_data: action.payload};
    default:
		return state;
  }
};
