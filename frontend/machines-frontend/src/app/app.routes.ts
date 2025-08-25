import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MachinesListComponent } from './features/machines-list/machines-list.component';
import { MachineCreateComponent } from './features/machine-create/machine-create.component';
import { MachineDetailsComponent } from './features/machine-details/machine-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'machines', pathMatch: 'full' },
  { path: 'machines', component: MachinesListComponent },
  { path: 'machines/create', component: MachineCreateComponent },
  { path: 'machines/:id', component: MachineDetailsComponent },
  { path: '**', redirectTo: 'machines' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
