import { Component, HostListener, OnInit, ViewChild, TemplateRef, DoCheck, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { GlobalsServices } from '../../services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { AtendimentosService } from '../../services/crud/atendimentos.service';
import { DeliverysNfService } from '../../services/crud/deliverysNf.service';
import { NotaFiscal } from '../../models/nota-fiscal.model';
import { ConhecimentoTransporte } from '../../models/conhecimento-transporte.model';
import { InformacoesCarga } from '../../models/informacoes-carga.model';
import { ValidaMilestone } from '../../models/valida-milestone.model';
import { InformacoesRastreio } from '../../models/informacoes-rastreio.model';
import { InformacoesTracking } from '../../models/tracking.model';
import { EnvioRastreio } from '../../models/envio-rastreio.model';
import { ToastrService } from 'ngx-toastr';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';


@Component({
	selector: 'app-relatorio-ag',
	templateUrl: './relatorio-ag.component.html',
	styleUrls: ['./relatorio-ag.component.css']
})

export class RelatorioAgComponent implements OnInit, DoCheck {

	token = localStorage.getItem('token');
	
    global = new GlobalsServices();
    
	// - Utilitário para funcionar o Breadcrumbs
	@ViewChild('breadcrumbs') breadcrumbs;
	@ViewChild('componenteEnvioRastreio') componenteEnvioRastreio;
	@ViewChild('componentRastreio') componentRastreio;
    @ViewChild('dgNotasFiscaisHome') dgNotasFiscaisHome:ElementRef;
    
    // - Controlador de Filtro Avançado ou Simplificado
	advancedFilter: boolean = true;

	// ##### Variáveis utilizadas nos Filtros
	 arIdCte = [];
     arIdNfe = [];
 
	 arIdCargaLog = [];
    // listCanhoto = [];

    arBreadcrumbsLocal = [];
    objFormFilter: FormGroup;
    objFormFilterAux: FormGroup;

	// - Utilitário para componente de datepicker
	data = new Date();
	dataMinima = [{ year: '', month: '', day: '' }];
	dataMaxima = [{ year: '', month: '', day: '' }];
	dtInicioDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1 }];
	dtTerminoDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate() }]
	dataInicio: any;
	horas = [];
	busca = '';
	mesSelecionado = '';
	anoSelecionado = '';
	diaDaSemana: any;
	dataClicou = [];
	diaSelecionado;

	dataHoje = new Date();
	dataColetaAux = null;
    snCheckColetado = 0;
    
    //Objetos
    objStyle = {
		'background': '#43295b',
		'color': '#ffffff',
		'iconColor': '#ffffff',
		'iconOpacity': '0.5'
    };
    
    objAux = {
		IdCte: { in: [] },
		idNfe: { in: [] },
		IdCargaLog: { in: [] },
		G024_IDG024: [],
		G043_IDG005RE: [],
		G043_IDG005DE: [],
		G051_IDG005CO: [],
		dataInicioAux: [],
		dataFimAux: [],
		G046_IDG024: [],
		G051_IDG005RE: [],
		G051_DTAGENDA: [],
		DTPREENT: [],
		G032_NRFROTA: [],
		G032_IDG032: []
	};

    url     = this.global.getApiHost();
    urlGrid = this.url+'mo/atendimentos/relatorioAg';
    ids001  = localStorage.getItem('ID_USER');

	constructor(
		private formBuilder: FormBuilder,
		private grid: DatagridComponent,
		private atendimentosService: AtendimentosService,
		private deliveryNfService: DeliverysNfService,
		private utilServices: UtilServices,
		private toastr: ToastrService,
		private adminLayoutService: AdminLayoutService,
		private modal: ModalComponent) {

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilter = formBuilder.group({
			NF: [],
			IDG043: [],
			IDG051: [],
			IDG046: [],
			IDG005RE: [],
			IDG005DE: [],
			IDG005_TRANSP: [],
			NRNOTA: [],
			NRCTE: [],
			DTINICIO: [],
			DTFIM: [],
			DESTINATARIO: [],
			G083_DTEMINOT: [],
			G083_NRNOTA: [],
			G051_IDG051: [],
			G051_CDCTRC: [],
			G046_IDG046: [],
			G043_IDG005RE: [],
			G043_IDG005DE: [],
			G024_IDG024: [],
			G051_TPTRANSP: [],
			G051_IDG005CO: [],
			G043_SNAG: [],
			G043_DTENTREG: [],
			G043_DTBLOQUE: [],
			G043_DTDESBLO: [],
			G051_CDCARGA: [],
			G051_STCTRC: [],
			A005_IDA001: [],
			A008_IDA008: [],
			G046_IDG024: [],
			G051_IDI015: [],
			//SNTRANSP: [],
			G051_IDG005RE: [],

			G043_IDG043: [],

			G051_DTAGENDA: [],
			DTPREENT: [],
			G032_NRFROTA: [],
			DTENTREG: [],
			G032_IDG032: [],
			G043_CDDELIVE: [],
			G043_DTLANCTO: []

		});

		this.objFormFilterAux = formBuilder.group({
			DTINICIO: [],
			DTFIM: [],
			G051_DTAGENDA: [],
			DTPREENT: [],
			G083_NRNOTA: [],
			G051_CDCTRC: [],
			G043_IDG005RE: [],
			G043_IDG005DE: [],
			G024_IDG024: [],
			G051_IDG005CO: [],
			G046_IDG046: [],
			G043_DTENTREG: [],
			G043_SNAG: [],
			G043_DTBLOQUE: [],
			G043_DTDESBLO: [],
			G051_CDCARGA: [],
			G051_STCTRC: [],
			A005_IDA001: [],
			A008_IDA008: [],
			G046_IDG024: [],
			G051_IDI015: [],
			//SNTRANSP: [],
			G051_IDG005RE: [],
			G032_NRFROTA: [],
			DTENTREG: [],
			G032_IDG032: [],
			DTENTREG0: [],
			DTENTREG1: [],
			G043_CDDELIVE: [],
			DTLANCT0: [],
			DTLANCT1: []
		});

	}

	ngOnInit() {


	}

	ngDoCheck() {
		
    }
    
    goHome(event = null){ //IR PARA TELA INICIAL
        this.arBreadcrumbsLocal = [];
    }

    clearNext(item){ //LIMPAR PROXIMOS PASSOS
        let ar = [];
        for(let itemFor of this.arBreadcrumbsLocal){
            ar.push(itemFor);
            if(item.id == itemFor.id){
                break;
            }
        }
        this.arBreadcrumbsLocal = ar;
    }

    dataClick(event) {
		if (event != null) {
			let dia = event.year + '-' + event.month + '-' + event.day;
			this.diaSelecionado = new Date(dia);
			this.dataClicou = event;
			this.anoSelecionado = event.year;
		}
    }

    dataC(event) {
		let thiscontext = '';
		if (event.day < 10) {
			thiscontext = "0" + event.day;
		} else {
			thiscontext = event.day;
		}
		if (event.month < 10) {
			thiscontext += "/0" + event.month;
		} else {
			thiscontext += "/" + event.month;
		}
		thiscontext += "/" + event.year;
		return thiscontext;
    }
    
    dataFormat(event) {

		const objStringMonth = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	
		let thiscontext = '';
		if(event.day < 10){
		  thiscontext = "0"+event.day;
		}else{
		  thiscontext = event.day;
		}
		thiscontext += "/"+objStringMonth[event.month-1];
	
		thiscontext += "/"+event.year;
		return thiscontext;
	}
    
    
	filtrar() {


		if ((this.objFormFilterAux.controls['G051_IDI015'].value != 2 && this.objFormFilterAux.controls['G051_IDI015'].value != null) && (this.objFormFilterAux.controls['G043_DTENTREG'].value == '' || this.objFormFilterAux.controls['G043_DTENTREG'].value == null)) {
			this.toastr.error('Coloque sim ou não em Notas Entregues');
		} else {

			this.objAux.IdCte = { in: [] };
			this.objAux.idNfe = { in: [] };
			this.objAux.G024_IDG024 = [];
			this.objAux.G051_IDG005CO = [];
			this.objAux.G043_IDG005DE = [];
			this.objAux.G043_IDG005RE = [];
			this.objAux.G051_IDG005RE = [];
			this.objAux.IdCargaLog = { in: [] };


			if ((this.objFormFilterAux.controls['DTLANCT0'].value != null) && (this.objFormFilterAux.controls['DTLANCT1'].value != null)) {
				this.objFormFilter.controls['G043_DTLANCTO'].setValue(
					[
						this.dataC(this.objFormFilterAux.controls['DTLANCT0'].value),
						this.dataC(this.objFormFilterAux.controls['DTLANCT1'].value)
					]
				);
			} else {
				this.objFormFilter.controls['G043_DTLANCTO'].setValue(null);
			}

			if (this.objFormFilterAux.controls['G032_NRFROTA'].value != null && this.objFormFilterAux.controls['G032_NRFROTA'].value.length > 0){
				this.objAux.G032_NRFROTA = this.objFormFilterAux.controls['G032_NRFROTA'].value;
				this.objFormFilter.controls['G032_NRFROTA'].setValue({ in: this.objFormFilterAux.controls['G032_NRFROTA'].value });
			} else {
				this.objFormFilter.controls['G032_NRFROTA'].setValue(null);
				this.objAux.G032_NRFROTA = null;
			}

			if (this.objFormFilterAux.controls['G032_IDG032'].value != null && this.objFormFilterAux.controls['G032_IDG032'].value.length > 0){
				this.objAux.G032_IDG032 = this.objFormFilterAux.controls['G032_IDG032'].value;
				this.objFormFilter.controls['G032_IDG032'].setValue({ in: this.objFormFilterAux.controls['G032_IDG032'].value });
			} else {
				this.objFormFilter.controls['G032_IDG032'].setValue(null);
				this.objAux.G032_IDG032 = null;
			}
			
			this.objAux.dataInicioAux[0] = this.objFormFilterAux.controls['DTLANCT0'].value;
			this.objAux.dataFimAux[0] = this.objFormFilterAux.controls['DTLANCT1'].value;
			this.objAux.G051_DTAGENDA[0] = this.objFormFilterAux.controls['G051_DTAGENDA'].value;
			this.objAux.DTPREENT[0] = this.objFormFilterAux.controls['DTPREENT'].value;

			//DATA AGENDADA
			if(this.objFormFilterAux.controls['G051_DTAGENDA'].value != null){
				this.objFormFilter.controls['G051_DTAGENDA'].setValue(this.dataFormat(this.objFormFilterAux.controls['G051_DTAGENDA'].value));
			}else{
				this.objFormFilter.controls['G051_DTAGENDA'].setValue(null);
			}

			//DATA PREVISTA
			if(this.objFormFilterAux.controls['DTPREENT'].value != null){
				let data = this.dataC(this.objFormFilterAux.controls['DTPREENT'].value);
				this.objFormFilter.controls['DTPREENT'].setValue(data);
			}else{
				this.objFormFilter.controls['DTPREENT'].setValue(null);
			}

			if (this.arIdNfe.length > 0) {
				for (let i of this.arIdNfe) {
					this.objAux.idNfe.in.push(i.name)
				}
				this.objFormFilter.controls['G083_NRNOTA'].setValue(this.objAux.idNfe);
			} else {
				this.objFormFilter.controls['G083_NRNOTA'].setValue(null);
			}

			if (this.arIdCte.length > 0) {
				for (let i of this.arIdCte) {
					this.objAux.IdCte.in.push(i.name)
				}
				this.objFormFilter.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
			} else {
				this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
			}

			if (this.arIdCargaLog.length > 0) {
				for (let i of this.arIdCargaLog) {
					this.objAux.IdCargaLog.in.push(i.name)
				}
				this.objFormFilter.controls['G051_CDCARGA'].setValue(this.objAux.IdCargaLog);
			} else {
				this.objFormFilter.controls['G051_CDCARGA'].setValue(null);
			}


			if (this.objFormFilterAux.controls['G043_IDG005RE'].value && this.objFormFilterAux.controls['G043_IDG005RE'].value.length != 0) {
				this.objAux.G043_IDG005RE = this.objFormFilterAux.controls['G043_IDG005RE'].value;
				this.objFormFilter.controls['G043_IDG005RE'].setValue({ in: this.objFormFilterAux.controls['G043_IDG005RE'].value });

			} else {
				this.objFormFilter.controls['G043_IDG005RE'].setValue(null);
				this.objAux.G043_IDG005RE = null;
			}

			if (this.objFormFilterAux.controls['G043_IDG005DE'].value && this.objFormFilterAux.controls['G043_IDG005DE'].value.length != 0) {
				this.objAux.G043_IDG005DE = this.objFormFilterAux.controls['G043_IDG005DE'].value;
				this.objFormFilter.controls['G043_IDG005DE'].setValue({ in: this.objFormFilterAux.controls['G043_IDG005DE'].value });
			} else {
				this.objFormFilter.controls['G043_IDG005DE'].setValue(null);
				this.objAux.G043_IDG005DE = null;
			}

			//Tabela G051 - > CTE (conhecimentos)
			if (this.objFormFilterAux.controls['G051_IDG005RE'].value && this.objFormFilterAux.controls['G051_IDG005RE'].value.length != 0) {
				this.objAux.G051_IDG005RE = this.objFormFilterAux.controls['G043_IDG005RE'].value;
				this.objFormFilter.controls['G051_IDG005RE'].setValue({ in: this.objFormFilterAux.controls['G051_IDG005RE'].value });

			} else {
				this.objFormFilter.controls['G051_IDG005RE'].setValue(null);
				this.objAux.G051_IDG005RE = null;
			}

			if (this.objFormFilterAux.controls['G046_IDG024'].value && this.objFormFilterAux.controls['G046_IDG024'].value.length != 0) {
				this.objAux.G046_IDG024 = this.objFormFilterAux.controls['G046_IDG024'].value;
				this.objFormFilter.controls['G046_IDG024'].setValue({ in: this.objFormFilterAux.controls['G046_IDG024'].value });

			} else {
				this.objFormFilter.controls['G046_IDG024'].setValue(null);
				this.objAux.G046_IDG024 = null;
			}

			if(this.objFormFilterAux.controls['G024_IDG024'].value && this.objFormFilterAux.controls['G024_IDG024'].value.length != 0){
				this.objAux.G024_IDG024 = this.objFormFilterAux.controls['G024_IDG024'].value;
				this.objFormFilter.controls['G024_IDG024'].setValue({in:this.objFormFilterAux.controls['G024_IDG024'].value});

			}else{
				this.objFormFilter.controls['G024_IDG024'].setValue(null);
				this.objAux.G024_IDG024 = null;
			}

			if(this.objFormFilterAux.controls['G046_IDG046'].value){
				this.objFormFilter.controls['G046_IDG046'].setValue(this.objFormFilterAux.controls['G046_IDG046'].value.text);
			} else {
				this.objFormFilter.controls['G046_IDG046'].setValue(null);
			}


			if(this.objFormFilterAux.controls['G051_STCTRC'].value ==  'A' || this.objFormFilterAux.controls['G051_STCTRC'].value ==  'C'){
				this.objFormFilter.controls['G051_STCTRC'].setValue(this.objFormFilterAux.controls['G051_STCTRC'].value);
			} else {
				this.objFormFilter.controls['G051_STCTRC'].setValue(null);
			}


			// if (this.objFormFilterAux.controls['G043_SNAG'].value == 0) {
			// 	this.objFormFilter.controls['G043_SNAG'].setValue({ 'null': true });
			// } else if (this.objFormFilterAux.controls['G043_SNAG'].value == 1) {
			// 	this.objFormFilter.controls['G043_SNAG'].setValue({ 'null': false });
			// } else if (this.objFormFilterAux.controls['G043_SNAG'].value == 2) {
			// 	this.objFormFilter.controls['G043_SNAG'].setValue('');
			// }

			if (this.objFormFilterAux.controls['G043_DTENTREG'].value == 0) {
				this.objFormFilter.controls['G043_DTENTREG'].setValue({ 'null': true });
			} else if (this.objFormFilterAux.controls['G043_DTENTREG'].value == 1) {
				this.objFormFilter.controls['G043_DTENTREG'].setValue({ 'null': false });
			} else {
				this.objFormFilter.controls['G043_DTENTREG'].setValue('');
			}

			if (this.objFormFilterAux.controls['G051_IDG005CO'].value && this.objFormFilterAux.controls['G051_IDG005CO'].value.length != 0) {
				this.objAux.G051_IDG005CO = this.objFormFilterAux.controls['G051_IDG005CO'].value;
				this.objFormFilter.controls['G051_IDG005CO'].setValue({ in: this.objFormFilterAux.controls['G051_IDG005CO'].value });
			} else {
				this.objFormFilter.controls['G051_IDG005CO'].setValue(null);
				this.objAux.G051_IDG005CO = null;
			}

			// if (this.objFormFilterAux.controls['G043_DTBLOQUE'].value == 0) {
			// 	this.objFormFilter.controls['G043_DTDESBLO'].setValue({ 'null': false });
			// 	this.objFormFilter.controls['G043_DTBLOQUE'].setValue({ 'null': false });
			// } else if (this.objFormFilterAux.controls['G043_DTBLOQUE'].value == 1) {
			// 	this.objFormFilter.controls['G043_DTBLOQUE'].setValue({ 'null': false });
			// 	this.objFormFilter.controls['G043_DTDESBLO'].setValue({ 'null': true });
			// } else if (this.objFormFilterAux.controls['G043_DTBLOQUE'].value == 2) {
			// 	this.objFormFilter.controls['G043_DTBLOQUE'].setValue('');
			// 	this.objFormFilter.controls['G043_DTDESBLO'].setValue('');
			// }

			// if (this.objFormFilterAux.controls['A008_IDA008'].value == 0) {
			// 	this.objFormFilter.controls['A008_IDA008'].setValue(null);
			// } else if (this.objFormFilterAux.controls['A008_IDA008'].value == 1) {
			// 	this.objFormFilter.controls['A008_IDA008'].setValue('1');
			// } else if (this.objFormFilterAux.controls['A008_IDA008'].value == 2) {
			// 	this.objFormFilter.controls['A008_IDA008'].setValue('2');
			// }

			// if (this.objFormFilterAux.controls['G051_IDI015'].value == 0) {
			// 	this.objFormFilter.controls['G051_IDI015'].setValue({ 'null': true });
			// } else if (this.objFormFilterAux.controls['G051_IDI015'].value == 1) {
			// 	this.objFormFilter.controls['G051_IDI015'].setValue({ 'null': false });
			// } else {
			// 	this.objFormFilter.controls['G051_IDI015'].setValue('');
			// }

			if ((this.objFormFilterAux.controls['DTENTREG0'].value != null && this.objFormFilterAux.controls['DTENTREG1'].value != null)) {
				this.objFormFilter.controls['DTENTREG'].setValue(
					[
						this.dataC(this.objFormFilterAux.controls['DTENTREG0'].value),
						this.dataC(this.objFormFilterAux.controls['DTENTREG1'].value)
					]
				);
			} else {
				this.objFormFilter.controls['DTENTREG'].setValue(null);
			}
			
			// if (this.objFormFilterAux.controls['SNTRANSP'].value == 1 || this.objFormFilterAux.controls['SNTRANSP'].value == null) {
			// 	this.objFormFilter.controls['SNTRANSP'].setValue('1');
			// } else {
			// 	this.objFormFilter.controls['SNTRANSP'].setValue('2');
			// }

			
			this.grid.findDataTable('dadosAg', 'objFormFilter');
			//this.filtrarIndicadores();
		}
	}


	limpar() {
		this.objFormFilterAux.reset();
		this.objFormFilter.reset();
		this.arIdCte.length = 0;
		this.arIdNfe.length = 0;
		//this.arIdCargaLog.length = 0;
		//this.grid.findDataTable('listarNotasFiscaisHome', 'objFormFilter');
	}

}