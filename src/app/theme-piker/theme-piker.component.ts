import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Theme } from '../app.component';

@Component({
  selector: 'app-theme-piker',
  templateUrl: './theme-piker.component.html',
  styleUrls: ['./theme-piker.component.css'],
  host: {
    '(click)': '_onTouched()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThemePikerComponent),
      multi: true
    }
  ]
})
export class ThemePikerComponent implements ControlValueAccessor {

  private _onChange;
  private _onTouched;

  @Input() themes: Theme[];
  private selected: Theme; 

  selectTheme(value: Theme) {
    this.selected = value;
    this._onChange(value);
  }

  writeValue(value: Theme) {
    const selected = this.themes.find(e => e.id === value.id);

    if (selected) {
      this.selected = selected;
    }
  }

  registerOnChange(fn) {
    this._onChange = fn;
  }

  registerOnTouched(fn) {
    this._onTouched = fn;
  }
}