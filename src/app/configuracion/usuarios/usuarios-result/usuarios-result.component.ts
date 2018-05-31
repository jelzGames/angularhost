import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DialogsDataService } from '../../../services/dialogs.data.service';

@Component({
  selector: 'app-usuarios-result',
  templateUrl: './usuarios-result.component.html',
  styleUrls: ['./usuarios-result.component.scss']
})
export class UsuariosResultComponent {
  @Input('resultLst') resultLst: any;
  @Input('path') path: string; 
  @Output() onEditQuery = new EventEmitter<any>();
  @Input('status') status: number;
  
  isDelete = false;
  isUnLock = false;
  //isLock = false;

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
    this.isDelete = true;
    //this.isLock = false;
  }

  delete(res) {
    this.lockUnlock(0, res);
  }

  lockUnlock(status, res) {
    var model = {
      type : 0,
      isActive : {
        id : res.id,
        status : status
      }
    };
    
    this.dialogsService.runWebservices(this.path, model, 1)
    .then( data => {
      if (data == null) {
        for (var x = 0; x < this.resultLst.length; x++) {
          var tmp = this.resultLst[x] as any;
          if (tmp.id == model.isActive.id) {
            if (this.status != 2 && res.status != 2) {
              this.resultLst.splice(x, 1);
            } 
            else {
              if (model.isActive.status == 2) {
                model.isActive.status = 0;
              }
              this.resultLst[x].status = model.isActive.status;
              
  
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
        //this.isLock = false;
        this.isUnLock = false;
        this.isDelete = true;
      }
    });
  }

  undo() {
    this.isDelete = false;
    //this.isLock = true;
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
