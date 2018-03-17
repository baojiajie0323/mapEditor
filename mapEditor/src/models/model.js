
export default {

  namespace: 'mapeditor',

  state: {
    drawMode: "",
    dataModalShow: false,
    showMapView: false,
    selectedArea: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    setDrawMode(state, { payload: drawMode }) {
      return { ...state, drawMode };
    },
    setDataModalShow(state, { payload: dataModalShow }) {
      return { ...state, dataModalShow };
    },
    setMapview(state, { payload: showMapView }) {
      return { ...state, showMapView: !state.showMapView };
    },
    selectedArea(state, { payload: selectedArea }) {
      return { ...state, selectedArea };
    }
  },

};
