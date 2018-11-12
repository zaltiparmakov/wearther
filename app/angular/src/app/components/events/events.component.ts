import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Event } from '../../models/event';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Event[];

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents(): void {
    this.restService.getAllEvents()
      .subscribe(events => this.events = events);
  }
}
