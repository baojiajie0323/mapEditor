
export default {

  namespace: 'mapeditor',

  state: {
    drawMode: "",
    dataModalShow: false,
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
  },

};
