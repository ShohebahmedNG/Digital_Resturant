import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EcomNotificationService } from 'src/app/ecom-notification.service';
import { Item } from '../item.model';
import { ItemService } from '../../admin/items.service';
import { CartService } from 'src/app/user/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-display-items',
  templateUrl: './display-items.component.html',
  styleUrls: ['./display-items.component.css']
})
export class DisplayItemsComponent implements OnInit, OnDestroy {
  
  items:Item[]
  isAuth:Boolean = false
  showConfirmation:boolean = false
  itemId:string
  currentUserRole:string = "user"
  authSubscription:Subscription
  itemSubscription:Subscription
  constructor(private itemService:ItemService, public notification:EcomNotificationService, public router:Router, private cartService: CartService, private authService:AuthService) {
    
   }
  ngOnDestroy(): void {
    this.itemSubscription.unsubscribe()
    this.authSubscription.unsubscribe()
  }

  ngOnInit(): void {
    const {isAuthenticated,currentUserRole} = this.authService.getAuthdetails()
    // console.log(isAuthenticated,currentUserRole);
    // this.items = this.itemService.itemsInitialize()
    this.isAuth = isAuthenticated
    this.currentUserRole = currentUserRole

    this.authSubscription = this.authService.getAuthSubject().subscribe(result=>{
      this.isAuth = result.isAuthenticated
      this.currentUserRole = result.currentUserRole
    })
    this.itemService.getItems()
    this.itemSubscription = this.itemService.getItemsSubject().
    subscribe(data=>{
      this.items = data.items
    })
    
  }

  setShowConfirmation(){
    // console.log(this.itemId)
    this.showConfirmation = !this.showConfirmation
  }

  deleteItem(){
    this.itemService.deleteItem(this.itemId).subscribe(res=>{
      console.log(res);
      this.items = this.items.filter(data=>{
        return data.id!=this.itemId
      })
      this.notification.showSuccess('Item is successfully deleted',null)
    },
    err=>{
      console.log(err)
      this.notification.showError('Item deletion failed',null)
    })
  }

  callEdit(){  
    this.router.navigate([`/admin/edit-item/${this.itemId}`])
  }

  addToCart(item:Item){
    this.cartService.addToCart(item)
  }
}
