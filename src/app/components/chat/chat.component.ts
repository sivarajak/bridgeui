import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first, map, startWith } from 'rxjs/operators';
import { ChatAdapter } from 'ng-chat';

import { UserService, MessageService, SubscriptionService, CommunicationService } from '@app/services';
import { SocketIOAdapter, StompAdapter } from '@app/helpers'
import { User } from '@app/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public toUser = new User();
  public toId: number;
  loggedInUser: User;
  
  public adapter: StompAdapter;
  chatS = false;

  @ViewChild('chat') chat;

  constructor(private userService: UserService,
    private route: ActivatedRoute, 
    private messageService: MessageService,
    private subscriptionService: SubscriptionService,
    private communicationService: CommunicationService) { 
    this.loggedInUser = userService.userValue;
    //this.toId = route.snapshot.params["userId"];  
    //console.log("toId " + this.toId +" loggedInUser.userId " + this.loggedInUser.userId);
    //this.adapter  = new StompAdapter(this.loggedInUser.userId, this.loggedInUser, this.user, this.http);
    this.adapter  = new StompAdapter(this.loggedInUser.userId, userService, messageService, subscriptionService, communicationService);
    /**userService.getById(this.toId).pipe(first())
      .subscribe(data => {
        this.toUser = data;
        this.adapter.toUser = this.toUser;
      });*/
  }

  ngOnInit(): void {
  }

  enableChat() {
    this.userService.getById(this.toId).pipe(first())
      .subscribe(data => {
        this.toUser = data;
        //this.adapter.toUser = this.toUser;
        //this.adapter.toId = this.toId;

        this.chat.
      onParticipantClickedFromFriendsList(
        {id: this.toId,
        displayName: this.toUser.name,
        status: 0,
        avatar: null}
      );

      });
    
  }

  disconnect() {
    this.adapter.disconnect();
  }

}
