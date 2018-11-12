import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  constructor(private restService: RestService, private location: Location, private form: FormsModule) { }

  ngOnInit() {
  }

  onSubmit(form: any): void {
    this.restService.createEvent(form);
    console.log(form);
  }

  goBack(): void {
    this.location.back();
  }
}
