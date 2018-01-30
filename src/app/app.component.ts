import {Component, ViewChild} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {NativeStorage} from '@ionic-native/native-storage';

import {LoginPage} from '../pages/login/login';
import {HomePage} from '../pages/home/home';
import {NewOrder} from '../pages/newOrder/newOrder';
import {UpdatePage} from '../pages/updatePage/updatePage';

import {ScreenOrientation} from '@ionic-native/screen-orientation';
import {utils} from "../services/utils";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages;
  platform;
  utils;

  constructor(platform: Platform, screenOrientation: ScreenOrientation, statusBar: StatusBar,utils: utils, splashScreen: SplashScreen, private nativeStorage: NativeStorage) {
    this.platform = platform;
    this.utils = utils;

    platform.ready().then(() => {
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
      var isLoggedIn;

      this.nativeStorage.getItem('isLoggedIn')
        .then(
          data => {
            isLoggedIn = data.isLogged;
            if (isLoggedIn) {
              this.rootPage = HomePage;
            }
            else {
              this.rootPage = LoginPage;
            }
          },
          error => console.error(error)
        );
      this.utils.createTimeout(300)
        .then(() => {
          if (isLoggedIn == null)
            this.rootPage = LoginPage;
        });

      statusBar.styleDefault();
      splashScreen.hide();
    });
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'New Order', component: NewOrder},
      {title: 'Update Availability', component: UpdatePage},
      {title: 'Sign Out', component: LoginPage}
    ];

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title == 'Sign Out') {
      this.nav.setRoot(page.component);
    }
    else {
      this.nav.push(page.component);
    }

  }
}
