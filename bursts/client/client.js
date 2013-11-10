Bursts = new Meteor.Collection("bursts");
Replies = new Meteor.Collection("replies");

Meteor.autosubscribe(function() {
	Meteor.subscribe("mostRecent");
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

	'click button.btnSubmit': function(){
		var title = $(".title").text();
		var content = $(".content").text();
		var checked = $("#public:checked").length;
		Meteor.call("createBurst", title, content, checked, function(err, data){
			Meteor.Router.to("/b/" + data);
		});
	}
})

Template.home.rendered = function(){
	count = 0;
 	$(".check").hide();
 	$(".submit").hide();
	};