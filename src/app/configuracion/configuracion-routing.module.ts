import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReglasComponent } from './reglas/reglas/reglas.component';
import { MenuComponent } from './menu/menu/menu.component';
import { GroupsComponent } from './groups/groups/groups.component';

const routes: Routes = [
  { path: 'Reglas', component: ReglasComponent },
  { path: 'Menu', component: MenuComponent },
  { path: 'Grupos', component: GroupsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }