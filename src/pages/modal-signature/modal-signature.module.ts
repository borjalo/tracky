import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSignaturePage } from './modal-signature';

@NgModule({
  declarations: [
    ModalSignaturePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSignaturePage),
  ],
  entryComponents: [
    ModalSignaturePage,
  ]
})
export class ModalSignaturePageModule {}
