import { Component, OnInit, NgZone, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav, MatCard } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { BreadcumDirective } from './breadcum.directive';
import { BreadcumComponent } from '../breadcum/breadcum.component';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild(BreadcumDirective) breadcumHost: BreadcumDirective;
  
  breadcum = "";
  
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  menuItems = [
    { 
      'avatar' : 'Catalogos',
      'menuItem' : 'Configuracion',
      'subMenuitems' : [
        {
          'avatar' : 'Catalogos',
          'menuItem' : 'Servicios Web',
          'route' : 'Configuracion/Reglas'
        },
        {
          'avatar' : 'Catalogos',
          'menuItem' : 'Menu',
          'route' : 'Configuracion/Menu'
        },
        {
          'avatar' : 'Catalogos',
          'menuItem' : 'Grupos',
          'route' : 'Configuracion/Grupos'
        },
        {
          'avatar' : 'Catalogos',
          'menuItem' : 'Usuarios',
          'route' : 'Configuracion/Usuarios'
        }
      ]
    },
    { 
      'avatar' : 'Catalogos',
      'menuItem' : 'Transacciones',
      'subMenuitems' : [
      ]
    },
    { 
      'avatar' : 'Catalogos',
      'menuItem' : 'Reportes',
      'subMenuitems' : [
      ]
    }
  ];

  constructor(zone: NgZone, private router: Router, public auth: AuthService, private componentFactoryResolver: ComponentFactoryResolver) { 
    this.mediaMatcher.addListener(mql => 
      zone.run(() => this.mediaMatcher = mql));
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
    this.breadcum = "DashBoard";
    //this.loadComponent(true, "");
  }

  isScreenSmall() : boolean {
    return this.mediaMatcher.matches;
  }

  doLink(menuItem) {
    this.breadcum = menuItem;
   
    //this.loadComponent(true, path)
  }

  loadComponent(isAdding, path) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(BreadcumComponent);

    let viewContainerRef = this.breadcumHost.viewContainerRef;
    viewContainerRef.clear();
    
    if (isAdding) {
      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<BreadcumComponent>componentRef.instance).breadcum = path;
    }
  }
}
