import { Component, ViewChild } from '@angular/core';
import { ChatComponent } from './components/chat/chat.component';
import { CommunicationService } from '@app/services';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vChase';

  @ViewChild(ChatComponent)
  chatComponent: ChatComponent;

  @ViewChild(HeaderComponent)
  headerComponent: HeaderComponent;

  constructor(private communicationService: CommunicationService) {
    this.subscribeCommunicationServiceEvent();
  }

  get token() {
    return localStorage.getItem('token');
  }

  subscribeCommunicationServiceEvent() {
    this.communicationService.changeEmitted$.subscribe(data => {
      console.log("data  mmmmmmmm" + data);
      if(data.action === "Chat") {
        this.chatComponent.toId = data.toId;
        this.chatComponent.enableChat();
      } else if (data.action === "LogOff") {
        this.chatComponent.disconnect();
      } else if (data.action === "OnSubscribedRequest") {
        console.log("OnSubscribedRequest");
        this.headerComponent.enableShowBadge();
      }
    });
  }

  /**chatClickedEvent(event: any) {
    console.log("chatClickedEven in roott" + event.toId);
    this.chatComponent.toId = event.toId;
    this.chatComponent.enableChat();
  }

  onActivate(componentReference) {
      console.log("componentReference " + componentReference)
      //componentReference.anyFunction();
      if(componentReference.chatClicked != null && componentReference.chatClicked != "undefined") {
      componentReference.chatClicked.subscribe(data => {
        console.log("chatClickedEvenfffft" + data.toId);
      this.chatComponent.toId = data.toId;
      this.chatComponent.enableChat();
      });
    }
  }

  onLogOff() {
    this.chatComponent.disconnect();
  }*/
}
