import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MonModule } from '../mon.module';
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { AtendimentosComponent } from './atendimentos/atendimentos.component';
import { PerformanceComponent } from './performance/performance.component';
import { LogDatasComponent } from './log-datas/log-datas.component';
import { RastreioComponent } from './rastreio/rastreio.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';

import { RelatorioRoutes } from './relatorio.routing';

import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { NgxChartsModule } from '@swimlane/ngx-charts';


import { MatChipsModule, MatFormFieldModule, MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule } from '@angular/material';
import { ArquivosQmComponent } from './arquivos-QM/arquivos-qm.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FluxoTranspComponent } from './fluxo-transp/fluxo-transp.component';
import { RelatorioAgComponent } from './relatorio-ag/relatorio-ag.component';
import { ReportNpsComponent } from './nps/report-nps.component';

// import { DatagridComponent } from './../componentes/datagrid/datagrid.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(RelatorioRoutes),
		MonModule,
		ReactiveFormsModule,
		FormsModule,
		NgbModule.forRoot(),
		LoadingModule.forRoot({
			animationType: ANIMATION_TYPES.threeBounce,
			backdropBackgroundColour: 'rgba(148, 147, 147, 0.7)',
			primaryColour: '#ffffff',
			secondaryColour: '#ffffff',
			tertiaryColour: '#ffffff'
		}),

		MatChipsModule,
		MatFormFieldModule,
		CKEditorModule,
		NgxChartsModule,

		// CHIPAO
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatIconModule,
		MatCardModule,
		CompBravoModule
	],
	declarations: [
		AtendimentosComponent,
		PerformanceComponent,
		LogDatasComponent,
		RastreioComponent,
		ArquivosQmComponent,
		TransferenciaComponent,
		FluxoTranspComponent,
		RelatorioAgComponent,
		ReportNpsComponent
	],
	providers: [
		UtilServices
	],
	exports: [
		// CHIPAO
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatCardModule
	]
})

export class RelatorioModule {}
