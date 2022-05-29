import { Component, OnInit } from '@angular/core';
import { OrderModel } from '../order.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders:OrderModel[] = []
  
  constructor(private orderService:OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrderHistory()
    this.orderService.getOrderHistoryAsObservable()
    .subscribe(result=>{
      this.orders = result.orders
      
    })
  }

}
