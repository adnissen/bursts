Router.route('/', function(){
  document.title = "Bursts";
  this.render('home');
});

Router.route('/b/:burst', function(){
  burst = this.params.burst;
  Meteor.subscribe("bursts", burst, function(){
    var obj = Bursts.findOne({_id: burst});
    Session.set("title", obj.title);
    Session.set("post", obj.post);
    document.title = obj.title;
  });

  Session.set("burst", burst);

  //we need to reset a "position" session var here, for infinite scrolling
  //(this is the position in the database we're currently at, so we need to request this number + 20 to get the next 20 messages)
  Session.set("position", 0);

  Meteor.subscribe("replies", burst, Session.get("position"));
  this.render('burstPage');
});
