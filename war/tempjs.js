

///////////////////////////////////

//NOTE: Global Variables

///////////////////////////////////

TEST_MODE = false;

User = {Name: "Ralf", Email: "", University: 0000}


///////////////////////////////////

//NOTE: Basic Functions

///////////////////////////////////

$(document).ready(function(){
   // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
   $('.modal').modal();
   $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });
    connectSendBird();
 });

var element_list = ["group_info", "messaging","global_notification_list","global_event_list","your_groups","departments","courses","groups","group_notification_list","group_event_list"];

function hideAll(){
  for (var element in element_list){
    hideElement(element_list[element]);
  }
  showElement("background");
}

function findGroups(University){
  hideAll();
  loadDepartments(University);
}

function updateScroll(){
    var element = document.getElementById("messaging");
    element.scrollTop = element.scrollHeight;
}

function yourGroups(){
  if(document.getElementById('your_groups').style.display == 'flex'){
    hideElement('your_groups');
  }else{
    hideAll();
    loadGroups('your_groups', null);
  }
}

function hideElement(element){
  document.getElementById(element).style.display = 'none';
}

function showElement(element){
  document.getElementById(element).style.display = 'flex';
}

function toggleElement(element){
  if(document.getElementById(element).style.display == 'flex'){
    hideElement(element);
  }else{
    showElement(element);
  }
}

var timestampCheck;

function onMessageScroll(){
  if($("#messaging").scrollTop() == 0){
    console.log("Time to scroll")
    if(timestampCheck != oldestTimestamp){
      loadMoreMessages();
      timestampCheck = oldestTimestamp;
    }
  }
}

///////////////////////////////////

//NOTE: Load Functions

///////////////////////////////////

function loadMessages(group){
  for(var i = 2; i < element_list.length; i++){
    hideElement(element_list[i]);
  }
  hideElement("background");
  findOpenChannel("Study_group_" + group);
  showElement("messaging"); //TODO: change this to update from groupID
  $('#messaging li').empty();
}

function loadDepartments(university){
    //do some logic to get list of departments for given university
    var dept_list;
    if(TEST_MODE){
      dept_list = dummy_dept_list;
    }
    $('#departments #nav-mobile li').not('li:first').empty()
    showElement('departments');
    var getDepartments = {
          "async": true,
          "crossDomain": true,
          "url": "/getdepartments?universityID=" + university,
          "method": "GET",
          "headers": {
            "cache-control": "no-cache",
            "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
          }
        }
    $.ajax(getDepartments).done(function (response) {
      dept_list = response;
      for(var dept in dept_list){
          var dept_line= "<li class=\'bold\'><a onClick=\"";
          dept_line += "loadCourses(\'" + dept_list[dept].department_uid + "\')\" ";
          dept_line += "class=\'waves-effect waves-teal\'>" + dept_list[dept].department_name + "</a></li>";
          $('#departments #nav-mobile').append(dept_line);
      }
    });
}

function loadCourses(department){
  //do some logic to get list of courses for given department
  var course_list;
  if(TEST_MODE){
    course_list = dummy_course_list;
  }
  $('#courses #nav-mobile li').not('li:first').not('li:first').empty()
  showElement('courses');
  var getCourses = {
        "async": true,
        "crossDomain": true,
        "url": "/getcourses?departmentID=" + department,
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
        }
      }
  $.ajax(getCourses).done(function (response) {
    course_list = response;
    for(var course in course_list){
        var course_line= "<li class=\'bold\'><a onClick=\"";
        course_line += "loadGroups(\'groups\','" + course_list[course].course_uid + "\')\" ";
        course_line += "class=\'waves-effect waves-teal\'>" + course_list[course].course_name + "</a></li>";
        $('#courses #nav-mobile').append(course_line);
    }
  });
}

function loadGroups(groups_type, course){
  var group_list;
  if(TEST_MODE){ group_list = dummy_group_list; }
  $('#' + groups_type + ' #nav-mobile #collection').empty()
  showElement(groups_type);
  if(course != null){
    var getCourseGroups = {
          "async": true,
          "crossDomain": true,
          "url": "/getgroupbycourse?courseID=" + course,
          "method": "GET",
          "headers": {
            "cache-control": "no-cache",
            "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
          }
        }
    $.ajax(getCourseGroups).done(function (response) {
      group_list = response;
      for(var group in group_list){
          addGroup(groups_type, group_list[group]);
      }
    });
  }else{
    //TODO: get groups for user
  }
}

function loadGroupInfo(group){
  //do some logic to get group information for given uid

  var group
  if(TEST_MODE){
    group = dummy_group;
  }
  var getGroupInfo = {
          "async": true,
          "crossDomain": true,
          "url": "/getgroupinfo?groupID=" + group,
          "method": "GET",
          "headers": {
            "cache-control": "no-cache",
            "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
          }
        }
    $.ajax(getGroupInfo).done(function (response) {
        enterChannel(response.uid);
        updateGroupInfo(response);
    });
  showElement("group_info");
}

function loadNotifications(notification_type, uid){
  var notifications_list;
  if(TEST_MODE){
    notifications_list = dummy_notifications_list;
  }
  else if(notification_type == "global_notification_list"){
    //do some logic to get list of all events
  }else{
    //do some logic to get list of events for given group
  }
  showElement(notification_type);
  for(var notification in notifications_list){
      //TODO: eventually
  }
}

function loadEvents(event_type, group_uid){
  var event_list;
  var url;
  if(event_type == "group_event_list"){
    url = "/getevents?groupID=" + group_uid;
  }else{
    url = "/geteventsforuser";
  }
  showElement(event_type);
  $("#" + event_type + " li").not('li:first').empty()
  var getGroups = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
        }
      }
  $.ajax(getGroups).done(function (response) {
    event_list = response;
    for(var eventIndex in event_list){
        addEvent(event_type, event_list[eventIndex]);
    }
  });
}

///////////////////////////////////

//NOTE: Add Single Item Functions

///////////////////////////////////

var oldestTimestamp = Number.MAX_VALUE;

function isAuthor(message){
  if(message.sender.nickname == User.Name){
    return true;
  }
  return false;
}

function submitMessage(){
  var message = {};
  message.message = $('#message_input #icon_prefix')[0].value; //get user input
  if(message.message == "") {return;}
  addMessage(message, true, true);
  sendMessage(message.message);
  $('#message_input #icon_prefix')[0].value = ""; // clean user input
  updateScroll();
}

function addMessage(message, knownOwner, atFront){
  var color = "teal";
  var ownerStyle = " class=\"message-right\"";
  var name = "You";
  if(!knownOwner){
    if(!isAuthor(message)){
      ownerStyle = "";
      color = "blue-grey";
      name = message.sender.nickname;
    }
  }
  var message_line = "<li" + ownerStyle + "><div class=\"card " + color + " lighten-3 message text-right\">";
  message_line += "<div class=\"card-content white-text\"><p><strong>" + name + ": </strong>" + message.message;
  message_line += "</p></div></div></li>";
  if(atFront){
    $('#messaging ul').append(message_line);
  }else{
    $('#messaging ul').prepend(message_line);
  }
}

function addGroup(groups_type, group){
    var group_uid = group.uid;
    var group_icon_url = group.icon_url;
    var group_name = group.name;
    var group_size = group.size;
    var group_purpose = group.purpose;
    var group_join_leave = group.is_member ? 'Leave' : 'Join';
    var group_line = "<li onClick=\"loadGroupInfo(\'" + group_uid + "\')\" alt class=\'collection-item avatar waves-effect waves-teal z-depth-2\'>";
    group_line += "<img src=\"" + group_icon_url + "\" class=\"circle group_icon\">";
    group_line +=  "<div class=\"study_budy_info\"><span class=\"title\">" + group_name + "</span>";
    group_line +=  "<p>" + group_size + " members <br>" + group_purpose + "</p></div>";
    group_line +=  "<a href=\"#!\" class=\"group_joinORleave\"><p>" + group_join_leave + "<br> Group </p></a></li>";
    $('#' + groups_type + ' #nav-mobile #collection').append(group_line);
}

function addEvent(event_type, event_item){
  var event_id = event_item.uid;
  var event_name = event_item.name;
  var event_description = event_item.description;
  //var group_icon_url = event_list[group].creator;
  var event_date = event_item.date;
  var event_time= event_item.time;
  var event_location = event_item.location;
  //var group_purpose = event_list[group].duration;

  var event_line = "<li><div class=\"card teal darken-2\" style=\"margin: 5px; line-height:initial;\">";
  event_line += "<div class=\"card-content white-text\"><span class=\"card-subtitle\">";
  event_line += event_name + "</p><p><b>Time: </b>";
  event_line += event_date + "at" + event_time + "</br><b>Duration: </b>";
  event_line += "3 hours" + "</br><b>Location: </b>";
  event_line += event_location + "</p></div><div class=\"card-action\"><a onClick=\"\" >";
  event_line += "Leave" + "</a></div></div></li>"
  //$('#group_event_list #nav-mobile').append(event_line);
  $('#' + event_type + ' #nav-mobile').append(event_line);
}

var currentGroup;

function updateGroupInfo(group){
  currentGroup = group.uid;
  var group_icon_url = group.icon_url;
  var group_name = group.name;
  var isMember = group.is_member;
  var group_purpose = group.purpose;
  var group_new_notifications = 4;
  var group_new_messages = 3;
  var group_events = 5;
  $('#group_info #nav-mobile img')[0].src = group_icon_url;
  $('#group_info #nav-mobile #name')[0].textContent = group_name;
  $('#group_info #nav-mobile #purpose')[0].textContent = group_purpose;
  $('#group_info #nav-mobile #joinleavebtn')[0].remove();
  if(!isMember){
    $('#group_info #nav-mobile #notifications')[0].style.display = "none";
    $('#group_info #nav-mobile #messages')[0].style.display = "none";
    $('#group_info #nav-mobile #events')[0].style.display = "none";
    $('#group_info #nav-mobile #settings')[0].style.display = "none";
  }else{
    $('#group_info #nav-mobile')[0].style.display = "flex";
    $('#group_info #nav-mobile #notifications #badge')[0].textContent = group_new_notifications;
    $('#group_info #nav-mobile #notifications a')[0].setAttribute("onclick", "loadNotifications('group_notification_list', " + group.uid + ")");
    $('#group_info #nav-mobile #messages a')[0].setAttribute("onclick", "loadMessages(" + group.uid + ")");
    $('#group_info #nav-mobile #messages #badge')[0].textContent = group_new_messages;
    $('#group_info #nav-mobile #events #badge')[0].textContent = group_events;
    $('#group_info #nav-mobile #events a')[0].setAttribute("onclick", "loadEvents('group_event_list', " + group.uid + ")");
  }
  var color = isMember ? "red" : "";
  var join_or_leave = isMember ? "Leave" : "Join";
  var onClickAction = isMember ? "onClick=\"leaveGroup(" + group_uid + ")\"" : "onClick=\"joinGroup(" + group_uid + ")\"";

  var btn = "<li id=\"joinleavebtn\"><a " + onClickAction + " class=\"waves-effect " + color + " waves-light btn\">" + join_or_leave + " Group</a></li>";
  $('#group_info #nav-mobile').append(btn);
}


///////////////////////////////////

//NOTE: Extra Functions

///////////////////////////////////

function joinGroup(group_uid){
  var createEvent = {
        "async": true,
        "crossDomain": true,
        "url": "/joingroup?groupID=" + group_uid,
        "method": "POST",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
        }
      }
  $.ajax(createEvent).done(function (response) {
  });
}

function leaveGroup(group_uid){
  var createEvent = {
        "async": true,
        "crossDomain": true,
        "url": "/leavegroup?groupID=" + group_uid,
        "method": "POST",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
        }
      }
  $.ajax(createEvent).done(function (response) {
  });
}

function submitNewEvent(){
  var name = $("#createevent_event_name")[0].value;
  var description = $("#createevent_event_description")[0].value;
  var location = $("#createevent_location")[0].value;
  var date = $("#createevent_date")[0].value;
  //var time = $("#createevent_time")[0].value
  var url = "/eventcreate?event_name=" + name + "&event_description=" + description;
  url += "&event_location=" + location  + "&event_date=" + date; + "&group=" + currentGroup;
  console.log(url);
  var createEvent = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
        }
      }
  $.ajax(createEvent).done(function (response) {
  });
}

function submitNewGroup(){
  var name = $("#creategroup_group_name")[0].value;
  var description = $("#creategroup_group_description")[0].value;
  var department = $("#creategroup_department")[0].value;
  var course_id = $("#creategroup_course_id")[0].value;
  var course_name = $("#creategroup_course_name")[0].value;
  var professor = $("#creategroup_professor")[0].value;
  var max_size = $("#creategroup_maxsize")[0].value;
  var isPrivate= $("#creategroup_private")[0].value;
  //var time = $("#createevent_time")[0].value
  var url = "/groupcreate?group_name=" + name + "&group_description=" + description;
  url += "&department_name=" + department  + "&courseId=" + course_id + "&course_name=" + course_name;
  url += "&professor=" + professor + "&max_size=" + max_size + "&join_by_request=" + isPrivate;
  console.log(url);
  var createEvent = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "POST",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "fb38c742-ab74-18f1-d76d-1f3d4560f8ab"
        }
      }
  $.ajax(createEvent).done(function (response) {
  });
}

///////////////////////////////////

//NOTE: SendBird Functions

///////////////////////////////////

var sb;
var currentChannel = null;

function connectSendBird(){
  sb = new SendBird({appId: "B3E1CBF0-0C08-42FB-A967-4817AE8FE95A"});
  connectUser(0000,"Ralf"); //TODO: change to fit user data
}

function connectUser(UserID, NickName){
  sb.connect(UserID, function(user, error) {});
}

function updateUser(NickName, Profile_url){
  sb.updateCurrentUserInfo(NickName, Profile_url, function(response, error) {
    console.log(response, error);
  });
}

function findOpenChannel(channel_name){
  var openChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();
  openChannelListQuery.next(function (response, error) {
    if (error) {
        console.log(error);
        return;
    }
    console.log("Open Channels:: ");
    console.log(response);
    enterChannelbyName(response, channel_name)
  });
}

function enterChannelbyName(channel_list, channel_name){
  var channel_url = null;
  for(i = 0; i < channel_list.length; i++){
    if(channel_list[i].name == channel_name){
      channel_url = channel_list[i].url;
      break;
    }
  }
  if(channel_url == null){
    createOpenChannel(channel_name)
  }else{
    enterChannelbyURL(channel_url);
  }
}

function createOpenChannel(Channel_name){
  Cover_url = null;
  sb.OpenChannel.createChannel(Channel_name, Cover_url, null, function (channel, error) {
    if (error) {
        console.error(error);
        return;
    }
    console.log("Channel created:: ");
    console.log(channel);
    enterChannelbyURL(channel.url);
  });
}

function enterChannelbyURL(Channel_url){
  sb.OpenChannel.getChannel(Channel_url, function (channel, error) {
    if (error) {
        console.log(error);
        return;
    }

    channel.enter(function(response, error){
        if (error) {
            console.error(error);
            return;
        }
        console.log(response);
    });
    console.log("Enter Channel:: ");
    console.log(channel);
    currentChannel = channel;
    loadPreviousMessages();
  });
}

function exitChannel(Channel_url){
  sb.OpenChannel.getChannel(Channel_url, function (channel, error) {
    if (error) {
        console.error(error);
        return;
    }

    channel.exit(function(response, error){
        if (error) {
            console.error(error);
            return;
        }
        currentChannel = null;
    });
  });
}

function loadPreviousMessages(){
  var messageListQuery = currentChannel.createPreviousMessageListQuery();
  messageListQuery.load(20, true, function(messageList, error){
    if (error) {
        console.error(error);
        return;
    }
    console.log(messageList);
    var length = messageList.length - 1;
    while(length >= 0){
      var message = messageList[length];
      addMessage(message, false, true);
      oldestTimestamp = (oldestTimestamp > message.createdAt) ? message.createdAt : oldestTimestamp;
      length--;
    }
    updateScroll();
    connectChannelHandler();
  });
}

function loadMoreMessages(){
  var messageListQuery = currentChannel.createMessageListQuery();

  messageListQuery.prev(oldestTimestamp, 5, true, function(messageList, error){
      if (error) {
          console.error(error);
          return;
      }
      console.log(messageList);
      var length = messageList.length - 1;
      while(length >= 0){
        var message = messageList[length];
        addMessage(message, false, false);
        oldestTimestamp = (oldestTimestamp > message.createdAt) ? message.createdAt : oldestTimestamp;
        length--;
      }
  });
}

function sendMessage(Message){
  currentChannel.sendUserMessage(Message, null, function(message, error){
    if (error) {
        console.error(error);
        return;
    }
    console.log(message);
  });
}

function connectChannelHandler(){
  var ChannelHandler = new sb.ChannelHandler();

  ChannelHandler.onMessageReceived = messageReceived;

  sb.addChannelHandler("Study_buddies_handler", ChannelHandler);
}

function messageReceived(channel, message){
  console.log(channel, message);
  addMessage(message, false, true);
  updateScroll();
}

///////////////////////////////////

//NOTE: Test Functions

///////////////////////////////////


function testLoadDepartments(){
  TEST_MODE = true;
  loadDepartments();
}

function testLoadCourses(){
  TEST_MODE = true;
  loadCourses(null);
}

function testLoadGroups(){
  TEST_MODE = true;
  loadGroups("groups",null);
}

function testLoadGroupInfo(){
  TEST_MODE = true;
  loadGroupInfo(null);
}

function testLoadEvents_Group(){
  TEST_MODE = true;
  loadEvents("group_event_list", null);
}

function testLoadEvents_Global(){
  TEST_MODE = true;
  loadEvents("global_event_list", null);
}
var dummy_dept_list = ['Dance', 'Biology', 'Physical Education', 'Geology','Civil Engineering'];
var dummy_course_list = ['Dance 101 ', 'Biology 304', 'Physical Education 202', 'Geology 331','Civil Engineering 432'];
var dummy_group = {uid: 4713, icon_url: "http://simpleicon.com/wp-content/uploads/wifi_11.png", name: "ArmStrongs", size: 9, purpose: "To go where no man has gone before", is_member: true};
var dummy_group2 = {uid: 2917, icon_url: "http://simpleicon.com/wp-content/uploads/wifi_11.png", name: "Genius", size: 3, purpose: "T100 on every test", is_member: false};
var dummy_group_list = [dummy_group, dummy_group2];
var dummy_event = {id: 4713, name: "Best event ever", description: "yes, it's true", date: "Dec 9", time: "10:00 PM",  location: "Starbucks"};
var dummy_event2 = {id: 2917, name: "Another event", description: "another one", date: "Nov 3", time: "9:00 PM", location: "Somewhere over the rainbow"};
var dummy_event_list = [dummy_event, dummy_event2];
//
