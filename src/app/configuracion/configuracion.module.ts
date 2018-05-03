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
import { MenuComponent } from './menu/menu/menu.component';
import { MenuEditComponent } from './menu/menu-edit/menu-edit.component';
import { MenuFiltroComponent } from './menu/menu-filtro/menu-filtro.component';
import { MenuResultComponent } from './menu/menu-result/menu-result.component';
import { GroupsEditComponent } from './groups/groups-edit/groups-edit.component';
import { GroupsFiltroComponent } from './groups/groups-filtro/groups-filtro.component';
import { GroupsResultComponent } from './groups/groups-result/groups-result.component';
import { GroupsRolesComponent } from './groups/groups-roles/groups-roles.component';
import { GroupsMenuComponent } from './groups/groups-menu/groups-menu.component';
import { UsuariosComponent } from './usuarios/usuarios/usuarios.component';
import { UsuariosResultComponent } from './usuarios/usuarios-result/usuarios-result.component';
import { UsuariosFiltroComponent } from './usuarios/usuarios-filtro/usuarios-filtro.component';
import { UsuariosEditComponent } from './usuarios/usuarios-edit/usuarios-edit.component';



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
  declarations: [ReglasComponent, ReglasResultComponent, ReglasEditComponent, GroupsComponent, ReglasFiltroComponent, MenuComponent, 
    MenuEditComponent, MenuFiltroComponent, MenuResultComponent, GroupsEditComponent, GroupsFiltroComponent, GroupsResultComponent, 
    GroupsRolesComponent, GroupsMenuComponent, UsuariosComponent, UsuariosResultComponent, UsuariosFiltroComponent, UsuariosEditComponent]
})
export class ConfiguracionModule { }
