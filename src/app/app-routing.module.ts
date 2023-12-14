import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { RecuperarPasswordComponent } from './componentes/recuperar-password/recuperar-password.component';
import { VerificarCorreoComponent } from './componentes/verificar-correo/verificar-correo.component';
import { HomeComponent } from './componentes/home/home.component';
import { CrearGruposComponent } from './componentes/crear-grupos/crear-grupos.component';
import { ListaGruposComponent } from './componentes/lista-grupos/lista-grupos.component';

const routes: Routes = [
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'registro', component: RegistroComponent},
  {path:'recuperar-password', component: RecuperarPasswordComponent},
  {path:'verificar-correo', component: VerificarCorreoComponent},
  {path:'home', component: HomeComponent},
  {path:'lista-grupos', component: ListaGruposComponent },
  {path:'**', redirectTo: 'login', pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
