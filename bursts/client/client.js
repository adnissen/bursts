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