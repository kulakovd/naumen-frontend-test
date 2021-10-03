import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { WikipediaSearchService, WikipediaSearchResults } from '../wikipedia-search.service';

interface SortingMethod {
  text: string;
  sort(results: WikipediaSearchResults): WikipediaSearchResults;
}

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  providers: [WikipediaSearchService]
})
export class SearchPageComponent implements OnInit {

  objectKeys = Object.keys;
  searchText: string = '';
  searchResults: WikipediaSearchResults = new WikipediaSearchResults();
  notFound: boolean = false;
  loading: boolean = false;

  readonly RESULTS_PER_PAGE: number = 10; // результатов на странице
  selectedPage: number = 1;
  resultPagesCount: number = 0;

  sorting: SortingMethod[] = [
    {
      text: 'по релевантности',
      sort(results: WikipediaSearchResults) {
        results.pages.sort((a, b) =>
          a.order - b.order
        );

        return results;
      }
    }, {
      text: 'по алфавиту (А-Я)',
      sort(results: WikipediaSearchResults) {
        results.pages.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );

        return results;
      }
    }, {
      text: 'по алфавиту (Я-А)',
      sort(results: WikipediaSearchResults) {
        results.pages.sort((a, b) =>
          a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1
        );

        return results;
      }
    }, {
      text: 'от новых к старым',
      sort(results: WikipediaSearchResults) {
        results.pages.sort((a, b) =>
          new Date(b.touched).valueOf() - new Date(a.touched).valueOf()
        );

        return results;
      }
    }, {
      text: 'от старых к новым',
      sort(results: WikipediaSearchResults) {
        results.pages.sort((a, b) =>
          new Date(a.touched).valueOf() - new Date(b.touched).valueOf()
        );

        return results;
      }
    }
  ];

  sortingControl: FormControl = new FormControl();

  constructor(
    private searchService: WikipediaSearchService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.queryParams.subscribe(params => this.updateResults(params.q));

    this.sortingControl.setValue(this.sorting[0], { emitEvent: false });
    this.sortingControl.valueChanges.subscribe(data => this.sortResults(data))
  }

  ngOnInit() {

  }

  sortResults(sorting: SortingMethod) {
    if (sorting && sorting.sort) {
      sorting.sort(this.searchResults);
      this.selectedPage = 1;
    }
  }

  updateRoute(searchText: string): void {
    this.router.navigate(['/'], {
      queryParams: {
        'q': searchText
      }
    });
  }

  updateResults(searchText: string): void {
    if (searchText == null) return;

    this.notFound = false;
    this.loading = true;
    this.searchText = searchText;
    this.searchResults = new WikipediaSearchResults();
    this.selectedPage = 1;

    this.searchService.findPagesByText(searchText)
      .subscribe(data => {
        this.searchResults = data;
        this.resultPagesCount = Math.ceil(data.pagesCount / this.RESULTS_PER_PAGE);

        this.loading = false;
        this.notFound = this.searchText != null && this.searchText !== '' && !data.find;

        this.sortResults(this.sortingControl.value);
      });
  }
}
