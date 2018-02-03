import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, Loading} from 'ionic-angular';
import {errorHandlingService} from '../../services/errorHandling.service';

import {httpService} from '../../services/http.service';

import {OrderDetails} from '../orderDetails/orderDetails';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  searchTerm: string;
  orders;
  displayedOrders;
  date: string = 'lastUpdatedDate';
  loading: Loading;

  constructor(public navCtrl: NavController, private navParams: NavParams, private httpService: httpService, private loadingCtrl: LoadingController, private errorHandlingService: errorHandlingService) {
    this.setup();
  }

  ionViewDidEnter() {
    this.httpService.fetchCurrentUser();
    console.log(this.navParams.get("refresh"));
    console.log(this.navParams.get("refresh") != 0 || this.navParams.get("refresh") != undefined);
    // if(this.navParams.get("order") != undefined) {
    //   this.orders.filter((order) => {
    //     order = this.navParams.get("order");
    //   });
    // }
    // if (this.navParams.get("refresh") != 0 || this.navParams.get("refresh") != undefined) {
    //   console.log("in");
    //   this.setup();
    // }
    if (this.navParams.get("fromLogIn") == null) {
      console.log("in null from log in ");
    }
  }

  setup() {
    this.orders = [];
    this.displayedOrders = [];
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Fetching orders...',
        dismissOnPageChange: true
      });
    }
    this.loading.present().then(() => {
      this.httpService.getOrders().then(response => {
        this.orders = response;
        this.displayedOrders = response;
        if (this.loading != null) {
          this.loading.dismiss();
          this.loading = null;
        }
      }).catch(error => {
        this.errorHandlingService.showNetworkError(error);
        if (this.loading != null) {
          this.loading.dismiss();
          this.loading = null;
        }
      });
    });
  }

  getOrderDetails(order){
    this.navCtrl.push(OrderDetails, {
      order: order,
      totalBillValue: order.totalBillValue
    });
  }

  onInput() {
    if (this.searchTerm == "") {
      this.displayedOrders = this.orders;
    }
    else {
      this.displayedOrders = this.orders.filter((order) => {
        var name = "";
        var orderId = "";
        var customerMobile = "";
        if (order.customerInfo.length > 0) {
          name = order.customerInfo[0].customerName;
          customerMobile = order.customerInfo[0].customerMobile;
        }
        if (order._id.orderId != null) {
          orderId = order._id.orderId
        }
        return (customerMobile.toString().indexOf(this.searchTerm.toLowerCase()) > -1) || (name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) || (orderId.indexOf(this.searchTerm.toLowerCase()) > -1);
      });
    }
  }
}
