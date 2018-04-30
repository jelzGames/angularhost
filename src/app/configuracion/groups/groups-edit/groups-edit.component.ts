import { Component, OnInit, Input, Output, EventEmitter, group } from '@angular/core';
import { ModalsaveComponent } from '../../../shared/modalsave/modalsave.component';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { fuuidv4, CharacterLimit } from '../../../helpers/text-helpers';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { WebservicesService } from '../../../services/webservices.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';

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

  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService, private snack: MatSnackBar) { }

  ngOnInit() {
    this.newForm = this.fb.group ({
      name : new FormControl('', [ Validators.required, CharacterLimit('name', 256)  ] ),
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

  ngAfterViewInit(): void {
    /*
    if (this.id != "0") {
      setTimeout(()=>{   
        this.getById();
       },10);
    }
    */
  }

  isValid(control) {
    return this.newForm.controls[control].invalid && this.newForm.controls[control].touched;
  }

  getById() {
    let dialogRef = this.createSpinner();
    
    var model = {
        id : this.id,
    }
        
    this.webservices.postMessage("api/Groups/ById", model)
    .then( data => {
      if (data != null ) {
        if (data.name != undefined) {
          this.newForm.controls['name'].setValue(data.name);
          if (this.editQuery == 1) {
            this.newForm.controls['name'].disable();
            this.readonly = true;
          }
          else { 
            this.readonly = false;
          }
          
          this.extractData(data.menu, this.menuLst, 0);
          this.extractData(data.roles, this.rolesLst, 1);
          if (this.id != "0") {
            this.reorderModel();
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

  extractData(data, lstType, typeModel) {
    var count = 0;
    var model = this.createExtractModel("", count);
    if (data.length > 0) {
      var names = data[0].name.split("/");
      if (names.length > 1) {
        model.name = names[0]
        if (typeModel == 0) {
          this.pushExtractModel(model,this.createHeaderModel(typeModel, 0, 1), "", typeModel);
        }
        this.pushExtractModel(model,this.createHeaderModel(typeModel, 1, 0), "", typeModel);
      }
      for (var x = 0; x < data.length; x++) {
        var temp = data[x].name.split("/");
        if (x == (data.length -1) || temp[0] != names[0]) {
          names = temp;
          lstType.push(model);
          count++;
          model = this.createExtractModel( names[0], count);
          if (typeModel == 0) {
            this.pushExtractModel(model,this.createHeaderModel(typeModel, 0, 1), "", typeModel);
          }
          this.pushExtractModel(model, this.createHeaderModel(typeModel, 1, 0), "", typeModel);
          this.pushExtractModel(model, data[x], temp[1], typeModel);
        }
        else {
          if (temp.length > 1) {
            this.pushExtractModel(model, data[x], temp[1], typeModel);
          }
        }
      } 
      if (model.name != "") {
        if (typeModel == 1) {
          lstType[count-1].lst.push(model.lst[1]);
        }
        else {
          lstType[count-1].lst.push(model.lst[2]);
        }
      }
    }
  }

  createExtractModel(name, group) {
    var model = 
    {
      name : name,
      group : group,
      lst : []
    };
    return model;
  }

  createHeaderModel(typeModel, isEdit, header) {
    var temp = {
      id : 0,
      name : "",
      isEdit : isEdit
    };
    if (typeModel == 0) {
      temp['header'] = header;
      temp['isquery'] = 0;
      temp['isqueryOriginal'] = 0;
      temp['isnew'] = 0;
      temp['isnewdOriginal'] = 0;
      temp['iseditField'] = 0;
      temp['iseditFielddOriginal'] = 0;
      temp['isdelete'] = 0;
      temp['isdeleteOriginal'] = 0;
    }
    else {
      temp['typeRight'] = 0;
      temp['typeOriginal'] = 0;
    }
    return  temp;
  }

  pushExtractModel(model, data, name, typeModel) {
    var temp = {
      id : data.id,
      name : name,
      isEdit : data.isEdit
    };
    if (typeModel == 0) {
      if (data.header == undefined) {
        temp['header'] = 0;
      }
      else {
        temp['header'] = data.header;
      }
      temp['isquery'] = data.isquery;
      temp['isqueryOriginal'] = data.isquery;
      temp['isnew'] = data.isnew;
      temp['isnewdOriginal'] = data.isnew;
      temp['iseditField'] = data.iseditField;
      temp['iseditFielddOriginal'] = data.iseditField;
      temp['isdelete'] = data.isdelete;
      temp['isdeleteOriginal'] = data.isdelete;
    }
    else {
      temp['typeRight'] = data.typeRight;
      temp['typeOriginal'] = data.typeRight;
    }
    model.lst.push(temp);
  }

  reorderModel() {
    for (var x = 0; x < this.rolesLst.length; x++) {
      var type = this.rolesLst[x].lst[1].typeRight;
      for (var y = 2; y < this.rolesLst[x].lst.length; y++) {
        if (this.rolesLst[x].lst[y].typeRight != type) {
          type = 0;
          break;
        }
      }
      this.rolesLst[x].lst[0].typeRight = type;
    }
  }

  doNew() {
    let dialogRef = this.createSpinner();
    var model = this.CreateUpdateModel(fuuidv4());
    var path = "api/Groups/New";
    this.runWebservices(path, model, dialogRef);
  }

  doUpdate() {
    let dialogRef = this.createSpinner();
    var model = this.CreateUpdateModel(this.id);
    var path = "api/Groups/Update";
    this.runWebservices(path, model, dialogRef);
  }

  CreateUpdateModel(id) {
    var model = {
      id : id,
      name : this.newForm.get('name').value,
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
    if (this.newForm.controls[control].invalid) {
        this.snack.open("Debe ingresar un valor valido para el campo " + control , "Aceptar", { duration: 2000 });
        return true;
    }
    return false;
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
      name : this.newForm.get('name').value,
      typeOperation : this.typeOperation
    }
    this.onSearch.emit(model);
  }

  doNuevo() {
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
