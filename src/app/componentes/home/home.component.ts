// home.component.ts

import { Component, OnInit } from '@angular/core';
import { TemaService } from '../../servicios/tema.service';  // Importa el servicio de tema

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isDarkTheme: boolean = false;

  constructor(private themeService: TemaService) { }

  ngOnInit(): void {
    this.themeService.isDarkTheme.subscribe((darkTheme) => {
      this.isDarkTheme = darkTheme;
    });
  }
}
