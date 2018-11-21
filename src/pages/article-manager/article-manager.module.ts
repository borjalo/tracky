import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticleManagerPage } from './article-manager';

@NgModule({
  declarations: [
    ArticleManagerPage
  ],
  imports: [
    IonicPageModule.forChild(ArticleManagerPage)
  ],
  exports: [
    ArticleManagerPage
  ]
})
export class ArticleManagerPageModule {}
