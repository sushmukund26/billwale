import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';

import {httpService} from '../../services/http.service';
import {errorHandlingService} from '../../services/errorHandling.service';

import {NewOrder} from '../newOrder/newOrder';
import {Bill} from '../orderDetails/bill';
import {utils} from "../../services/utils";

@Component({
  selector: 'page-orderDetails',
  templateUrl: 'orderDetails.html'
})
export class OrderDetails {
  order;
  searchTerm;
  totalBillValue;
  paymentModes = [];
  name: string = "itemName";

  constructor(public navCtrl: NavController, public navParams: NavParams, private utils: utils, private httpService: httpService, public modalCtrl: ModalController, private errorHandlingService: errorHandlingService) {
    this.order = this.navParams.get("order");
    this.totalBillValue = this.navParams.get("totalBillValue");
    this.getPaymentModes();
    this.order.paymentModeUsed = '';

    console.log(":" + this.navParams.get("fromHome"));
    console.log(this.order);
    console.log(this.navParams.get("paymentMode"));
  }

  editOrder() {
    this.navCtrl.push(NewOrder, {
      isEdit: true,
      order: this.order
    });
  }

  getPaymentModes() {
    if (this.paymentModes.length == 0) {
      console.log("in");
      this.httpService.getPaymentModes().then(response => {
        var paymentModesResponse = this.utils.generateArray(response);
        for (var paymentMode of paymentModesResponse) {
          this.paymentModes.push({name: paymentMode.paymentModeName, id: paymentMode.paymentModeId});
            console.log("here");
            console.log(paymentMode.paymentModeId);
            console.log(this.order.paymentMode);
          if (paymentMode.paymentModeId == this.order.paymentMode) {
            this.order.paymentModeUsed = paymentMode.paymentModeName;
          }
        }
      }).catch(error => {
        this.errorHandlingService.showNetworkError(error);
        console.log("Got error:", error);
      });
    }
    return this.paymentModes;
  }

  generateInvoice() {
    var paymentModes = this.getPaymentModes();
    console.log("generateInvoice");
    console.log(paymentModes);
    let billModal = this.modalCtrl.create(Bill, {order: this.order, paymentModes: paymentModes});
    billModal.onDidDismiss(data => {
    });
    billModal.present();
  }
}

