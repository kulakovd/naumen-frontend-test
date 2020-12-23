import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormControl } from '@angular/forms'

export interface Theme {
  id: string;
  name: string;
}

const THEME_KEY = 'app-theme';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  host: {
    'class': 'app'
  }
})
export class AppComponent  {
  name = 'Angular';

  themes: Theme[] = [
    {
      id: 'indigo-light-theme',
      name: 'Индиго Светлая'
    }, {
      id: 'green-light-theme',
      name: 'Зеленая Светлая'
    }, {
      id: 'pink-dark-theme',
      name: 'Розовая Тёмная'
    }, {
      id: 'orange-dark-theme',
      name: 'Оранжевая Тёмная'
    }
  ];

  themeControl: FormControl = new FormControl();
  selectedThemeId: string;

  constructor() {
    this.themeControl.valueChanges.subscribe((theme: Theme) => {
      this.setTheme(theme);
      localStorage.setItem(THEME_KEY, theme.id);
    });

    window.addEventListener('storage', (e) => {
      if (e.key !== THEME_KEY) {
        return;
      }
      
      let theme = this.getThemeById(e.newValue);

      this.setTheme(theme);
      this.themeControl.setValue(theme, { emitEvent: false });
    });

    this.loadThemeFromLocalStorage();
  }

  loadThemeFromLocalStorage() {
    let themeId = localStorage.getItem(THEME_KEY);
    let theme = this.getThemeById(themeId);

    if (!theme) {
      theme = this.themes[0];
    }
    
    this.themeControl.setValue(theme);
  }

  getThemeById(themeId: string): Theme {
    if (!themeId) {
      return null;
    }

    let themeIndex = 0;
    themeIndex = this.themes.findIndex(e => e.id === themeId);

    if (themeIndex < 0) {
      themeIndex = 0;
    }

    return this.themes[themeIndex];
  }

  setTheme(theme: Theme) {
    let bodyClassList = document.body.classList;

    if (this.selectedThemeId) {
      bodyClassList.remove(this.selectedThemeId)
    };

    bodyClassList.add(theme.id);
    this.selectedThemeId = theme.id;
  }
}
