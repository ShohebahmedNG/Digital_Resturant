import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateItemsComponent } from "./admin/create-items/create-items.component";
import { DisplayItemsComponent } from "./common/display-items/display-items.component";
import { EditItemsComponent } from "./admin/edit-items/edit-items.component";
import { CartitemsComponent } from "./user/cartitems/cartitems.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import {AuthGuardAdmin, AuthGuardUser} from './auth/auth.guard'
import { OrderHistoryComponent } from "./user/order-history/order-history.component";

export const appRoutes:Routes=[
    {path:'admin/create', component:CreateItemsComponent, canActivate:[AuthGuardAdmin]},
    {path:'admin/edit-item/:itemId', component:EditItemsComponent, canActivate:[AuthGuardAdmin]},
    {path:'user/cart', component:CartitemsComponent, canActivate:[AuthGuardUser]},
    {path:'user/shopping-history', component:OrderHistoryComponent, canActivate:[AuthGuardUser]},
    {path:'signup', component:SignupComponent},
    {path:'login', component:LoginComponent},
    {path:'', component:DisplayItemsComponent},
]

@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
    
})

export class AppRoute{

}