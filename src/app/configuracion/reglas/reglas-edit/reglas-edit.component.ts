import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CharacterLimit } from '../../../helpers/text-helpers';
import { MatDialog, MatSnackBar } from '@angular/material';
import { WebservicesService } from '../../../services/webservices.service';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { ModalsaveComponent } from '../../../shared/modalsave/modalsave.component';

@Component({
  selector: 'app-reglas-edit',
  templateUrl: './reglas-edit.component.html',
  styleUrls: ['./reglas-edit.component.scss']
})
export class ReglasEditComponent implements OnInit {
  newRoleForm;
  title = "Nuevo";

  @Input('id') id: string;
  @Output() onSearch = new EventEmitter<void>();

  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService, private snack: MatSnackBar) { }

  ngOnInit() {
    this.newRoleForm = this.fb.group ({
      role : new FormControl('', [ Validators.required, CharacterLimit('shortname', 256)  ] ),
      menu : new FormControl('',  [ Validators.required, CharacterLimit('shortname', 256)  ] ),
    });
  }

  isValid(control) {
    return this.newRoleForm.controls[control].invalid && this.newRoleForm.controls[control].touched;
  }

  guardar() {

    let dialogRef = this.dialog.open(ModalspinnerComponent,  {
      width: '250px',
      disableClose: true,
      panelClass: 'spinner-dialog'
      //data: { name: this.name, animal: this.animal }
    });
    
    var model = {};
    var path = "api/Configuration/NewRole";
    if (this.id != "0") {
      path = "api/Configuration/EditRole"; 
      model = {
        id : this.id,
      }
    }
    model['role'] =  this.newRoleForm.get('role').value;
    model['menu'] =  this.newRoleForm.get('menu').value;
    
    this.webservices.postMessage(path, model)
    .then( data => {
      dialogRef.close();
      this.doConsulta();
    }).catch( err => {
      dialogRef.close();
    });
   
  }

  riseError(control) {
    if (this.newRoleForm.controls[control].invalid) {
        this.snack.open("Debe ingresar un valor valido para el campo " + control , "Aceptar", { duration: 2000 });
        return true;
    }
    return false;
  }

  showConfirmacion() {
    if (!this.newRoleForm.valid) {
        for (var control in  this.newRoleForm.controls) {
            if (this.riseError(control)) {
                break;
            }
        }
    }
    else  {
      let dialogRef = this.dialog.open(ModalsaveComponent,  {
        width: '250px',
        //disableClose: true,
        //panelClass: 'spinner-dialog'
        //data: { name: this.name, animal: this.animal }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        this.guardar();
      });

    }
  }


  doConsulta() {
    this.onSearch.emit();
  }
}
