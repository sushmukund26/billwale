import {Injectable} from '@angular/core';
import {NativeStorage} from "@ionic-native/native-storage";
import {Observable} from "rxjs/Observable";

@Injectable()
export class utils {
  observable;
  constructor(private nativeStorage: NativeStorage) {

  }
  getCurrentUserDetails(): Promise<any> {
    return this.nativeStorage.getItem('currentUser').then(response => {
      console.log("here from get()");
      return response.currentUser;
    }).catch((error: Response | any) => {
      return Observable.throw(error.json());
    })
  }

  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key]
    });
  }
  createTimeout(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(null), timeout)
    })
  }

}
