import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';


@NgModule({
imports: [MatButtonModule,MatToolbarModule,MatCardModule,],
exports: [MatButtonModule,MatToolbarModule,MatCardModule,],

})

export  class  MyMaterialModule { }
