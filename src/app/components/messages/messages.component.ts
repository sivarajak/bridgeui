import { Component, OnInit, PipeTransform  } from '@angular/core';
import { Request, User } from '@app/models'
import { ScheduleService, UserService, AlertService, RequestService, CommunicationService } from '@app/services'
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  users: User[];
  loggedInUser: User;
  messagedUsers: String[];
  //filter = new FormControl('');

  constructor(private userService: UserService,
    private communicationService: CommunicationService,
    private alertService: AlertService,
    private router: Router) {
      
      this.loggedInUser = this.userService.userValue;
      this.messagedUsers = this.userService.userValue.messagedUsers;
      console.log("this.messagedUsers " + this.messagedUsers);
      this.getMessagedUserDetails(this.messagedUsers);

     }

  ngOnInit(): void {
  }

  messageUser(userId): void {
    console.log("messageUser");
    this.communicationService.emitChange({action: "Chat", toId: userId});
  }

  deleteMessagedUser(userId, index): void {
    console.log("deleteRequest: " + index); 
    this.loggedInUser.messagedUsers.splice(index, 1);
    console.log("users before remove" + this.users);
    let messagedUsers = {"messagedUsers" : this.loggedInUser.messagedUsers};
    this.userService.updateMessagedUsers(this.loggedInUser.userId, messagedUsers)
      .pipe(first()).subscribe(x => {

        console.log("success");
        this.users.filter(user => user.userId == userId).forEach(filteredUser => {
          this.users.splice(this.users.indexOf(filteredUser), 1);
        });
        console.log("users after remove" + this.users);
        
        },
        error => {
          console.log("error" + error);
          this.alertService.error("Not able to delete this request at this moment. Try again");
        }); 
        console.log("deleted");
    
  }

  getMessagedUserDetails(userIds: String[]) { 
    if(userIds != null  && userIds.length > 0) {
      this.userService.getUsersByUserIds(userIds).subscribe(
        data => {
          this.users = data;
        }
      );
    }
  }

}
