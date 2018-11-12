import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewChecked {

  constructor(private restService: RestService) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    function swapFirst() {
      (<HTMLInputElement>document.getElementById('prikazna')).src = '../img/2slika.jpg';
      (<HTMLInputElement>document.getElementById('prvaSlika')).src = '../img/1slika.jpg';
    }

    function swapSecond() {
      (<HTMLInputElement>document.getElementById('prikazna')).src = '../img/3slika.jpg';
      (<HTMLInputElement>document.getElementById('drugaSlika')).src = '../img/1slika.jpg';
    }

    function swapThird() {
      (<HTMLInputElement>document.getElementById('prikazna')).src = '../img/4slika.jpg';
      (<HTMLInputElement>document.getElementById('tretjaSlika')).src = '../img/1slika.jpg';
    }

  }
}
