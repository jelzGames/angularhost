import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { WebservicesService } from './webservices.service';
import { ModalspinnerComponent } from '../shared/modalspinner/modalspinner.component';
import { ModalsaveComponent } from '../shared/modalsave/modalsave.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsDataService {

  constructor(public dialog: MatDialog, private webservices: WebservicesService, private snack: MatSnackBar) { }

  createView(view) {
    let dialogRef = this.dialog.open(view,  {
      width: '250px',
      disableClose: true,
      panelClass: 'spinner-dialog'
      //data: { name: this.name, animal: this.animal }
    });
    return dialogRef;
  }

  runWebservices(path, model, type) : any {
    let dialogRef = this.createView(ModalspinnerComponent);
    return this.webservices.postMessage(path, model)
    .then( data => {
      dialogRef.close();
      if (data == null) {
        if (type == 0) {
          this.snack.open("Registro ha sido gurdado con exito ", "Aceptar", { duration: 2000 });
        }
      }
      return data;
    }).catch( err => {
      dialogRef.close();
    });
  }
  
}
