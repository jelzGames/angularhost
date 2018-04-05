import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ReglasComponent } from './reglas/reglas/reglas.component';
import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReglasResultComponent } from './reglas/reglas-result/reglas-result.component';
import { ReglasEditComponent } from './reglas/reglas-edit/reglas-edit.component';
import { GroupsComponent } from './groups/groups/groups.component';
import { ReglasFiltroComponent } from './reglas/reglas-filtro/reglas-filtro.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ConfiguracionRoutingModule
  ],
  declarations: [ReglasComponent, ReglasResultComponent, ReglasEditComponent, GroupsComponent, ReglasFiltroComponent]
})
export class ConfiguracionModule { }
