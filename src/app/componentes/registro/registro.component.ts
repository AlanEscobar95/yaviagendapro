import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'

})

export class RegistroComponent implements OnInit {
 registrarUsuario: FormGroup;

 constructor(private fb: FormBuilder, 
    private afAuth: AngularFireAuth){
   this.registrarUsuario = this.fb.group({
     nombre: ['', Validators.required],
     apellido: ['', Validators.required],
     email: ['', [Validators.required, Validators.email]],
     password: ['', Validators.required],
     password2: ['', Validators.required]
   });
 }
 ngOnInit():void{
 }

 registrar(){
  const nombre = this.registrarUsuario.value.nombre;
  const apellido = this.registrarUsuario.value.apellido;
  const email = this.registrarUsuario.value.email;
  const password = this.registrarUsuario.value.password;
  const repetirPassword = this.registrarUsuario.value.password2;

  this.afAuth.createUserWithEmailAndPassword(email, password).then((user) => {
    console.log(user);
  }).catch((error) => {
    console.log(error);
    alert(this.firebaseError(error.code));
  })
 }
firebaseError(code: string){
switch(code) {
  case 'auth/email-already-in-use':
  return 'El usuario ya existe';
  default:
  return 'Error desconocido'
}
}
}
