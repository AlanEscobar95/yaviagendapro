import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FullCalendarModule } from '@fullcalendar/angular';


import { environment } from 'src/environments/environments';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { HomeComponent } from './componentes/home/home.component';
import { VerificarCorreoComponent } from './componentes/verificar-correo/verificar-correo.component';
import { RecuperarPasswordComponent } from './componentes/recuperar-password/recuperar-password.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ListaGruposComponent } from './componentes/lista-grupos/lista-grupos.component';
import { CrearGruposComponent } from './componentes/crear-grupos/crear-grupos.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CrearTareasComponent } from './tareas/crear-tareas/crear-tareas.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { CalendarioComponent } from './componentes/calendario/calendario.component';
import { EditarTareasComponent } from './tareas/editar-tareas/editar-tareas.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    HomeComponent,
    InicioComponent,
    VerificarCorreoComponent,
    RecuperarPasswordComponent,
    SpinnerComponent,
    ListaGruposComponent,
    CrearGruposComponent,
    NavbarComponent,
    CrearTareasComponent,
    CalendarioComponent,
    EditarTareasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    FullCalendarModule,
    ToastrModule.forRoot(),
    CarouselModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
