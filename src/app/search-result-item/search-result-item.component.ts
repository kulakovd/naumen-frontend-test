import { Component, OnInit, Input } from '@angular/core';
import { WikipediaPage } from '../wikipedia-search.service'

@Component({
  selector: 'app-search-result-item[page]',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.css']
})
export class SearchResultItemComponent implements OnInit {

  constructor() { }

  // @ts-ignore будет заполненно в ngOnInit
  @Input() page: WikipediaPage;
  lastModified?: string;

  ngOnInit() {
    this.lastModified = new Date(this.page?.touched)
      .toLocaleString(navigator.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      });
  }

}
