import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CorreoService } from 'src/app/servicios/correo.service';

import { GruposService } from 'src/app/servicios/grupos.service';
import { TemaService } from 'src/app/servicios/tema.service';


@Component({
  selector: 'app-crear-grupos',
  templateUrl: './crear-grupos.component.html',
  styleUrls: ['./crear-grupos.component.css']
})
export class CrearGruposComponent implements OnInit {
  crearGrupos: FormGroup;
  enviado = false;
  correosIntegrantes: string[] = [];
  loading: boolean = false;
  id: string | null;
  tituloFormulario: string = 'Crear Grupo';
  isDarkTheme: boolean = false;
  isLightTheme: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _gruposService: GruposService,
    private _temaService: TemaService,
    private _correoService: CorreoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute
  ) {
    this.crearGrupos = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      integrantes: ['', [Validators.required, Validators.email]],
      fechaInicio: ['', [Validators.required, this.fechaInicioValidator.bind(this)]],
      fechaFin: ['', [Validators.required, this.fechaFinValidator.bind(this)]],
      enviarButton: [{ value: null, disabled: true }],
      textoVisualizar: ['']
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
    
  }

  ngOnInit(): void {
    this.editar();
    this.verificarIntegrantes();
    this._temaService.isDarkTheme.subscribe((darkTheme: boolean) => {
      this.isDarkTheme = darkTheme;
      this.isLightTheme = !darkTheme;
    });
  }
  fechaInicioValidator(control: AbstractControl): ValidationErrors | null {
    const fechaInicio = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    return fechaInicio >= fechaActual ? null : { fechaInvalida: true };
  }

  fechaFinValidator(control: AbstractControl): ValidationErrors | null {
    const fechaFin = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    return fechaFin >= fechaActual ? null : { fechaInvalida: true };
  }

  agregarEditarGrupo() {
    this.enviado = true;
  
    if (this.id === null) {
      if (this.crearGrupos.invalid) {
        return;
      }
  
      if (this.correosIntegrantes.length === 0) {
        this.toastr.error('Debe existir al menos un integrante', 'Error');
        return;
      }
    }
  
    if (this.id === null && this.correosIntegrantes.length === 0) {
      this.toastr.error('Debe existir al menos un integrante', 'Error');
      return;
    }
  
    if (this.id === null) {
      this.registrarGrupo();
    } else {
      this.editarGrupo(this.id);
    }
  }
  

  registrarGrupo() {
    const grupo: any = {
      nombre: this.crearGrupos.value.nombre,
      descripcion: this.crearGrupos.value.descripcion,
      integrantes: this.correosIntegrantes,
      fechaInicio: this.crearGrupos.value.fechaInicio,
      fechaFin: this.crearGrupos.value.fechaFin,
      fechaIngreso: new Date(),
      fechaModificacion: new Date()
    };
  
    this.loading = true;
  
    this._gruposService.registrarGrupo(grupo)
      .then(() => {
        this.toastr.success('Grupo registrado con éxito');
        this.loading = false;
        this.router.navigate(['/lista-grupos']);
      })
      .catch(error => {
        console.error(error);
        this.loading = false;
      });
  }
  
  
  editarGrupo(id: string) {
    const grupo: any = {
      nombre: this.crearGrupos.value.nombre,
      descripcion: this.crearGrupos.value.descripcion,
      integrantes: this.correosIntegrantes,
      fechaInicio: this.crearGrupos.value.fechaInicio,
      fechaFin: this.crearGrupos.value.fechaFin,
      fechaModificacion: new Date()
    };
  
    if (this.correosIntegrantes.length === 0) {
      this.toastr.error('Debe existir al menos un integrante', 'Error');
      return;
    }
  
    this.loading = true;
    this._gruposService.actualizarGrupo(id, grupo).then(() => {
      this.loading = false;
      this.toastr.info('El grupo fue modificado con éxito', 'Grupo Modificado');
      this.router.navigate(['/lista-grupos']);
    }).catch(error => {
      console.log(error);
      this.loading = false;
    });
  }
  
    editar() {
      if (this.id !== null) {
        this.loading = true;
        this._gruposService.getGrupo(this.id).subscribe(data => {
          this.loading = false;
          const integrantes = data.payload.data()['integrantes'];
          this.correosIntegrantes = integrantes ? [...integrantes] : [];
          this.crearGrupos.patchValue({
            nombre: data.payload.data()['nombre'],
            descripcion: data.payload.data()['descripcion'],
            integrantes: '',
            fechaInicio: data.payload.data()['fechaInicio'],
            fechaFin: data.payload.data()['fechaFin'],
            textoVisualizar: ''
          });
    
          this.tituloFormulario = 'Editar Grupo';
        });
      }
  }
  

  agregarCorreo() {
    const integrantesControl = this.crearGrupos.get('integrantes');
    if (integrantesControl && integrantesControl.valid && integrantesControl.value.trim() !== '') {
      const nuevoCorreo = integrantesControl.value;
      this.correosIntegrantes.push(nuevoCorreo);
      this.actualizarTextoVisualizar();
      integrantesControl.markAsUntouched();

      integrantesControl.setValue('');
      integrantesControl.setErrors(null);

      const mensajeCorreo = `¡Hola ${nuevoCorreo}!\nHas sido agregado al grupo.`;
      this._correoService.enviarCorreo(nuevoCorreo, 'Bienvenido al Grupo', mensajeCorreo);
    } else {
      this.toastr.error('Debe ingresar un correo electrónico válido', 'Error');
    }
    this.verificarIntegrantes();
  }

  eliminarCorreo(correo: string) {
    this.correosIntegrantes = this.correosIntegrantes.filter(c => c !== correo);
    this.actualizarTextoVisualizar();
    this.verificarIntegrantes();
  }

  actualizarTextoVisualizar() {
    const textoVisualizar = this.correosIntegrantes.join('\n');
    this.crearGrupos.get('textoVisualizar')?.setValue(textoVisualizar);
  }

  verificarIntegrantes() {
    if (this.id !== null) {
      return;
    }
  
    const integrantesControl = this.crearGrupos.get('integrantes');
    const enviarButton = this.crearGrupos.get('enviarButton');
  
    if (integrantesControl && enviarButton) {
      const integrantesNoVacios = integrantesControl.value.trim() !== '';
      enviarButton[ integrantesNoVacios ? 'enable' : 'disable' ]();
    }
  }
  
}