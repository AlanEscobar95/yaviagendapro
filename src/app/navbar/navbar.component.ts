import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { TemaService } from '../servicios/tema.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  dataUser: any;
  isDarkTheme: boolean = false;
  isMenuOpen = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private themeService: TemaService
  ) {
    console.log('Servicio de Tema:', this.themeService);
  }

  ngOnInit(): void {
    this.themeService.isDarkTheme.subscribe((darkTheme) => {
      this.isDarkTheme = darkTheme;
    });

    this.afAuth.currentUser.then(user => {
      if (user && user.emailVerified) {
        this.dataUser = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  toggleTheme() {
    this.themeService.toggleDarkTheme();
    console.log("Cambiar Tema");
  }
  

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
