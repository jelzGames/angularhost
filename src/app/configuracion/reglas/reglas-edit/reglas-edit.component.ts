import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CharacterLimit, fuuidv4 } from '../../../helpers/text-helpers';
import { MatDialog, MatSnackBar } from '@angular/material';
import { WebservicesService } from '../../../services/webservices.service';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { ModalsaveComponent } from '../../../shared/modalsave/modalsave.component';

@Component({
  selector: 'app-reglas-edit',
  templateUrl: './reglas-edit.component.html',
  styleUrls: ['./reglas-edit.component.scss'],
})
export class ReglasEditComponent implements OnInit, AfterViewInit {
 
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
      role : new FormControl('', [ Validators.required, CharacterLimit('role', 256)  ] ),
      descripcion : new FormControl('', [ Validators.required ] ),
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
        
    this.webservices.postMessage("api/Roles/ById", model)
    .then( data => {
      if (data != null ) {
        if (data.role != undefined) {
          this.newRoleForm.controls['role'].setValue(data.role);
          this.newRoleForm.controls['descripcion'].setValue(data.descripcion);
          if (this.editQuery == 0) {
            this.newRoleForm.controls['role'].disable();
            this.newRoleForm.controls['descripcion'].disable();
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
    var path = "api/Roles/New";
    this.runWebservices(path, model, dialogRef);
  }

  doUpdate() {
    let dialogRef = this.createSpinner();
    var model = this.CreateUpdateModel(this.id);
    var path = "api/Roles/Update";
    this.runWebservices(path, model, dialogRef);
  }

  CreateUpdateModel(id) {
    var model = {
      id : id,
      role : this.newRoleForm.get('role').value,
      descripcion : this.newRoleForm.get('descripcion').value
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
