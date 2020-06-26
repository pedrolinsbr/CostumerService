import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';


import { MonModule } from '../mon.module';

import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';


import { SacRoutes } from './sac.routing';
import { BacklogComponent } from './backlog/backlog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAdmComponent } from './dashboardAdm/dashboard.component';
import { ControleComponent } from './controle/controle.component';
import { AtendentesListComponent } from './atendentes-list/atendentes-list.component';
import { AtendenteSingleComponent } from './atendente-single/atendente-single.component';
import { ClientesListComponent } from './clientes-list/clientes-list.component';
import { ClientesSingleComponent } from './clientes-single/clientes-single.component';
import { SituacaoGeralSacComponent } from './situacao-geral-sac/situacao-geral-sac.component';
import { MatChipsModule, MatFormFieldModule, MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule } from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(SacRoutes),
		MonModule,
		ReactiveFormsModule,
		FormsModule,
		NgbModule,
		NgxEchartsModule,
		LoadingModule.forRoot({
			animationType: ANIMATION_TYPES.threeBounce,
			backdropBackgroundColour: 'rgba(148, 147, 147, 0.7)',
			primaryColour: '#ffffff',
			secondaryColour: '#ffffff',
			tertiaryColour: '#ffffff'
		}),

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
	declarations: [
		BacklogComponent,
		DashboardComponent,
		DashboardAdmComponent,
		ControleComponent,
		AtendentesListComponent,
		AtendenteSingleComponent,
		ClientesListComponent,
		ClientesSingleComponent,
		SituacaoGeralSacComponent
	],
	providers: [
	],

	exports:[
		// CHIPAO
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatCardModule
	]
})

export class SacModule {}
