import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { TreeviewItem, TreeviewConfig, TreeItem, TreeviewHelper } from 'ngx-treeview';
import { SubscriptionService, CategoryService, AlertService, UserService } from '@app/services';
import { Category, Subscription } from '@app/models'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css'],
  providers: [
    SubscriptionService, CategoryService
  ]
})
export class SubscribeComponent implements OnInit {

  subscribeForm: FormGroup;
  subscription: Subscription;
  loading = false;
  submitted = false;
  render = false;
  //private cdRef: ChangeDetectorRef;
  userId: number;
  items: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
      hasAllCheckBox: true,
      hasFilter: true,
      hasCollapseExpand: true,
      decoupleChildFromParent: false,
      maxHeight: 400
  });

  ngOnInit(): void {
    this.subscribeForm = this.formBuilder.group({
      location: ['', Validators.required],
      radius: ['', Validators.required],
    });
    this.getAllCategoriesTreeView();
    //this.getSubscription();
  }

  constructor(private formBuilder: FormBuilder,
    private subscriptionService: SubscriptionService,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef) {
      this.userId = userService.userValue.userId;
  
  }

  onFilterChange(value: string) {
    console.log('filter:', value);
  }

  onSelectedChange(event) {
    console.log("event: " + event);
    console.log("values 1: " + this.values);
    this.values = event;
    console.log("values 2: " + this.values);
  }
  
  /**async getAllCategoriesTreeView() {
    let categories = await this.categoryService.getAllCategories();
    if(categories === null || categories === undefined) {
      return null;
    }
    this.items = categories.map(category => {
      return new TreeviewItem({text: category.categoryName, value: category.categoryId, checked: false,
        children: this.getChildTreeItemFromSubCategories(category.subCategories)})
    });
    //console.log("getAllCategoriesTreeView " + this.items);
  }*/

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

  /**async getSubscription() {
    console.log("getSubscription");
    this.subscription = await this.subscriptionService.getSubscriptionById(this.userId);
    console.log("subscription: " + this.subscription.location);
    console.log("subscription:selectedCategories  " + this.subscription.selectedCategories);
    console.log("SUbscription " + JSON.stringify(this.subscription))
      this.subscribeForm.get('location').setValue(this.subscription.location);
      this.subscribeForm.get('radius').setValue(this.subscription.radius);
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
  }*/

  getSubscription() {
    console.log("getSubscription");
    this.subscriptionService.getSubscriptionById(this.userId).pipe(first()).subscribe(
      data => {
        this.subscription = data;
        console.log("subscription: " + this.subscription.location);
        console.log("subscription:selectedCategories  " + this.subscription.selectedCategories);
        console.log("SUbscription " + JSON.stringify(this.subscription))
        this.subscribeForm.get('location').setValue(this.subscription.location);
        this.subscribeForm.get('radius').setValue(this.subscription.radius);
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
      }
    );
    
  }

  rerender() {
    this.items.forEach(item => {
      item.correctChecked();
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

  subscribe() {
    console.log(this.subscribeForm);
    console.log('Saved: ' + JSON.stringify(this.subscribeForm.value));

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.subscribeForm.invalid) {
      this.alertService.error('Fill the subscribe form properly', { keepAfterRouteChange: true });
      return;
    }

    this.loading = true;
    console.log("this.subscription " + this.subscription);
    console.log("this.values " + this.values);
    if(this.subscription === null || this.subscription === undefined) {
      console.log("this.subscribeForm.value - create " + this.subscribeForm.value);
      this.subscriptionService.subscribe(this.subscribeForm.value, this.values)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.alertService.success('Your Subscription has been updated', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      } else if(Array.isArray(this.values) && this.values.length) {
        console.log("this.subscribeForm.value - update " + this.subscribeForm.value);
        this.subscriptionService.updateSubscription(this.userId, this.subscribeForm.value, this.values)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.alertService.success('Your Subscription has been updated', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      } else {
        console.log("this.subscribeForm.value - delete " + this.subscribeForm.value);
        this.subscriptionService.deleteSubscription(this.userId)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.subscribeForm.get('radius').setValue('');
                  this.subscribeForm.get('location').setValue('');
                  this.subscription = null;
                  this.alertService.success('Your Subscription has been deleted', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      }
  }

}
