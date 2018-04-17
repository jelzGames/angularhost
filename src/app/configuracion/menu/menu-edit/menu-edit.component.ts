import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { WebservicesService } from '../../../services/webservices.service';
import { CharacterLimit, fuuidv4 } from '../../../helpers/text-helpers';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { ModalsaveComponent } from '../../../shared/modalsave/modalsave.component';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit {
  newMenuForm;
  title = "Nuevo";
  readonly = true;
  typeOperation = 0;
  
  @Input('id') id: string;
  @Input('editQuery') editQuery: number;
  @Output() onSearch = new EventEmitter<any>();

  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService, private snack: MatSnackBar) { }

  ngOnInit() {
    this.newMenuForm = this.fb.group ({
      menu : new FormControl('', [ Validators.required, CharacterLimit('shortname', 256)  ] ),
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
    return this.newMenuForm.controls[control].invalid && this.newMenuForm.controls[control].touched;
  }

  getById() {
    let dialogRef = this.createSpinner();
    
    var model = {
        id : this.id,
    }
        
    this.webservices.postMessage("api/Configuration/MenuById", model)
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
      dialogRef.close();
      
    }).catch( err => {
      dialogRef.close();
    });
  }

  doNew() {
    let dialogRef = this.createSpinner();
    var path = "api/Configuration/MenuNew";
    var model = this.CreateUpdateModel(fuuidv4());
    this.runWebservices(path, model, dialogRef);
  }

  doUpdate() {
    let dialogRef = this.createSpinner();
    var path = "api/Configuration/MenuUpdate";
    var model = this.CreateUpdateModel(this.id);
    this.runWebservices(path, model, dialogRef);
  }

  CreateUpdateModel(id) {
    var model = {
      id : id,
      menu : this.newMenuForm.get('menu').value,
      descripcion : this.newMenuForm.get('descripcion').value
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
        this.snack.open("Registro ha sido gurdado con exito ", "Aceptar", { duration: 2000 });
        this.doConsulta(model.id);
      }
      dialogRef.close();
      
    }).catch( err => {
      dialogRef.close();
    });
  }

  riseError(control) {
    if (this.newMenuForm.controls[control].invalid) {
        this.snack.open("Debe ingresar un valor valido para el campo " + control , "Aceptar", { duration: 2000 });
        return true;
    }
    return false;
  }

  showConfirmacion() {
    if (!this.newMenuForm.valid) {
        for (var control in  this.newMenuForm.controls) {
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
        //data: { name: 'this.name', animal: 'this.animal' }
        data: { answer: true }
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
      menu : this.newMenuForm.get('menu').value,
      typeOperation : this.typeOperation
    }
    this.onSearch.emit(model);
  }
}
