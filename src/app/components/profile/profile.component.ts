import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, ChangeDetectorRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first, map, startWith } from 'rxjs/operators';
import { ChatAdapter } from 'ng-chat';

import { UserService, CommunicationService, ScheduleService, SubscriptionService, CategoryService } from '@app/services';
import { SocketIOAdapter, StompAdapter } from '@app/helpers'
import { User, Availability, Subscription, Category, Request } from '@app/models';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { TreeviewItem, TreeviewConfig, TreeItem } from 'ngx-treeview';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = new User();
  userId: number;
  loggedInUser: User;

  ratingCtrl = new FormControl(null, Validators.required);
  currentRate: number;

  availability: Observable<Availability>;

  render = false;
  subscription: Subscription;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasFilter: true,
      hasCollapseExpand: true,
      decoupleChildFromParent: false,
      maxHeight: 400
  });
  location: string;
  radius: number;

  obRequests: Observable<Request[]>;
  requests: Request[];

  /**http: HttpClient;
  public adapter: StompAdapter;
  @ViewChild('chat') chat;*/

  //@Output() chatClicked = new EventEmitter<any>();

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private communicationService: CommunicationService,
    private scheduleService: ScheduleService,
    private subscriptionService: SubscriptionService,
    private categoryService: CategoryService,
    private cdRef: ChangeDetectorRef) { 

    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.loggedInUser = userService.userValue;
    this.userId = route.snapshot.params["userId"];  
    //console.log("userId " + this.userId +" loggedInUser.userId " + this.loggedInUser.userId);
    //this.adapter  = new StompAdapter(this.loggedInUser.userId, this.loggedInUser, this.user, this.http);
    //this.adapter  = new StompAdapter(this.loggedInUser.userId, this.userId, this.http);
    userService.getById(this.userId).pipe(first())
      .subscribe(data => {
        this.user = data;
        this.currentRate = this.user.rating;
        //this.adapter.toUser = this.user;
      });

      this.getAvailabilityById(this.userId);

      this.getAllCategoriesTreeView();

      this.getMyRequests(this.userId);
  }

  ngOnInit(): void {
  }

  /**enableChat() {
    this.chat.
      onParticipantClickedFromFriendsList(
        {id: this.userId,
        displayName: this.user.name,
        status: 0,
        avatar: null}
      );
  }*/

  chatClickedEvent(action: any) {
    console.log("chatClickedEvent");
    //this.chatClicked.emit({toId: this.userId, event: action});
    this.communicationService.emitChange({action: "Chat", toId: this.userId});
  }

  setRating() {
    console.log("value   " + this.ratingCtrl.value);
    this.user.rating = this.ratingCtrl.value;
  }

  getAvailabilityById(userId) {
      this.availability = this.scheduleService.getAvailabilityById(userId);
  }

  getAllCategoriesTreeView() {
    this.categoryService.getAllCategories().subscribe(
      data => {
        let categories = data; 
        if(categories === null || categories === undefined) {
          return null;
        }
        this.items = categories.map(category => {
          return new TreeviewItem({text: category.categoryName, value: category.categoryId, checked: false,
            children: this.getChildTreeItemFromSubCategories(category.subCategories)})
        });
        //console.log("getAllCategoriesTreeView " + this.items);
        this.getSubscription();
      }
    );
    
  }

  getChildTreeItemFromSubCategories(categories: Category[]): TreeItem[] {
    if(categories === null || categories === undefined) {
      return null;
    } else {
      return categories.map(category => {
        return {text: category.categoryName, value: category.categoryId, checked: false,
          children: this.getChildTreeItemFromSubCategories(category.subCategories)}
      });
    }
  }

  getSubscription() {
    console.log("getSubscription");
    this.subscriptionService.getSubscriptionById(this.userId).pipe(first()).subscribe(
      data => {
        this.subscription = data;
        console.log("subscription: " + this.subscription.location);
        console.log("subscription:selectedCategories  " + this.subscription.selectedCategories);
        console.log("SUbscription " + JSON.stringify(this.subscription))
        this.location = this.subscription.location;
        this.radius = this.subscription.radius;
        if(Array.isArray(this.subscription.selectedCategories) && this.subscription.selectedCategories.length) {
          this.subscription.selectedCategories.map(categoryValue => {
            //console.log("getSubscription items " + this.items);
            //const foundItem = TreeviewHelper.findItemInList(this.items, categoryValue);
            //foundItem.checked = true;
            this.items.map(item => {
              this.selectTreeItem(item.children, categoryValue);
            });
            this.items.filter(item => item.value === categoryValue).map(item =>{ 
              item.checked = true;
              //item.setCheckedRecursive(false);
              //item.correctChecked();
            });
          });
          this.rerender();
        }
      }, 
      error => {
        console.log("No Subsription");
        this.rerender();
      }
    );
    
    
  }

  rerender() {
    this.items.forEach(item => {
      item.correctChecked();
      item.disabled = true;
    });
    this.render = true;
    this.cdRef.detectChanges();
    this.render = false;
  }

  selectTreeItem(childitems: TreeItem[], categoryValue: number) {
    if(Array.isArray(childitems) && childitems.length) {
      childitems.filter(item => item.value === categoryValue).map(item => item.checked = true);
      childitems.map(item => {
        this.selectTreeItem(item.children, categoryValue)
      });
    }
  }

  getMyRequests(userId) {
    this.obRequests = this.userService.getRequestByUserId(userId);
  }


}
