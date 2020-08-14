import { Injectable } from '@angular/core';
import { ChatAdapter,  Message, ParticipantResponse, ChatParticipantType } from 'ng-chat';
import { Observable, of } from "rxjs";
import { map, catchError, first, delay } from 'rxjs/operators';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
//import { Socket } from 'ng-socket-io';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User, Request } from '@app/models'
import { UserService, MessageService, SubscriptionService, CommunicationService } from '@app/services';

//@Injectable()
export class StompAdapter extends ChatAdapter
{
    //private socket: Socket;
    //private http: HttpClient;
    //private loggedInUser: User;
    //public toUser: User;
    private userId: number;
    //public toId: any;
    isLoaded: boolean = false;
    isCustomSocketOpened = false;
    private stompClient;
    messages: Message[] = [];
    requests: Request[] = [];

    /**constructor(userId: number, loggedInUser: User, toUser: User, http: HttpClient) {
        super();
        //this.socket = socket;
        this.http = http;
        this.toUser = loggedInUser;
        this.toUser = toUser;
        this.userId = userId;
        console.log("this.userId " + this.loggedInUser.userId);
        this.InitializeSocketListerners();  
    }*/

    constructor(userId: number, private userService: UserService, 
      private messageService: MessageService,
      private subscriptionService: SubscriptionService,
      private communicationService: CommunicationService) {
        super();
        //this.socket = socket;
        //this.http = http;
        this.userId = userId;
        //this.toId = toId;
        //console.log("this.userId " + this.loggedInUser.userId);
        console.log("this.userId " + this.userId);
        this.InitializeSocketListerners();  
    }

    listFriends(): Observable<ParticipantResponse[]> {
            return of([]);
    }

    getMessageHistory(toId: any): Observable<Message[]> {
        // This could be an API call to your NodeJS application that would go to the database
        // and retrieve a N amount of history messages between the users.
        console.log("getMessageHistory toId " + toId);

        return this.messageService.getMessageHistory(this.userId, toId);

        //return of(mockedHistory).pipe(delay(2000));
        //return of([]);
    }
    
    sendMessage(message: Message): void {
        //this.socket.emit("sendMessage", message);
        console.log("sendMessage " + message);
        console.log("sendMessage " + message.toId);
        console.log("sendMessage " + message.fromId);
        //console.log("userId " + this.loggedInUser.userId);
        //console.log("toId " + this.toUser.userId);
        //message.toId = this.toUser.userId;
        console.log("userId " + this.userId);
        //console.log("toId " + this.toId);
        
        /**if(this.toId != "undefined") {
            console.log("toIdddd " + this.toId);
            message.toId = this.toId;
        }*/
        /**console.log("this.stompClient.status " + this.stompClient.status);
        if (this.stompClient.status !== 'CONNECTED') {
          console.log("not connected");
          this.InitializeSocketListerners();
        }*/
        //this.stompClient.send("/api/message/send", {}, JSON.stringify(message));
        this.stompClient.send("/api/message/send", JSON.stringify(message));
        console.log(this.userService.userValue.messagedUsers.includes(message.toId));
        if(!this.userService.userValue.messagedUsers.includes(message.toId)) {
          console.log("refresh");
          this.userService.refreshLocalStorageUser(this.userId);
        }
    }

    public InitializeSocketListerners(): void
    {
     /** this.socket.on("messageReceived", (messageWrapper) => {
        // Handle the received message to ng-chat

        this.onMessageReceived(messageWrapper.user, messageWrapper.message);
      });

      this.socket.on("friendsListChanged", (usersCollection: Array<ParticipantResponse>) => {
        // Handle the received message to ng-chat
        this.onFriendsListChanged(usersCollection.filter(x => x.participant.id != this.userId));
      }); */
      console.log("InitializeSocketListerners");
        let headers: Object = {
            Authentication: `Bearer ${localStorage.getItem("token")}`,
        };
        let url = `${environment.apiUrl}/api/socket?Authorization=Bearer ` + localStorage.getItem("token");
        //let ws = new SockJS(`${environment.apiUrl}/api/socket`);
        let ws = new SockJS(url);
        //this.stompClient = Stomp.over(ws);
        //this.stompClient = Stomp.client(url);
        this.stompClient = Stomp.over(function(){
          return new SockJS(url);
        });
        this.stompClient.reconnect_delay = 5000;
        let that = this;
        this.stompClient.connect({}, function (frame) {
        that.isLoaded = true;
        //that.openGlobalSocket()
        that.openChatSocket()
        that.openRequestNotificationSocket();
        });
    }

    openGlobalSocket() {
        console.log("openGlobalSocket");
        this.stompClient.subscribe("/queue/chat", (message) => {
            console.log("openGlobalSocket1");
          this.handleChatResult(message);
        });
        console.log("openGlobalSocket2");
      }
    
      openChatSocket() {
        console.log("openSocket");
        if (this.isLoaded) {
            console.log("openSocket1");
          this.isCustomSocketOpened = true;
          this.stompClient.subscribe("/queue/chat/"+this.userId, (message) => {
            console.log("openSocket2");
            this.handleChatResult(message);
          });
        }
        console.log("openSocket3");
      }
    
      handleChatResult(message){
        console.log("handleResult" + message);
        if (message.body) {
            console.log("handleResult1" + message.body);
          let messageResult: Message = JSON.parse(message.body);
          console.log("messageResult" + messageResult);
          console.log(messageResult);
          this.messages.push(messageResult);
          //this.onMessageReceived({id: this.toUser.userId, status: 0, displayName: this.toUser.name, avatar: null, participantType: ChatParticipantType.User}, messageResult);
          console.log(messageResult.fromId);
          this.userService.getById(messageResult.fromId).pipe(first()).subscribe(data => {
            this.onMessageReceived({id: messageResult.fromId, status: 0, displayName: data.name, 
                avatar: null, participantType: ChatParticipantType.User}, messageResult);
          });
          
        }
      }

      openRequestNotificationSocket() {
        console.log("openRequestNotificationSocket");
        if (this.isLoaded) {
            console.log("openRequestNotificationSocket1");
          this.isCustomSocketOpened = true;

          this.subscriptionService.getSubscriptionById(this.userId).pipe(first())
              .subscribe(date => {
                date.selectedCategories.forEach(categoryId => {
                  this.stompClient.subscribe("/topic/category/"+categoryId, (message) => {
                    console.log("openRequestNotificationSocket2");
                    this.handleRequestNotificationResult(message);
                  });
                });
              }, 
              error => {
                console.log("There is no subscription");
              });            
        }
        console.log("openRequestNotificationSocket3");
      }
    
      handleRequestNotificationResult(message){
        console.log("handleRequestNotificationResult" + message);
        if (message.body) {
            console.log("handleResult1" + message.body);
          let messageResult: Request = JSON.parse(message.body);
          console.log("messageResult" + messageResult);
          console.log(messageResult);
          this.requests.push(messageResult);
          this.communicationService.emitChange({action : "OnSubscribedRequest"});
          //this.onMessageReceived({id: this.toUser.userId, status: 0, displayName: this.toUser.name, avatar: null, participantType: ChatParticipantType.User}, messageResult);
         
          
        }
      }

      disconnect() {
          console.log("disconnect");
          if(this.stompClient !== null) {
            this.stompClient.disconnect();
          }
      }
    
}