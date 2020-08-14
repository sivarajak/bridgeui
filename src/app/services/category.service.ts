import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first} from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Subscription, Category } from '@app/models';
import { UserService } from './user.service';
import { TreeviewItem, TreeItem } from 'ngx-treeview';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private userService: UserService) {
     }

  createCategory(category: Category) {
    console.log("category: " + category);
    return this.http.post(`${environment.apiUrl}/api/categories`, category);
  }

  /**getCategoryById(id: number) {
    console.log("id: " + id);
    return this.http.get<Category>(`${environment.apiUrl}/api/categories/${id}`)
      .toPromise().catch((err: HttpErrorResponse) => {
      // simple logging, but you can do a lot more, see below
      //console.error('An error occurred:', err.error);
      return null;
    });
  }*/

  getCategoryById(id: number) {
    console.log("id: " + id);
    return this.http.get<Category>(`${environment.apiUrl}/api/categories/${id}`);
  }

  /**getAllCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}/api/categories`)
      .toPromise().catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        //console.error('An error occurred:', err.error);
        return null;
      });
  }*/

  getAllCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}/api/categories`);
  }

  updateCategory(id, category) {
    console.log("Category: " + category);
    category.id = id;
      return this.http.put(`${environment.apiUrl}/api/categories/${id}`, category);
  }

  deleteCategory(id: number) {
      return this.http.delete(`${environment.apiUrl}/api/categories/${id}`);
          /**.pipe(map(x => {
              return x;
          })); */
  }
}
