import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalsaveComponent } from '../../../shared/modalsave/modalsave.component';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { fuuidv4, CharacterLimit } from '../../../helpers/text-helpers';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { WebservicesService } from '../../../services/webservices.service';
import { MatSnackBar, MatDialog } from '@angular/material';

@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss']
})
export class GroupsEditComponent implements OnInit {

  newRoleForm;
  title = "Nuevo";
  readonly = true;
  typeOperation = 0;
  
  @Input('id') id: string;
  @Input('editQuery') editQuery: number;
  @Output() onSearch = new EventEmitter<any>();

  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService, private snack: MatSnackBar) { }

  ngOnInit() {
    this.newRoleForm = this.fb.group ({
      name : new FormControl('', [ Validators.required, CharacterLimit('name', 256)  ] ),
    });
    if (this.id == "0") {
      this.readonly = false;
    }
    else if (this.editQuery == 1) {
      this.title = "Editar";
      this.typeOperation = 1;
    }
    else {
      this.title = "Consulta";
      this.typeOperation = 2;
    }
  }

  ngAfterViewInit(): void {
    if (this.id != "0") {
      setTimeout(()=>{   
        this.getById();
       },10);
    }
  }

  isValid(control) {
    return this.newRoleForm.controls[control].invalid && this.newRoleForm.controls[control].touched;
  }

  getById() {
    let dialogRef = this.createSpinner();
    
    var model = {
        id : this.id,
    }
        
    this.webservices.postMessage("api/Configuration/GroupsById", model)
    .then( data => {
      if (data != null ) {
        if (data.role != undefined) {
          this.newRoleForm.controls['name'].setValue(data.role);
          if (this.editQuery == 0) {
            this.newRoleForm.controls['name'].disable();
            this.readonly = true;
          }
          else { 
            this.readonly = false;
          }
        }
        else {
          this.readonly = true;
        }
      }
      dialogRef.close();
      
    }).catch( err => {
      dialogRef.close();
    });
  }

  doNew() {
    let dialogRef = this.createSpinner();
    var model = this.CreateUpdateModel(fuuidv4());
    var path = "api/Configuration/GroupsNew";
    this.runWebservices(path, model, dialogRef);
  }

  doUpdate() {
    let dialogRef = this.createSpinner();
    var model = this.CreateUpdateModel(this.id);
    var path = "api/Configuration/GroupsUpdate";
    this.runWebservices(path, model, dialogRef);
  }

  CreateUpdateModel(id) {
    var model = {
      id : id,
      name : this.newRoleForm.get('name').value,
  };

    return model;
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
        this.doConsulta(model.id);
      }
      dialogRef.close();
      
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
        data: { answer: true }
        //disableClose: true,
        //panelClass: 'spinner-dialog'
        //data: { name: this.name, animal: this.animal }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          if (this.id == '0') {
            this.doNew();
          }
          else {
            this.doUpdate();
          }
        }
        else {
          this.doConsulta(undefined);
        }
      });

    }
  }


  doConsulta(id) {
    if (id == undefined) {
      this.typeOperation = -1;
    }
    var model = {
      id : id,
      role : this.newRoleForm.get('role').value,
      typeOperation : this.typeOperation
    }
    this.onSearch.emit(model);
  }

}
