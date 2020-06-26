import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MonModule } from '../mon.module';
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';

import { TransporteRoutes } from './transporte.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BacklogComponent } from './backlog/backlog.component';
import { NgxEchartsModule } from 'ngx-echarts';

import { MatChipsModule, MatFormFieldModule, MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule } from '@angular/material';

@NgModule({
  imports: [
  	CommonModule,
  	RouterModule.forChild(TransporteRoutes),
  	MonModule,
  	ReactiveFormsModule,
    NgxEchartsModule,

    MatChipsModule,
		MatFormFieldModule,

		// CHIPAO
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatIconModule,
		MatCardModule,
    CompBravoModule
  ],
  declarations: [DashboardComponent, BacklogComponent],
  providers: [],

  exports: [
		// CHIPAO
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatCardModule
	]

})

export class TransporteModule {}
