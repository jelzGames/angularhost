import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WebservicesService } from '../../../services/webservices.service';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-reglas-result',
  templateUrl: './reglas-result.component.html',
  styleUrls: ['./reglas-result.component.scss']
})
export class ReglasResultComponent implements OnInit {
  @Input('resultLst') resultLst: any;
  @Output() onEditQuery = new EventEmitter<any>();
  
  isDelete = false;

  constructor(private webservices: WebservicesService, public dialog: MatDialog) { }

  ngOnInit() {
  }

  edicionConsulta(idValue, typeValue) {
    this.onEditQuery.emit({ id : idValue, editQuery : typeValue});
  }

  isGotoDelete(id) {
    this.isDelete = true;
  }

  delete(id) {
    let dialogRef = this.createSpinner();
    var model = {
      id : id,
      status : 0
    };
    var path = "api/Configuration/UpdateIsActiveRole";
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
      if (data == null ) {
        for (var x = 0; x < this.resultLst.length; x++) {
          var tmp = this.resultLst[x] as any;
          if (tmp.id == model.id) {
            this.resultLst.splice(x, 1);
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
}
