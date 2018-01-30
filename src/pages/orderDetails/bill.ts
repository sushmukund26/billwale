import { Component } from '@angular/core';
import {NavParams, AlertController, ViewController} from 'ionic-angular';

import { httpService } from '../../services/http.service';
import { errorHandlingService } from '../../services/errorHandling.service';

@Component({
  selector: 'page-bill',
  templateUrl: 'bill.html'
})
export class Bill {
  order
  isDineIn
  subTotal = 0
  cgst = 0
  sgst = 0
  total = 0
  paymentModes

 constructor(public viewCtrl: ViewController, public navParams: NavParams, private httpService: httpService, private errorHandlingService : errorHandlingService,private alertCtrl: AlertController) {
     this.order = this.navParams.get('order');
     this.paymentModes = this.navParams.get('paymentModes');
       var string = this.order.customerInfo[0].customerName;
   this.order.customerInfo[0].customerName = string.substring(0, 14);
     this.isDineIn = this.order.orderMode == 1 ? true : false;

     for (var item of this.order.items) {
            if(this.isDineIn) {
              this.subTotal += (item.item_info[0].itemRateDineIn * item.quantity);
            }
            else {
              this.subTotal += (item.item_info[0].itemRateOnline * item.quantity);
            }

          }
    this.httpService.getTaxDetails().then(response => {
    var taxDetails = response;
    for(var tax of taxDetails) {
      if(tax.taxName == "cgst") {
          this.cgst = this.subTotal * (tax.taxPercentage * 0.01);
      }
      if(tax.taxName == "sgst") {
          this.sgst = this.subTotal * (tax.taxPercentage * 0.01);

      }
    }
    this.total = this.subTotal + this.cgst + this.sgst;
 }).catch(error => {
  this.errorHandlingService.showNetworkError(error);
    console.log("Got error:", error);
  });

 }

 dismiss() {
   let data = { 'foo': 'bar' };
   this.viewCtrl.dismiss(data);
 }
 confirmPayment() {
  var options = {
    title: 'Confirm order payment?',
    inputs: [],
    buttons: [
    {
        text: 'OK',
        handler: option => {
          this.order.isPaid = true;
          console.log("data"+option);
          var updatedOrder = {
            "orderId" : this.order._id.orderId,
            "orderItems" : this.order.items,
            "customerMobile" : this.order.customerInfo[0].customerMobile,
            "totalBillValue" : this.order.totalBillValue,
            "isPaid" : true,
            "orderMode" : this.order.orderMode,
            "paymentMode" : option.toString()
        }
          // update in db
          console.log(updatedOrder);
         this.httpService.updateOrder(updatedOrder);
         let data = { 'paymentMode': option };
         this.viewCtrl.dismiss(data);
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
  options.inputs = [];

 for(var paymentMode of this.paymentModes) {
      options.inputs.push({ name : 'options', value: paymentMode.id, label: paymentMode.name, type: 'radio' });
  }

  let alert = this.alertCtrl.create(options);
  alert.present();
 }

}
