
import {Component,Renderer, Renderer2, ViewChild} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  ViewController
} from 'ionic-angular';
import {Content} from "ionic-angular";
import {finalize} from "rxjs/operators";
import {AngularFireStorage,AngularFireUploadTask} from 'angularfire2/storage';
@IonicPage()
@Component({
  selector: 'page-modal-signature',
  templateUrl: 'modal-signature.html',
})
export class ModalSignaturePage {
  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;
  storedImages = [];
  task: AngularFireUploadTask;
  downloadURL: any;
  url:string;
  // // Make Canvas sticky at the top stuff
  @ViewChild(Content) content: Content;
  @ViewChild('fixedContainer') fixedContainer: any;

  selectedColor = '#000000';


  constructor(public renderer: Renderer2,
              public navCtrl: NavController,
              public navParams: NavParams,
              private plt: Platform,
              private storage: AngularFireStorage,
              public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
  }

  ionViewDidEnter() {
    // Get the height of the fixed item
    let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
    let scroll = this.content.getScrollElement();

    // Add preexisting scroll margin to fixed container size
    itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
    scroll.style.marginTop = itemHeight + 'px';
  }

  ionViewDidLoad() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 200;
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  startDrawing(ev) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.touches[0].pageX - canvasPosition.x;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
  }

  moved(ev) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX - canvasPosition.x;
    let currentY = ev.touches[0].pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  saveCanvasImage() {

    const confirm = this.alertCtrl.create({
      title: 'Attention',
      message: 'Do you want to deliver this order?',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          handler: () => {
            var dataUrl = this.canvasElement.toDataURL();
            let ctx = this.canvasElement.getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
            var data = dataUrl.split(',')[1];
            let blob = this.b64toBlob(data, 'image/png');
            this.uploadToStorage(blob);
          }
        }
      ]
    });
    confirm.present();
  }


  uploadToStorage(data: any) {
    const loading = this.loadingCtrl.create({
      content: 'Saving signature...'
    });
    loading.present().then(() => {
    let newName = `${new Date().getTime()}.png`;
      const ref = this.storage.ref(`/signatures/` + newName);
      this.task = this.storage.ref(`/signatures/` + newName).put(data);
      this.task.snapshotChanges().pipe(
          finalize(() => this.downloadURL = this.storage.ref(`/signatures/` + newName).getDownloadURL().subscribe(res => {
            this.url = res;
            loading.dismiss().then(() => {
              this.dismiss()
            });
          }))
      ).subscribe();
    });

  }

  dismiss() {
    this.viewCtrl.dismiss(this.url);
  }

}
