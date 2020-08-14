import { Component, OnInit, PipeTransform  } from '@angular/core';
import { Request } from '@app/models'
import { ScheduleService, UserService, AlertService, RequestService, CommunicationService } from '@app/services'
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  //obRequests: Observable<Request[]>;
  requests: Request[];
  //filter = new FormControl('');

  constructor( private scheduleService: ScheduleService,
    private userService: UserService,
    private alertService: AlertService,
    private requestService: RequestService,
    private communicationService: CommunicationService,
    private router: Router,
    private route: ActivatedRoute,
    private pipe: DecimalPipe) {
     

     }

  ngOnInit(): void {
    this.getMySubscribedRequests();
  }

  getRequests() {
    return this.requests
  }

  addRequests(request: Request): void {
    this.requests.push(request);
  }


  deleteRequest(index: number): void {
    console.log("deleteRequest: " + index); 
    console.log("this.requests[index].requestId " + this.requests[index].requestId)
    this.requestService.deleteRequest(this.requests[index].requestId)
      .pipe(first()).subscribe(x => {
        console.log("this.requests " + this.requests)
        console.log("this.requests " + this.requests.length)
        this.requests.splice(index, 1);
        /**this.requests = this.requests.filter(request => {
          console.log(request.requestId) ;
          console.log(x.requestId) ;
          return request.requestId !== x.requestId
        });*/
        //this.obRequests = Observable.create(this.requests);
        console.log("this.requests " + this.requests)
        console.log("this.requests " + this.requests.length)
        
        //return x;
        console.log("success");
        },
        error => {
          console.log("error" + error);
          this.alertService.error("Not able to delete this request at this moment. Try again");
        }); 
        console.log("deleted");
    
  }

  //async getMyRequests() {
    //this.requests = await this.userService.getRequestByUserId(this.userService.userValue.userId);
    //console.log("this.requests " + this.requests);
    /**this.obRequests = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, this.pipe))
    );*/
  //}

  getMySubscribedRequests() {
    this.userService.getSubscribedRequestByUserId(this.userService.userValue.userId).subscribe(
      data => {
        this.requests = data;
        console.log("this.requests " + this.requests);
        /**this.obRequests = this.filter.valueChanges.pipe(
          startWith(''),
          map(text => this.search(text, this.pipe))
        );*/
      }
    )
  }

  search(text: string, pipe: PipeTransform): Request[] {
    if(this.requests !== null && this.requests !== undefined)
    return this.requests.filter(request => {
      const term = text.toLowerCase();
      return request.lookingFor.toLowerCase().includes(term)
          || request.location.toLowerCase().includes(term);
          //|| availability.schedules.map(schedule => {
          //  return schedule.day.toLowerCase().includes(term);
          //});
    });
  }

  messageUser(userId): void {
    console.log("messageUser");
    this.communicationService.emitChange({action: "Chat", toId: userId});
  }

}
