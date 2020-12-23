import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { WikipediaPage } from './wikipedia-page';
import { Observable, forkJoin, concat, of } from 'rxjs';
import { map, switchMap, last } from 'rxjs/operators';

interface RawSearchResults {
  0: string;
  1: string[];
  2: string[];
  3: string[];
};

interface RawAdditionalInfo {
  query: {
    pages: {
      [id: string]: {
        title: string;
        pageid: number;
        touched: string;
        length: number;
        description: string;
        original?: {
          source: string;
        }
      }
    }
  }
}

export class WikipediaPage {
  public id: number;
  public touched: string;
  public desctiprion: string;
  public length: number;
  public imageSrc: string;

  constructor(
    public order: number, 
    public title: string, 
    public shortContent: string, 
    public link: string
  ) {}
}

export class WikipediaSearchResults {
  pages: WikipediaPage[];
  pagesCount: number;

  get find(): boolean {
    return this.pagesCount !== 0;
  }

  get averageLength(): number {
    let sum = 0;

    for (let key in this.pages) {
      sum += this.pages[key].length;
    }

    return Math.round(sum / this.pagesCount);
  }

  constructor(pages?: WikipediaPage[]) {
    this.pages = pages || [];
    this.pagesCount = this.pages.length;
  };
}

@Injectable()
export class WikipediaSearchService {

  constructor(private http: HttpClient) { }

  // максимальное кол-во резулатов поиска
  static readonly MAX_SEARCH_RESULTS_COUNT = 500; 

  // максимальное кол-во заколовков, для которых можно
  // загрузить дополнительную информацию в одном запросе
  static readonly MAX_TITLES_IN_QUERY = 10; 

  private static apiUrl: string = 'https://ru.wikipedia.org/w/api.php';

  private static buildSearchUrl(searchText: string): string {
    let url: URL = new URL(this.apiUrl);
    let params: URLSearchParams = url.searchParams;

    params.set('action', 'opensearch');
    params.set('search', searchText);
    params.set('redirects', 'resolve');
    params.set('limit', WikipediaSearchService.MAX_SEARCH_RESULTS_COUNT.toString());

    params.set('format', 'json');
    params.set('utf8', '1');
    params.set('callback', 'w_c');
    
    return url.toString();
  }

  private static buildQueryUrl(titles: string[], start: number = 0, end: number = 50): string {
    let url: URL = new URL(this.apiUrl);
    let params: URLSearchParams = url.searchParams;

    params.set('action', 'query');
    params.set('prop', ['info', 'description', 'pageimages'].join('|'));
    params.set('piprop', 'original');
    params.set('titles', titles.slice(start, end).join('|'));

    params.set('format', 'json');
    params.set('utf8', '1');
    params.set('callback', 'w_c');
    
    return url.toString();
  };

  private buildQueryUrlsArray(titles: string[]): string[] {
    let urls = [];
    let titleCount = WikipediaSearchService.MAX_TITLES_IN_QUERY;

    for (let i = 0; i < titles.length; i += titleCount) {
      urls.push(WikipediaSearchService.buildQueryUrl(titles, i, i + titleCount));
    }

    return urls;
  }

  private formatData(raw: RawSearchResults): WikipediaSearchResults {
    let pages: WikipediaPage[] = [];

    for (let i = 0; i < raw[1].length; i++) {
      pages[i] = new WikipediaPage(i, raw[1][i], raw[2][i], raw[3][i]);
    }

    return new WikipediaSearchResults(pages);
  }

  private extractTitlesList(results: WikipediaSearchResults): string[] {
    return results.pages.map(function(page: WikipediaPage) {
      return page.title;
    });
  }

  private loadAdditionalInfo(results: WikipediaSearchResults) {
    let titles = this.extractTitlesList(results);
    let queryUrls = this.buildQueryUrlsArray(titles);
    let requests = queryUrls.map(
      url => this.http.jsonp(url, 'callback') as Observable<RawAdditionalInfo>
    );

    return concat(...requests)
      .pipe(
        map(value => {
          let additionalInfo = value.query.pages;
          for (let id in additionalInfo) {
            let title: string = additionalInfo[id].title;
            let index: number = titles.indexOf(title);

            let page = results.pages[index];
            let additional = additionalInfo[id];

            // Записываем дополнительну информацию
            page.id = additional.pageid;
            page.touched = additional.touched;
            page.desctiprion = additional.description;
            page.length = additional.length;
            page.imageSrc = additional.original ? additional.original.source : undefined;
          }

          return results;
        }),
        last()
      );
  };

  public findPagesByText(searchText: string): Observable<WikipediaSearchResults> {
    if (searchText === '') {
      return of(new WikipediaSearchResults());
    }

    let searchUrl: string = WikipediaSearchService.buildSearchUrl(searchText);

    return this.http.jsonp(searchUrl, 'callback')
      .pipe(
        map(value => this.formatData(value as RawSearchResults)),
        switchMap(value => {
          if (value.pagesCount !== 0) {
            return this.loadAdditionalInfo(value);
          } else {
            return of(value);
          }
        })
      );
  }
}