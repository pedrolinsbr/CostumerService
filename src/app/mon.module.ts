//Components Angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JsonpModule } from '@angular/http';
import { HttpClient, HttpClientModule} from '@angular/common/http';

// Components de Terceiros
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragulaModule } from 'ng2-dragula';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { FileUploadModule } from 'ng2-file-upload';


// Components da aplicação
import { NovoAtendimentoComponent } from './home/novo-atendimento/novo-atendimento.component';
import { AtendimentoMovsComponent } from './home/atendimento-movs/atendimento-movs.component';
import { MovAtendimentoSingleComponent } from './home/mov-atendimento-single/mov-atendimento-single.component';
import { InfoNfeComponent } from './home/info-nfe/info-nfe.component';
import { MapaComponent } from './home/mapa/mapa.component';
import { InfoCteComponent } from './home/info-cte/info-cte.component';
import { InfoRastreioComponent } from './home/info-rastreio/info-rastreio.component';
import { InfoRastreioEmailComponent } from './home/info-rastreio-email/info-rastreio-email.component';
import { InfoRastreioDetalhadoComponent } from './home/info-rastreio-detalhado/info-rastreio-detalhado.component';
import { InfoCargaComponent } from './home/info-carga/info-carga.component';
import { EnvioRastreioComponent } from './home/envio-rastreio/envio-rastreio.component';
import { EnvioNpsComponent } from './home/envio-nps/envio-nps.component';
import { IndicadoresGroupComponent } from './home/indicadores-group/indicadores-group.component';
import { IndicadorSingleComponent } from './home/indicador-single/indicador-single.component';
import { InserirMotivoComponent } from './home/inserir-motivo/inserir-motivo.component';
import { InfoCteDetalhadoComponent } from './raio-x/info-cte-detalhado/info-cte-detalhado.component'

import { PipeModule } from './shared/componentesbravo/src/app/pipes/pipe.module';
import { MatChipsModule, MatFormFieldModule, MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule } from '@angular/material';
export function createTranslateLoader(http: HttpClient) {
  var URL_INT = localStorage.getItem('URL_INT');
  return new TranslateHttpLoader(http, URL_INT+'/locales/', '.json');
}
//  ###### COMPONENTES BRAVO
import { CompBravoModule } from './shared/componentesbravo/src/app/comp-bravo.module';
import { DacteComponent } from './home/docs-fiscais/dacte/dacte.component';
import { DanfeComponent } from './home/docs-fiscais/danfe/danfe.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
	imports: [
		CommonModule,
    JsonpModule,
    NgbModule.forRoot(),
    SidebarModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [
          HttpClient
        ]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgbModule,
    NgSelectModule,
    DragulaModule,
    NgxChartsModule,
    FileUploadModule,
    PipeModule.forRoot(),
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
		CompBravoModule,
		QRCodeModule
		// CHIPAO
	],
	declarations: [
		NovoAtendimentoComponent,
		InserirMotivoComponent,
		AtendimentoMovsComponent,
		MovAtendimentoSingleComponent,
		InfoNfeComponent,
		InfoCteComponent,
		InfoRastreioComponent,
		InfoRastreioEmailComponent,
		InfoRastreioDetalhadoComponent,
		InfoCargaComponent,
		MapaComponent,
		EnvioRastreioComponent,
		EnvioNpsComponent,
		IndicadoresGroupComponent,
		IndicadorSingleComponent,
		InfoCteDetalhadoComponent,
		DacteComponent,
		DanfeComponent
	],
	providers:[
	],
	exports:[
		NovoAtendimentoComponent,
		InserirMotivoComponent,
		AtendimentoMovsComponent,
		MovAtendimentoSingleComponent,
		InfoNfeComponent,
		InfoCteComponent,
		InfoRastreioComponent,
		InfoRastreioEmailComponent,
		InfoRastreioDetalhadoComponent,
		InfoCargaComponent,
		MapaComponent,
		EnvioRastreioComponent,
		EnvioNpsComponent,
		IndicadoresGroupComponent,
		IndicadorSingleComponent,
		InfoCteDetalhadoComponent,
		DacteComponent,
		DanfeComponent
	]
})

export class MonModule {}
