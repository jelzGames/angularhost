import { Component, OnInit } from '@angular/core';
import { UpdateService } from './services/update.service';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  private _hubConnection: HubConnection;
  msgs = [];

  constructor(private update: UpdateService) {
    //update.checkForUpdate();
  }

  ngOnInit(): void {
    this._hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:44324/loopy')
        .configureLogging(signalR.LogLevel.Information)
        .build();

    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));
  
    this._hubConnection.on('Send', (type: string, payload: string) => {
      this.msgs.push({ severity: type, summary: payload });
    });
  }
}
