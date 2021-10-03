import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Theme } from '../app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() themeControl?: FormControl;
  @Input() themes?: Theme[];

  constructor() { }

  ngOnInit() {
  }
}
