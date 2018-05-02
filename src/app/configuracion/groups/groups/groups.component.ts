import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { WebservicesService } from '../../../services/webservices.service';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { GroupsEditComponent } from '../groups-edit/groups-edit.component';
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @ViewChild(GroupsEditComponent)
  private editQueryChild: GroupsEditComponent;


  basicForm;

  title = "Búsqueda";

  filter = "";
  status = 1;
  resultLst = [];
 
  search = true;
  edit = false;
  viewFilter = false;

  id = '0';
  editQuery = 0;
 
  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService) { 
    
  }

  ngOnInit() {
    this.basicForm = this.fb.group ({
      filter: ["",[] ],
    });
  }

  doSearch() {
    this.resultLst = [];
    let dialogRef = this.dialog.open(ModalspinnerComponent,  {
      width: '250px',
      disableClose: true,
      panelClass: 'spinner-dialog'
      //data: { name: this.name, animal: this.animal }
    });
    var model = {
      filter : this.basicForm.get('filter').value,
      status : this.status
    }
    
    this.webservices.postMessage("api/Groups/SearchQuery", model)
    .then( data => {
      if (data.error == null ) {
        this.resultLst = data;
      }
      dialogRef.close();
    }).catch( err => {
      dialogRef.close();
    });
  }

  doNuevo() {
    this.id = '0';
    this.search = false;
    this.edit = true;
  }

  onSearch(model) {
    if (model.typeOperation == 0) {
      var tmpmodel = {
        id : model.id,
        name : model.name,
        status : 1
      }  
      this.resultLst.splice(0, 0, tmpmodel);
    }   
    else if (model.typeOperation == 1) {
      for (var x = 0; x < this.resultLst.length; x++) {
        var tmp = this.resultLst[x] as any;
        if (tmp.id == model.id) {
            this.resultLst[x].name = model.name;
        } 
      }  
    }
    this.edit = false;
    this.search = true;
  }

  onEditQuery(model) {
    this.id = model.id;
    this.editQuery = model.editQuery;
    this.search = false;
    this.edit = true;
  }

  onGoSearch(status) {
    this.onToggleFiltro();
    this.status = status;
    this.doSearch();
  }

  toggleFiltro() {
    this.search = false;
    this.viewFilter = true;
  }

  onToggleFiltro() {
    this.search = true;
    this.viewFilter = false;
  }

  doReport() {
    let doc = new jsPDF();
    doc.text(20,20,'Hello world');
    var img = new Image;
    img.onload = function() {
      doc.addImage(this, 30, 30, 5, 5);
      doc.save("test.pdf");
    };
    img.crossOrigin = "";  // for demo as we are at different origin than image
    img.src = "assets/icons/avatars.svg";  // some random imgur image
    
    //doc.save('Test.pdf');
  }
}
