import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  err=false;

  constructor(private FB: FormBuilder, private service: AuthService, private router: Router) {}

  formUser = this.FB.group({
    // 'email': ['', [Validators.required, Validators.email]],
    'documento': ['', Validators.required],
    'password': ['', Validators.required]
  });

  get documento() {
    return this.formUser.get('documento') as FormControl;
  }

  get password() {
    return this.formUser.get('password') as FormControl;
  }

  login() {
    const docNumber = this.documento.value;
    const password = this.password.value;
    
    this.service.login(docNumber, password).subscribe(credenciales =>{
      console.log(credenciales);
      if(credenciales['state'] === 'Ok') {
        if (credenciales['role'] === "0") {
          this.router.navigate(['/agricultor']); // Redirigir al módulo de agricultor.
        } else if (credenciales['role'] === "1") {
           this.router.navigate(['/asociacion']); // Redirigir al módulo de asociacion.
        } else if (credenciales['role'] === "2") {
           this.router.navigate(['/colaborador']); // Redirigir al módulo de colaborador.
        }
      } else if (credenciales['state'] === 'Fail'){
        this.err = true;
      }
    });
    // console.log(this.formUser.value);
  }
}
