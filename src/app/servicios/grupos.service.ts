import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})


export class GruposService{

constructor(private firestore: AngularFirestore){}
  registrarGrupo(grupo:any): Promise<any>{
    return this.firestore.collection('grupos').add(grupo);
  }

  ConsultaGrupos(): Observable<any> {
    return this.firestore.collection('grupos', ref => ref.orderBy('fechaIngreso', 'asc')).snapshotChanges();
  }

  EliminarGrupos(id: string): Promise<any>{
    return this.firestore.collection('grupos').doc(id).delete();
  }

  getGrupo(id: string): Observable<any>{
    return this.firestore.collection('grupos').doc(id).snapshotChanges();
  }

  actualizarGrupo(id: string, data: any): Promise<any>{
    return this.firestore.collection('grupos').doc(id).update(data);
  }
}
  
