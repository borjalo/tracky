import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistorycPage } from './historyc';

@NgModule({
  declarations: [
    HistorycPage,
  ],
  imports: [
    IonicPageModule.forChild(HistorycPage),
  ],
})
export class HistorycPageModule {}
