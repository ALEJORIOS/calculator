import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "main",
    loadComponent: () => import("./pages/main/main.component").then(m => m.MainComponent)
  },
  {
    path: "**",
    redirectTo: "/main",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
