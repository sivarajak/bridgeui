import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ChatAdapter } from 'ng-chat';

import { UserService, CommunicationService } from '@app/services';
import { SocketIOAdapter, StompAdapter } from '@app/helpers'
import { User } from '@app/models';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first, map, startWith } from 'rxjs/operators';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  isCollapsed = true;
  showBadge = false;

  //@Output() logOffClicked = new EventEmitter<any>();


  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private communicationService: CommunicationService) {
    this.user = userService.userValue;

  }

  ngOnInit(): void {
  }

  get token() {
    return localStorage.getItem('token');
  }

  collapse() {
    this.isCollapsed = true;
  }

  closeDropdown(dropdown) {
    dropdown.close();
  }

  logout() {
    //this.logOffClicked.emit();
    this.communicationService.emitChange({action: "LogOff"})
    this.userService.logout();
  }

  enableShowBadge() {
    console.log("toggleShowBadge Before" + this.showBadge);
    this.showBadge = !this.showBadge;
    console.log("toggleShowBadge After" + this.showBadge);
  }



}
