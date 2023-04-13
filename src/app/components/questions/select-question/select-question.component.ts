import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {AppConfig} from '../../../app.config';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-select-question',
  templateUrl: './select-question.component.html',
  styleUrls: ['./select-question.component.scss']
})
export class SelectQuestionComponent implements OnInit {
  @Input() title: string;
  @Input() value;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() required: boolean;
  @Input() autoComplete: string;

  searchTerm: any;
  searching = false;
  searchFailed = false;
  searchResult = ['1', '2', '3'];
  isLoading = false;
  items = ['z', 'zz', 'zzz'];

  constructor(private rest: RestService) { }

  ngOnInit() {
  }

  onChange() {
    this.valueChange.emit(this.value);
  }

  search2(text: string) {
    if (!text) {
      return of([]);
    }

    this.rest.getRestNutritionix().all('/v2/search/')
        .get('instant', {query: text}).pipe(
            map(response => {
          return response['common']
    }));
  }

  search = (text$: Observable<string>) =>
      text$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => this.searching = true),
          switchMap(term =>
              this.rest.getRestNutritionix().all('/v2/search/')
                  .get('instant', {query: term}).pipe(
                      map(response => response['common']),
                  tap(() => this.searchFailed = false),
                  catchError(() => {
                    this.searchFailed = true;
                    return of([]);
                  }))
          ),
          tap(() => this.searching = false)
      );

  formatter(x: {food_name: string}) {
    return x.food_name;
  }


}
