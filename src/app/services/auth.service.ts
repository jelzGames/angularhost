import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebservicesService } from './webservices.service';
import { HttpClient } from '@angular/common/http/src/client';

@Injectable()
export class AuthService {
    email = "";
    token = "";

    constructor(private webService: WebservicesService, private router : Router) {}

    async login(model) {
        await this.webService.postAuth(model).then( data => {
            if (data != "") {
                this.email = model.email;
                this.token = data;
                this.router.navigate(['/']);
            }
        });
    }

    logout() {
        this.token = "";
        this.router.navigate(['/login']);
    }
 
    get isAuthenticated() {
        if (this.token != "") {
            return true;
        }
        return false;
    }

}
