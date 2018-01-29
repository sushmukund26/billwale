import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';

import { AuthService } from '../providers/auth-service';
import { Ng2OrderModule } from 'ng2-order-pipe';

import { OrderDetails } from '../pages/orderDetails/orderDetails';
import { Bill } from '../pages/orderDetails/bill';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UpdatePage } from '../pages/updatePage/updatePage';
import { NewOrder } from '../pages/newOrder/newOrder';

import { httpService } from '../services/http.service';
import { utils } from '../services/utils';
import { errorHandlingService } from '../services/errorHandling.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    MyApp,
    OrderDetails,
    HomePage,
    LoginPage,
    UpdatePage,
    Bill,
    NewOrder
  ],
  imports: [
    BrowserModule,
    HttpModule,
    Ng2OrderModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OrderDetails,
    LoginPage,
    UpdatePage,
    Bill,
    HomePage,
    NewOrder
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    httpService,
    utils,
    errorHandlingService,
    NativeStorage,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
