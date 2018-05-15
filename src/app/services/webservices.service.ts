import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { ConfigService } from './config.service';

@Injectable()
export class WebservicesService {

    TokenInfo = ""; 
   
    constructor(private router: Router, private http : HttpClient, private snackBar: MatSnackBar, private config : ConfigService) {}

    async postMessage(url, model) {
        var headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + this.TokenInfo);
        headers = headers.append('Content-Type', 'application/json; charset=utf-8');
        
        return await this.http.post(this.config.BASE_URL + url, model, { headers : headers } ).toPromise()
        .then ( response => {
            var data = response as any;
            return data;
        })
        .catch ( error => {
            this.handleError(error);
            return { error : true };
        } )
    }

    async postAuth(model) {
        const options = {
            params: new HttpParams()
        };
          
        options.params.set('Content-Type', 'application/x-www-form-urlencoded');
        
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('grant_type', "password");
        urlSearchParams.append('username',  model.email);
        urlSearchParams.append('password', model.password);
        let body = urlSearchParams.toString()

        return await this.http.post(this.config.BASE_URL + 'token', body, options).toPromise()
        .then ( response => {
            var data = response as any;
            if (data != undefined && data.access_token != null) {
                return data.access_token;
            }
            else {
                this.handleError("no esta autorizado");
                return "";
            }
        })
        .catch ( error => {
            this.handleError(error);
            return "";
    
        } )
    }
  
    private handleError(error) {
        var errorMessage;
        if (error.status == "404" ) {
            errorMessage = "Webservice no encotrado";
        }
        else if (error.status == "401") {
            errorMessage = "No autorizado";
            this.router.navigate(['/login']);
        }
        else if (error.status != "0" && error.status != "400") {
            if (error.error != undefined && error.error.error == "invalid_grant") {
                errorMessage = "Correo o contraseña es incorrecto";
            }
            else if (error.Message != undefined) {
                errorMessage = error.Message;
            }
            else if (error.error.message != undefined) {
                errorMessage = error.error.message;
            }
            else {
                errorMessage = error.error.error_description;
            } 
        }
        else {
            errorMessage = "No es posible conectar al servidor";
        }
        this.snackBar.open(errorMessage , 'Close', {duration: 3000});
    }
}
