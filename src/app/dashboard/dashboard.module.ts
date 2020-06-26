import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MonModule } from '../mon.module';
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';


import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { NgxEchartsModule } from 'ngx-echarts';
//import { Ng2Echarts } from 'ng2-echarts';


// import { DatagridComponent } from './../componentes/datagrid/datagrid.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(DashboardRoutes),
		MonModule,
		NgxEchartsModule,
		ReactiveFormsModule,
		FormsModule,
		CompBravoModule
		//Ng2Echarts
	],
	declarations: [
		DashboardComponent
	],
	providers: [
	]
})

export class DashboardModule {}
