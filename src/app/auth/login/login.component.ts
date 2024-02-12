import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  err:boolean =false;
  role:string = '';

  docTypeselect: any[] = [
    { id: 0, name: 'CC' },
    { id: 1, name: 'TI' },
    { id: 2, name: 'CE' },
    { id: 3, name: 'NIT' },
  ];

  constructor(private formBuilder: FormBuilder, private service: AuthService, private router: Router) {}

  userForm = this.formBuilder.group({
    docType: ['', Validators.required],
    documento: ['', Validators.required],
    password: ['', Validators.required],
  });

  get documento() {
    return this.userForm.get('documento') as FormControl;
  }

  get password() {
    return this.userForm.get('password') as FormControl;
  }

  roleSelect(role:string):void {
    console.log('Valor seleccionado:', role);
    switch (role) {
      case '0':
        this.role = role;
        console.log('Ingresa un agriculto');
        break;
      
      case '1':
        this.role = role;
        console.log('Ingresa un colaborador');
        break;

      case '3':
        this.role = role;
        console.log('Ingresa un asociado');
        break;

      default:
        console.log('Aun no hay seleccion');
        break;
    }
  }

  login() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      const docType: string = formData.docType || "";
      const docNumber: string = formData.documento || "";
      const password: string = formData.password || "";
      console.log(docType,' ',docNumber,' ',password,' ',this.role);
      this.service.login(docType, docNumber, password, this.role).subscribe(credenciales =>{
        if(credenciales['state'] === 'Ok') {
          console.log('Ingreso ',credenciales);
          if (this.role) {
            console.log("Con rol");
            if (this.role === "0" && credenciales.roles.isFarmer) {
              console.log("entro como agricultor por medio la seleccion del rol ");
              this.router.navigate(['/agricultor']); // Redirigir al módulo de agricultor.
            } else if (this.role === "1" && credenciales.roles.isCollab) {
              console.log("entro como asociado por medio la seleccion del rol ");
               this.router.navigate(['/colaborador']); // Redirigir al módulo de colaborador.
            } else if (this.role === "3" && credenciales.roles.isAdmin) {
              console.log("entro como asociado por medio la seleccion del rol ");
               this.router.navigate(['/asociacion']); // Redirigir al módulo de asociacion.
            }
          }else if (!this.role) {
            console.log("Sin rol");
            if (credenciales['role'] === "0" && credenciales.roles.isFarmer) {
              console.log("entro como agricultor por medio del rol inicial ");
              this.router.navigate(['/agricultor']); // Redirigir al módulo de agricultor.
            } else if (credenciales['role'] === "1" && credenciales.roles.isCollab) {
              console.log("entro como asociado por medio del rol inicial ");
               this.router.navigate(['/colaborador']); // Redirigir al módulo de colaborador.
            }
          }
        } else if (credenciales['state'] === 'Fail'){
          console.log('No ingreso ',credenciales);
          this.err = true;
        }
      });
    }
  }
}
