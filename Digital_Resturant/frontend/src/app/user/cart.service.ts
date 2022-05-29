import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from '../common/item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems:Item[] = []
  private cart = new Subject<{cartItems: Item[], cartItemLength:number}>()

  constructor() { }

  addToCart(item:Item){
    this.cartItems = this.cartItems.filter(data=>{
      return data.id!= item.id
    })
    this.cartItems.push(item)

    this.cart.next({
     cartItems: [...this.cartItems], 
     cartItemLength:this.cartItems.length
    })
  }

  removeFromCart(itemid:string){
    this.cartItems = this.cartItems.filter(data=>{
      return data.id!= itemid
    })

    this.cart.next({
     cartItems: [...this.cartItems], 
     cartItemLength:this.cartItems.length
    })
  }

  getCartUpdate(){
    return this.cart.asObservable()
  }

  getcartitem(){
    return [...this.cartItems]
  }

  clearCart(){
    this.cartItems = []
    this.cart.next({
      cartItems: [...this.cartItems], 
      cartItemLength:this.cartItems.length
     })
  }

}
