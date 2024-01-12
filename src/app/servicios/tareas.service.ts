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

  getTareas(): Observable<any[]> {
    return this.firestore.collection('tareas', ref => ref.orderBy('fechaInicio', 'asc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  EliminarTareas(id: string): Promise<void> {
    if (!id) {
      console.error('El ID proporcionado para eliminar la tarea es inválido:', id);
      return Promise.reject('ID de tarea inválido');
    }
  
    return this.firestore.collection('tareas').doc(id).delete()
      .then(() => {
        console.log('Tarea eliminada correctamente con ID:', id);
      })
      .catch(error => {
        console.error('Error al eliminar tarea:', error);
        return Promise.reject('Error al eliminar la tarea');
      });
  }
  
  actualizarTarea(id: string, data: any): Promise<any>{
    return this.firestore.collection('tareas').doc(id).update(data);
  }

}
