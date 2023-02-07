import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [ShoppingListComponent, ShoppingEditComponent],
	imports: [SharedModule, RouterModule, FormsModule, ShoppingRoutingModule]
})
export class ShoppingModule {}
