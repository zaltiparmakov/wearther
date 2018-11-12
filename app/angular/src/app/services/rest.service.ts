import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';

import { Event } from '../models/event';
import { User } from '../models/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RestService {

  constructor(private http: HttpClient) { }

  /* GET CALLS */
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(environment.backend_api + 'events');
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(environment.backend_api + 'event' + id);
  }

  profile(): Observable<User> {
    return this.http.get<User>(environment.backend_api + 'profile');
  }

  /* UPDATE CALLS */
  updateEvent(event: Event): Observable<any> {
    return this.http.put(environment.backend_api + 'events/update/' + event.id, event, httpOptions);
  }

  /* DELETE CALLS */
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(environment.backend_api + 'events/delete/' + id);
  }

  /* CREATE CALLS */
  createEvent(event: Event): Observable<any> {
    const eventData = JSON.stringify(event);
    return this.http.post<Event>(environment.backend_api + 'events/create', eventData, httpOptions);
  }

  login(user: User): Observable<any> {
    const userData = JSON.stringify(user);
    return this.http.post<User>(environment.backend_api + 'users/login', userData, httpOptions);
  }

}
