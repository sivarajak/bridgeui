import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Message } from 'ng-chat';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  getMessageHistory(fromId, toId) {
    console.log("fromId: " + fromId);
    console.log("toId: " + toId);
    return this.http.get<Message[]>(`${environment.apiUrl}/api/message/history?fromId=${fromId}&toId=${toId}`);
  }
}
