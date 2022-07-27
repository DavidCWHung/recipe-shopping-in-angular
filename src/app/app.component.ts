import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'recipe-shopping';

  constructor(private authService: AuthService,
              private loggingService: LoggingService) {}

  ngOnInit() {
    this.authService.autoLogin();
    
    // For illustration purpose - Service instance
    this.loggingService.printLog("Hello from AppComponent ngOnInit");
  }
}
