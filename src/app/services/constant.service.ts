import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environmenturl } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ConstantService {
  private APIBaseURL = environmenturl.apiURL;

  user = new BehaviorSubject<any>(null);

  constructor() {}

  public APIConfig = {
    LOGIN: this.APIBaseURL + 'login',
  };
}
