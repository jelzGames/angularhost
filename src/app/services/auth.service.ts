import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebservicesService } from './webservices.service';

@Injectable()
export class AuthService {

  constructor(private webService: WebservicesService, private router : Router) {}

    async login(model) {
        await this.webService.postAuth(model);
    }

    logout() {
        localStorage.removeItem("TokenInfo");
        this.router.navigate(['/login']);
    }
 
    get isAuthenticated() {
        return !!localStorage.getItem("TokenInfo");
    }

}
