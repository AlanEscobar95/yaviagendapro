import { Injectable } from '@angular/core';
import { FirebaseErrorEnum } from '../utils/firebase-code-error';

@Injectable({
  providedIn: 'root'
})
export class FirebaseErrorService {

  constructor() { }

  codeError(code: string) {
    switch (code) {
      case FirebaseErrorEnum.emailAlreadyInUse:
        return 'El usuario ya existe';

      case FirebaseErrorEnum.weakPassword:
        return 'La contraseña es débil';

      case FirebaseErrorEnum.invalidEmail:
        return 'El email no es válido';

      case FirebaseErrorEnum.invalidCredential:
        return 'Credenciales incorrectas';
       
      default:
        return 'Recuerda verificar tu correo electrónico';
    }
  }
}


