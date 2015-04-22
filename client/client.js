Bursts = new Meteor.Collection("bursts");
Replies = new Meteor.Collection("replies");

Meteor.autosubscribe(function() {
  Meteor.subscribe("mostRecent");
  Meteor.subscribe("topPosts");
});

Template.burstPage.title = function() {
  return Session.get("title");
}

Template.burstPage.post = function() {
  return Session.get("post");
}

Template.home.events({
	'click div.content': function(){
		if(count == 0){
	 	$(".title").text("Title");
	 	$(".content").text("Message");
	 	$(".check").show();
	 	$(".submit").show();
	 	$(".check").animate({height:"30px"},{queue:false});
	 	$(".submit").animate({height:"30px"},{queue:false});
	    } 
	    count ++;
	},

	'click div.title': function(){
		if(count == 0){
	 	$(".title").text("Title");
	 	$(".content").text("Message");
	 	$(".check").show();
	 	$(".submit").show();
	 	$(".check").animate({height:"30px"},{queue:false});
	 	$(".submit").animate({height:"30px"},{queue:false});
	    }
	    count ++;
	},

	'keypress div.title': function(event){
      return event.which != 13;
	},

    'keypress div.content': function(event){
      return event.which != 13;
	},

	'click button.btnSubmit': function(){
		var title = $(".title").text();
		var content = $(".content").text();
		var checked = $("#public:checked").length;
		Meteor.call("createBurst", title, content, checked, function(err, data){
			Meteor.Router.to("/b/" + data);
		});
	}
});

Template.home.recent = function() {
  return Bursts.find({publicBool: true}, {sort: {timestamp: -1}, limit: 5});
};

Template.home.top = function() {
  return Bursts.find({publicBool: true}, {sort: {replies: -1}, limit: 5});
};

Template.home.rendered = function(){
  count = 0;
  $(".check").hide();
  $(".submit").hide();
};

Template.burstPage.events({
  'keypress input.form-control' : function(e){
  	if (e.which == 13){

  		var content = $("#respond").val();
  		if (content.length <= 500){
  		  Meteor.call("reply", content, Session.get("burst"), Session.get("clientId"));
  		  var content = $("#respond").val("");
  	    }
  	}
  }
});

Template.burstPage.rendered = function(){
  if(!document.hasFocus()){
  	var obj = Bursts.findOne({_id: Session.get("burst")});
  	document.title = obj.title;
  	document.title = "(*)" + document.title;
  }
  $(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()){
      Session.set("position", Session.get("position") + 20)
      Meteor.subscribe("replies", Session.get("burst"), Session.get("position"));
    }
  });
};

Template.burstPage.created = function(){
	window.onfocus = function(){
	  console.log("here we go");
      var obj = Bursts.findOne({_id: Session.get("burst")});
  	  document.title = obj.title;
	};
	Session.set("clientId", Math.floor((Math.random() * 99999) + 10000));
};

Template.burstPage.reply = function(){
  return Replies.find({parent: Session.get("burst")}, {sort: {timestamp: -1}});  
};

