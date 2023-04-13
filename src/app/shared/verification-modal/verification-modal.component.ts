import {Component, Input, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {NotificationsService} from 'angular2-notifications';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verification-modal',
  templateUrl: './verification-modal.component.html',
  styleUrls: ['./verification-modal.component.scss']
})
export class VerificationModalComponent implements OnInit {
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {  }

}
