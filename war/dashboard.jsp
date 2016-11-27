<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Collections" %>
<%@ page import="com.googlecode.objectify.*" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.googlecode.objectify.ObjectifyService" %>
<%@ page import="com.googlecode.objectify.Ref" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="com.recursivebogosort.studybuddies.entities.*" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Dashboard</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <link rel="stylesheet" type="text/css" href="stylesheets/homestyle.css" />
</head>

<nav class="navbar navbar-default">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">StudyBuddies</a>
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav navbar-right">
        <li><a href="/settings.jsp">SETTINGS</a></li>
        <%
	    	UserService userService = UserServiceFactory.getUserService();
	    	User user = userService.getCurrentUser();
	    	if (user != null) {
	      		pageContext.setAttribute("user", user);
		%>
      <li><a href="<%= userService.createLogoutURL("/homepage.jsp")%>"><span class="glyphicon glyphicon-log-out"></span> LOG OUT</a></li>
      </ul>
    </div>
  </div>
</nav>

<body>

<p>
<form class="form-horizontal" action="/joingroup" method="POST">
						<div class="control-group">
							<label class="control-label" for="groupID">Group ID</label>
							<div class="controls">
								<input type="text" id="groupID" name="groupID"
									required="true" placeholder="" class="form-control input-lg">
								<p class="help-block">JoinGroupByID</p>
							</div>
						</div>
						<div class="controls">
								<button type="submit" class="btn btn-success">Join
									Group</button>
								<a href="/dashboard.jsp" class="btn btn-danger"> Cancel</a>
							</div>
</form>
<form class="form-horizontal" action="/leavegroup" method="POST">
						<div class="control-group">
							<label class="control-label" for="groupID">Group ID</label>
							<div class="controls">
								<input type="text" id="groupID" name="groupID"
									required="true" placeholder="" class="form-control input-lg">
								<p class="help-block">LeaveGroupByID</p>
							</div>
						</div>
						<div class="controls">
								<button type="submit" class="btn btn-success">Leave
									Group</button>
								<a href="/dashboard.jsp" class="btn btn-danger"> Cancel</a>
							</div>
</form>
<a href="/groupcreate.jsp" class="btn btn-danger"> Create Group</a>
<a href="/eventcreate.jsp" class="btn btn-danger"> Create Event</a>
<%
	ObjectifyService.register(StudyBuddiesUser.class);
 	String id = user.getUserId();
 	Ref<StudyBuddiesUser> sbuRef = ObjectifyService.ofy().load().type(StudyBuddiesUser.class).id(id);
 	StudyBuddiesUser sbu = sbuRef.get();
 	if(sbu != null){
 		ArrayList<Ref<GroupMember>> g = sbu.getAllGroups();
 		if(g == null){
 			out.println("NO GROUPS");
 		}
 		else{
 			Iterator iter = g.iterator();
 			while(iter.hasNext()){
 				Ref<GroupMember> gmemberRef = (Ref<GroupMember>)iter.next();
 				gmemberRef = ObjectifyService.ofy().load().ref(gmemberRef);
 				GroupMember gmember = gmemberRef.get();
 				Group grp = gmember.getGroup();
 				out.println(grp.getGroupName());
 	 		}
 			 
 		}
 		
 		ArrayList<Ref<Event>> it = sbu.getEvents();
 		if(it != null){
 		Iterator i = it.iterator();
 		while(i.hasNext()){
			Ref<Event> one = (Ref<Event>)i.next();
			one = ObjectifyService.ofy().load().ref(one);
			Event go = one.get();
			out.println(go.getEventName());
 		}
 		}
 		
 		
	 } }
 		%> </p>
 	

</body>
</html>
