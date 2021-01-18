import { UsuarioModel } from './../modelos/usuario.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = '?key=AIzaSyA1Nj449WR4POnSbvLTr0YwXuyQCMQUueU';
  // crear nuevos usuarios
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // inicio sesion
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  userToken: string;

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logOut() {
    localStorage.removeItem('token');
  }

  login(user: UsuarioModel) {
    const authData = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(
      this.url + `signInWithPassword` + this.apiKey, authData
    ).pipe(
      map(resr => {
        this.guardarToken(resr['idToken']);
        return resr;
      })
    );

  }

  register(user: UsuarioModel) {
    const authData = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(
      this.url + `signUp` + this.apiKey, authData
    ).pipe(
      map(resr => {
        this.guardarToken(resr['idToken']);
        return resr;
      })
    );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken() {
    let savedToken: string = localStorage.getItem('token');
    if ( savedToken !== null || savedToken === '') {
      this.userToken = savedToken;
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado() {
    if (this.userToken.length < 2) {return false; }
    const exp = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(exp);
    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }

 }
