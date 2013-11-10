Meteor.Router.add({
  '/' : function(){
    document.title = "Bursts";
    return 'home';
  },

  '/b/:burst': function(burst){
  	Meteor.subscribe("bursts", burst, function(){
  	  var obj = Bursts.findOne({_id: burst});
  	  Session.set("title", obj.title);
  	  Session.set("post", obj.post);
  	  document.title = obj.title;
  	});
  	Meteor.subscribe("replies", burst);
  	Session.set("burst", burst);
  	return 'burstPage';
  }
});