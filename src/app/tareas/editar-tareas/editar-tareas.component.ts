import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GruposService } from 'src/app/servicios/grupos.service';
import { TareasService } from 'src/app/servicios/tareas.service';
import { TemaService } from 'src/app/servicios/tema.service';

@Component({
  selector: 'app-editar-tareas',
  templateUrl: './editar-tareas.component.html',
  styleUrls: ['./editar-tareas.component.css']
})
export class EditarTareasComponent implements OnInit {
  editarTareas: FormGroup;
  tareaId: string = ''; 
  loading = false;
  enviado = false;
  correosIntegrantes: string[] = [];
  listaIntegrantes: string[] = [];
  listaGrupos: any[] = [];
  isDarkTheme: boolean = false;
  isLightTheme: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _tareasService: TareasService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private temaService: TemaService
  ) {
    this.editarTareas = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      integrantes: ['', [Validators.email]],
      fechaInicio: ['', [Validators.required, this.fechaInicioValidator.bind(this)]],
      fechaFin: ['', [Validators.required, this.fechaFinValidator.bind(this)]],
      estado: ['', [Validators.required]],
      enviarButton: [{ value: null, disabled: true }],
      idGrupo: [''],
      textoVisualizar: ['']
    });
  }

  ngOnInit(): void {
    this.temaService.isDarkTheme.subscribe((darkTheme: boolean) => {
      this.isDarkTheme = darkTheme;
      this.isLightTheme = !darkTheme;
    });

    this.route.params.subscribe(params => {
      this.tareaId = params['id'];
      this.cargarInformacionTarea();
    });

    this.verificarIntegrantes();
  }


  cargarInformacionTarea() {
    this._tareasService.getTareas().subscribe(tareas => {
      const tarea = tareas.find(t => t.id === this.tareaId);
      if (tarea) {
        this.correosIntegrantes = [...tarea.integrantes];
  
        this.editarTareas.patchValue({
          nombre: tarea.nombre,
          descripcion: tarea.descripcion,
          fechaInicio: tarea.fechaInicio,
          fechaFin: tarea.fechaFin,
          estado: tarea.estado,
        });
  
        this.actualizarTextoVisualizar();
        this.verificarIntegrantes();
      } else {
        console.log(`No se encontró una tarea con ID: ${this.tareaId}`);
      }
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
    const fechaInicio = new Date(this.editarTareas.value.fechaInicio);
    const fechaFin = new Date(control.value);
    return fechaFin >= fechaInicio ? null : { fechaFinMenorQueInicio: true };
  }

  agregarEditarTareas() {
    this.enviado = true;

    if (this.editarTareas.invalid) {
      return;
    }

    if (this.correosIntegrantes.length === 0) {
      this.toastr.error('Debe existir al menos un integrante', 'Error');
      return;
    }

    this.editarTarea();
  }

  editarTarea() {
    const tarea: any = {
      nombre: this.editarTareas.value.nombre,
      descripcion: this.editarTareas.value.descripcion,
      fechaInicio: this.editarTareas.value.fechaInicio,
      fechaFin: this.editarTareas.value.fechaFin,
      estado: this.editarTareas.value.estado,
    };
  
    if (!this.editarTareas.value.integrantes) {
      tarea.integrantes = this.correosIntegrantes;
    }
  
    this.loading = true;
  
    this._tareasService.actualizarTarea(this.tareaId, tarea)
      .then(() => {
        this.toastr.success('Tarea editada con éxito');
        this.loading = false;
        this.router.navigate(['/calendario']);
      })
      .catch(error => {
        console.error('Error al editar tarea:', error);
        this.loading = false;
      });
  }
  

  agregarIntegrante() {
    const integrantesControl = this.editarTareas.get('integrantes');
  
    if (integrantesControl && integrantesControl.valid && integrantesControl.value.trim() !== '') {
      const nuevoCorreo = integrantesControl.value;
      this.correosIntegrantes.push(nuevoCorreo);
      this.actualizarTextoVisualizar();
      integrantesControl.setValue(''); // Limpiar el control después de agregar
      this.verificarIntegrantes(); // Actualizar la verificación de integrantes
    } else {
      this.toastr.error('Debe ingresar un correo electrónico válido', 'Error');
    }
  }
  
  

  eliminarCorreo(correo: string) {
    this.correosIntegrantes = this.correosIntegrantes.filter(c => c !== correo);
    this.actualizarTextoVisualizar();
    this.verificarIntegrantes();
  }
  

  actualizarTextoVisualizar() {
    const textoVisualizar = this.correosIntegrantes.join('\n');
    this.editarTareas.get('textoVisualizar')?.setValue(textoVisualizar);
  }

  verificarIntegrantes() {
    const enviarButton = this.editarTareas.get('enviarButton');
    if (enviarButton) {
      enviarButton[this.correosIntegrantes.length > 0 ? 'enable' : 'disable']();
    }
  }
  
}
