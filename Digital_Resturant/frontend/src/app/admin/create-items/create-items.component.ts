import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EcomNotificationService } from 'src/app/ecom-notification.service';
import { ItemService } from '../items.service';
import {checkNeumeric} from './item.validator';

@Component({
  selector: 'app-create-items',
  templateUrl: './create-items.component.html',
  styleUrls: ['./create-items.component.css']
})
export class CreateItemsComponent  {

  createForm:FormGroup
  constructor(private itemService:ItemService, private router:Router, private notification: EcomNotificationService) {
    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('',[checkNeumeric]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl('',[Validators.required])
    })
   }

   imageChange(event:Event){
     const file = (event.target as HTMLInputElement).files[0]
     
     this.createForm.patchValue({
      image: file
     })

     this.createForm.updateValueAndValidity()
   }

  addItem(){
    
    this.createForm.markAllAsTouched()
    if(this.createForm.valid){
    this.itemService.addItem(this.createForm.value.name, this.createForm.value.price, this.createForm.value.description, this.createForm.value.image)
    .subscribe(res=>{
      console.log(res)
      this.notification.showSuccess('Successfully Created',`${this.createForm.value.name} is added successfully`)
      this.router.navigate(['/'])
      this.createForm.reset()
  }, err=>{
    this.notification.showError("Creation Failed",`${this.createForm.value.name} was not added`)
    console.log(err)
  })
  }
    else
    return
  }
}
