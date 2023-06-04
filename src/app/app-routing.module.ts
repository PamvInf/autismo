import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrincipalComponent } from './paginas/principal/principal.component';
import { EmocionesBasicasComponent } from './paginas/emociones-basicas/emociones-basicas.component';
import { ReconocimientoEmocionesComponent } from './paginas/reconocimiento-emociones/reconocimiento-emociones.component';
import { CasosRealesComponent } from './paginas/casos-reales/casos-reales.component';
import { EstadisticasComponent } from './paginas/estadisticas/estadisticas.component';


const routes: Routes = [
  { path: '', component: PrincipalComponent},
  { path: 'emocionesBasicas', component: EmocionesBasicasComponent},
  { path: 'reconocimientoEmociones', component: ReconocimientoEmocionesComponent},
  { path: 'casosReales', component: CasosRealesComponent},
  { path: 'login', loadChildren: () => import('./modulo-login/login-routing.module').then(m => m.LoginRoutingModule)},
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '**', component: PrincipalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
