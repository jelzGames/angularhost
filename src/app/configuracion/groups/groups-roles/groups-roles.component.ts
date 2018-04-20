import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-groups-roles',
  templateUrl: './groups-roles.component.html',
  styleUrls: ['./groups-roles.component.scss']
})
export class GroupsRolesComponent implements OnInit {
  @Input('rolesLst') resultLst: string;

  constructor() { }

  ngOnInit() {
  }

}
