import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResumeBuilderComponent } from './resume-builder/resume-builder.component';
import { ResumeBuilderService } from './services/resume-builder.service';
import { ResumeValidationComponent } from './resume-validation/resume-validation.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxKjuaModule } from 'ngx-kjua';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    AppComponent,
    ResumeBuilderComponent,
    ResumeValidationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    NgxKjuaModule,
    MatDialogModule
  ],
  providers: [
    ResumeBuilderService
  ],
  entryComponents: [
    ResumeValidationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
