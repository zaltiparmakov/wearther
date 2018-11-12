import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewChecked {

  constructor(private restService: RestService) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    function validate() {
      const prvo_geslo = (<HTMLInputElement>document.getElementById('geslo'));
      const drugo_geslo = (<HTMLInputElement>document.getElementById('potrdi_geslo'));

      if (prvo_geslo.value !== drugo_geslo.value) {
        drugo_geslo.setCustomValidity('Geslo se ne ujema');
      } else {
        drugo_geslo.setCustomValidity('');
      }
    }
  }

  onSubmit(form) {
    this.restService.login(form);
    console.log(form);
  }
}
