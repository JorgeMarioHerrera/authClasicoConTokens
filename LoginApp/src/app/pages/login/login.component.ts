import { UsuarioModel } from './../../modelos/usuario.models';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recodar = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel();
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recodar = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe( res => {
      console.log(res);
      Swal.close();
      if (this.recodar) {
        localStorage.setItem('email', this.usuario.email);
      }
      this.router.navigateByUrl('/home');
    }, error => {
      console.log(error.error.error.message);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Oops..',
        text: error.error.error.message
      });
    }

    );
  }

}
