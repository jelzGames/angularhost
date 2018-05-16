import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { WebservicesService } from '../../../services/webservices.service';
import { CharacterLimit, fuuidv4, CharacterMinumun } from '../../../helpers/text-helpers';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { ModalsaveComponent } from '../../../shared/modalsave/modalsave.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MenusRoles } from '../../../classes/menus.roles';

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
  typeOperation = 0;
  menuLst = [];
  rolesLst = [];
  interval;
 
  imageRaw;
  file = "";
 
  notMaching = "Contraseñas no coinciden";
  minimunPasswordLength = 6;

  isShowBtnPhoto = true;
 
  @Input('id') id: string;
  @Input('editQuery') editQuery: number;
  @Input('email') email: string;
  @Output() onSearch = new EventEmitter<any>();

  radios = 0;
  @ViewChild("labelPerfil", {read: ElementRef}) labelPerfil: ElementRef;
 
  goRadio(value) {
    this.radios = value;
  }
  
  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService, private snack: MatSnackBar,
    public _DomSanitizer: DomSanitizer) { }

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
    if (this.id == "0" || this.editQuery != 2) {
      this.labelPerfil.nativeElement.click();
    }
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
      dialogRef.close();
      
    }).catch( err => {
      dialogRef.close();
    });
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
      this.snack.open("Registro ha sido gurdado con exito ", "Aceptar", { duration: 2000 });
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
        if (result != 0) {
          if (result == 1) {
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
        }
        else {
          this.doConsulta(undefined);
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

 
}
