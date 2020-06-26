import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MonModule } from '../mon.module';

//  ###### COMPONENTES BRAVO
import { CompBravoModule } from './../shared/componentesbravo/src/app/comp-bravo.module';


import { VisualizacaoAgComponent } from './visualizacaoAg.component';
import { VisualizacaoAgRoutes } from './visualizacaoAg.routing';
import { NotasCargaComponent } from '../home/notas-carga/notas-carga.component';

import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';

import {
	MatButtonModule,
	MatMenuModule,
	MatToolbarModule,
	MatCardModule
  } from '@angular/material';

// import { DatagridComponent } from './../componentes/datagrid/datagrid.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(VisualizacaoAgRoutes),
		MonModule,
		ReactiveFormsModule,
		FormsModule,
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
		VisualizacaoAgComponent

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

export class VisualizacaoAgModule {}
