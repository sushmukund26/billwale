import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { errorHandlingService } from '../services/errorHandling.service';


export class User {
  name: string;
  email: string;


  constructor(name: string, email: string) {
 this.name = name;
    this.email = email;



  }
}

@Injectable()
export class AuthService {
  public currentUser: User;

    existingUsers;

  constructor(private errorHandlingService: errorHandlingService) {
  }


  getCurrentUser() {
    return this.currentUser;
  }

  public login(credentials, existingUsers) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = false;
        for (var user of existingUsers) {
          console.log(user.name);

          if(credentials.password === user.password && credentials.email === user.outletId) {
            access = true;
            this.currentUser = new User(user.outletId, user.password);

          }
          // observer.next(access);
          // observer.complete();
        }
        observer.next(access);
        observer.complete();
  }).catch(error => {
    console.log("Got error:", error);
            this.errorHandlingService.showNetworkError(error);
            return Observable.throw("Error");


  })

    }
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
