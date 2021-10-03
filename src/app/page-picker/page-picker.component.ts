import { Component, Input, HostBinding, forwardRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-page-picker',
  templateUrl: './page-picker.component.html',
  styleUrls: ['./page-picker.component.css'],
  host: {
    '(click)': '_onTouched()'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PagePickerComponent),
      multi: true
    }
  ]
})
export class PagePickerComponent implements ControlValueAccessor {
  constructor(private elRef: ElementRef<HTMLElement>) {
    this._host = elRef.nativeElement;
  }

  @HostBinding('scrollLeft') scroll?: number;

  @Input() pagesCount: number = 0;
  _value?: number;
  private readonly _host: HTMLElement | null;

  _onChange?: (value: number) => void;
  _onTouched?: () => void;

  pages(): number[] {
    return Array(this.pagesCount).fill(0).map((e, i) => i + 1);
  };

  private countScroll(value: number): number {
    if (this._host == null) return 0;
    const hostWidth = this._host?.clientWidth;

    const MIN_SCROLL = 0;
    const MAX_SCROLL = this._host.scrollWidth - this._host.clientWidth;

    let buttonWidth = 36;
    let scroll = (value-1)*buttonWidth + buttonWidth/2 - hostWidth/2 ;

    if (scroll < MIN_SCROLL) {
      return MIN_SCROLL;
    } else if (scroll > MAX_SCROLL) {
      return MAX_SCROLL;
    }

    return scroll;
  }

  private scrollTo(value: number) {
    this._host?.scrollTo({
      left: this.countScroll(value),
      behavior: 'smooth'
    } as ScrollOptions)
  }

  selectPage(value: number) {
    this.scrollTo(value);

    this._value = value;
    if (this._onChange)
      this._onChange(value);
  }

  writeValue(value: number) {
    if (value < 1 || value > this.pagesCount) {
      this._value = 1;
    } else {
      this._value = value;
    }
  }

  registerOnChange(fn: (value: number) => void) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this._onTouched = fn;
  }
}
