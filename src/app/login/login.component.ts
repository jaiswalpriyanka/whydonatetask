import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ConstantService } from '../services/constant.service';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitForm!: FormGroup;
  submitted = false;

  email : string ="";
  password : string ="";
  show: boolean= false;
  validPattern:any;

  constructor(private formBuilder: FormBuilder,private router: Router, private tokenStorage: TokenStorageService,private apiSvc: ApiService, private apiCon: ConstantService, ) {
    this.validPattern = "^[a-z]$";
    this.submitForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[ Validators.required,Validators.minLength(6),Validators.maxLength(8)]]
      // password: [  '', [
      //   Validators.required,
      //   Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}') ]  ]
    });


  }
  get f1() { return this.submitForm.controls; }

  ngOnInit(): void {
  }

  login()
  {
    this.submitted = true;
    if (this.submitForm.invalid) { return; }

     this.apiSvc.userLogin(this.apiCon.APIConfig.LOGIN,this.submitForm.value).subscribe({
      next:(res) => {
        if (res.response == true) {
          let Name = res.data.first_name + " " + res.data.last_name
          this.tokenStorage.saveToken(res.data.accessToken);
          alert(res.message);
          this.router.navigateByUrl('/dashbord')
          // .then(() => {
          //   window.location.reload();
          //   });


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
