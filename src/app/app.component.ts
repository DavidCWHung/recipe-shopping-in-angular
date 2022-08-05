import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

import * as fromApp from './store/app.reducer';
import * as AuthActions from '../app/auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'recipe-shopping';

  constructor(private authService: AuthService,
              private loggingService: LoggingService,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    // this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLogin());

    // For illustration purpose - Service instance
    this.loggingService.printLog("Hello from AppComponent ngOnInit");
  }
}
