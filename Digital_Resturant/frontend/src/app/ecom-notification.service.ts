import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EcomNotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message, title){
    if(title===null)this.toastr.success(message)
    this.toastr.success(message, title)
}

showError(message, title){
  if(title===null)this.toastr.error(message)
    this.toastr.error(message, title)
}

showInfo(message, title){
    this.toastr.info(message, title)
}

showWarning(message, title){
    this.toastr.warning(message, title)
}
}
