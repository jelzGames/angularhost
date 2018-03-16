import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material';
import { ModalspinnerComponent } from '../../../info/components/modalspinner/modalspinner.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  constructor(public auth : AuthService, public dialog: MatDialog) {}
    
  loginData = {
      email: 'jelz2yk@hotmail.com',
      password: 'Hotelera2015?'
  }

  ngOnInit() {
  }

  async login() {
    this.openDialog();
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(ModalspinnerComponent,  {
      width: '250px',
      disableClose: true,
      panelClass: 'spinner-dialog'
      //data: { name: this.name, animal: this.animal }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });

    this.auth.login(this.loginData)
    .then( data => {
      dialogRef.close();
    }).catch( err => {
      dialogRef.close();
    });
  
  }
}
