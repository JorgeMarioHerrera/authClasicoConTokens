import { UsuarioModel } from './../../modelos/usuario.models';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { registerLocaleData } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel();
  }

  onSubmit(form: NgForm) {

    if (form.invalid) {return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    this.auth.register(this.usuario).subscribe(reg => {
      console.log(reg);
      Swal.close();
      this.router.navigateByUrl('/login');
    }, error => {
      console.log(error.error.error.message);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Oops..',
        text: error.error.error.message
      });
    });
  }

}
