import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoRoutingModule } from './info-routing.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ModalspinnerComponent } from './components/modalspinner/modalspinner.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    InfoRoutingModule
  ],
  declarations: [NotfoundComponent, ModalspinnerComponent]
})
export class InfoModule { }
