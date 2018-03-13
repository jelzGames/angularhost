import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layoutmanager-app',
  template: `
    <app-sidenav></app-sidenav>
  `,
  styles: []
})
export class LayoutmanagerAppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
