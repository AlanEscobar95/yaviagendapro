import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map} from 'rxjs';



@Injectable({
  providedIn: 'root'
})


export class TareasService{

constructor(private firestore: AngularFirestore, private auth: AngularFireAuth){}
  registrarTarea(tarea:any): Promise<any>{
    return this.firestore.collection('tareas').add(tarea);
  }

  ConsultaTareas(): Observable<any> {
    return this.firestore.collection('tareas', ref => ref.orderBy('fechaIngreso', 'asc')).snapshotChanges();
  }

  EliminarTareas(id: string): Promise<any>{
    return this.firestore.collection('tareas').doc(id).delete();
  }

  getTarea(id: string): Observable<any>{
    return this.firestore.collection('tareas').doc(id).snapshotChanges();
  }

  actualizarTarea(id: string, data: any): Promise<any>{
    return this.firestore.collection('tareas').doc(id).update(data);
  }

}
