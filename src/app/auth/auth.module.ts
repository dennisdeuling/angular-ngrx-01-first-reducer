import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [AuthComponent],
	imports: [SharedModule, CommonModule, FormsModule, AuthRoutingModule]
})
export class AuthModule {}
