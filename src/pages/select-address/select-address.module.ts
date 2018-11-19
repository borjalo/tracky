import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectAddressPage } from './select-address';

@NgModule({
  declarations: [
    SelectAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectAddressPage),
  ],
})
export class SelectAddressPageModule {}
