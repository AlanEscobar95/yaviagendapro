import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual: string = '';

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      this.usuarioActual = user ? user.email : null;
    });
  }

  getEstadoAutenticacion(): Observable<any> {
    return this.afAuth.authState;
  }

  getCorreoUsuarioActual(): string {
    return this.usuarioActual;
  }

  iniciarSesion(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  cerrarSesion(): Promise<any> {
    return this.afAuth.signOut();
  }
}
