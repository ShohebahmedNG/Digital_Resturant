import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { AuthService } from '../auth/auth.service';
import {Item} from '../common/item.model'
import {OrderModel} from '../user/order.model'
import { ItemService } from '../admin/items.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orders:OrderModel[]
  items:Item[]=[]
  orderSubject = new Subject<{orders:OrderModel[]}>()
  constructor(private http:HttpClient, private authService:AuthService, private itemService:ItemService) {
    this.items = this.itemService.itemsInitialize()
   }

  orderHistoryInitialize(){
    return [... this.orders]
  }

  getOrderHistoryAsObservable(){
    return this.orderSubject.asObservable()
  }

  getOrderHistory(){
    
    this.orders = []
    const {userid} = this.authService.getAuthdetails()
    return this.http.get<{msg:string, orders:[any]}>('http://127.0.0.1:3000/shopping/'+userid)
    .subscribe(result=>{
      
      if (!result.orders) return

      result.orders.forEach(order=>{
        let items=[]
        order.allitems.forEach(element => {
          items.push({
            item: this.items.find(x=>{
              return x.id=== element.itemtaken
            }),
            qty:element.qty
          }
          )
          
        });
        let orderx:OrderModel = {
          allitems: items as [{item:Item, qty:Number}],
          userid:userid,
          totalPrice: order.totalPrice
        }
        this.orders.push(orderx)
        
      })
      this.orderSubject.next({
        orders:[... this.orders]
      })
      
    }, err=>{
      console.log(err)
    })
    
  }

  purchase(items:Item[], qtyOfEachItem:number[]){
    const {userid} = this.authService.getAuthdetails()
    // console.log(items);
    // console.log(qtyOfEachItem);
    const order = {"allitems":[], "userid":userid}
    for(let i=0;i<items.length;i++){
      order.allitems.push({"itemtaken": items[i].id, "qty":qtyOfEachItem[i]})
    }

    // console.log(order);
    this.http.post<{totalamt:Number}>('http://127.0.0.1:3000/shopping/', order)
    .subscribe(result=>{
      console.log(result.totalamt);
      
    })
    
  }
}
