import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map} from 'rxjs';



@Injectable({
  providedIn: 'root'
})


export class GruposService{

constructor(private firestore: AngularFirestore, private auth: AngularFireAuth){}
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

  obtenerIntegrantesDeGrupo(idGrupo: string): Observable<string[]> {
    if (!idGrupo) {
      return new Observable<string[]>(observer => observer.next([]));
    }
    return this.firestore.collection('grupos').doc(idGrupo).valueChanges().pipe(
      map((grupo: any) => grupo.integrantes || [])
    );
  }

}
  