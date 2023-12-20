import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GruposService } from 'src/app/servicios/grupos.service';

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
  textoVisualizar = 'Crear Grupo';

  constructor(private fb: FormBuilder,
    private _gruposService: GruposService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute) {
    this.crearGrupos = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      integrantes: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      textoVisualizar: ['']
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.editar();
  }

  agregarEditarGrupo() {
    this.enviado = true;
    if (this.crearGrupos.invalid) {
      return;
    }
    if (this.id === null) {
      this.registrarGrupo();
    } else {
      this.editarGrupo(this.id);
    }
  }

  registrarGrupo(){
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
    this._gruposService.registrarGrupo(grupo).then(() => {
      this.toastr.success('Grupo registrado con éxito');
      this.loading = false;
      this.router.navigate(['/lista-grupos']);
    }).catch(error => {
      console.log(error);
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
    this.textoVisualizar = 'Editar Grupo';
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
      });
    }
  }
  

  agregarCorreo() {
    const integrantesControl = this.crearGrupos.get('integrantes');
    if (integrantesControl && integrantesControl.valid) {
      const nuevoCorreo = integrantesControl.value;
      this.correosIntegrantes.push(nuevoCorreo);
      this.actualizarTextoVisualizar();
      integrantesControl.setValue('');
      integrantesControl.setErrors(null);
    }
  }


  eliminarCorreo(correo: string) {
    this.correosIntegrantes = this.correosIntegrantes.filter(c => c !== correo);
    this.actualizarTextoVisualizar();
  }

  private actualizarTextoVisualizar() {
    const textoVisualizar = this.correosIntegrantes.join('\n');
    this.crearGrupos.get('textoVisualizar')?.setValue(textoVisualizar);
  }
}
