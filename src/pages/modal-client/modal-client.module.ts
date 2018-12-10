import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalClientPage } from './modal-client';

@NgModule({
  declarations: [
    ModalClientPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalClientPage),
  ],
  entryComponents: [
    ModalClientPage,
  ]
})
export class ModalClientPageModule {}
