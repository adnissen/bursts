Bursts = new Meteor.Collection("bursts");
Replies = new Meteor.Collection("replies");

Meteor.publish("bursts", function(id){
  return Bursts.find({_id: id});
});

Meteor.publish("replies", function(parentId){
  return Replies.find({parent: parentId});  
});

Meteor.publish("mostRecent", function(){
  return Bursts.find({publicBool: true}, {sort: {timestamp: -1}, limit: 5});
});

Meteor.methods({

  createBurst: function(_title, _post, _public){
  	var time = new Date();
    	time = time.getTime();
  	var newBurst = Bursts.insert({title: _title, post: _post, publicBool: Boolean(_public), timestamp: time});
  	console.log(newBurst);
  	console.log(Bursts.find().count());
    return newBurst;
  },

  reply: function(_text, _parent){
  	var parent = Bursts.findOne({_id: _parent});
    if (parent){
    	var time = new Date();
    	time = time.getTime();
    	Replies.insert({parent: _parent, text: _text, timestamp: time});
    }
  }
});