import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MonModule } from '../mon.module';

//  ###### COMPONENTES BRAVO
import { CompBravoModule } from './../shared/componentesbravo/src/app/comp-bravo.module';


import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';
import { NotasCargaComponent } from './notas-carga/notas-carga.component';

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

  import { FileUploadModule } from 'ng2-file-upload';

// import { DatagridComponent } from './../componentes/datagrid/datagrid.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(HomeRoutes),
		MonModule,
		ReactiveFormsModule,
		NgbModule.forRoot(),
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
		FileUploadModule,
		CompBravoModule
	],
	declarations: [
		HomeComponent,
		NotasCargaComponent

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

export class HomeModule {}
