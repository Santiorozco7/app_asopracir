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
  role:string = '0';
  roleName:string = 'agricultor';

  docTypeselect: any[] = [
    { id: 0, name: 'Cédula de ciudadanía' },
    { id: 1, name: 'Tarjeta de Identidad' },
    { id: 2, name: 'Cédula de extranjería' },
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

  ngOnInit(): void {
    // Verificar si el usuario ya está autenticado.
    if (this.service.isLoggedIn()) {
      // Obtener los roles del usuario desde el servicio de autenticación.
      const userRoles = this.service.getUserRoles();
      if (userRoles.isFarmer) {
        this.router.navigate(['/agricultor']);
      } else if (userRoles.isCollab) {
        this.router.navigate(['/colaborador']);
      } else if (userRoles.isAdmin) {
        this.router.navigate(['/asociacion']);
      } else {
        this.router.navigate(['/default']);
      }
    }
  }  

  roleSelect(role:string):void {
    this.role = role;
    switch (role) {
      case '0':
        this.roleName = "agricultor"
        break;
      
      case '1':
        this.roleName = "colaborador"
        break;

      case '3':
        this.roleName = "asociado"
        break;

      default:
        break;
    }
  }

  login() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      const docType: string = formData.docType || "";
      const docNumber: string = formData.documento || "";
      const password: string = formData.password || "";
      this.service.login(docType, docNumber, password, this.role).subscribe(credenciales =>{
        if(credenciales['state'] === 'Ok') {
          console.log('Ingreso ',credenciales);
          if (this.role) {
            console.log("Con rol");
            if (this.role === "0" && credenciales.roles.isFarmer) {
              this.router.navigate(['/agricultor']); // Redirigir al módulo de agricultor.
            } else if (this.role === "1" && credenciales.roles.isCollab) {
               this.router.navigate(['/colaborador']); // Redirigir al módulo de colaborador.
            } else if (this.role === "3" && credenciales.roles.isAdmin) {
               this.router.navigate(['/asociacion']); // Redirigir al módulo de asociacion.
            }
          }else if (!this.role) {
            if (credenciales['role'] === "0" && credenciales.roles.isFarmer) {
              this.router.navigate(['/agricultor']); // Redirigir al módulo de agricultor.
            } else if (credenciales['role'] === "1" && credenciales.roles.isCollab) {
               this.router.navigate(['/colaborador']); // Redirigir al módulo de colaborador.
            }
          }
        } else if (credenciales['state'] === 'Fail'){
          this.err = true;
        }
      });
    } else {
      this.userForm.markAllAsTouched(); 
    }
  }
}
