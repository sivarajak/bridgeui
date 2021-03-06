import { Injectable } from '@angular/core';
import { ChatAdapter, User, Message, ParticipantResponse } from 'ng-chat';
import { Observable, of } from "rxjs";
import { map, catchError } from 'rxjs/operators';
//import { Socket } from 'ng-socket-io';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

//@Injectable()
export class SocketIOAdapter extends ChatAdapter
{
    //private socket: Socket;
    private http: HttpClient;
    private userId: number;

    constructor(userId: number,  http: HttpClient) {
        super();
        //this.socket = socket;
        this.http = http;
        this.userId = userId;

        this.InitializeSocketListerners();  
    }

    listFriends(): Observable<ParticipantResponse[]> {
        // List connected users to show in the friends list
        // Sending the userId from the request body as this is just a demo 
        /**return this.http
            .post("http://localhost:3000/listFriends", { userId: this.userId })
            .pipe(
                map((res:Response) => res.json()),
                catchError((error:any) => Observable.throw(error.json().error || 'Server error'))
            );**/
            return of([]);
    }

    getMessageHistory(userId: any): Observable<Message[]> {
        // This could be an API call to your NodeJS application that would go to the database
        // and retrieve a N amount of history messages between the users.
        return of([]);
    }
    
    sendMessage(message: Message): void {
        //this.socket.emit("sendMessage", message);
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
    }
}