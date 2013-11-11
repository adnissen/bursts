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

  	Session.set("burst", burst);
    Session.set("clientId", Math.floor((Math.random() * 99999) + 10000));

    //we need to reset a "position" session var here, for infinite scrolling
    //(this is the position in the database we're currently at, so we need to request this number + 20 to get the next 20 messages)
    Session.set("position", 0);

    Meteor.subscribe("replies", burst, Session.get("position"));
  	return 'burstPage';
  }
});