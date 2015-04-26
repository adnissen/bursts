Bursts = new Meteor.Collection("bursts");
Replies = new Meteor.Collection("replies");
ClientsInUse = new Meteor.Collection("clients");

Bursts.allow({
  insert: function(userId, record){
    return false;
  },
  update: function(userId, record){
    return false;
  },
  remove: function(userId, record){
    return false;
  }
});

ClientsInUse.allow({
  insert: function(userId, record){
    return false;
  },
  update: function(userId, record){
    return false;
  },
  remove: function(userId, record){
    return false;
  }
});

Replies.allow({
  insert: function(userId, record){
    return false;
  },
  update: function(userId, record){
    return false;
  },
  remove: function(userId, record){
    return false;
  }
});

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

var stringToColour = function(str) {

    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
}

Meteor.methods({

  createBurst: function(_title, _post, _public){
  	var time = new Date();
    	time = time.getTime();
  	var newBurst = Bursts.insert({title: _title, post: _post, publicBool: Boolean(_public), timestamp: time, replies: 1});
    return newBurst;
  },

  reply: function(_text, _parent, _clientId){
    _clientId = this.connection.id;
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
      Replies.insert({parent: _parent, text: _text, timestamp: time, clientId: _clientId, color: stringToColour(_clientId)});
      Bursts.update({_id: _parent}, {$inc: {replies: 1}})
    }
  },

  getActiveBurst: function(){
    var replies = Replies.find({}, {sort: {timestamp: -1}, limit: 30});
    var ret;
    replies.forEach(function(reply) {
      parent = Bursts.findOne({_id: reply.parent});
      if (parent.publicBool){
        ret = parent._id;
      }
    });
    return ret;
  }
});
