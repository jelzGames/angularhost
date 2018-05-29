import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu/menu.component';
import { GroupsComponent } from './groups/groups/groups.component';
import { UsuariosComponent } from './usuarios/usuarios/usuarios.component';

const routes: Routes = [
  { path: 'Menu', component: MenuComponent },
  { path: 'Grupos', component: GroupsComponent },
  { path: 'Usuarios', component: UsuariosComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
