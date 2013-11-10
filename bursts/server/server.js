Bursts = new Meteor.Collection("bursts");
Replies = new Meteor.Collection("replies");

Meteor.publish("bursts", function(id){
  return Bursts.find({_id: id});
});

Meteor.publish("replies", function(parentId){
  return Replies.find({parent: parentId}, {sort: {timestamp: -1}, limit: 20});  
});

Meteor.publish("mostRecent", function(){
  return Bursts.find({publicBool: true}, {sort: {timestamp: -1}, limit: 5});
});

Meteor.publish("topPosts", function(){
  return Bursts.find({publicBool: true}, {sort: {replies: -1}, limit: 5});
});

Meteor.methods({

  createBurst: function(_title, _post, _public){
  	var time = new Date();
    	time = time.getTime();
  	var newBurst = Bursts.insert({title: _title, post: _post, publicBool: Boolean(_public), timestamp: time, replies: 1});
    return newBurst;
  },

  reply: function(_text, _parent){
    if (!_text || /^\s*$/.test(_text)){
      return "string is empty";
    }
  	var parent = Bursts.findOne({_id: _parent});
    if (parent){
    	var time = new Date();
    	time = time.getTime();
    	Replies.insert({parent: _parent, text: _text, timestamp: time});
    	Bursts.update({_id: _parent}, {$inc: {replies: 1}})
    }
  }
});