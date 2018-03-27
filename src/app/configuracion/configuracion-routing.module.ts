import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReglasComponent } from './reglas/reglas/reglas.component';

const routes: Routes = [
  { path: 'Reglas', component: ReglasComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
