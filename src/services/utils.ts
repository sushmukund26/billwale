import {Injectable} from '@angular/core';

@Injectable()
export class utils {
  observable;
  constructor() {

  }
  //   getUserDetails() {
  //   var currentUser = this.auth.currentUser;
  //   console.log("%%%%%%%%");
  //   console.log(currentUser);
  // }

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
