import {BrowserAnimationsModule} from '@angular/platform-browser/animations'; // this is needed!
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app.routing';
import {RestangularModule} from 'ngx-restangular';
import {AppComponent} from './app.component';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {RestService} from './services/rest.service';
import {HttpClientModule} from '@angular/common/http';
import {SurveyComponent} from './views/survey/survey.component';
import {NouisliderModule} from 'ng2-nouislider';
import {SurveysComponent} from './views/surveys/surveys.component';
import {SettingsComponent} from './views/settings/settings.component';
import {ScaleQuestionComponent} from './components/questions/scale/scale-question.component';
import {TitleQuestionComponent} from './components/questions/title/title-question.component';
import {NotificationAnimationType, SimpleNotificationsModule} from 'angular2-notifications';
import {MemoriesComponent} from './views/memories/memories.component';
import {HomeComponent} from './views/home/home.component';
import {BrowserModule} from '@angular/platform-browser';
import {PromptService} from './services/prompt.service';
import {ResourcesComponent} from './views/resources/resources.component';
import {SensorsComponent} from './views/sensors/sensors.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {LoginComponent} from './views/login/login.component';
import {ProfileComponent} from './views/profile/profile.component';
import {VerificationModalComponent} from './shared/verification-modal/verification-modal.component';
import {DatetoolsService} from './services/datetools.service';
import { SamsungStatusComponent } from './components/questions/samsung-status/samsung-status.component';
import { OuraStatusComponent } from './components/questions/oura-status/oura-status.component';
import { UniteBreathingComponent } from './components/questions/unite-breathing/unite-breathing.component';
import { AudioPlayerComponent } from './components/questions/audio-player/audio-player.component';
import { ExerciseComponent } from './components/questions/exercise/exercise.component';
import { CheckQuestionComponent } from './components/questions/check/check-question.component';
import { TextQuestionComponent } from './components/questions/text/text-question.component';
import { RadioQuestionComponent } from './components/questions/radio/radio-question.component';
import { ImageScaleQuestionComponent } from './components/questions/image-scale/image-scale-question.component';
import { BigTextQuestionComponent } from './components/questions/big-text/big-text-question.component';
import { AudioQuestionComponent } from './components/questions/audio-capture/audio-question.component';
import { BreathingExerciseQuestionComponent } from './components/questions/breathing-exercise/breathing-exercise-question.component';
import { UploadPhotoQuestionComponent } from './components/questions/upload-photo/upload-photo-question.component';
import {UniteEmotionAssessmentComponent} from './components/questions/emoji-emotion-assessment/unite-emotion-assessment.component';
import { DatetimeComponent } from './components/questions/datetime/datetime.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { NgSelectModule } from '@ng-select/ng-select';
import {SelectQuestionComponent} from './components/questions/select-question/select-question.component';
import { UploadPhotoValidator } from './directives/validators/upload-photo-validator.directive';
import { CheckboxValidator } from './directives/validators/checkbox-validator.directive';
import { FileAccessor} from './directives/accessors/file-accessor.directive';
import { CountdownModule } from 'ngx-countdown';
import { NumberComponent } from './components/questions/number/number.component';
import { IndicatorComponent } from './components/questions/indicator/indicator.component';
import { SamsungStatusUpdatedComponent } from './components/questions/samsung-status-updated/samsung-status-updated.component';
import {ProfilePipe} from './pipes/profile.pipe';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        SurveyComponent,
        SurveysComponent,
        SettingsComponent,
        ScaleQuestionComponent,
        TitleQuestionComponent,
        MemoriesComponent,
        HomeComponent,
        ResourcesComponent,
        SensorsComponent,
        LoginComponent,
        ProfileComponent,
        VerificationModalComponent,
        SamsungStatusComponent,
        OuraStatusComponent,
        UniteBreathingComponent,
        AudioPlayerComponent,
        ExerciseComponent,
        CheckQuestionComponent,
        TextQuestionComponent,
        RadioQuestionComponent,
        ImageScaleQuestionComponent,
        BigTextQuestionComponent,
        AudioQuestionComponent,
        BreathingExerciseQuestionComponent,
        DatetimeComponent,
        UploadPhotoQuestionComponent,
        UniteEmotionAssessmentComponent,
        UploadPhotoValidator,
        CheckboxValidator,
        FileAccessor,
        IndicatorComponent,
        SelectQuestionComponent,
        NumberComponent,
        IndicatorComponent,
        SamsungStatusUpdatedComponent,
        ProfilePipe
    ],
    imports: [
        BrowserAnimationsModule,
        NouisliderModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AppRoutingModule,
        RestangularModule,
        HttpClientModule,
        SimpleNotificationsModule.forRoot({
            position: ['top', 'center'],
            timeOut: 2000,
            animate: NotificationAnimationType.Fade
        }),
        BrowserModule,
        NgxSpinnerModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        GalleryModule.forRoot(),
        NgSelectModule,
        CountdownModule
    ],
    providers: [
        RestService,
        PromptService,
        DatetoolsService
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ScaleQuestionComponent,
        VerificationModalComponent,
        UniteBreathingComponent
    ]
})
export class AppModule { }
