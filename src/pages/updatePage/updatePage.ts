import {Component} from '@angular/core';
import {NavController, AlertController, LoadingController, ViewController, Loading} from 'ionic-angular';

import {httpService} from '../../services/http.service';
import {errorHandlingService} from '../../services/errorHandling.service';

import {HomePage} from '../home/home';


@Component({
  selector: 'updateItems',
  templateUrl: 'updatePage.html'
})
export class UpdatePage {
  searchTerm;
  searchResult;
  orderItems;
  name;
  items;
  isEdit;
  title;
  myGroup;
  errorMessage;
  isDineIn;
  loading: Loading;
  changedItems = [];


  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private errorHandlingService: errorHandlingService, private httpService: httpService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.errorMessage = '';


    this.getItems();

    this.name = "itemName";
    this.searchResult = [];

    this.items = [];

  }

  getItems() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Fetching items...',
        dismissOnPageChange: true
      });
    }
    this.loading.present().then(() => {
      this.httpService.getItems().then(response => {
        console.log("Got response:", response);
        this.searchResult = response;
        this.items = response;
        console.log(this.items);
        if (this.loading != null) {
          this.loading.dismiss();
          this.loading = null;
        }


      }).catch(error => {
        this.errorHandlingService.showNetworkError(error);
        console.log("Got error:", error);
        if (this.loading != null) {
          this.loading.dismiss();
          this.loading = null;
        }

      });
    });
  }

  onInput() {
    if (this.searchTerm == "") {
      this.searchResult = this.items;
    }
    else {
      this.searchResult = this.items.filter((item) => {
        return item.itemName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    }
  }

  changeAvailability(item) {
    if (item.isAvailable == 1) {
      item.isAvailable = 0;
      item.quantity = 0;
    }
    else {
      item.isAvailable = 1;
      item.quantity = 10;
    }

    if (this.changedItems.indexOf(item) == -1) {
      this.changedItems.push(item);
    }
  }

  onChange(item) {
    item.quantity = +item.quantity;
    if (item.quantity == 0) {
      item.isAvailable = 0;
    }
    else {
      item.isAvailable = 1;
    }
    if (this.changedItems.indexOf(item) == -1) {
      this.changedItems.push(item);
    }
  }

  resetAll() {
    for (var item of this.items) {
      if (item.quantity != 0) {
        this.changedItems.push(item);
        item.quantity = 0;
        item.isAvailable = 0;
      }
    }
  }

  doneClicked() {
    this.httpService.updateItems(this.changedItems, false);
    this.navCtrl.push(HomePage,
      {
        refresh: 0
      });

  }

  menuSelected(selected) {
    if (selected == "Save") {
      this.doneClicked();
    }
    if (selected == "Reset All") {
      this.resetAll();
    }
  }

  menuClicked() {
    var options = {
      title: 'Menu',
      inputs: [{
        name: 'Reset All', value: 'Reset All', label: 'Reset All',
        type: 'radio'
      }, {
        type: 'radio', value: 'Save', label: 'Save',
        name: 'Save'
      }],
      buttons: [
        {
          text: 'OK',
          handler: option => {
            this.menuSelected(option.toString());
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    };

    let alert = this.alertCtrl.create(options);
    alert.present();
  }


}
