Bursts = new Meteor.Collection("bursts");
Replies = new Meteor.Collection("replies");

Meteor.publish("bursts", function(id){
  return Bursts.find({_id: id});
});

Meteor.publish("replies", function(parentId, position){
  //we need to take in thier current position so that we can return the right amount of documents for them, but not overload them before they get to the bottom of the page
  position = position + 20;
  return Replies.find({parent: parentId}, {sort: {timestamp: -1}, limit: position});  
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
  	var newBurst = Bursts.insert({title: _title, post: _post, publicBool: Boolean(_public), timestamp: time, replies: 1, typeCount: 0});
    return newBurst;
  },
  isTyping: function(_value, _parent){
    newData =  Bursts.update({_id: _parent}, {$inc: {typeCount: _value}});
    return newData;

  },
  reply: function(_text, _parent, _clientId){
    if (!_text || /^\s*$/.test(_text)){
      return "string is empty";
    }
    if (_text.length > 500){
      return "string too long";
    }
  	var parent = Bursts.findOne({_id: _parent});
    if (parent){
    	var time = new Date();
    	time = time.getTime();
    	Replies.insert({parent: _parent, text: _text, timestamp: time, clientId: _clientId});
    	Bursts.update({_id: _parent}, {$inc: {replies: 1}})
    }
  }
});