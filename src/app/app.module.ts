import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

import { ShoppingListReducer } from './shopping-list/store/shopping-list.reducer';

@NgModule({
	declarations: [AppComponent, HeaderComponent],
	imports: [
		BrowserModule,
		StoreModule.forRoot({
			shoppingList: ShoppingListReducer
		}),
		HttpClientModule,
		AppRoutingModule,
		SharedModule,
		CoreModule
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
