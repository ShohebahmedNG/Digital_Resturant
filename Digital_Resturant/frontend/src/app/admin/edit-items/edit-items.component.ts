import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EcomNotificationService } from 'src/app/ecom-notification.service';
import { ItemService } from '../items.service';
import {checkNeumeric} from '../create-items/item.validator';
import { Item } from '../../common/item.model';

@Component({
  selector: 'app-edit-items',
  templateUrl: './edit-items.component.html',
  styleUrls: ['./edit-items.component.css']
})

export class EditItemsComponent implements OnInit {

  @ViewChild('imageElement') imageShow:ElementRef
  createForm:FormGroup
  itemId:string
  item:Item
  isLoading:boolean

  constructor(private itemService:ItemService, private router:Router, private notification: EcomNotificationService, public route:ActivatedRoute) {
    
   }

  ngOnInit(): void {
    this.isLoading = true
    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('',[checkNeumeric]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl('',[Validators.required])
    })

    this.route.paramMap.
    subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('itemId')){
        this.itemId = paramMap.get('itemId')

        this.itemService.getItemById(this.itemId)
        .subscribe(data=>{
          this.item = {id:data._id, name:data.name, price:data.price, description:data.description, imagePath: data.imagePath}

          this.createForm.setValue({
            name: data.name,
            price: data.price,
            description: data.description,
            image: data.imagePath
          })

          this.isLoading = false
        })
      }
    })
  }

  imageChange(event:Event){
    const file = (event.target as HTMLInputElement).files[0]
    
    if(typeof file !== 'undefined'){
      this.createForm.patchValue({
       image: file
      })
  
      this.createForm.updateValueAndValidity()
  
      const reader = new FileReader()
      reader.onload = ()=>{
        this.imageShow.nativeElement.src = (reader.result as string)
      }
      
      reader.readAsDataURL(file)
    }
  }

 editItem(){
   
   this.createForm.markAllAsTouched()
   if(this.createForm.valid){
   this.itemService.updateItem(this.itemId,this.createForm.value.name, this.createForm.value.price, this.createForm.value.description, this.createForm.value.image)
   .subscribe(res=>{
     console.log(res)
     this.notification.showSuccess('Successfully Edited',`${this.createForm.value.name} is saved successfully`)
     this.router.navigate(['/'])
     this.createForm.reset()
 }, err=>{
   this.notification.showError("Editing Failed",`${this.createForm.value.name} was not saved`)
   console.log(err)
 })
 }
   else
   return
 }

 cancel(){
   this.router.navigate(['/'])
 }
}
