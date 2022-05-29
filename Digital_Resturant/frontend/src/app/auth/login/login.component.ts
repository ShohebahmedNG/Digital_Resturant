import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required]),
      role: new FormControl('', [Validators.required])
    })
  }

  onLogin(){
    this.loginForm.markAllAsTouched()
    if(this.loginForm.valid)
    {
      this.authService.loginUser(
        this.loginForm)
    }
    else
    {
      return
    }
    
  }

}
