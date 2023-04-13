import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { ProfileComponent } from './views/profile/profile.component';
import {SurveyComponent} from './views/survey/survey.component';
import {SurveysComponent} from './views/surveys/surveys.component';
import {SettingsComponent} from './views/settings/settings.component';
import {HomeComponent} from './views/home/home.component';
import {ResourcesComponent} from './views/resources/resources.component';
import {SensorsComponent} from './views/sensors/sensors.component';
import {MemoriesComponent} from './views/memories/memories.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'survey',               component: SurveyComponent },
    { path: 'surveys',              component: SurveysComponent },
    { path: 'home',                 component: HomeComponent },
    { path: 'login',                component: LoginComponent },
    { path: 'memories',             component: MemoriesComponent },
    { path: 'settings',             component: SettingsComponent },
    { path: 'resources',            component: ResourcesComponent },
    { path: 'sensors',              component: SensorsComponent },
    { path: 'profile',              component: ProfileComponent }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {useHash: true})
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
