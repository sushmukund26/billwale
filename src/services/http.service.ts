import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {utils} from "./utils";

@Injectable()
export class httpService {
  private headers;
  private currentUserId;
  private requestOptions: RequestOptions;
  private baseUrl: string;

  constructor(public http: Http, public utils: utils) {
    // this.currentUserId = this.utils.getUserDetails();
    this.baseUrl = "https://billwale.herokuapp.com";
    this.headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
    this.requestOptions = new RequestOptions({
      headers: this.headers
    })
  }

  getItems(): Promise<any> {
    return this.http.get(this.baseUrl + '/items', this.requestOptions).map(response => {
      return response.json() || {success: false, message: "No response from server"};
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    }).toPromise();
  }

  getPaymentModes(): Promise<any> {
    return this.http.get(this.baseUrl + '/paymentModes', this.requestOptions).map(response => {
      return response.json() || {success: false, message: "No response from server"};
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    }).toPromise();
  }

  getOrders(): Promise<any> {
    return this.http.get(this.baseUrl + '/order', this.requestOptions).map(response => {
      return response.json() || {success: false, message: "No response from server"};
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    }).toPromise();
  }

  getOrderByID(id): Promise<any> {
    return this.http.get(this.baseUrl + '/order/orderId/' + id, this.requestOptions).map(response => {
      return response.json() || {success: false, message: "No response from server"};
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    }).toPromise();
  }

  getLatestOrder(): Promise<any> {

    return this.http.get(this.baseUrl + '/order/latest', this.requestOptions).map(response => {
      return response.json() || {success: false, message: "No response from server"};
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    }).toPromise();
  }

  getUsers(): Promise<any> {
    return this.http.get(this.baseUrl + '/user', this.requestOptions).map(response => {
      return response.json() || {success: false, message: "No response from server"};
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    }).toPromise();
  }

  getTaxDetails(): Promise<any> {
    return this.http.get(this.baseUrl + '/taxdetails', this.requestOptions).map(response => {
      return response.json() || {success: false, message: "No response from server"};
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    }).toPromise();
  }

  getCustomers(): Promise<any> {
    return this.http.get(this.baseUrl + '/customer', this.requestOptions).map(response => {
      return response.json() || {success: false, message: "No response from server"};
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    }).toPromise();
  }

  postOrder(data) {
    this.http.post(this.baseUrl + '/order', data, this.requestOptions)

      .subscribe(data => {
        return data;
      });
  }

    updateOrder(data) {
    this.http.put(this.baseUrl + '/order', data, this.requestOptions)

      .subscribe(data => {
        return data;
      });
  }

  updateItems(data, fromOrder) {
    if (fromOrder) {
      for (var item of data) {
        item.quantity = +item.q;
        if (item.quantity == 0) {
          item.isAvailable = 0;
        }
      }
    }
    console.log("========data==");
    console.log(data);
    this.http.put(this.baseUrl + '/items', data, this.requestOptions)
      .subscribe(data => {
        return data;
      });
  }

  addCustomer(data) {
    this.http.post(this.baseUrl + '/customer', data, this.requestOptions)

      .subscribe(data => {
        return data;
      });
  }

}
