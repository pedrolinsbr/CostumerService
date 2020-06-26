
// ###### IMPORTS
import { BrowserModule                } from '@angular/platform-browser';
import { RouterModule                 } from '@angular/router';
import { NgModule, LOCALE_ID          } from '@angular/core';
import { FormBuilder, FormGroup,
         FormControl, Validators,
         ReactiveFormsModule,
         FormsModule                  } from '@angular/forms';
import { CommonModule,
         registerLocaleData           } from '@angular/common';
import { HttpClientModule,
         HttpClient                   } from '@angular/common/http';
import { HttpModule                   } from '@angular/http';
import { ToastrModule                 } from 'ngx-toastr';
import { TranslateModule,
         TranslateLoader              } from '@ngx-translate/core';
import { TranslateHttpLoader          } from '@ngx-translate/http-loader';
import { NgbModule                    } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule                } from 'ng-sidebar';
import { CustomFormsModule            } from 'ng2-validation'
import { BrowserAnimationsModule      } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS            } from '@angular/common/http';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SharedModule } from './shared/shared.module';
import { SatisfacaoLayoutComponent } from './layouts/satisfacao/satisfacao-layout.component';


import { SessionServices } from './services/session.services';

import { RecoveryComponent } from './account/recovery/recovery.component';
import { SignupComponent } from './account/signup/signup.component';

import { TextMaskModule } from 'angular2-text-mask';

//SERVICES
import { AdminLayoutService } from './services/admin-layout.service';
import { UtilServices } from './shared/componentesbravo/src/app/services/util.services';
import { ComboboxServices } from './shared/componentesbravo/src/app/services/combobox.services';
import { DeliverysService } from './shared/componentesbravo/src/app/services/crud/delivery.service';
import { GlobalsServices            } from './shared/componentesbravo/src/app/services/globals.services';
import { TipoVeiculosService        } from './shared/componentesbravo/src/app/services/crud/tipo-veiculos.service';
import { FornecedorService          } from './shared/componentesbravo/src/app/services/crud/fornecedor.service';
import { TransportadorasService     } from './shared/componentesbravo/src/app/services/crud/transportadoras.service';
import { VeiculoService             } from './shared/componentesbravo/src/app/services/crud/veiculo.service';
import { MotoristaService           } from './shared/componentesbravo/src/app/services/crud/motorista.service';
import { GrupoDeClientesService     } from './shared/componentesbravo/src/app/services/crud/grupo-de-clientes.service';
import { ClientesService            } from './shared/componentesbravo/src/app/services/crud/clientes.service';
import { MunicipiosService          } from './shared/componentesbravo/src/app/services/crud/municipios.service';
import { DeliverysNewService } from './shared/componentesbravo/src/app/services/crud/deliveryNew.service';
import { EstadosService } from './services/crud/estados.service';
import { AtendimentosService } from './services/crud/atendimentos.service';
import { DeliverysNfService } from './services/crud/deliverysNf.service';
import { TokenInterceptor } from './services/token.interceptor';
import { AcoesService } from './services/crud/acoes.service';
import { MotivosService } from './services/crud/motivos.service';
import { SacService } from './services/crud/sac.service';
import { SacDashboardService } from './services/crud/dashboard-sac.service';
import { DashboardService } from './services/crud/dashboard.service';
import { UsuarioGlobalService         } from './shared/componentesbravo/src/app/services/usuario-global.service';
import { EdiService } from './services/crud/edi.service';

import localePt from '@angular/common/locales/pt';
import { QRCodeModule } from 'angularx-qrcode';

registerLocaleData(localePt, 'pt-BR');

export function createTranslateLoader(http: HttpClient) {
	var URL_INT = localStorage.getItem('URL_INT');
	return new TranslateHttpLoader(http, URL_INT+'/locales/', '.json');
}

//  ###### COMPONENTES BRAVO
import { CompBravoModule } from './shared/componentesbravo/src/app/comp-bravo.module';


@NgModule({
	declarations: [
		AppComponent,
		AdminLayoutComponent,
		AuthLayoutComponent,
		RecoveryComponent,
		SignupComponent,
		SatisfacaoLayoutComponent
	],
	imports: [
		CommonModule,
		BrowserModule,
		ToastrModule.forRoot(),
		BrowserAnimationsModule,
		SharedModule,
		RouterModule.forRoot(AppRoutes, {useHash: true}),
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		TextMaskModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
		NgbModule.forRoot(),
		SidebarModule.forRoot(),
		HttpModule,
		CompBravoModule,
		QRCodeModule
	],
	providers: [
		HttpModule,
		GlobalsServices,
		UtilServices,
		ComboboxServices,
		AdminLayoutService,
		TipoVeiculosService,
		FornecedorService,
		TransportadorasService,
		VeiculoService,
		MotoristaService,
		GrupoDeClientesService,
		MunicipiosService,
		DeliverysNewService,
		ClientesService,
		HttpClientModule,
		EstadosService,
		AtendimentosService,
		DeliverysNfService,
		DeliverysService,
		SessionServices,
		AcoesService,
		MotivosService,
		EdiService,
		SacService,
		SacDashboardService,
		DashboardService,
    UsuarioGlobalService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		},
		{provide: LOCALE_ID, useValue: 'pt-BR'}
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
