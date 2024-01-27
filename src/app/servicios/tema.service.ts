import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  private _darkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme = this._darkTheme.asObservable();

  toggleDarkTheme() {
    this._darkTheme.next(!this._darkTheme.value);
  }
}
