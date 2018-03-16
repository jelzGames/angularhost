import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class WebservicesService {

    BASE_URL = 'http://localhost:30270/';

    constructor(private router: Router, private http : HttpClient, private snackBar: MatSnackBar) {}

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

        return await this.http.post(this.BASE_URL + 'token', body, options).toPromise()
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
        if (error.status == "404") {
            errorMessage = "Webservice no encotrado";
        }
        else if (error.status == "401") {
            this.router.navigate(['/login']);
        }
        else if (error.status != "0") {
            if (error.error != undefined && error.error.error == "invalid_grant") {
                errorMessage = "Correo o contraseña es incorrecto";
            }
            else if (error.Message != undefined) {
                errorMessage = error.Message;
            }
            else if (error.message != undefined) {
                errorMessage = error.message;
            }
            else {
                errorMessage = error.error.error_description;
            } 
        }
        else {
            errorMessage = "No es posible conectar al servidor";
        }
        this.snackBar.open(errorMessage , 'Close', {duration: 5000});
    }

  /*
  constructor(private http: Http, private dialog: MdDialog, private router: Router, private snackBar: MdSnackBar) {}

  async postMessage(url, model) {
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + localStorage.getItem("TokenInfo"));
      headers.append('Content-Type', 'application/json; charset=utf-8');
      let options = new RequestOptions({ headers: headers });
  
      try {
          var response = await this.http.post(this.BASE_URL + url,  model, options).toPromise();
          return response.json();
      }
      catch (error) {
          this.handleError(error);
      }
  }

  async postAuth(model) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let options = new RequestOptions({ headers: headers });
      
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('grant_type', "password");
      urlSearchParams.append('username',  model.email);
      urlSearchParams.append('password', model.password);
      let body = urlSearchParams.toString()

      try {
          var response = await this.http.post(this.BASE_URL + 'token', body, options).toPromise();
          var data = response.json();
          if (data != undefined && data.access_token != null) {
              localStorage.setItem("TokenInfo", data.access_token);
              this.router.navigate(['/']);
          }
          return data;
      }
      catch (error) {
          this.handleError(error);
      }
  }

  private handleError(error) {
      var errorMessage;
      console.log(error.statusText);
      if (error.status == "404") {
          errorMessage = "Not found webservice";
      }
      else if (error.status == "401") {
          this.router.navigate(['/login']);
      }
      else if (error.status != "0") {
          if (error.json().Message != undefined) {
              errorMessage = error.json().Message;
          }
          else if (error.json().message != undefined) {
              errorMessage = error.json().message;
          }
          else {
                errorMessage = error.json().error_description;
          } 
      }
      else {
          errorMessage = "Unable to connect to the server";
      }
      //this.snackBar.open(errorMessage , 'Close', {duration: 3000});
      let var1 = this.dialog.open(AlertComponent);
      var1.componentInstance.content = errorMessage;
  }
 */
}
