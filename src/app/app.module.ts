/* Angular */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

/* Angular Material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  MatIconModule, 
  MatButtonModule, 
  MatInputModule, 
  MatSelectModule, 
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatMenuModule,
  MatAutocompleteModule
} from '@angular/material';

/* App components */
import { AppComponent } from './app.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultItemComponent } from './search-result-item/search-result-item.component';
import { HeaderComponent } from './header/header.component';
import { ThemePikerComponent } from './theme-piker/theme-piker.component';
import { PagePickerComponent } from './page-picker/page-picker.component';
import { SearchAutocompliteService } from './search-autocomplite.service';

const appRoutes: Routes =[
    { path: '', component: SearchPageComponent},
];

@NgModule({
  imports: [ 
    RouterModule.forRoot(appRoutes),
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,

    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatAutocompleteModule
  ],
  declarations: [ 
    AppComponent, 
    SearchPageComponent, 
    SearchFormComponent,
    SearchResultItemComponent,
    HeaderComponent,
    ThemePikerComponent,
    PagePickerComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [SearchAutocompliteService]
})
export class AppModule {
}
