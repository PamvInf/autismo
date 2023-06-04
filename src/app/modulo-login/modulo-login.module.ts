import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatFormFieldModule,
    MatIconModule
  ],
  exports: [
    // ModuloLoginModule,
    LoginRoutingModule,
    MatFormFieldModule,
    MatIconModule
  ]
})
export class ModuloLoginModule { }
