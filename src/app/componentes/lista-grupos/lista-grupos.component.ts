import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GruposService } from 'src/app/servicios/grupos.service';
import { TemaService } from 'src/app/servicios/tema.service';

@Component({
  selector: 'app-lista-grupos',
  templateUrl: './lista-grupos.component.html',
  styleUrls: ['./lista-grupos.component.css']
})
export class ListaGruposComponent implements OnInit {
  
  grupos: any[] = [];
  isDarkTheme: boolean = false;
  isLightTheme: boolean = true;
  
  constructor(private _gruposService: GruposService,
              private toastr: ToastrService,
              private temaService: TemaService) {
    
  }

  ngOnInit(): void {
    this.getGrupos();
    this.temaService.isDarkTheme.subscribe((darkTheme: boolean) => {
      this.isDarkTheme = darkTheme;
      this.isLightTheme = !darkTheme;
    });
  }
  getGrupos(){
    this._gruposService.ConsultaGrupos().subscribe(data =>{
      this.grupos = [];
      data.forEach((element: any) => {
        this.grupos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });

    })
  }

deleteGrupo(id: string){
  this._gruposService.EliminarGrupos(id).then (() => {
    this.toastr.success('El Grupo fue eliminado con éxito', 'Registro Eliminado')
  });
}


}
