Bursts = new Meteor.Collection("bursts");
Replies = new Meteor.Collection("replies");

Meteor.publish("bursts", function(id){
  Bursts.find({_id: id});
});

Meteor.publish("replies", function(parentId){
  Replies.find({burst: parentId});  
});

Meteor.methods({

  createBurst: function(_title, _post, _public){
  	var time = new Date();
    	time = time.getTime();
  	var newBurst = Bursts.insert({title: _title, post: _post, publicBool: Boolean(_public), timestamp: time});
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