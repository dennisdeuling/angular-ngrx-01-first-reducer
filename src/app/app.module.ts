import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

import * as fromApp from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environment/environment';

@NgModule({
	declarations: [AppComponent, HeaderComponent],
	imports: [
		BrowserModule,
		StoreModule.forRoot(fromApp.appReducer),
		EffectsModule.forRoot([AuthEffects]),
		StoreDevtoolsModule.instrument({ logOnly: environment.production }),
		HttpClientModule,
		AppRoutingModule,
		SharedModule,
		CoreModule
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
