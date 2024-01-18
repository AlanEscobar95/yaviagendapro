import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GruposService } from 'src/app/servicios/grupos.service';
import { TareasService } from 'src/app/servicios/tareas.service';
import { TemaService } from 'src/app/servicios/tema.service';

@Component({
  selector: 'app-crear-tareas',
  templateUrl: './crear-tareas.component.html',
  styleUrls: ['./crear-tareas.component.css']
})
export class CrearTareasComponent {
  crearTareas: FormGroup;
  enviado = false;
  correosIntegrantes: string[] = [];
  loading = false;
  listaIntegrantes: string[] = [];
  listaGrupos: any[] = [];
  isDarkTheme: boolean = false;
  isLightTheme: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _tareasService: TareasService,
    private _gruposService: GruposService,
    private router: Router,
    private toastr: ToastrService,
    private temaService: TemaService

  ) {
    this.crearTareas = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      integrantes: ['', [Validators.required, Validators.email]],
      fechaInicio: ['', [Validators.required, this.fechaInicioValidator.bind(this)]],
      fechaFin: ['', [Validators.required, this.fechaFinValidator.bind(this)]],
      prioridad: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      enviarButton: [{ value: null, disabled: true }],
      idGrupo: [''],
      textoVisualizar: ['']
    });
  }

  ngOnInit(): void {
    this.obtenerGrupos();
    this.verificarIntegrantes();
    this.temaService.isDarkTheme.subscribe((darkTheme: boolean) => {
      this.isDarkTheme = darkTheme;
      this.isLightTheme = !darkTheme;
    });
  }

  obtenerGrupos() {
    this.listaGrupos = [];
    this.listaIntegrantes = [];
  
    this._gruposService.ConsultaGrupos().subscribe(grupos => {
      const integrantesSet = new Set<string>();
  
      grupos.forEach((grupo: any) => {
        const id = grupo.payload.doc.id;
        const data = grupo.payload.doc.data();
  
        this._gruposService.obtenerIntegrantesDeGrupo(id).subscribe(integrantes => {
          integrantes.forEach((integrante: string) => {
            integrantesSet.add(integrante);
          });
  
          const grupoConIntegrantes = { id, ...data, integrantes };
          this.listaGrupos.push(grupoConIntegrantes);
        });
  
        this.listaIntegrantes = Array.from(integrantesSet);
      });
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

  fechaFinMayorQueInicioValidator(control: AbstractControl): ValidationErrors | null {
    const fechaInicio = new Date(this.crearTareas.value.fechaInicio);
    const fechaFin = new Date(control.value);
    return fechaFin >= fechaInicio ? null : { fechaFinMenorQueInicio: true };
  }

  agregarEditarTareas() {
    this.enviado = true;

    if (this.crearTareas.invalid) {
      return;
    }

    if (this.correosIntegrantes.length === 0) {
      this.toastr.error('Debe existir al menos un integrante', 'Error');
      return;
    }

    this.registrarTarea();
  }

  registrarTarea() {
    const tarea: any = {
      nombre: this.crearTareas.value.nombre,
      descripcion: this.crearTareas.value.descripcion,
      integrantes: this.correosIntegrantes,
      fechaInicio: this.crearTareas.value.fechaInicio,
      fechaFin: this.crearTareas.value.fechaFin,
      fechaIngreso: new Date(),
      fechaModificacion: new Date(),
      prioridad: this.crearTareas.value.prioridad,
      estado: this.crearTareas.value.estado,
    };

    this.loading = true;

    this._tareasService.registrarTarea(tarea)
      .then(() => {
        this.toastr.success('Tarea registrada con éxito');
        this.loading = false;
        this.router.navigate(['/calendario']);
      })
      .catch(error => {
        console.error(error);
        this.loading = false;
      });
  }

  agregarIntegrante() {
    const integrantesControl = this.crearTareas.get('integrantes');
    if (integrantesControl && integrantesControl.valid && integrantesControl.value.trim() !== '') {
      const nuevoCorreo = integrantesControl.value;
      this.correosIntegrantes.push(nuevoCorreo);
      this.actualizarTextoVisualizar();

      integrantesControl.markAsUntouched();

      integrantesControl.setValue('');
      integrantesControl.setErrors(null);
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
    this.crearTareas.get('textoVisualizar')?.setValue(textoVisualizar);
  }

  verificarIntegrantes() {
    const integrantesControl = this.crearTareas.get('integrantes');
    const enviarButton = this.crearTareas.get('enviarButton');

    if (integrantesControl && enviarButton) {
      const integrantesNoVacios = integrantesControl.value.trim() !== '';
      enviarButton[integrantesNoVacios ? 'enable' : 'disable']();
    }
  }

  cargarIntegrantes() {
    const idGrupo = this.crearTareas.value.idGrupo;
    if (idGrupo) {
      this._gruposService.obtenerIntegrantesDeGrupo(idGrupo).subscribe(integrantes => {
        this.listaIntegrantes = integrantes ? [...integrantes] : [];
      });
    } else {
      this.listaIntegrantes = [];
    }
  }
}
