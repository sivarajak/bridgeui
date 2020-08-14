import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService, AlertService } from '@app/services'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private alertService: AlertService,
  ) { }


  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      this.alertService.error("Fill the schedule form");
      return;
    }

    this.loading = true;
    this.userService.register(this.form.value)
        .pipe(first())
        .subscribe(
            data => {
                //this.alertService.success('Registration successful. Please login', { keepAfterRouteChange: true });
                this.router.navigate(['../login'], { relativeTo: this.route });
                this.alertService.success('Registration successful. Please login', { keepAfterRouteChange: true });
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
  }


}
