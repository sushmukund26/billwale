import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Loading
} from 'ionic-angular';
import {
  httpService
} from '../../services/http.service';
import {
  errorHandlingService
} from '../../services/errorHandling.service';
import {
  HomePage
} from '../home/home';
import {utils} from "../../services/utils";
@Component({
  selector: 'new-order',
  templateUrl: 'newOrder.html'
})
export class NewOrder {
  searchTerm;
  isSearchBarClicked;
  searchResult;
  orderItems;
  name;
  order;
  items;
  isEdit;
  title;
  allItems;
  editableItems;
  isDineIn = true;
  loading: Loading;
  isInputSelected = false;
  removedItems = [];
  total = 0;

  constructor(public navCtrl: NavController, private navParams: NavParams, private utils: utils, private errorHandlingService: errorHandlingService, private httpService: httpService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.isEdit = this.navParams.get("isEdit");
    if (this.isEdit) {
      this.title = "Edit Order";
      this.order = this.navParams.get("order");
      this.orderItems = [];
      if (this.order.items.length > 0) {
        console.log(this.order.items);
        for (var orderedItem of this.order.items) {
          var toPush = orderedItem.item_info[0];
          toPush.q = toPush.quantity;
          console.log(orderedItem);
          console.log("$$$$$$$$$$$");
          toPush.initialQuantity = orderedItem.quantity;
          toPush.quantity = orderedItem.quantity;
          if (this.order.orderMode == 1) {
            toPush.rate = orderedItem.item_info[0].itemRateDineIn;
          } else {
            toPush.rate = orderedItem.item_info[0].itemRateOnline;
          }
          this.orderItems.push(toPush);
          this.total += (toPush.quantity * toPush.rate);
        }
      }
      this.order.name = this.order.customerInfo[0].customerName;
      this.order.customerMobile = this.order.customerInfo[0].customerMobile;
      this.isDineIn = (this.order.orderMode == 1);
      this.getItems();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Order mode?',
        enableBackdropDismiss: false,
        buttons: [{
          text: 'Dine in',
          handler: () => {
            this.isDineIn = true;
            this.getItems();
          }
        },
          {
            text: 'Take away',
            handler: () => {
              this.isDineIn = false;
              this.getItems();
            }
          }
        ]
      });
      alert.present();
      this.title = "New Order";
      this.order = {
        'totalBillValue': 0
      };
      this.orderItems = [];
    }
    this.isSearchBarClicked = false;
    this.name = "itemName";
    this.searchResult = [];
    this.items = [];
  }

  getItems() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        dismissOnPageChange: true
      });
    }
    this.loading.present().then(() => {
      this.httpService.getItems().then(response => {
        this.allItems = response;
        this.editableItems = this.utils.generateArray(response);
        for (var item of this.editableItems) {
          item.q = item.quantity;
          item.quantity = 1;
          if (this.itemInOrderItems(item)) {
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            item.quantity = this.getQuantityByItemId(item);
            item.yetToAdd = false;
            console.log(item.initialQuantity);
            // this.items.push(item)
          } else {
            item.yetToAdd = true;
            item.quantity = 1;
          }
          if (this.isDineIn) {
            item.rate = item.itemRateDineIn;
          } else {
            item.rate = item.itemRateOnline;
          }
          if (item.isAvailable == 1) {
            console.log(item.itemId)
            this.items.push(item)
          }
        }
        this.searchResult = this.items;
        console.log(this.searchResult)
      }).catch(error => {
        this.errorHandlingService.showNetworkError(error);
        console.log("Got error:", error);
      });
      if (this.loading) {
        this.loading.dismissAll();
        this.loading = null;
      }
    });
  }

  onInput() {
    if (this.searchTerm == "") {
      this.searchResult = this.items;
    } else {
      this.searchResult = this.items.filter((item) => {
        return item.itemName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    }
  }

  doneClicked() {
    this.isSearchBarClicked = false;
    this.searchTerm = '';
  }

  getQuantityByItemId(item) {
    if (this.orderItems.filter(o => o.itemId == item.itemId).length > 0) {
      return this.orderItems.filter(o => o.itemId == item.itemId)[0].quantity;
    }
    return 1;
  }

  itemInOrderItems(item) {
    if (this.orderItems.filter(o => o.itemId == item.itemId).length > 0) {
      return true;
    }
    return false;
  }

  updateOrder(operation, item) {
    if (operation == "i") {
      item.quantity += 1;
    } else {
      item.quantity -= 1;
    }
  }

  add(item) {
    item.yetToAdd = false;
    item.q--;
    this.order.totalBillValue += item.rate;
    if (this.isEdit) {
      this.total += item.rate;
    }
    var toPushItem = item;
    toPushItem.q = item.q;
    this.orderItems.push(toPushItem);
    console.log(toPushItem)
  }

  incrementValue(item) {
    this.order.totalBillValue += item.rate;
    if (this.isEdit) {
      this.total += item.rate;
    }
    var i = this.orderItems.filter(o => o.itemId == item.itemId)[0];
    i.q--;
    this.updateOrder("i", i);
    if (this.searchResult.filter(o => o.itemId == item.itemId).length > 0) {
      var itemRequiredToIncrement = this.searchResult.filter(o => o.itemId == item.itemId)[0];
      itemRequiredToIncrement.quantity = i.quantity;
      itemRequiredToIncrement.q = i.q;
    }
  }

  decrementValue(item) {
    if (this.itemInOrderItems(item)) {
      this.order.totalBillValue -= item.rate;
      if (this.isEdit) {
        this.total -= item.rate;
      }
      if (item.quantity != 1) {
        var i = this.orderItems.filter(o => o.itemId == item.itemId)[0];
        i.q++;
        this.updateOrder("d", i)
        if (this.searchResult.filter(o => o.itemId == item.itemId).length > 0) {
          var itemRequiredToDecrement = this.searchResult.filter(o => o.itemId == item.itemId)[0];
          itemRequiredToDecrement.quantity = i.quantity;
          itemRequiredToDecrement.q = i.q;
        }
      } else {
        this.orderItems.splice(this.orderItems.indexOf(item), 1);
        console.log(item);
        console.log("***************");
          item.q++;
        console.log(item);
        this.removedItems.push(item);
        if (this.searchResult.filter(o => o.itemId == item.itemId).length > 0) {
          var itemRequired = this.searchResult.filter(o => o.itemId == item.itemId)[0];
          console.log(itemRequired);

          itemRequired.yetToAdd = true;
          itemRequired.q++;
        }
      }
    }
  }

  saveButton() {
    var isNumber = /^\d{10}$/.test(this.order.customerMobile);
    console.log(isNumber + "  " + this.order.customerMobile);
    console.log("--" + this.order.customerEmail + "[[")
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isEmailValid = re.test(this.order.customerEmail);
    if (!isNumber) {
      let alert = this.alertCtrl.create({
        title: 'Please enter a valid phone number',
        buttons: [{
          text: 'OK',
          handler: () => {
          }
        }]
      });
      alert.present();
    } else if (this.order.customerEmail != null && this.order.customerEmail != "" && !isEmailValid) {
      if (this.order.customerEmail.length != 0) {
        let alert = this.alertCtrl.create({
          title: 'Please enter a valid email ID',
          buttons: [{
            text: 'OK',
            handler: () => {
            }
          }]
        });
        alert.present();
      }
    } else {
      console.log("success");
      this.httpService.getCustomers().then(response => {
        var customers = this.utils.generateArray(response);
        var unique = true;
        for (var customer of customers) {
          if (this.order.customerMobile == customer.customerMobile) {
            unique = false;
          }
        }
        if (unique) {
          //create customer
          var newCustomer: any = {
            "customerName": this.order.name,
            "customerMobile": this.order.customerMobile,
            "customerEmail": "",
            "lastVisitDate": new Date().toISOString()
          }
          this.httpService.addCustomer(newCustomer);
        }
      }).catch(error => {
        console.log("Got error:", error);
        this.errorHandlingService.showNetworkError(error);
      });
      if (this.isEdit) {
        //post data to db
        this.order['orderItems'] = this.orderItems;
        this.order['orderId'] = this.order._id.orderId;
        this.order['createdDate'] = new Date().toISOString();
        this.order['lastUpdatedDate'] = new Date().toISOString();
        this.order['isPaid'] = false;
        if (this.isDineIn) {
          this.order['orderMode'] = 1;
        } else {
          this.order['orderMode'] = 2;
        }
        console.log(this.order);
        //update availablity of items
        var allOk = true;
        // this.total += (item.quantity*item.rate);


        if (allOk) {
          console.log("---------------------------");
          console.log(this.order);
          console.log("---------------------------");
          //get tax details
          var subTotal = this.total;//this.order['totalBillValue'];
          var cgst = 0, sgst = 0;
          this.httpService.getTaxDetails().then(response => {
            console.log("Got response:", response);
            var taxDetails = response;
            for (var tax of taxDetails) {
              if (tax.taxName == "cgst") {
                cgst = subTotal * (tax.taxPercentage * 0.01);
              }
              if (tax.taxName == "sgst") {
                sgst = subTotal * (tax.taxPercentage * 0.01);

              }
            }
            console.log("==========");
            console.log(this.orderItems);
            this.order['totalBillValue'] = Math.round(subTotal + cgst + sgst);
            this.order['createdBy'] = this.httpService.getOutletId();
            this.httpService.updateOrder(this.order);
            console.log("==========");
            console.log(this.removedItems);
            this.httpService.updateItems(this.orderItems, true);
            if(this.removedItems.length != 0) {
              this.httpService.updateItems(this.removedItems, true);
            }
            this.navCtrl.push(HomePage, {
              refresh: 0
            });

          }).catch(error => {
            this.errorHandlingService.showNetworkError(error);
            console.log("Got error:", error);
          });


        }
      } else {
        //new order
        this.httpService.getLatestOrder().then(response => {
          if (response.length != 0 && !isNaN(response[0].orderId) && typeof +response[0].orderId === 'number') {
            var latestOrderID = +response[0].orderId;
            //prepare order
            console.log(latestOrderID);
            this.order['orderId'] = latestOrderID + 1;
          }
          else {
            this.order['orderId'] = "1";
          }
          this.order['orderItems'] = this.orderItems;
          this.order['createdDate'] = new Date().toISOString();
          this.order['lastUpdatedDate'] = new Date().toISOString();
          this.order['isPaid'] = false;
          this.order['paymentMode'] = "";

          if (this.isDineIn) {
            this.order['orderMode'] = 1;
          } else {
            this.order['orderMode'] = 2;
          }
          console.log(this.order);
          var allOk = true;
          if (allOk) {
            //get tax details
            var subTotal = this.order['totalBillValue'];
            var cgst = 0, sgst = 0;
            this.httpService.getTaxDetails().then(response => {
              console.log("Got response:", response);
              var taxDetails = response;
              for (var tax of taxDetails) {
                if (tax.taxName == "cgst") {
                  cgst = subTotal * (tax.taxPercentage * 0.01);
                }
                if (tax.taxName == "sgst") {
                  sgst = subTotal * (tax.taxPercentage * 0.01);

                }
              }
              this.order['totalBillValue'] = Math.round(subTotal + cgst + sgst);
              this.order['createdBy'] = this.httpService.getOutletId();
              this.httpService.postOrder(this.order);
              console.log(this.orderItems);


              this.httpService.updateItems(this.orderItems, true);
              this.navCtrl.push(HomePage, {
                refresh: 0
              });
            }).catch(error => {
              this.errorHandlingService.showNetworkError(error);
              console.log("Got error:", error);
            });

          }
        }).catch(error => {
          console.log("Got error:", error);
        });
      }
    }
  }
}
