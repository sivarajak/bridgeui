import { Component, OnInit, PipeTransform  } from '@angular/core';
import { Request } from '@app/models'
import { ScheduleService, UserService, AlertService, RequestService } from '@app/services'
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  //obRequests: Observable<Request[]>;
  requests: Request[];
  //filter = new FormControl('');

  constructor( private scheduleService: ScheduleService,
    private userService: UserService,
    private alertService: AlertService,
    private requestService: RequestService,
    private router: Router,
    private route: ActivatedRoute,
    private pipe: DecimalPipe) {
     

     }

  ngOnInit(): void {
    this.getMyRequests();
  }

  editRequest(index: number): void {
    //this.requests.removeAt(index);
    //this.obRequests.slice(index, 1);
    //this.router.navigate(["/postRequest"]);
    this.router.navigate(['../postrequest'], {queryParams: {action: 'edit', requestId: this.requests[index].requestId}});
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

  getMyRequests() {
    this.userService.getRequestByUserId(this.userService.userValue.userId).subscribe(
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

}
