import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, observable, Observable, Observer, Subject, throwError } from 'rxjs';
import { ConstantService } from './constant.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  token = localStorage.getItem('AuthToken');

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': (this.token) ? this.token: "",
    })
  };


  constructor( private http: HttpClient,
    private constantSvc: ConstantService,
    private router: Router,
    public tokenS : TokenStorageService) { }


    getService(url: string): Observable<any> {
      var Atoken=localStorage.getItem('AuthToken');
      var httpOptionss = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization':Atoken!,
        })
      };
      return new Observable<any>((observer: Observer<any>) => {
        this.http.get(url , httpOptionss ).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          }, err => {
            if(err.status == 401){
              this.tokenS.signOutAdmin();
              this.router.navigate(['login']);
            }
            observer.next(err.error);
            observer.complete();
          }
        );
      });
    }

    postService(url: string, data: any): Observable<any> {
      console.log(url)
      // console.log(this.httpOptions)
      return new Observable<any>((observer: Observer<any>) => {
        this.http.post(url, data, this.httpOptions )
        .subscribe(
          res => {
            observer.next(res);
            observer.complete();
          }, err => {
            // console.log(err);
            observer.next(err);

            if(err.status == 401){
              this.tokenS.signOutAdmin()
              this.router.navigate(['login']);
            }
          },()=>{
            observer.complete();
          }
            // observer.next(err.error);
        );
      });
    }

    putService(url: string, data: any): Observable<any> {
      return new Observable<any>((observer: Observer<any>) => {
        this.http.put( url, data, this.httpOptions).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          }, err => {
            if(err.status == 401){
              this.tokenS.signOutAdmin();
              this.router.navigate(['login']);
            }
            observer.next(err.error);
            observer.complete();
          }
        );
      });
    }


    userLogin(url: any, data: any): Observable<any> {
      console.log(url,data)
      return new Observable<any>((observer: Observer<any>) => {
        this.http.post(url, data
          // ,{'headers':headers}
          ).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          }, err => {
            observer.next(err.error);
            observer.complete();
          }
        );
      });
    }

    getServicenew(url: string): Observable<any> {
      var Atoken=localStorage.getItem('AuthToken');
      var httpOptionss = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization':Atoken!,
        })
      };
      return new Observable<any>((observer: Observer<any>) => {
        this.http.get(url , httpOptionss ).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          }, err => {
            if(err.status == 401){
              this.tokenS.signOutAdmin();
              this.router.navigate(['login']);
            }
            observer.next(err.error);
            observer.complete();
          }
        );
      });
    }



}
