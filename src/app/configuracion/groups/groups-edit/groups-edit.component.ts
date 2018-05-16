import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalsaveComponent } from '../../../shared/modalsave/modalsave.component';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { fuuidv4, CharacterLimit } from '../../../helpers/text-helpers';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { WebservicesService } from '../../../services/webservices.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';
import { MenusRoles } from '../../../classes/menus.roles';
import { DialogsDataService } from '../../../services/dialogs.data.service';


@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss']
})
export class GroupsEditComponent implements OnInit {

  newForm;
  title = "Nuevo";
  readonly = true;
  loading = false;
  typeOperation = 0;
  menuLst = [];
  rolesLst = [];
  interval;
 
  viewRoles = false;
  viewMenu = false;

  @Input('id') id: string;
  @Input('editQuery') editQuery: number;
  @Output() onSearch = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private webservices: WebservicesService, private snack: MatSnackBar,
  private dialogsService : DialogsDataService) { }

  ngOnInit() {
    this.newForm = this.fb.group ({
      name : new FormControl('', [ Validators.required, CharacterLimit(256)  ] ),
      typeData : new FormControl(''),
    });
    this.newForm.get('typeData').setValue(false);

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

    this.interval = setInterval( () => { 
      clearInterval(this.interval);
      this.getById();
     });
    
  }

  isValid(control) {
    return this.newForm.controls[control].invalid && this.newForm.controls[control].touched;
  }

  getById() {
    let dialogRef = this.dialogsService.createView(ModalspinnerComponent);
    
    var model = {
        id : this.id,
    }
        
    this.webservices.postMessage("api/Groups/ById", model)
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
          
          let menuRolesClass = new MenusRoles();
          menuRolesClass.extractData(data.menu, this.menuLst, 0);
          menuRolesClass.extractData(data.roles, this.rolesLst, 1);
          if (this.id != "0") {
            menuRolesClass.reorderModel(this.menuLst, this.rolesLst);
          }
        }
        else {
          this.readonly = true;
        }
      }
      this.viewMenu = true;
      dialogRef.close();
      
    }).catch( err => {
      dialogRef.close();
    });
  }

  showConfirmacion() {
    if (!this.newForm.valid) {
        for (var control in  this.newForm.controls) {
            if (this.riseError(control)) {
                break;
            }
        }
    }
    else  {
      let dialogRef = this.dialogsService.createView(ModalsaveComponent);
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
    if (this.newForm.controls[control].invalid) {
        this.snack.open("Debe ingresar un valor valido para el campo " + control , "Aceptar", { duration: 2000 });
        return true;
    }
    return false;
  }

  doUpdate() {
    var model;
    var path;
    if (this.id == '0') {
      model = this.CreateUpdateModel(fuuidv4());
      path = "api/Groups/New";
    }
    else {
      model = this.CreateUpdateModel(this.id);
      path = "api/Groups/Update";
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
      name : this.newForm.get('name').value,
      menu : [],
      roles : []
    };
    for (var x = 0; x < this.rolesLst.length; x++) {
      for (var y = 0; y < this.rolesLst[x].lst.length; y++) {
        if (this.rolesLst[x].lst[y].id != 0) {
          if (this.rolesLst[x].lst[y].typeRight != this.rolesLst[x].lst[y].typeOriginal) {
            model.roles.push( 
              {
                idrole : this.rolesLst[x].lst[y].id,
                typeright : this.rolesLst[x].lst[y].typeRight,
                isedit : this.rolesLst[x].lst[y].isEdit
              }
            );
          }
        }
      }
    }

    for (var x = 0; x < this.menuLst.length; x++) {
      for (var y = 0; y < this.menuLst[x].lst.length; y++) {
        if (this.menuLst[x].lst[y].id != 0) {
          if (this.menuLst[x].lst[y].isquery != this.menuLst[x].lst[y].isqueryOriginal ||
            this.menuLst[x].lst[y].isnew != this.menuLst[x].lst[y].isnewOriginal ||
            this.menuLst[x].lst[y].iseditField != this.menuLst[x].lst[y].iseditFieldOriginal ||
            this.menuLst[x].lst[y].isdelete != this.menuLst[x].lst[y].isdeleteOriginal) {
            model.menu.push( 
              {
                idmenu : this.menuLst[x].lst[y].id,
                isquery : this.menuLst[x].lst[y].isquery,
                isnew : this.menuLst[x].lst[y].isnew,
                iseditField : this.menuLst[x].lst[y].iseditField,
                isdelete : this.menuLst[x].lst[y].isdelete,
                isedit : this.menuLst[x].lst[y].isEdit
              }
            );
          }
        }
      }
    }
    
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
