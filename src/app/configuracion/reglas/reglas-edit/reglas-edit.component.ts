import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CharacterLimit, fuuidv4 } from '../../../helpers/text-helpers';
import { DialogsDataService } from '../../../services/dialogs.data.service';
import { MenuRole } from '../../../classes/menu.role';
import { DialogSnackService } from '../../../services/dialog.snack.service';

@Component({
  selector: 'app-reglas-edit',
  templateUrl: './reglas-edit.component.html',
  styleUrls: ['./reglas-edit.component.scss'],
})
export class ReglasEditComponent {
  newRoleForm;
  title = "Nuevo";
  readonly = false;
  typeOperation = 0;
  interval;
  
  @Input('id') id: string;
  @Input('editQuery') editQuery: number;
  @Output() onSearch = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private dialogsService : DialogsDataService, private snack : DialogSnackService) { 
     let menuRoleClass = new MenuRole();
   
    this.newRoleForm = this.fb.group ({
      role : new FormControl('', [ Validators.required, CharacterLimit(256), menuRoleClass.validFormat() ] ),
      descripcion : new FormControl('', [ Validators.required ] ),
    });
     
    this.interval = setInterval( () => { 
      clearInterval(this.interval);
      if (this.id != "0") {
        if (this.editQuery == 1) {
          this.title = "Editar";
          this.typeOperation = 1;
        }
        else {
          this.title = "Consulta";
          this.typeOperation = 2;
        }
      
        this.getById();
      }
    });
  }

  isValid(control) {
    return this.newRoleForm.controls[control].invalid && this.newRoleForm.controls[control].touched;
  }

  getById() {
    var model = {
        id : this.id,
    }

    this.dialogsService.runWebservices("api/Roles/ById", model, 1)
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
    });
    
  }

 
  showConfirmacion() {
    if (!this.dialogsService.checkError(this.newRoleForm)) {
      let dialogRef = this.dialogsService.createView(0);
      dialogRef.afterClosed().subscribe(result => {
        if (result != 0) {
          if (result == 1) {
            this.doUpdate();
          }
        }
        else {
          this.doConsulta(undefined);
        }
      });
    }
  }

  riseError(control) {
    if (this.newRoleForm.controls[control].invalid) {
        this.snack.showSnack("Debe ingresar un valor valido para el campo " + control);
        return true;
    }
    return false;
  }

  doUpdate() {
    var model;
    var path;
    if (this.id == '0') {
      model = this.CreateUpdateModel(fuuidv4());
      path = "api/Roles/New";
    }
    else {
      model = this.CreateUpdateModel(this.id);
      path = "api/Roles/Update";
    }
    this.dialogsService.runWebservices(path, model, 0)
    .then( data => {
      if (data == null) {
        this.doConsulta(model.id);
      }
    });
  }

  CreateUpdateModel(id) {
    var model = {
      id : id,
      role : this.newRoleForm.get('role').value,
      descripcion : this.newRoleForm.get('descripcion').value
    };

    return model;
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
