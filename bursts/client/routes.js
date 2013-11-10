Meteor.Router.add({
  '/' : function(){
    document.title = "Bursts";
    return 'home';
  },

  '/b/:burst': function(burst){
  	Meteor.subscribe("bursts", burst);
  	Meteor.subscribe("replies", burst);
  	return 'burstPage';
  }
});