import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { WebservicesService } from '../../../services/webservices.service';
import { MatDialog } from '@angular/material';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';

@Component({
  selector: 'app-usuarios-result',
  templateUrl: './usuarios-result.component.html',
  styleUrls: ['./usuarios-result.component.scss']
})
export class UsuariosResultComponent implements OnInit {
  @Input('resultLst') resultLst: any;
  @Output() onEditQuery = new EventEmitter<any>();
  @Input('status') status: number;
  
  isDelete = false;
  isUnLock = false;

  constructor(private webservices: WebservicesService, public dialog: MatDialog) { }

  ngOnInit() {
  }

  edicionConsulta(idValue, typeValue, email) {
    var model = { 
      id : idValue, 
      editQuery : typeValue
    };
    if (typeValue == 2) {
      model["email"] = email;
    }
    
    this.onEditQuery.emit(model);
   
  }

  isGotoDelete(id) {
    this.isDelete = true;
  }

  delete(id) {
    this.lockUnlock(id, 0);
  }

  lockUnlock(id, status) {
    let dialogRef = this.createSpinner();
      var model = {
        id : id,
        status : status
      };
      var path = "api/Users/UpdateIsActive";
      this.runWebservices(path, model, dialogRef);
  }

  createSpinner() {
    let dialogRef = this.dialog.open(ModalspinnerComponent,  {
      width: '250px',
      disableClose: true,
      panelClass: 'spinner-dialog'
      //data: { name: this.name, animal: this.animal }
    });
    return dialogRef;
  }
  
  runWebservices(path, model, dialogRef) {
    this.webservices.postMessage(path, model)
    .then( data => {
      if (data == null) {
        for (var x = 0; x < this.resultLst.length; x++) {
          var tmp = this.resultLst[x] as any;
          if (tmp.id == model.id) {
            if (this.status != 2) {
              this.resultLst.splice(x, 1);
            } 
            else {
              this.resultLst[x].status = model.status;
              this.isUnLock = false;
  
            }  
            break;
          } 
        }
        this.isDelete = false;
      }
      dialogRef.close();
      
    }).catch( err => {
      dialogRef.close();
    });
  }

  undo() {
    this.isDelete = false;
  }

  undoUnlock() {
    this.isUnLock = false;
  }

  unlock(id) {
    if (!this.isUnLock) {
      this.isUnLock = true;
    }
    else {
      this.lockUnlock(id, 1)
    }
  }

}
