import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { WebservicesService } from '../../../services/webservices.service';
import { CharacterLimit, fuuidv4, CharacterMinumun } from '../../../helpers/text-helpers';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { ModalsaveComponent } from '../../../shared/modalsave/modalsave.component';
import { DomSanitizer } from '@angular/platform-browser';

const URL = '';

@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.component.html',
  styleUrls: ['./usuarios-edit.component.scss']
})
export class UsuariosEditComponent implements OnInit {
  
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

  imageRaw;
  file = "";
 
  notMaching = "Contraseñas no coinciden";
  minimunPasswordLength = 6;

  isShowBtnPhoto = true;
 
  @Input('id') id: string;
  @Input('editQuery') editQuery: number;
  @Input('email') email: string;
  @Output() onSearch = new EventEmitter<any>();

  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService, private snack: MatSnackBar,
    public _DomSanitizer: DomSanitizer,) { }

  ngOnInit() {
    if (this.id == "0") {
      this.newForm = this.fb.group ({
        email : new FormControl('', [ Validators.required, CharacterLimit(256), this.emailValid() ] ),
        firstname : new FormControl('', [ Validators.required, CharacterLimit(256)  ] ),
        lastname : new FormControl('', [ Validators.required, CharacterLimit(256)  ] ),
        direccion : new FormControl('', [ CharacterLimit(256)  ] ),
        colonia : new FormControl('', [ CharacterLimit(256)  ] ),
        ciudad : new FormControl('', [ CharacterLimit(256)  ] ),
        tel : new FormControl('', [ CharacterLimit(128)  ] ),
        password : new FormControl('', [ Validators.required, CharacterLimit(256), CharacterMinumun(this.minimunPasswordLength) ] ),
        retry : new FormControl('', [ Validators.required, CharacterLimit(256), CharacterMinumun(this.minimunPasswordLength) ] ),
      },{ validator: this.matchingPassword()});

      this.readonly = false;
    }
    else {
      if (this.editQuery == 2) {
        this.newForm = this.fb.group ({
          email : new FormControl('', [ Validators.required, CharacterLimit(256), this.emailValid() ] ),
          password : new FormControl('', [ Validators.required, CharacterLimit(256), CharacterMinumun(this.minimunPasswordLength) ] ),
          retry : new FormControl('', [ Validators.required, CharacterLimit(256), CharacterMinumun(this.minimunPasswordLength) ] ),
        },{ validator: this.matchingPassword()});
        this.newForm.controls['email'].setValue(this.email);
        this.newForm.controls['email'].disable();
        this.typeOperation = 3;
        this.title = "Cambiar contraseña"
      }
      else {
        this.newForm = this.fb.group ({
          email : new FormControl('', [ Validators.required, CharacterLimit(256), this.emailValid() ] ),
          firstname : new FormControl('', [ Validators.required, CharacterLimit(256)  ] ),
          lastname : new FormControl('', [ Validators.required, CharacterLimit(256)  ] ),
          direccion : new FormControl('', [ CharacterLimit(256)  ] ),
          colonia : new FormControl('', [ CharacterLimit(256)  ] ),
          ciudad : new FormControl('', [ CharacterLimit(256)  ] ),
          tel : new FormControl('', [ CharacterLimit(128)  ] ),
        });
        if (this.editQuery == 1) {
          this.title = "Editar";
          this.typeOperation = 1;
        }
        else {
          this.title = "Consulta";
          this.typeOperation = 2;
          this.isShowBtnPhoto = false;
        }

        this.interval = setInterval( () => { 
          clearInterval(this.interval);
          this.getById();
        });
      }
    }
    
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
        
    this.webservices.postMessage("api/Users/ById", model)
    .then( data => {
      if (data != null ) {
        if (data.email != undefined) {
          this.newForm.controls['email'].setValue(data.email);
          this.newForm.controls['firstname'].setValue(data.firstname);
          this.newForm.controls['lastname'].setValue(data.lastname);
          this.newForm.controls['direccion'].setValue(data.direccion);
          this.newForm.controls['colonia'].setValue(data.colonia);
          this.newForm.controls['ciudad'].setValue(data.ciudad);
          this.newForm.controls['tel'].setValue(data.tel);
          this.file = "data:image/jpeg;base64," + data.photo;
          
          if (this.editQuery == 0) {
            this.newForm.controls['email'].disable();
            this.newForm.controls['firstname'].disable();
            this.newForm.controls['lastname'].disable();
            this.newForm.controls['direccion'].disable();
            this.newForm.controls['colonia'].disable();
            this.newForm.controls['ciudad'].disable();
            this.newForm.controls['tel'].disable();
            this.readonly = true;
          }
          else { 
            this.readonly = false;
          }
         
          /*
          this.extractData(data.menu, this.menuLst, 0);
          this.extractData(data.roles, this.rolesLst, 1);
          if (this.id != "0") {
            this.reorderModel();
          }
          */
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
      id : "0",
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
    for (var x = 0; x < this.menuLst.length; x++) {
      var typer = this.menuLst[x].lst[2].isquery;
      var typen = this.menuLst[x].lst[2].isnew;
      var typee = this.menuLst[x].lst[2].iseditField;
      var typed = this.menuLst[x].lst[2].isdelete;
      for (var y = 3; y < this.menuLst[x].lst.length; y++) {
        var flagr = false;
        var flagn = false;
        var flage = false;
        var flagd = false;
        if (this.menuLst[x].lst[y].isquery != typer) {
          typer = 0;
          flagr = true;
        }
        if (this.menuLst[x].lst[y].isnew != typen) {
          typen = 0;
          flagn = true;
        }
        if (this.menuLst[x].lst[y].iseditField != typee) {
          typee = 0;
          flage = true;
        }
        if (this.menuLst[x].lst[y].isdelete != typed) {
          typed = 0;
          flagd = true;
        }
        if (flagr && flagn && flage && flagd) {
          break;
        }
      }
      this.menuLst[x].lst[1].isquery = typer;
      this.menuLst[x].lst[1].isnew = typen;
      this.menuLst[x].lst[1].iseditField = typee;
      this.menuLst[x].lst[1].isdelete = typed;
    }
  }

  doNew() {
    let dialogRef = this.createSpinner();
    var model = this.CreateUpdateModel("0");
    var path = "api/Users/New";
    this.runWebservices(path, model, dialogRef);
  }

  doChangePassword() {
    let dialogRef = this.createSpinner();
    var model = {
      id : this.id,
      password : this.newForm.get("password").value 
    }
    var path = "api/Users/ChangePassword";
    this.runWebservices(path, model, dialogRef);
  }

  doUpdate() {
    let dialogRef = this.createSpinner();
    var model = this.CreateUpdateModel(this.id);
    var path = "api/Users/Update";
    this.runWebservices(path, model, dialogRef);
  }

  CreateUpdateModel(id) {
    var model = {
      id : id,
      email : this.newForm.get("email").value,
      firstname : this.newForm.get("firstname").value,
      lastname : this.newForm.get("lastname").value,
      direccion : this.newForm.get("direccion").value,
      colonia : this.newForm.get("colonia").value,
      ciudad : this.newForm.get("ciudad").value,
      tel : this.newForm.get("tel").value,
      photo : this.file.replace(/data:image\/jpeg;base64,/g, '')
    };
    if (this.id == "0") {
      model["password"] = this.newForm.get("password").value;
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
      if (this.id == "0") {
        model.id = data.id;
      }
      this.doConsulta(model.id);
      dialogRef.close();
      
    }).catch( err => {
      dialogRef.close();
    });
  }

  matchingPassword() {
    return form => {
     if (form.controls["password"].value != form.controls["retry"].value) {
        return { notMatchingPassword : true}
      }
    }
  }

  emailValid() {
    return control => {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regex.test(control.value) ? null : { invalidEmail : true};
    }
  }

  riseError(control) {
    if (this.newForm.controls[control].invalid) {
      if (control == "email") {
         control = "correo";
      }
      else if (control == "password") {
        control = "contraseña, minimo " +  this.minimunPasswordLength + " caracteres";
      }
      else if (control == "retry") {
        control = "verifique contraseña, minimo " +  this.minimunPasswordLength + " caracteres";
      }
      else if (control == "firstname") {
        control = "nombre";
      }
      else if (control == "lastname") {
        control = "apellido";
      }
      this.snack.open("Debe ingresar un valor valido para el campo " + control , "Aceptar", { duration: 2000 });
      return true;
    }
    return false;
  }

  showConfirmacion() {
    if (!this.newForm.valid) {
      var flag = false;
      for (var control in  this.newForm.controls) {
          if (this.riseError(control)) {
              flag = true;
              break;
          }
      }
      if (!flag) {
        this.snack.open(this.notMaching , "Aceptar", { duration: 2000 });
      }
    }
    else {
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
          else if (this.editQuery == 2) {
            this.doChangePassword();
          }
          else {
            
            this.doUpdate();
          }
        }
        else {
          //this.doConsulta(undefined);
        }
      });

    }
  }

  doConsulta(id) {
    var model = {
      typeOperation : this.typeOperation
    }
    if (this.typeOperation != 3) 
    {
      if (id == undefined) {
        this.typeOperation = -1;
      }
      var name = this.newForm.get('firstname').value + " " + this.newForm.get('lastname').value;
      if (this.newForm.get('firstname').value == "" && this.newForm.get('firstname').value == "")  {
        name = this.newForm.get('email').value;
      }
      model["id"] = id;
      model["email"] = this.newForm.get('email').value;
      model["name"] = name;
      model["typeOperation"] = this.typeOperation;
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
 
  onFileSelected(e) {
    var reader = new FileReader();
    reader.onload = (event:any) => {
     this.file = event.target.result;
    }
    reader.readAsDataURL(e.srcElement.files[0]);
  }

}
