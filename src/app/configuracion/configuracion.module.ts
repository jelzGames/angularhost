import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ReglasComponent } from './reglas/reglas.component';

@NgModule({
  imports: [
    CommonModule,
    ConfiguracionRoutingModule
  ],
  declarations: [ReglasComponent]
})
export class ConfiguracionModule { }
