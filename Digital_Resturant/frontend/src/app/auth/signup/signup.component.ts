import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm:FormGroup
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required]),
      role: new FormControl('', [Validators.required])
    })
  }

  onSignup(){
    this.signupForm.markAllAsTouched()
    if(this.signupForm.valid)
    {
      this.authService.signupNewUser(
        this.signupForm.value.email,
         this.signupForm.value.password,
         this.signupForm.value.role)
    }
    else
    {
      return
    }
    
  }

}
