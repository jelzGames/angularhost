import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalspinnerComponent } from '../../shared/modalspinner/modalspinner.component';
import { MatDialog } from '@angular/material';
import { WebservicesService } from '../../services/webservices.service';

@Component({
  selector: 'app-reglas',
  templateUrl: './reglas.component.html',
  styleUrls: ['./reglas.component.scss']
})
export class ReglasComponent implements OnInit {
  basicForm;

  title = "Búsqueda";

  filter = "";
  resultLst = [];

  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService) { 
    this.basicForm = fb.group ({
      filter: ["",[] ],
    });
  }

  ngOnInit() {
   
  }

  /*
  onChanges(): void {
    this.basicForm.get('filter').valueChanges.subscribe(val => {
      this.filter = val;
    });
  }
  */
  
  doSearch() {
    this.resultLst = [];

    let dialogRef = this.dialog.open(ModalspinnerComponent,  {
      width: '250px',
      disableClose: true,
      panelClass: 'spinner-dialog'
      //data: { name: this.name, animal: this.animal }
    });
    
    var model = {
      filter : this.basicForm.get('filter').value
    }
    
    this.webservices.postMessage("api/Configuracion/ReglasSearch", model)
    .then( data => {
      this.resultLst = data;
      dialogRef.close();
    }).catch( err => {
      dialogRef.close();
    });
    
  }

}
