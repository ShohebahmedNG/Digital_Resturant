import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EcomNotificationService } from '../ecom-notification.service';
import { AuthData } from './auth.mode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: Boolean = false
  private currentUserRole: string = ''
  private usermail:string = ''
  private userid:string = ''
  private token:string = ''
  private authSubject = new Subject<{userid:string,usermail:string, currentUserRole: string, isAuthenticated: Boolean }>()
  private authTimer

  constructor(private http: HttpClient, private notification: EcomNotificationService, private router:Router) { }

  getAuthdetails(){
    return {isAuthenticated:this.isAuthenticated ,userid: this.userid,usermail: this.usermail, currentUserRole:this.currentUserRole}
  }

  getAuthSubject(){
    return this.authSubject.asObservable()
  }

  signupNewUser(email: string, password: string, role: string) {
    const authData: AuthData = { email, password, role }
    console.log(authData);

    this.http.post('http://127.0.0.1:3000/user/signup', authData)
      .subscribe(response => {
        console.log(response)
        this.notification.showSuccess('user is successfully signedup', null)
        this.router.navigate(['/'])
      }, err => {
        console.log(err);
        this.notification.showError("signup failed", null)
      })

  }

  autoAuthenticate(){
    let expDate:any = localStorage.getItem('expirationDate')
    if(!expDate) return 
    expDate = new Date(expDate)
    let now = new Date()
    let interval = expDate.getTime() - now.getTime()
    if (interval>0){
      this.authTimer = setTimeout(()=>{
        this.logoutUser()
      }, interval)
      this.token = localStorage.getItem('token')
      this.userid = localStorage.getItem('userid')
      this.usermail = localStorage.getItem('usermail')
      this.currentUserRole = localStorage.getItem('currentUserRole')
      this.isAuthenticated = true
      this.authSubject.next({
        userid:this.userid,
        usermail:this.usermail,
        currentUserRole: this.currentUserRole,
        isAuthenticated:this.isAuthenticated 
      })
      this.router.navigate(['/'])
    }
  }
  saveAuthLS(userid:string, token:string,usermail:string, currentUserRole:string, expirationDate:Date){
    localStorage.setItem('userid', userid)
    localStorage.setItem('usermail',usermail)
    localStorage.setItem('token', token)
    localStorage.setItem('currentUserRole', currentUserRole)
    localStorage.setItem('expirationDate', expirationDate.toISOString())
  }

  removeAuthLS(){
    localStorage.removeItem("userid")
    localStorage.removeItem("token")
    localStorage.removeItem("usermail")
        localStorage.removeItem("currentUserRole")
        localStorage.removeItem("expirationDate")
  }

  loginUser(loginForm: FormGroup) {

    const authData: AuthData = {
      email: loginForm.value.email,
      password: loginForm.value.password,
      role: loginForm.value.role
    }

    this.http.post<{token:string, duration:number, userid:string,usermail:string, role:string}>('http://127.0.0.1:3000/user/login', authData)
      .subscribe(response => {
        // console.log(response)
        this.token = response.token
        this.notification.showSuccess('user is successfully loggedin', null)
        loginForm.reset()
        this.userid = response.userid
        this.usermail = response.usermail
        this.currentUserRole = response.role
        this.isAuthenticated = true
        let expDate = new Date(new Date().getTime() + response.duration*1000)
        this.authTimer = setTimeout(()=>{
          this.logoutUser()
        }, response.duration*1000)
        this.saveAuthLS(this.userid, this.token,this.usermail, this.currentUserRole, expDate)
        this.authSubject.next({
          userid:this.userid,
          usermail:this.usermail,
          currentUserRole: this.currentUserRole,
          isAuthenticated:this.isAuthenticated 
        })
        this.router.navigate(['/'])
      }, err => {
        console.log(err);
        this.notification.showError("login failed", null)
      })
  }

  logoutUser(){
    this.userid = ''
    this.usermail = ''
    this.currentUserRole = ''
    this.isAuthenticated = false
    this.token = ''
    this.authSubject.next({
      userid:this.userid,
      usermail:this.usermail,
      currentUserRole: this.currentUserRole,
      isAuthenticated:this.isAuthenticated 
    })
    this.removeAuthLS()
    clearTimeout(this.authTimer)
    this.notification.showSuccess('user is successfully loggedout', null)
    this.router.navigate(['/'])
  }

  getToken(){
    this.token = localStorage.getItem('token')
    return this.token
  }
}
