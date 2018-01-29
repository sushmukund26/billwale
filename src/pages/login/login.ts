import {Component} from '@angular/core';
import {NavController, LoadingController, Loading} from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import {NativeStorage} from '@ionic-native/native-storage';

import {errorHandlingService} from '../../services/errorHandling.service';

import {HomePage} from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};

  constructor(private nav: NavController, private auth: AuthService, private errorHandlingService: errorHandlingService, private loadingCtrl: LoadingController, private nativeStorage: NativeStorage) {
    this.nativeStorage.setItem('isLoggedIn', {isLogged: false})
      .then(
        () => console.log("setToFalse")
        ,
        error => console.error('Error storing item', error)
      );
  }


  public login() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Authenticating...',
        dismissOnPageChange: true
      });
    }
    this.loading.present().then(() => {
      this.auth.login(this.registerCredentials).subscribe(allowed => {
          console.log("1");
          if (allowed) {
            if (this.loading) {
              this.loading.dismissAll();
              this.loading = null;
            }

            this.nativeStorage.setItem('isLoggedIn', {isLogged: true})
              .then(
                () => console.log("setToTrue"),
                error => console.error('Error storing item', error)
              );
            var isLoggedIn;
            this.nativeStorage.getItem('isLoggedIn')
              .then(
                data => {
                  isLoggedIn = data.isLogged
                },
                error => console.error(error)
              );

            this.nav.setRoot(HomePage, {
              fromLogIn: true
            });
          } else {
            this.errorHandlingService.showErrorMessage("Access Denied");
            if (this.loading) {
              this.loading.dismissAll();
              this.loading = null;
            }
          }
        },
        error => {
          this.errorHandlingService.showNetworkError(error);
        });

    });


  }


}
