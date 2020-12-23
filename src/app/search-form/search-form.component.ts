import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { SearchAutocompliteService } from '../search-autocomplite.service';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  host: {
    'class': 'search-from'
  }
})
export class SearchFormComponent implements OnInit {

  @Input() searchText: string;
  @Output() find = new EventEmitter<string>();

  private searchControl = new FormControl();
  private autocompliteOptions: Observable<string[]>;

  constructor(private autocomplite: SearchAutocompliteService) { 
    this.autocompliteOptions = this.searchControl.valueChanges.pipe(
      map(value => this.autocomplite.getCompliteGuesses(value))
    );

    this.searchControl.valueChanges.subscribe(value => this.searchText = value);
  }

  // TODO: переименовать
  private yana(option: string, query: string) {
    return option.replace(new RegExp(query, 'i'), '<b>$&</b>');
  }

  ngOnInit() {
    this.searchControl.setValue(this.searchText, { emitEvent: false });
  }

  private clearSearch() {
    this.searchControl.setValue('');
    this.find.emit('');
  }

  submit(event: Event) {
    this.find.emit(this.searchText);
    this.autocomplite.addQuery(this.searchText);
  }
}