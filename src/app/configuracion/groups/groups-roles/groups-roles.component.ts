import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-groups-roles',
  templateUrl: './groups-roles.component.html',
  styleUrls: ['./groups-roles.component.scss']
})
export class GroupsRolesComponent {
  @Input('rolesLst') resultLst: string;
  @Input('editQuery') editQuery: number;
  @Input('id') id: string;
  flagCursor = true;

  constructor() { 
  }

  ngOnInit() {
    if (this.id == "0" || this.editQuery == 1) {
      this.flagCursor = false;
    }
  }

  changeStatus(res, resLst) {
    if (!this.flagCursor) {
      if (res.typeRight == 0) {
        res.typeRight = 1;
      }
      else if (res.typeRight == 1) {
        res.typeRight = 2;
      }
      else {
        res.typeRight = 0;
      }
      if (res.name == "") {
        for (var x = 0; x < resLst.lst.length; x++) {
          resLst.lst[x].typeRight = res.typeRight;
        }
      }
      else {
        resLst.lst[0].typeRight = 0;
      }
    }
  }
}
