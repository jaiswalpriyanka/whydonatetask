import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ConstantService } from '../services/constant.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email : string ="";
  password : string ="";
  show: boolean= false;

  constructor(private router: Router, private tokenStorage: TokenStorageService,private apiSvc: ApiService, private apiCon: ConstantService, ) { }

  ngOnInit(): void {
  }

  login()
  {
     let values = {
      email : this.email,
      password : this.password
     }


     this.apiSvc.userLogin(this.apiCon.APIConfig.LOGIN,values).subscribe({
      next:(res) => {

        if (res.response == true) {
          let Name = res.data.first_name + " " + res.data.last_name
          this.tokenStorage.saveToken(res.data.accessToken);
          alert(res.message);
          this.router.navigate(['dashboard']);
          this.router.navigateByUrl('dashboard');


        } else {
          alert(res?.message?res.message:'Unknown Error');
          console.log(res?.message?res.message:'Unknown Error');
        }
      },
      error:(err) => {
        console.log('Please try after some time')
         }
        });



  }

  clear(){
    this.email ="";
    this.password = "";
    }

}
