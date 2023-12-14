import { Injectable } from '@angular/core';

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class GruposService implements OnInit {
 /* grupos: Observable<any[]>;

 constructor(private firestore: AngularFirestore) {
    this.grupos = this.firestore.collection('grupos').valueChanges();
  }*/
constructor(private firestore: AngularFirestore){
  /*registrarGrupo(grupos:any){
    return this.firestore.collection('grupos').add(grupos))
  }*/
}
  ngOnInit(): void {
  }
}
