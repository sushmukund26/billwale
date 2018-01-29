import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()

export class errorHandlingService {
	constructor(private alertCtrl: AlertController) {

	}

	 showNetworkError(text) {
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'We are facing technical difficulties. Please try again later.',
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  showErrorMessage(text) {
 
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
