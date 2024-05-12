import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService
  ) { }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  async loginUser() {
    if (this.loginForm.valid) {
      const email = this.email?.value;
      const password = this.password?.value;

      if (email && password) {
        const hashedPassword = await this.hashPassword(password);

        this.authService.getUserByEmail(email).subscribe(
          response => {
            if (response.length > 0 && response[0].password === hashedPassword) {
              sessionStorage.setItem('email', email);
              sessionStorage.setItem('fullName', response[0].fullName);
              this.router.navigate(['/home']);
            } else {
              this.msgService.add({ severity: 'error', summary: 'Login Failed', detail: 'Wrong credentials' });
            }
          },
          error => {
            console.error(error);
            this.msgService.add({ severity: 'error', summary: 'Server Error', detail: 'Something went wrong' });
          }
        );
      } else {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
      }
    } else {
      this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
