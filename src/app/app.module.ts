import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { RecipeModule } from './recipes/recipe.module';
import { ShoppinListmodule } from './shopping-list/shopping-List.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { Authmodule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RecipeModule,
    ShoppinListmodule,
    SharedModule,
    CoreModule,
    Authmodule
  ],

  bootstrap: [AppComponent],

})
export class AppModule { }
