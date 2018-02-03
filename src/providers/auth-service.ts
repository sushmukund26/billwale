import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { errorHandlingService } from '../services/errorHandling.service';
import {NativeStorage} from "@ionic-native/native-storage";


export class User {
  constructor(name: string, outletId: string, password: string, gstID: string, address1: string, address2: string) {
    this.name = name;
    this.outletId = outletId;
    this.password = password;
    this.gstID = gstID;
    this.address1 = address1;
    this.address2 = address2;
  }
  name: string;
  outletId: string;
  password: string;
  gstID: string;
  address1: string;
  address2: string;

}

@Injectable()
export class AuthService {
  public currentUser: User;

    existingUsers;

  constructor(private errorHandlingService: errorHandlingService, private nativeStorage: NativeStorage) {
  }


  getCurrentUser() {
    return this.currentUser;
  }

  public login(credentials, existingUsers) {
    if (credentials.outletId === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = false;
        for (var user of existingUsers) {
          console.log(user.name);

          if(credentials.password === user.password && credentials.outletId === user.outletId) {
            access = true;
            this.currentUser = new User(user.name,  user.outletId,  user.passive,  user.gstID, user.address1, user.address2);
            this.nativeStorage.setItem('currentUser', {currentUser: this.currentUser}).then(
              () => {
                console.log("+++++++++++++++");
                console.log(this.currentUser);
                var currentUser: User;
                this.nativeStorage.getItem('currentUser')
                  .then(
                    data => {
                      currentUser = data.currentUser;
                      console.log("+++++++++++++++");
                      console.log(currentUser);
                    },
                    error => console.error(error)
                  );              }
              ,
              error => console.error('Error storing item', error)
            );


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
    if (credentials.outletId === null || credentials.password === null) {
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
