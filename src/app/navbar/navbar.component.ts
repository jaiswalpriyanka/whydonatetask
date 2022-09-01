import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  token:any;
  constructor(private router: Router, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.token = this.tokenStorage.getToken();

  }
  Logout()
  {
    this.tokenStorage.signOutAdmin();
    this.router.navigateByUrl('/login');
  }

}
