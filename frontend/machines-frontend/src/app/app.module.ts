import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes'; 

import { AppComponent } from './app.component';
import { MachinesListComponent } from './features/machines-list/machines-list.component';
import { MachineCreateComponent } from './features/machine-create/machine-create.component';
import { MachineDetailsComponent } from './features/machine-details/machine-details.component';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MachinesListComponent,
    MachineCreateComponent,
    MachineDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
