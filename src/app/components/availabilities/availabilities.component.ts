import { Component, OnInit, PipeTransform  } from '@angular/core';
import { Availability, User } from '@app/models'
import { ScheduleService, UserService, AlertService, CommunicationService } from '@app/services'
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-availabilities',
  templateUrl: './availabilities.component.html',
  styleUrls: ['./availabilities.component.css']
})
export class AvailabilitiesComponent implements OnInit {

  obAvailabilities: Observable<Availability[]>;
  availabilities: Availability[];
  filter = new FormControl('');
  loggedInUser: User;

  constructor( private scheduleService: ScheduleService,
    private userService: UserService,
    private alertService: AlertService,
    private communicationService: CommunicationService,
    private pipe: DecimalPipe) {
      this.loggedInUser = userService.userValue;

     }

  ngOnInit(): void {
    /**this.scheduleService.getAllAvailabilities().pipe(first())
    .subscribe(availabilities => { 
      this.availabilities = availabilities;
      console.log("availabilities " + availabilities);
    });
    this.availabilities = await this.scheduleService.getAllAvailabilities();
    console.log("this.availabilities " + this.availabilities);
    this.obAvailabilities = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, this.pipe))
    );*/
    this.getAllavailabilities();
  }

  /**async getAllavailabilities() {
    this.availabilities = await this.scheduleService.getAllAvailabilities();
    console.log("this.availabilities " + this.availabilities);
    this.obAvailabilities = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text, this.pipe))
    );
  }*/

  getAllavailabilities() {
    this.scheduleService.getAllAvailabilities().subscribe(
      data => {
        this.availabilities = data;
        console.log("this.availabilities " + this.availabilities);
        this.obAvailabilities = this.filter.valueChanges.pipe(
          startWith(''),
          map(text => this.search(text, this.pipe)));
      });
    
  }

  search(text: string, pipe: PipeTransform): Availability[] {
    if(this.availabilities !== null && this.availabilities !== undefined)
    return this.availabilities.filter(availability => {
      const term = text.toLowerCase();
      return availability.userNickName.toLowerCase().includes(term)
          || availability.availableFor.toLowerCase().includes(term)
          || availability.location.toLowerCase().includes(term);
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
