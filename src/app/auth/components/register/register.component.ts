import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'linker-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string;
  password1: string;
  password2: string;
  passwordFail: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  ngOnInit() {
  }

  signUp(){
    if (this.password1 !== this.password2) {
      this.passwordFail = true;
    } else {
      this.passwordFail = false;
      if (this.email !== undefined && this.password1 !== undefined) {
        this.authService.register(this.email, this.password1).then(() => {
          this.router.navigate(['/']);
        })
      }
    }
  }

  cancel(){
    this.router.navigate(['/login']);
  }
}
