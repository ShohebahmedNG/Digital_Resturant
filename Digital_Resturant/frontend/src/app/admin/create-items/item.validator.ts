import { AbstractControl } from "@angular/forms";


export const checkNeumeric = (control :AbstractControl):{[key: string]: any} | null=>{
    
    if ( isNaN(control.value) || isNaN(parseFloat(control.value)))
         return {priceError: 'not a valid price'}
    return null
}