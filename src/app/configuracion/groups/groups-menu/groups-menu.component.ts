import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-groups-menu',
  templateUrl: './groups-menu.component.html',
  styleUrls: ['./groups-menu.component.scss']
})
export class GroupsMenuComponent implements OnInit {
  @Input('menuLst') resultLst: string;
  @Input('editQuery') editQuery: number;

  constructor() { }

  ngOnInit() {
  }

  changeStatus(res, resLst) {
    if (this.editQuery == 0) {
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
