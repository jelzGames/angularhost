import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DialogsDataService } from '../../../services/dialogs.data.service';

@Component({
  selector: 'app-usuarios-result',
  templateUrl: './usuarios-result.component.html',
  styleUrls: ['./usuarios-result.component.scss']
})
export class UsuariosResultComponent {
  @Input('resultLst') resultLst: any;
  @Output() onEditQuery = new EventEmitter<any>();
  @Input('status') status: number;
  
  isDelete = true;
  isUnLock = false;
  isLock = false;

  constructor(private dialogsService : DialogsDataService) { }

  edicionConsulta(idValue, typeValue, email) {
    var model = { 
      id : idValue, 
      editQuery : typeValue
    };
    if (typeValue == 2) {
      model["email"] = email;
    }
    
    this.onEditQuery.emit(model);
   
  }

  isGotoDelete() {
    console.log("aqui");
    this.isDelete = false;
    this.isLock = true;
  }

  delete(res) {
    this.lockUnlock(0, res);
  }

  lockUnlock(status, res) {
    var model = {
      id : res.id,
      status : status
    };
    
    this.dialogsService.runWebservices("api/Users/UpdateIsActive", model, 1)
    .then( data => {
      if (data == null) {
        for (var x = 0; x < this.resultLst.length; x++) {
          var tmp = this.resultLst[x] as any;
          if (tmp.id == model.id) {
            if (this.status != 2 && res.status != 2) {
              this.resultLst.splice(x, 1);
            } 
            else {
              if (model.status == 2) {
                model.status = 0;
              }
              this.resultLst[x].status = model.status;
              
  
            }  
            break;
          } 
        }
        if (res.needreload == 1) {
          res.isReloadOriginal = res.needreload;
          res.needreload = 0;
        }
        else  if (res.isReloadOriginal != undefined) {
            res.isReloadOriginal = undefined;
            res.needreload = 1;
        } 
        this.isLock = false;
        this.isUnLock = false;
        this.isDelete = true;
      }
    });
  }

  undo() {
    this.isDelete = true;
    this.isLock = false;
  }

  undoUnlock() {
    this.isDelete = true;
    this.isUnLock = false;
  }

  unlock(res) {
    if (!this.isUnLock) {
      this.isDelete = false;
      this.isUnLock = true;
    }
    else {
      this.lockUnlock(1, res)
    }
    
  }

}
