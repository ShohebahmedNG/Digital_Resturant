import { Item } from "../common/item.model";

export interface OrderModel{
    
    allitems:[{item:Item, qty:Number}],
    userid:string,
    totalPrice:string
}