import {Injectable} from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router"
import { Observable } from 'rxjs'
import { AuthService } from './auth.service'

@Injectable({providedIn:'root'})
export class AuthGuardAdmin implements CanActivate{
    constructor(private authService: AuthService, private router: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
        let {isAuthenticated, currentUserRole} = this.authService.getAuthdetails()
        console.log('admin route',isAuthenticated,currentUserRole);
        
        if(isAuthenticated && currentUserRole==='admin'){
            return true 
        }

        this.router.navigate(['/login'])
    }
}

@Injectable({providedIn:'root'})
export class AuthGuardUser implements CanActivate{
    constructor(private authService: AuthService, private router: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
        let {isAuthenticated, currentUserRole} = this.authService.getAuthdetails()

        if(isAuthenticated && currentUserRole==='user')
            return true 

        this.router.navigate(['/login'])
    }
}