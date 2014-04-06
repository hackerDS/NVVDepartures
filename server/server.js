module.exports = function Server(app) {
  var mySelf = this;
  
  mySelf.init = function(){
    console.log('init hello world module');
  };
  
  mySelf.methods = {
    'serverMsg': function (msg) {
      console.log(msg);
    }
  };
};