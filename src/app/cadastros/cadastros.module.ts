import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JsonpModule } from '@angular/http';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { AlertComponent } from './alert/alert.component';
import { SelectModule } from 'ng2-select';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { CadastrosRoutes } from './cadastros.routing';
import { TextMaskModule } from 'angular2-text-mask';

import { AcoesComponent } from './acoes/acoes.component';
import {GruposEmail} from './grupos-email/grupos-email.component';


import { NgSelectModule } from '@ng-select/ng-select';
import { UtilServices } from '../services/util.services';
import { DragulaModule                    } from 'ng2-dragula';
//components

import { MonModule } from '../mon.module';
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';
//### MODULOS COMPONENTS



import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TelaClienteComponent } from './tela-cliente/tela-cliente.component';
import { TelaClientesContatosComponent } from './tela-clientes-contatos/tela-clientes-contatos.component';
import { DataCanhotoComponent } from './data-canhoto/data-canhoto.component';
import { EdiComponent } from './edi/edi.component';

export function createTranslateLoader(http: HttpClient) {
	var URL_INT = localStorage.getItem('URL_INT');
	return new TranslateHttpLoader(http, URL_INT+'/locales/', '.json');
}


@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(CadastrosRoutes),
		JsonpModule,
		NgbModule.forRoot(),
		SidebarModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
		FormsModule,
		ReactiveFormsModule,
		TextMaskModule,
		NgSelectModule,
		MonModule,
		CompBravoModule
	],
	declarations: [
		AlertComponent,
		AcoesComponent,
		TelaClienteComponent,
		TelaClientesContatosComponent,
		GruposEmail,
		DataCanhotoComponent,
		EdiComponent
	],
	providers:[
		AlertComponent,
		UtilServices
	],
	exports:[
		AlertComponent
	]
})

export class CadastrosModule {}
