package com.recursivebogosort.studybuddies.entities;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.Date;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;

@Entity
public class Event {
	
	@Id Long id;
    String eventName;
    String eventDiscription;
    String eventLocation;
    // int currentSize;            // Current number of members not including the owner
	// int maxSize;                // Max number of members not including the owner
    String date;
    boolean notificationSent;
	@Load Ref<Group> group;
	
	 private Event(){}

		private Event(String name, String location, String description, Group group, String date) {
			super();
			this.eventName = name;
			this.eventLocation = location;
			this.eventDiscription = description;
			this.date = date; //yyyy -mm -dd
			this.notificationSent = false;
			// this.eventSize = 0;
			// this.maxSize = maxSize;
		//	this.course = Ref.create(Key.create(Course.class, course.getId()));
	    }


		public Long getId(){ return id;}
		public boolean isNotificationSent(){
			return this.notificationSent;
		}
	    public String getEventName() { return eventName; }
	    public void setEventName(String name) { eventName = name; }
	    public String getEventDescription(){
	    	return this.eventDiscription;
	    }
	    public String getEventLocation(){
	    	return this.eventLocation;
	    }
	    public String getDate(){
	    	return this.date;
	    }
//	    public GroupOwner getOwner() { return ownerRef.getValue(); }
//	    public void setOwner(Key<GroupOwner> groupOwnerKey) { ownerRef = ofy().load().key(groupOwnerKey); }



	    public static Event createEvent(String name, String location, String description, Group group, String date)
	    {
	        Event event = new Event(name, location, description, group, date);
	        //event.addAllGroupMembersToEvent();
	        Key<Event> eventKey = ofy().save().entity(event).now();
	        group.addEvent(eventKey);
	       // ofy().save().entity(user).now();
	       // ofy().save().entity(groupOwner).now();
	        ofy().save().entity(group).now();
	        return event;
	    }

}
