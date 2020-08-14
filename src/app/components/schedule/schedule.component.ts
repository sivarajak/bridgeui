import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Availability } from '@app/models'
import { ScheduleService, UserService, AlertService } from '@app/services'
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  //public isCollapsed = false;
  scheduleForm: FormGroup;
  //availability: Availability;
  private availability;
  userId: number;
  loading = false;
  submitted = false;


  constructor(private formBuilder: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private scheduleService: ScheduleService,
      private userService: UserService,
      private alertService: AlertService) {
        this.userId = userService.userValue.userId;
        
  }

  ngOnInit(): void {
    this.scheduleForm = this.formBuilder.group({
      location: ['', Validators.required],
      availableFor: ['', Validators.required],
      //availableFor: [this.availability.availableFor, Validators.required],
      //schedules: this.formBuilder.array([ this.buildSchedule() ])
      schedules: this.formBuilder.array([  ])
    });
    this.populateAvailability(this.userId);
  }

  get schedules(): FormArray {
    return this.scheduleForm.get('schedules') as FormArray;
  }

  addSchedule(): void {
    this.schedules.push(this.buildSchedule());
  }

  removeSchedule(index: number): void {
    this.schedules.removeAt(index);
  }

  /**populateSchedule(): FormGroup[] {
    const arr = this.availability.schedules.map(data => {
      return this.formBuilder.group({
        day: [data.day,Validators.required], //<--e.g. if Required
        starttime: [data.startTime, Validators.required],
        endtime: [data.endTime, Validators.required]});
    })
    return arr;
  }*/


  buildSchedule(): FormGroup {
    return this.formBuilder.group({
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  save() {
    console.log(this.scheduleForm);
    console.log('Saved: ' + JSON.stringify(this.scheduleForm.value));

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.scheduleForm.invalid) {
      this.alertService.error('Fill the availability properly', { keepAfterRouteChange: true });
      return;
    }

    this.loading = true;
    
    if(this.availability === null  || this.availability === undefined) {
      console.log("this.scheduleForm.value - create " + this.scheduleForm.value);
      this.scheduleService.scheduleAvailability(this.scheduleForm.value)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.alertService.success('Your availability has been updated', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      } else if(Array.isArray(this.scheduleForm.value.schedules) && this.scheduleForm.value.schedules.length) {
        console.log("this.scheduleForm.value - update " + this.scheduleForm.value);
        this.scheduleService.updateAvailability(this.userId, this.scheduleForm.value)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.alertService.success('Your availability has been updated', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      } else {
        console.log("this.scheduleForm.value - delete " + this.scheduleForm.value);
        this.scheduleService.deleteAvailability(this.userId)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.scheduleForm.get('availableFor').setValue('');
                  this.scheduleForm.get('location').setValue('');
                  this.availability = null;
                  this.alertService.success('Your availability has been deleted', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      }
  }

    /**async populateAvailability(userId: number) {
      this.availability = await this.scheduleService.getAvailabilityById(userId);
      console.log("getAvailabilityByUsername 1 " + this.availability);
      //this.populateSchedule().map(data => {this.schedules.push(data);});
      if(this.availability !== null) {
        this.availability.schedules.map(data => {
          console.log("Data " + data.day + data.startTime + data.endTime)
          this.schedules.push(this.formBuilder.group({
            day: [data.day,Validators.required], //<--e.g. if Required
            startTime: [data.startTime, Validators.required],
            endTime: [data.endTime, Validators.required]}));
        });
        this.scheduleForm.get('location').setValue(this.availability.location);
        this.scheduleForm.get('availableFor').setValue(this.availability.availableFor);
      }
    }*/

    populateAvailability(userId: number) {
      this.scheduleService.getAvailabilityById(userId).subscribe(
        data => {
          this.availability = data;
          if(this.availability !== null) {
            this.availability.schedules.map(data => {
              console.log("Data " + data.day + data.startTime + data.endTime)
              this.schedules.push(this.formBuilder.group({
                day: [data.day,Validators.required], //<--e.g. if Required
                startTime: [data.startTime, Validators.required],
                endTime: [data.endTime, Validators.required]}));
            });
            this.scheduleForm.get('location').setValue(this.availability.location);
            this.scheduleForm.get('availableFor').setValue(this.availability.availableFor);
        }
      
    });
  }
  

}
