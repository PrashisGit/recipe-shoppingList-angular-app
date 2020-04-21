import { NgModule } from '@angular/core';
import { DropdownDirective } from './dropdow.directive';
import { LoadingSpinnerComponent } from './loadingSpinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { PlaceholderDirective } from './paceholder/placeholder.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DropdownDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    DropdownDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    AlertComponent
  ]

})
export class SharedModule {}
