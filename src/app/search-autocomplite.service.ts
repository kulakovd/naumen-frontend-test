import { Injectable } from '@angular/core';

const SEARCH_QUERIES_KEY = 'search-queries';

@Injectable()
export class SearchAutocompliteService {

  constructor() {
    this._readQueries();
  }

  private _queries: string[] = [];

  private _saveQueries() {
    localStorage.setItem(SEARCH_QUERIES_KEY, JSON.stringify(this._queries));
  }

  private _readQueries() {
    this._queries = JSON.parse(localStorage.getItem(SEARCH_QUERIES_KEY) || '[]');
  }

  addQuery(query: string) {
    if (!query || query === '' || this._queries.indexOf(query.toLowerCase()) !== -1) {
      return;
    }

    this._queries.push(query.toLowerCase());
    this._saveQueries();
  }  

  getCompliteGuesses(uncomplited: string) {
    if (this._queries.length <= 1) {
      return this._queries;
    }
    
    const str = uncomplited.toLowerCase();

    return this._queries.map(e => e.toLowerCase())
      // выбрать только строки, которые содержат искомое значение
      .filter(e => e.indexOf(str) !== -1)
      // сортировка по алфавиту
      .sort((a, b) => a.localeCompare(b, navigator.languages as string[])) 
      // сортировка по соответствию
      .sort((a, b) => { 
        const aIndex = a.indexOf(str);
        const bIndex = b.indexOf(str);
        const diff = aIndex - bIndex;

        if (diff === 0) {
          // оставить как есть
          return 0;
        }

        if (aIndex === -1) {
          // поместить первую строку вправо
          return 1;
        }

        if (bIndex === -1) {
          // поместить вторую строку вправо
            return -1;
        }

        // если в первой строке совпадение раньше,
        // поместить её влево
        // иначе -- вправо
        return diff;

      }).slice(0, 5)
      .map(e => e[0].toUpperCase() + e.slice(1));
  }
}