import {Injectable} from '@angular/core';
import {AuthService} from "../providers/auth-service";

@Injectable()
export class utils {
  observable;
  constructor(private auth: AuthService) {

  }
    getUserDetails() {
    var currentUser = this.auth.currentUser;
    return currentUser.name;
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
