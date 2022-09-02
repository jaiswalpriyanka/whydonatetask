import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { ApiService } from '../services/api.service';
import { ConstantService } from '../services/constant.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  token :any;
  search : String ="";

  constructor( private tokenStorage: TokenStorageService,private apiSvc: ApiService, private apiCon: ConstantService,) { }

  ngOnInit(): void {
    this.token = this.tokenStorage.getToken();


  }


  searching()
  {
        debugger
       this.apiSvc.getServicenew(`http://www.omdbapi.com/?t=`+this.search+`&apikey=46d2f8c2`).subscribe({
        next:(res) => {
          console.log(res);
        },
        error:(err) => {
          console.log('Please try after some time')
           }
          });

  }

}
