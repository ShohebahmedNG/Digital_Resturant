import { AfterViewInit, Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/common/item.model';
import { EcomNotificationService } from 'src/app/ecom-notification.service';
import { CartService } from '../cart.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-cartitems',
  templateUrl: './cartitems.component.html',
  styleUrls: ['./cartitems.component.css']
})
export class CartitemsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('qty') qtyListDom
  @ViewChildren('itemPrice') itemPriceListDom
  totalPrice:number = 0
  cartItems:Item[] = []
  quantity:number[] = []
  cartSubscription: Subscription
  constructor(private cartService: CartService, private notificationService:EcomNotificationService, private router: Router, private orderService:OrderService) { }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.calculateTotalPrice()
    },0)
    this.qtyListDom.changes.subscribe(()=>{
      // console.log('changed')
      setTimeout(()=>{
        this.calculateTotalPrice()
      },0)
    })
  }
  
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getcartitem()
    this.cartSubscription = this.cartService.getCartUpdate()
    .subscribe(result=>{
      this.cartItems = result.cartItems
      this.calculateTotalPrice()
    }, err=>{
      console.log('Error : ',err)
    })
  }

  removeItem(itemId:string){
    this.cartService.removeFromCart(itemId)
    this.calculateTotalPrice()
  }

  calculateTotalPrice(){
    // console.log(this.qtyListDom)
    // console.log(this.itemPriceListDom)
    this.totalPrice = 0
    let priceArr:number[] = []
    let qtyArr:number[] = []
    this.qtyListDom.forEach(element => {
      qtyArr.push(element.nativeElement.valueAsNumber)
    });
    this.itemPriceListDom.forEach(element => {
      priceArr.push(+element.nativeElement.innerText)
    });

    for(let i=0; i<qtyArr.length;i++){
      this.totalPrice += qtyArr[i]*priceArr[i]
    }
    this.quantity = [...qtyArr]
  }

  checkout(){
    this.orderService.purchase([...this.cartItems],[...this.quantity])
    setTimeout(()=>{
      this.notificationService.showSuccess("Your order is submitted",null)
      this.cartService.clearCart()
      
    },50)
    this.router.navigate(['/'])
  }
}
