import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/servicios/firebase-error.service';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']

})

export class RegistroComponent implements OnInit {
  registrarUsuario: FormGroup;
  loading: boolean = false;
  passwordVisible = {
    password: false,
    password2: false
  };

  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseErrorService) {
    this.registrarUsuario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(25), Validators.pattern('[a-zA-Z ]*')]],
      apellido: ['', [Validators.required, Validators.minLength(25), Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9_@./#&+-]*$')]],
      password2: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
  }

  registrar() {
    const nombre = this.registrarUsuario.value.nombre;
    const apellido = this.registrarUsuario.value.apellido;
    const email = this.registrarUsuario.value.email;
    const password = this.registrarUsuario.value.password;
    const repetirPassword = this.registrarUsuario.value.password2;

    if (password !== repetirPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }

    this.loading = true;
    this.afAuth.createUserWithEmailAndPassword(email, password).then(() => {
      this.verificarCorreo();

    }).catch((error) => {
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
    })
  }


  verificarCorreo() {
    this.afAuth.currentUser.then(user => user?.sendEmailVerification())
      .then(() => {
        this.router.navigate(['/login']);
        this.toastr.info('Le enviamos un correo electrónico para su verificación', 'Verificar correo');
      });
  }
 
  togglePasswordVisibility(field: 'password' | 'password2') {
    this.passwordVisible[field] = !this.passwordVisible[field];
  }
}

