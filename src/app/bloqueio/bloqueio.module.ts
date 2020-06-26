import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MonModule } from '../mon.module';

import { BloqueioComponent } from './bloqueio.component';
import { BloqueioRoutes } from './bloqueio.routing';

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


	//  ###### COMPONENTES BRAVO
	import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';

// import { DatagridComponent } from './../componentes/datagrid/datagrid.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(BloqueioRoutes),
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
		BloqueioComponent,
	],
	providers: [
	],

	exports: [
		// CHIPAO
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatCardModule
	]
})

export class BloqueioModule {}
