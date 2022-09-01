import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  token :any;

  constructor( private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.token = this.tokenStorage.getToken();


  }

}
