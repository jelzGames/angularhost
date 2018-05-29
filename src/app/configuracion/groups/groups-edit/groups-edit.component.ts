import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fuuidv4, CharacterLimit } from '../../../helpers/text-helpers';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MenusRoles } from '../../../classes/menus.roles';
import { DialogsDataService } from '../../../services/dialogs.data.service';


@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss']
})
export class GroupsEditComponent {

  newForm;
  title = "Nuevo";
  readonly = false;
  loading = false;
  typeOperation = 0;
  menuLst = [];
  rolesLst = [];
  interval;
 
  viewRoles = false;
  viewMenu = false;
  menuRolesClass = new MenusRoles();

  @Input('id') id: string;
  @Input('editQuery') editQuery: number;
  @Output() onSearch = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private dialogsService : DialogsDataService) {
    this.newForm = this.fb.group ({
      name : new FormControl('', [ Validators.required, CharacterLimit(256)  ] ),
      typeData : new FormControl(''),
    });
   this.newForm.get('typeData').setValue(false);
    this.newForm.get('name')['tagname'] = 'nombre';
  
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
      }
      this.getById();
    });
  }

  isValid(control) {
    return this.newForm.controls[control].invalid && this.newForm.controls[control].touched;
  }

  getById() {
    var model = {
      type : 2,
      byId : {
        id : this.id,
      }
    }
   
    this.dialogsService.runWebservices("api/groups", model, 1)
    .then( data => {
      if (data != null ) {
        if (data.name != undefined) {
          this.newForm.controls['name'].setValue(data.name);
          if (this.id != "0" && this.editQuery == 0) {
            this.newForm.controls['name'].disable();
            this.readonly = true;
          }
          else { 
            this.readonly = false;
          }
         
          this.menuRolesClass.extractData(data.menu, this.menuLst, 0);
          if (this.id != "0") {
            this.menuRolesClass.reorderModel(this.menuLst);
          }
        }
        else {
          this.readonly = true;
        }
      }
      this.viewMenu = true;
    });
  }

  showConfirmacion() {
    if (!this.dialogsService.checkError(this.newForm)) {
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

  doUpdate() {
    var model;
    var path = "api/groups";
    if (this.id == '0') {
      model = this.CreateUpdateModel(fuuidv4(), 3);
    }
    else {
      model = this.CreateUpdateModel(this.id, 4);
    }
    this.dialogsService.runWebservices(path, model, 0)
    .then( data => {
      if (data == null) {
        this.doConsulta(model.id);
      }
    });
  }

  CreateUpdateModel(id, type) {
    var model = {
      type : type,
      update : {
        id : id,
        name : this.newForm.get('name').value,
        menu : [],
        roles : []
      }
    };
    this.menuRolesClass.pushDataModel(this.menuLst, model);
   
    return model;
  }

  doConsulta(id) {
    if (id == undefined) {
      this.typeOperation = -1;
    }
    var model = {
      id : id,
      name : this.newForm.get('name').value,
      typeOperation : this.typeOperation
    }
    this.onSearch.emit(model);
  }

  doToogle() {
    if (!this.newForm.get('typeData').value) {
      this.viewMenu = false;
      this.viewRoles = true;
    }
    else {
      this.viewRoles = false;
      this.viewMenu = true;
    }
  }
}
