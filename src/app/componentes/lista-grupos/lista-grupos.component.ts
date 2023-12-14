import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-grupos',
  templateUrl: './lista-grupos.component.html',
  styleUrls: ['./lista-grupos.component.css']
})
export class ListaGruposComponent implements OnInit {
  grupos: Observable<any[]>;

  constructor(firestore: AngularFirestore) {
    this.grupos = firestore.collection('grupos').valueChanges();
  }

  ngOnInit(): void {
    // Lógica de inicialización si es necesaria
  }
}
