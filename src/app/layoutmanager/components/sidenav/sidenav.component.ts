import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  links = [
    { 
      'avatar' : 'Catalogos',
      'link' : 'Catalogos',
    },
    { 
      'avatar' : 'Catalogos',
      'link' : 'Transacciones',
    },
    { 
      'avatar' : 'Catalogos',
      'link' : 'Reportes',
    }
  ];

  constructor(zone: NgZone, private router: Router) { 
    this.mediaMatcher.addListener(mql => 
      zone.run(() => this.mediaMatcher = mql));
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    })
  }

  isScreenSmall() : boolean {
    return this.mediaMatcher.matches;
  }

}
