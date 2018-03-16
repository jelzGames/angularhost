import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsertasksRoutingModule } from './usertasks-routing.module';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ModalspinnerComponent } from '../info/components/modalspinner/modalspinner.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    UsertasksRoutingModule
  ],
  declarations: [LoginComponent, ModalspinnerComponent],
  entryComponents: [ ModalspinnerComponent ]
})
export class UsertasksModule { }
