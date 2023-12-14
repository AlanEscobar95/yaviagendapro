import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-grupos',
  templateUrl: './crear-grupos.component.html',
  styleUrls: ['./crear-grupos.component.css']
})
export class CrearGruposComponent implements OnInit {
  crearGrupos: FormGroup;
  enviado = false;
  constructor(private fb: FormBuilder) {
    this.crearGrupos = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      integrantes: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  registrarGrupo() {
    this.enviado = true;
    if (this.crearGrupos.invalid) {
      return
    }
      const grupo : any ={
        nombre: this.crearGrupos.value.nombre,
        descripcion: this.crearGrupos.value.descripcion,
        agregarCorreo: this.crearGrupos.value.agregarCorreo,
        integrantes: this.crearGrupos.value.integrantes,
        fechaInicio: this.crearGrupos.value.fechaIncio,
        fechaFin: this.crearGrupos.value.fechaFin,
        fechaIngreso: new Date(),
        fechaModificacion: new Date()

      }
      //this._gruposService.agr
      console.log(grupo)
      
  }
  agregarCorreo() { }

}
