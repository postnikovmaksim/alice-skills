let token = '';

module.exports = {
  setToken({ newToken }){
      token = newToken;
  },

  getToken(){
      return token;
  }
};