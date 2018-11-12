import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { WeatherComponent } from './components/weather/weather.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EventsComponent } from './components/events/events.component';
import { LoginComponent } from './components/login/login.component';
import { CreateEventComponent } from './components/create-event/create-event.component';

const routes: Routes = [
  { path: 'weather', component: WeatherComponent },
  { path: 'events', component: EventsComponent },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/weather', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot( routes, { enableTracing: true } ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
