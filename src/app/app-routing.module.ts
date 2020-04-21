import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const appRoutes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  // old approach
  // {path: 'recipes', loadChildren: './recipes/recipes.module#RecipeModule'}
  // modern approach
  {path: 'recipes', loadChildren: () => import('./recipes/recipe.module').then(m => m.RecipeModule)},
  {path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-List.module').then(m => m.ShoppinListmodule)},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.Authmodule)}

];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
