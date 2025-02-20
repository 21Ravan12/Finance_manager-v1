import { createStore } from 'vuex';

export default createStore({
  state: {
    token: localStorage.getItem('authToken') || null
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('authToken', token); 
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('authToken'); 
    }
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token
  }
});
