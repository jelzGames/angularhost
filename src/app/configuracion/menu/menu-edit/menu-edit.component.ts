import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CharacterLimit, fuuidv4 } from '../../../helpers/text-helpers';
import { DialogsDataService } from '../../../services/dialogs.data.service';
import { MenuRole } from '../../../classes/menu.role';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent {
  newMenuForm;
  title = "Nuevo";
  readonly = false;
  typeOperation = 0;
  interval;
  
  @Input('id') id: string;
  @Input('editQuery') editQuery: number;
  @Output() onSearch = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private dialogsService : DialogsDataService) { 
    let menuRoleClass = new MenuRole();
   
    this.newMenuForm = this.fb.group ({
      menu : new FormControl('', [ Validators.required, CharacterLimit(256),  menuRoleClass.validFormat() ] ),
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
    return this.newMenuForm.controls[control].invalid && this.newMenuForm.controls[control].touched;
  }

  getById() {
    var model = {
        id : this.id,
    }

    this.dialogsService.runWebservices("api/Menu/ById", model, 1)
    .then( data => {
      if (data != null ) {
        if (data.menu != undefined) {
          this.newMenuForm.controls['menu'].setValue(data.menu);
          this.newMenuForm.controls['descripcion'].setValue(data.descripcion);
          if (this.editQuery == 0) {
            this.newMenuForm.controls['menu'].disable();
            this.newMenuForm.controls['descripcion'].disable();
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
    if (!this.dialogsService.checkError(this.newMenuForm)) {
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
    if (this.newMenuForm.controls[control].invalid) {
        this.dialogsService.showSnack("Debe ingresar un valor valido para el campo " + control);
        return true;
    }
    return false;
  }

  doUpdate() {
    var model;
    var path;
    if (this.id == '0') {
      model = this.CreateUpdateModel(fuuidv4());
      path = "api/Menu/New";
    }
    else {
      model = this.CreateUpdateModel(this.id);
      path = "api/Menu/Update";
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
      menu : this.newMenuForm.get('menu').value,
      descripcion : this.newMenuForm.get('descripcion').value
    };
    return model;
  }

  doConsulta(id) {
    if (id == undefined) {
      this.typeOperation = -1;
    }
    var model = {
      id : id,
      menu : this.newMenuForm.get('menu').value,
      typeOperation : this.typeOperation
    }
    this.onSearch.emit(model);
  }
}
