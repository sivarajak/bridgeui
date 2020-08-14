import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { TreeviewItem, TreeviewConfig, TreeItem, TreeviewHelper } from 'ngx-treeview';
import { RequestService, CategoryService, AlertService, UserService } from '@app/services';
import { Category, Request } from '@app/models'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-postreq',
  templateUrl: './postreq.component.html',
  styleUrls: ['./postreq.component.css']
})
export class PostreqComponent implements OnInit {

  requestForm: FormGroup;
  request: Request;
  loading = false;
  submitted = false;
  render = false;
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
  action: string;
  requestId: number;

  ngOnInit(): void {
    this.requestForm = this.formBuilder.group({
      location: ['', Validators.required],
      lookingFor: ['', Validators.required],
    });
    this.getAllCategoriesTreeView();
    if(this.action === "edit") {
      this.getRequest();
    }
  }

  constructor(private formBuilder: FormBuilder,
    private requestService: RequestService,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute) {
      this.userId = userService.userValue.userId;
      this.route.queryParams.subscribe(params => {
        this.action = params['action'];
        this.requestId = params['requestId'];
        });
  
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

  /**async getRequest() {
    console.log("getRequest");
    this.request = await this.requestService.getRequestById(this.requestId);
    console.log("request: " + this.request.location);
    console.log("request:selectedCategories  " + this.request.selectedCategories);
    console.log("SUbscription " + JSON.stringify(this.request))
      this.requestForm.get('location').setValue(this.request.location);
      this.requestForm.get('lookingFor').setValue(this.request.lookingFor);
      if(Array.isArray(this.request.selectedCategories) && this.request.selectedCategories.length) {
        this.request.selectedCategories.map(categoryValue => {
          //console.log("getRequest items " + this.items);
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

  getRequest() {
    console.log("getRequest");
    this.requestService.getRequestById(this.requestId).pipe(first()).subscribe(
      data => {
        this.request = data;
        console.log("request: " + this.request.location);
        console.log("request:selectedCategories  " + this.request.selectedCategories);
        console.log("SUbscription " + JSON.stringify(this.request))
        this.requestForm.get('location').setValue(this.request.location);
        this.requestForm.get('lookingFor').setValue(this.request.lookingFor);
        if(Array.isArray(this.request.selectedCategories) && this.request.selectedCategories.length) {
          this.request.selectedCategories.map(categoryValue => {
            //console.log("getRequest items " + this.items);
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

  postRequest() {
    console.log(this.requestForm);
    console.log('Saved: ' + JSON.stringify(this.requestForm.value));

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.requestForm.invalid) {
      this.alertService.error('Fill the request form properly', { keepAfterRouteChange: true });
      return;
    }

    this.loading = true;
    console.log("this.request " + this.request);
    console.log("this.values " + this.values);
    if(this.request === null || this.request === undefined) {
      console.log("this.requestForm.value - create " + this.requestForm.value);
      this.requestService.postRequest(this.requestForm.value, this.values)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.alertService.success('Your Request has been posted', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      } else if(Array.isArray(this.values) && this.values.length) {
        console.log("this.requestForm.value - update " + this.requestForm.value);
        this.requestService.updateRequest(this.requestId, this.requestForm.value, this.values)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.alertService.success('Your Request has been updated', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      } else {
        console.log("this.requestForm.value - delete " + this.requestForm.value);
        this.requestService.deleteRequest(this.requestId)
          .pipe(first())
          .subscribe(
              data => {
                  //this.router.navigate(['../scheduleavailability'], { relativeTo: this.route });
                  this.requestForm.get('radius').setValue('');
                  this.requestForm.get('location').setValue('');
                  this.request = null;
                  this.alertService.success('Your Request has been deleted', { keepAfterRouteChange: true });
              },
              error => {
                  this.alertService.error(error);
                  this.loading = false;
              });
      }
  }

}
