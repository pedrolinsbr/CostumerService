import { VirtualScrollComponent } from './../shared/componentesbravo/src/app/componentes/ng-select/virtual-scroll.component';
import { Component, HostListener, OnInit, ViewChild, TemplateRef, DoCheck, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
//import { GlobalsServices            } from '../shared/componentesbravo/src/app/services/globals.services';
import { GlobalsServices } from '../services/globals.services';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';

import { AtendimentosService } from '../services/crud/atendimentos.service';
import { DeliverysNfService } from '../services/crud/deliverysNf.service';
import { IndicadorHome } from '../models/indicador-home.model';
import { NotaFiscal } from '../models/nota-fiscal.model';
import { ConhecimentoTransporte } from '../models/conhecimento-transporte.model';
import { InformacoesCarga } from '../models/informacoes-carga.model';
import { ValidaMilestone } from '../models/valida-milestone.model';
import { InformacoesRastreio } from '../models/informacoes-rastreio.model';
import { InformacoesTracking } from '../models/tracking.model';
import { EnvioRastreio } from '../models/envio-rastreio.model';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { ToastrService } from 'ngx-toastr';

import { DOCUMENT } from '@angular/platform-browser';
import * as $ from 'jquery';
import { AdminLayoutService } from '../services/admin-layout.service';
import { ModalComponent } from '../shared/componentesbravo/src/app/componentes/modal/modal.component';
@Component({
	selector: 'app-visualizacaoAg',
	templateUrl: './visualizacaoAg.component.html',
	styleUrls: ['./visualizacaoAg.component.scss']
})

export class VisualizacaoAgComponent implements OnInit, DoCheck {

	token = localStorage.getItem('token');
	
	global = new GlobalsServices();
	// - Utilitário para funcionar o Breadcrumbs
	@ViewChild('breadcrumbs') breadcrumbs;

	@ViewChild('componenteEnvioRastreio') componenteEnvioRastreio;
	@ViewChild('componentRastreio') componentRastreio;
	@ViewChild('dgNotasFiscaisHome') dgNotasFiscaisHome:ElementRef;

	controllerFirstSearch: boolean = false;

	// ##### ARRAYS // OBJECTS
	arIdCte = [];
	arIdNfe = [];
	arIdCargaLog = [];
	listCanhoto = [];

	filterAux = 0;

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

	SNADMIN;
	auxGoHome = false;
	showCDUF = true;

	IDS001 = localStorage.getItem('ID_USER');

	selected1 = true;
	selected2 = true;
	selected3 = true;
	selected4 = true;
	selected5 = true;
	selected6 = true;
	selected7 = true;
	selected8 = true;

	entregTracking = false;

	validSyngenta: boolean = false;

	numNF = 0;

	fixedTop:Boolean = false;

	arCanhoto:number= 0;

	arrayBotoes = [];

	// - Formgroup que representa o filtro da Datagrid inicial da home
	objFormFilterHome: FormGroup;
	objFormFilterH: FormGroup;


	// - Formgroup para representar o formulário da NF-e
	objFormNotaFiscal: FormGroup;



	// - Objeto de Indicadores
	// indicadores: IndicadorHome[] = [];
	// - Objeto de Nota Fiscal Resumida
	nfeObj: NotaFiscal;
	cteObj: ConhecimentoTransporte;
	cargaObj: InformacoesCarga;
	rastreioObj: InformacoesRastreio;
	objValidaMilestone: ValidaMilestone = {
		SNHABCOL: 0
	};
	trackingObj: InformacoesTracking;
	envioRastreioObj: EnvioRastreio;

	// - Atendimento Selecionado para movimentação


	public loading = false;

	// - Nota Fiscal Selecionada
	IDG043_selecionada: number;
	IDG051_selecionada: number;
	IDG046_selecionada: number;
	IDG083_selecionada: number

	// - controle view da grid de atendimentos/ocorrências

	// viewControlGrid = true;
	// objAtendimento = [];

	// - Valor dos Indicadores da Home
	vlQtdAtendimentos: number = 0; // Quantidade de Atendimentos em Aberto
	vlQtdOcorrencias: number = 0; // Quantidade de Ocorrências em Aberto
	vlQtdEntregas: number = 0; // Quantidade de Entregas em Aberto
	vlQtdEntregasCTE: number = 0; // Quantidade de Entregas em Aberto por CTE
	vlPercSatisfacao: number = 0; // Percentual de Satisfação
	gridVazia = false;

	// - Controlador de Filtro Avançado ou Simplificado
	advancedFilter: boolean = true;

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

	// DATAS VIEW
	DTEMINOT: string = ''; // Data de Emissão da NFe
	DTEMICTR: string = ''; // Data de Emissão do CTe
	DTENTCON: string = ''; // Data de SLA
	DTPREENT: string = ''; // Data de Previsão de Entrega
	DTCOLETA: string = ''; // Data de Coleta
	DTAGENDA: string = ''; // Data Agendada
	DTCOMBIN: string = ''; // Data Combinada
	DTROTERI: string = ''; // Data de Roteirização
	DTENTREG: string = ''; // Data de Entrega
	DTCALDEP: string = ''; // Data de previsão de entrega corretiva
	DTENTPLA: string = ''; // Data de previsão de entrega
	// DTENTMOB: string = ''; // Data de entrega Mobile
	// DTCANHOT: string = ''; // Data do canhoto
	// DTENTRAS: string = ''; // Data do Rastreador

	//variaveis para controle de datas view
	previsao1: boolean = false;
	previsao2: boolean = false;
	previsao3: boolean = false;
	previsao4: boolean = false;
	previsao5: boolean = false;
	markEntrega: boolean = false;


	// - Valor responsável por informar em qual breadcrumbs nós estamos
	exibir = 1;
	// - Array que armazena os passos do Breadcrumbs
	arBreadcrumbsLocal = [];

	// - Home
	frame1 = true;
	// - Cadastro de Atendimento
	frame2 = false;
	// - Visualizar NFe
	frame3 = false;
	// - Visualizar CTe
	frame4 = false;


	url = this.global.getApiHost();

	constructor(
		private formBuilder: FormBuilder,
		private grid: DatagridComponent,
		private atendimentosService: AtendimentosService,
		private deliveryNfService: DeliverysNfService,
		private utilServices: UtilServices,
		private toastr: ToastrService,
		private adminLayoutService: AdminLayoutService,
		private modal: ModalComponent) {

		// - Carrega os Indicadores na página
		// this.indicadores.push(
		// 	{ desc: 'Atendimentos', value: this.vlQtdAtendimentos + '', color: 'green', icon: 'icon-basic-headset' },
		// 	{ desc: 'Ocorrências', value: this.vlQtdOcorrencias + '', color: 'red', icon: 'icon-basic-gear' },
		// 	{ desc: 'Entregas Realizadas', value: 'NFE: ' + this.vlQtdEntregas + '/' + 'CTE: ' + this.vlQtdEntregasCTE, color: 'teal', icon: 'icon-ecommerce-cart-check' },
		// 	{ desc: 'Satisfação', value: this.vlPercSatisfacao + '%', color: 'blue', icon: 'icon-ecommerce-graph-increase' }
		// );

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterHome = formBuilder.group({
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

		this.objFormFilterH = formBuilder.group({
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

	// - Função responsável por atualizar e montar os Indicadores
	filtrarIndicadores(): void {
		// - Montar Indicadores da Home
		if (!this.objFormFilterHome.controls['G043_DTLANCTO'].value && !this.controllerFirstSearch) {

			this.controllerFirstSearch = true;

			this.objFormFilterH.controls['DTLANCT0'].setValue(this.utilServices.getStringFromDateObj(this.dtInicioDefault));
			this.objFormFilterH.controls['DTLANCT1'].setValue(this.utilServices.getStringFromDateObj(this.dtTerminoDefault));
			
			this.objFormFilterH.controls['G051_DTAGENDA'].setValue(null);
			this.objFormFilterHome.controls['G051_DTAGENDA'].setValue(null);

			this.objFormFilterH.controls['DTPREENT'].setValue(null);
			this.objFormFilterHome.controls['DTPREENT'].setValue(null);


			this.objFormFilterHome.controls['G043_DTLANCTO'].setValue(
				[
					this.dataC(this.dtInicioDefault[0]),
					this.dataC(this.dtTerminoDefault[0])
				]
			);


			//this.objFormFilterHome.controls['SNTRANSP'].setValue('1');
		}


		// this.atendimentosService.getIndicadoresEmAbertoAg(this.objFormFilterHome.value).subscribe(
		// 	data => {
		// 		this.vlQtdAtendimentos = data[0].QTD_ATENDIMENTOS;
		// 		this.vlQtdOcorrencias = data[0].QTD_OCORRENCIAS;
		// 		this.vlQtdEntregas = data[0].QTD_ENTREGAS;
		// 		this.vlQtdEntregasCTE = data[0].QTD_ENTREGAS_CTE;
		// 		this.vlPercSatisfacao = parseFloat((data[0].SATISFACAO).toFixed(2));
		// 		this.refreshIndicadores();
		// 	},
		// 	err => {
		// 		this.toastr.error('Erro ao buscar estatísticas. ');
		// 	}
		// );
	}

	filtrarHome(): void {


		if ((this.objFormFilterH.controls['G051_IDI015'].value != 2 && this.objFormFilterH.controls['G051_IDI015'].value != null) && (this.objFormFilterH.controls['G043_DTENTREG'].value == '' || this.objFormFilterH.controls['G043_DTENTREG'].value == null)) {
			this.toastr.error('Coloque sim ou não em Notas Entregues');
		} else {
			this.filterAux = 1;

			this.objAux.IdCte = { in: [] };
			this.objAux.idNfe = { in: [] };
			this.objAux.G024_IDG024 = [];
			this.objAux.G051_IDG005CO = [];
			this.objAux.G043_IDG005DE = [];
			this.objAux.G043_IDG005RE = [];
			this.objAux.G051_IDG005RE = [];
			this.objAux.IdCargaLog = { in: [] };


			if ((this.objFormFilterH.controls['DTFIM'].value != null) && (this.objFormFilterH.controls['DTINICIO'].value != null)) {
				this.objFormFilterHome.controls['G083_DTEMINOT'].setValue(
					[
						this.dataC(this.objFormFilterH.controls['DTINICIO'].value),
						this.dataC(this.objFormFilterH.controls['DTFIM'].value)
					]
				);
			} else {
				this.objFormFilterHome.controls['G083_DTEMINOT'].setValue(null);
			}

			if ((this.objFormFilterH.controls['DTLANCT0'].value != null) && (this.objFormFilterH.controls['DTLANCT1'].value != null)) {
				this.objFormFilterHome.controls['G043_DTLANCTO'].setValue(
					[
						this.dataC(this.objFormFilterH.controls['DTLANCT0'].value),
						this.dataC(this.objFormFilterH.controls['DTLANCT1'].value)
					]
				);
			} else {
				this.objFormFilterHome.controls['G043_DTLANCTO'].setValue(null);
			}

			if (this.objFormFilterH.controls['G032_NRFROTA'].value != null && this.objFormFilterH.controls['G032_NRFROTA'].value.length > 0){
				this.objAux.G032_NRFROTA = this.objFormFilterH.controls['G032_NRFROTA'].value;
				this.objFormFilterHome.controls['G032_NRFROTA'].setValue({ in: this.objFormFilterH.controls['G032_NRFROTA'].value });
			} else {
				this.objFormFilterHome.controls['G032_NRFROTA'].setValue(null);
				this.objAux.G032_NRFROTA = null;
			}

			if (this.objFormFilterH.controls['G032_IDG032'].value != null && this.objFormFilterH.controls['G032_IDG032'].value.length > 0){
				this.objAux.G032_IDG032 = this.objFormFilterH.controls['G032_IDG032'].value;
				this.objFormFilterHome.controls['G032_IDG032'].setValue({ in: this.objFormFilterH.controls['G032_IDG032'].value });
			} else {
				this.objFormFilterHome.controls['G032_IDG032'].setValue(null);
				this.objAux.G032_IDG032 = null;
			}
			
			this.objAux.dataInicioAux[0] = this.objFormFilterH.controls['DTLANCT0'].value;
			this.objAux.dataFimAux[0] = this.objFormFilterH.controls['DTLANCT1'].value;
			this.objAux.G051_DTAGENDA[0] = this.objFormFilterH.controls['G051_DTAGENDA'].value;
			this.objAux.DTPREENT[0] = this.objFormFilterH.controls['DTPREENT'].value;

			//DATA AGENDADA
			if(this.objFormFilterH.controls['G051_DTAGENDA'].value != null){
				this.objFormFilterHome.controls['G051_DTAGENDA'].setValue(this.dataFormat(this.objFormFilterH.controls['G051_DTAGENDA'].value));
			}else{
				this.objFormFilterHome.controls['G051_DTAGENDA'].setValue(null);
			}

			//DATA PREVISTA
			if(this.objFormFilterH.controls['DTPREENT'].value != null){
				this.objFormFilterHome.controls['DTPREENT'].setValue(this.dataC(this.objFormFilterH.controls['DTPREENT'].value));
			}else{
				this.objFormFilterHome.controls['DTPREENT'].setValue(null);
			}

			if (this.arIdNfe.length > 0) {
				for (let i of this.arIdNfe) {
					this.objAux.idNfe.in.push(i.name)
				}
				this.objFormFilterHome.controls['G083_NRNOTA'].setValue(this.objAux.idNfe);
			} else {
				this.objFormFilterHome.controls['G083_NRNOTA'].setValue(null);
			}

			if (this.arIdCte.length > 0) {
				for (let i of this.arIdCte) {
					this.objAux.IdCte.in.push(i.name)
				}
				this.objFormFilterHome.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
			} else {
				this.objFormFilterHome.controls['G051_CDCTRC'].setValue(null);
			}

			if (this.arIdCargaLog.length > 0) {
				for (let i of this.arIdCargaLog) {
					this.objAux.IdCargaLog.in.push(i.name)
				}
				this.objFormFilterHome.controls['G051_CDCARGA'].setValue(this.objAux.IdCargaLog);
			} else {
				this.objFormFilterHome.controls['G051_CDCARGA'].setValue(null);
			}


			if (this.objFormFilterH.controls['G043_IDG005RE'].value && this.objFormFilterH.controls['G043_IDG005RE'].value.length != 0) {
				this.objAux.G043_IDG005RE = this.objFormFilterH.controls['G043_IDG005RE'].value;
				this.objFormFilterHome.controls['G043_IDG005RE'].setValue({ in: this.objFormFilterH.controls['G043_IDG005RE'].value });

			} else {
				this.objFormFilterHome.controls['G043_IDG005RE'].setValue(null);
				this.objAux.G043_IDG005RE = null;
			}

			if (this.objFormFilterH.controls['G043_IDG005DE'].value && this.objFormFilterH.controls['G043_IDG005DE'].value.length != 0) {
				this.objAux.G043_IDG005DE = this.objFormFilterH.controls['G043_IDG005DE'].value;
				this.objFormFilterHome.controls['G043_IDG005DE'].setValue({ in: this.objFormFilterH.controls['G043_IDG005DE'].value });
			} else {
				this.objFormFilterHome.controls['G043_IDG005DE'].setValue(null);
				this.objAux.G043_IDG005DE = null;
			}

			//Tabela G051 - > CTE (conhecimentos)
			if (this.objFormFilterH.controls['G051_IDG005RE'].value && this.objFormFilterH.controls['G051_IDG005RE'].value.length != 0) {
				this.objAux.G051_IDG005RE = this.objFormFilterH.controls['G043_IDG005RE'].value;
				this.objFormFilterHome.controls['G051_IDG005RE'].setValue({ in: this.objFormFilterH.controls['G051_IDG005RE'].value });

			} else {
				this.objFormFilterHome.controls['G051_IDG005RE'].setValue(null);
				this.objAux.G051_IDG005RE = null;
			}

			if (this.objFormFilterH.controls['G046_IDG024'].value && this.objFormFilterH.controls['G046_IDG024'].value.length != 0) {
				this.objAux.G046_IDG024 = this.objFormFilterH.controls['G046_IDG024'].value;
				this.objFormFilterHome.controls['G046_IDG024'].setValue({ in: this.objFormFilterH.controls['G046_IDG024'].value });

			} else {
				this.objFormFilterHome.controls['G046_IDG024'].setValue(null);
				this.objAux.G046_IDG024 = null;
			}

			if(this.objFormFilterH.controls['G024_IDG024'].value && this.objFormFilterH.controls['G024_IDG024'].value.length != 0){
				this.objAux.G024_IDG024 = this.objFormFilterH.controls['G024_IDG024'].value;
				this.objFormFilterHome.controls['G024_IDG024'].setValue({in:this.objFormFilterH.controls['G024_IDG024'].value});

			}else{
				this.objFormFilterHome.controls['G024_IDG024'].setValue(null);
				this.objAux.G024_IDG024 = null;
			}

			if(this.objFormFilterH.controls['G046_IDG046'].value){
				this.objFormFilterHome.controls['G046_IDG046'].setValue(this.objFormFilterH.controls['G046_IDG046'].value.text);
			} else {
				this.objFormFilterHome.controls['G046_IDG046'].setValue(null);
			}


			if(this.objFormFilterH.controls['G051_STCTRC'].value ==  'A' || this.objFormFilterH.controls['G051_STCTRC'].value ==  'C'){
				this.objFormFilterHome.controls['G051_STCTRC'].setValue(this.objFormFilterH.controls['G051_STCTRC'].value);
			} else {
				this.objFormFilterHome.controls['G051_STCTRC'].setValue(null);
			}


			if (this.objFormFilterH.controls['G043_SNAG'].value == 0) {
				this.objFormFilterHome.controls['G043_SNAG'].setValue({ 'null': true });
			} else if (this.objFormFilterH.controls['G043_SNAG'].value == 1) {
				this.objFormFilterHome.controls['G043_SNAG'].setValue({ 'null': false });
			} else if (this.objFormFilterH.controls['G043_SNAG'].value == 2) {
				this.objFormFilterHome.controls['G043_SNAG'].setValue('');
			}

			if (this.objFormFilterH.controls['G043_DTENTREG'].value == 0) {
				this.objFormFilterHome.controls['G043_DTENTREG'].setValue({ 'null': true });
			} else if (this.objFormFilterH.controls['G043_DTENTREG'].value == 1) {
				this.objFormFilterHome.controls['G043_DTENTREG'].setValue({ 'null': false });
			} else {
				this.objFormFilterHome.controls['G043_DTENTREG'].setValue('');
			}

			if (this.objFormFilterH.controls['G051_IDG005CO'].value && this.objFormFilterH.controls['G051_IDG005CO'].value.length != 0) {
				this.objAux.G051_IDG005CO = this.objFormFilterH.controls['G051_IDG005CO'].value;
				this.objFormFilterHome.controls['G051_IDG005CO'].setValue({ in: this.objFormFilterH.controls['G051_IDG005CO'].value });
			} else {
				this.objFormFilterHome.controls['G051_IDG005CO'].setValue(null);
				this.objAux.G051_IDG005CO = null;
			}

			if (this.objFormFilterH.controls['G043_DTBLOQUE'].value == 0) {
				this.objFormFilterHome.controls['G043_DTDESBLO'].setValue({ 'null': false });
				this.objFormFilterHome.controls['G043_DTBLOQUE'].setValue({ 'null': false });
			} else if (this.objFormFilterH.controls['G043_DTBLOQUE'].value == 1) {
				this.objFormFilterHome.controls['G043_DTBLOQUE'].setValue({ 'null': false });
				this.objFormFilterHome.controls['G043_DTDESBLO'].setValue({ 'null': true });
			} else if (this.objFormFilterH.controls['G043_DTBLOQUE'].value == 2) {
				this.objFormFilterHome.controls['G043_DTBLOQUE'].setValue('');
				this.objFormFilterHome.controls['G043_DTDESBLO'].setValue('');
			}

			if (this.objFormFilterH.controls['A008_IDA008'].value == 0) {
				this.objFormFilterHome.controls['A008_IDA008'].setValue(null);
			} else if (this.objFormFilterH.controls['A008_IDA008'].value == 1) {
				this.objFormFilterHome.controls['A008_IDA008'].setValue('1');
			} else if (this.objFormFilterH.controls['A008_IDA008'].value == 2) {
				this.objFormFilterHome.controls['A008_IDA008'].setValue('2');
			}

			if (this.objFormFilterH.controls['G051_IDI015'].value == 0) {
				this.objFormFilterHome.controls['G051_IDI015'].setValue({ 'null': true });
			} else if (this.objFormFilterH.controls['G051_IDI015'].value == 1) {
				this.objFormFilterHome.controls['G051_IDI015'].setValue({ 'null': false });
			} else {
				this.objFormFilterHome.controls['G051_IDI015'].setValue('');
			}

			if ((this.objFormFilterH.controls['DTENTREG0'].value != null && this.objFormFilterH.controls['DTENTREG1'].value != null)) {
				this.objFormFilterHome.controls['DTENTREG'].setValue(
					[
						this.dataC(this.objFormFilterH.controls['DTENTREG0'].value),
						this.dataC(this.objFormFilterH.controls['DTENTREG1'].value)
					]
				);
			} else {
				this.objFormFilterHome.controls['DTENTREG'].setValue(null);
			}
			
			// if (this.objFormFilterH.controls['SNTRANSP'].value == 1 || this.objFormFilterH.controls['SNTRANSP'].value == null) {
			// 	this.objFormFilterHome.controls['SNTRANSP'].setValue('1');
			// } else {
			// 	this.objFormFilterHome.controls['SNTRANSP'].setValue('2');
			// }

			
			this.grid.findDataTable('listarNotasViewAG', 'objFormFilterHome');
			//this.filtrarIndicadores();
		}
	}


	limparHome() {
		this.objFormFilterH.reset();
		this.objFormFilterHome.reset();
		this.arIdCte.length = 0;
		this.arIdNfe.length = 0;
		this.arIdCargaLog.length = 0;
		//this.grid.findDataTable('listarNotasViewAG', 'objFormFilterHome');
	}

	pFiltroIndicadores() {
		this.grid.findDataTable('listarNotasViewAG', 'objFormFilterHome');
	}

	// - Função para atualizar os valores do Indicador
	// refreshIndicadores(): void {
	// 	this.indicadores = [];
	// 	this.indicadores.push(
	// 		{
	// 			desc: 'Atendimentos',
	// 			value: this.vlQtdAtendimentos + '',
	// 			color: 'green',
	// 			icon: 'icon-basic-headset'
	// 		},
	// 		{ desc: 'Ocorrências', value: this.vlQtdOcorrencias + '', color: 'red', icon: 'icon-basic-gear' },
	// 		{ desc: 'Entregas Realizadas', value: 'NFE: ' + this.vlQtdEntregas + '/' + 'CTE: ' + this.vlQtdEntregasCTE, color: 'teal', icon: 'icon-ecommerce-cart-check' },
	// 		{ desc: 'Satisfação', value: this.vlPercSatisfacao + '%', color: 'blue', icon: 'icon-ecommerce-graph-increase' }
	// 	);
	// }


	// - Função para carregar informações da Nota Fiscal
	loadInformacoesNotaFiscal(objReq): void {
		this.loading = true;

		this.deliveryNfService.getInformacoesNotaFiscal(objReq).subscribe(
			data => {
				console.log(data);
				// Validação do milestone mostrar coletado apenas quando a data de coleta
				// for igual ou maior que a data de hoje
				let dtColAux = null;
				let dtColAux2 = null;
				let dtColAux3 = null;
				let timerCole = null;
				let timerHoje = null;
				let dtHojeAux2 = null;
				let dtHojeAux = this.dataHoje.toLocaleDateString("pt-BR");
				let dtHojeAux3 = dtHojeAux.split('/');
				//sempre que cvhamar detalhe da nota, seta como 0 para não ficar dados de outras consultas
				this.objValidaMilestone = {
					SNHABCOL: 0
				};

				if (data.RASTREAMENTO_AG.DTCOLETA != null && data.RASTREAMENTO_AG.DTCOLETA != '') {
					//trata data da coleta vinda do banco
					dtColAux =  data.RASTREAMENTO_AG.DTCOLETA.split("-").reverse().join("/");
					dtColAux3 = dtColAux.split('/');
					dtColAux2 = new Date(Number(dtColAux3[2]), Number(dtColAux3[1]), Number(dtColAux3[0]));
					timerCole = dtColAux2.getTime();
					//trata data "Hoje"
					dtHojeAux2 = new Date(Number(dtHojeAux3[2]), Number(dtHojeAux3[1]), Number(dtHojeAux3[0]));
					timerHoje = dtHojeAux2.getTime();
					//compara as duas datas
					if (timerHoje >= timerCole) {
						//flag para deixar como completo o milestone da data de coleta
						this.objValidaMilestone = {
							SNHABCOL: 1
						};
					}
				}

				if (data.CTE != null) {
					if (data.CTE.length > 0) {
						for (let i = 0; i < data.CTE.NOTAS_CTE.length; i++) {
						
							if (data.CTE.NOTAS_CTE[i].IDG005RE != null || data.CTE.NOTAS_CTE[i].IDG005DE != null) {
								data.CTE.NOTAS_CTE[i].NRCHADOC = '';
							}
						}
					}
				}

				this.nfeObj = data.NFE_AG;
				this.cteObj = data.CTE;
				this.cargaObj = data.CARGA;
				this.rastreioObj = data.RASTREAMENTO_AG;
				this.trackingObj = data.TRACKING;
				this.envioRastreioObj = data.EMAIL;
				//this.loading = false;
				this.numNF = data.NFE_AG.NRNOTA;

	

				if (data.RASTREAMENTO_AG != null && data.RASTREAMENTO_AG.DTENTREG) {
					this.entregTracking = true;
				} else {
					this.entregTracking = false;
				}
				

				if (data.EMAIL != null && data.EMAIL.IDG014 == 5) {
					this.validSyngenta = true;
				} else {
					this.validSyngenta = false;
				}


				this.deliveryNfService.getDatasToAtendimentoAg({IDG083: this.IDG083_selecionada, IDG043: this.IDG043_selecionada}).subscribe(
					data => {
						
						this.DTEMINOT = data.DTEMINOT;
						this.DTEMICTR = data.DTEMICTR;
						this.DTENTCON = data.DTENTCON;
		
						this.DTCOLETA = data.DTCOLETA;
						this.DTENTREG = data.DTENTREG;
						this.DTENTPLA = data.DTENTPLA;
						this.DTPREENT = data.DTPREENT;
						this.DTAGENDA = data.DTAGENDA;
						this.DTCOMBIN = data.DTCOMBIN;
						this.DTROTERI = data.DTROTERI;
						this.DTCALDEP = data.DTCALDEP;
						// this.DTENTMOB = data.DTENTMOB;
						// this.DTCANHOT = data.DTCANHOT;
						// this.DTENTRAS = data.DTENTRAS;
						this.loading = false;
		
					},
					err => {
						this.toastr.error('Erro ao buscar informações das datas.');
					}
				);

			},
			err => {
				this.toastr.error('Erro ao buscar informações.');
			}
		);

			

		let objParam = {
			NMTABELA: 'G043',
			PKS007: this.IDG043_selecionada,
			TPDOCUME: 'CTO'
		}

		this.deliveryNfService.visualizarCanhoto(objParam).subscribe(
			data => {

				this.listCanhoto = data;

				if(this.listCanhoto.length >= 1){
					this.arCanhoto = this.listCanhoto.length ;
				}else{
					this.arCanhoto = 0;
				}

			}, err => {
				this.toastr.error('Erro ao buscar informações.');
			}
		);
		
	}

	compartilharRastreio(event): void {
		console.log(event);
		if (typeof event === 'object') {
			if (event.DSEMAIL != '' && event.IDG043 != '' && event.IDG005 != '') {

				this.utilServices.loadGridShow();

				this.deliveryNfService.isValidSendRastreio(event).subscribe(
					data => {
						console.log("adasdsadas ", data);
						if (data.VALIDO > 0 && data.VALIDO < 72) {
						
							this.deliveryNfService.sendRastreio(event).subscribe(
								data => {
									this.componenteEnvioRastreio.closeModalConfirmaEnvio();
									this.toastr.success('Enviado com sucesso!');
									this.utilServices.loadGridHide();
								}, err => {
									this.toastr.error('Não foi possível enviar o rastreio.');
									this.utilServices.loadGridHide();
								}
							);
						
						} else {
							this.toastr.error('Esta nota não permite envio do rastreio.');
							this.utilServices.loadGridHide();
						}
					}, err => {
						this.toastr.error('Não foi possível encaminhar o rastreio');
						this.utilServices.loadGridHide();
					}
				);
			} else {
				this.toastr.error('Não foi possível encaminhar o rastreio');
			}
		} else {
			this.toastr.error('Não foi possível encaminhar o rastreio');
		}
	}

	ngOnInit() {

		// - Chamar função de atualizar indicadores.
		this.filtrarIndicadores();

	}

	ngDoCheck() {
		if (this.adminLayoutService.exibir == true) {
			this.exibir = 1;
			this.arBreadcrumbsLocal = [];
			this.adminLayoutService.exibir = false;
		
		}

	
		
	}

	// - Função que seta novos passos no breadcrumbs
	set(id, name, functionName, parameter, icon) {
		let valid = true;
		let data = {
			id: id,
			name: name,
			function: functionName,
			parameter: parameter,
			icon: icon
		}

		for (let item of this.arBreadcrumbsLocal) {
			if (item.id == data.id || item.name == name) {
				valid = false;
			}
		}

		if (valid) {
			this.arBreadcrumbsLocal.push(data);
		}
	}

	// - Função que volta para a primeira posição do Breadcrumbs
	goHome(event) {
		this.cancelarCadastro();
	}

	dataClick(event) {
		if (event != null) {
			let dia = event.year + '-' + event.month + '-' + event.day;
			this.diaSelecionado = new Date(dia);
			this.dataClicou = event;
			this.anoSelecionado = event.year;
		}
	}

	// - Função que volta para o primeiro indice do Breadcrumbs
	cancelarCadastro() {
		this.arBreadcrumbsLocal = [];
		this.exibir = 1;

		this.guardFilter();

		return false;
	}

	// - Limpar novos passos do breadcrumbs
	clearNext(item) {
		let ar = [];
		for (let itemFor of this.arBreadcrumbsLocal) {
			ar.push(itemFor);
			if (item.id == itemFor.id) {
				break;
			}
		}
		this.arBreadcrumbsLocal = ar
	}

	// - Método responsável para redirecionar
	visualizarNota(IDG083): void {
		let userObj = JSON.parse(localStorage.getItem('user'));
		this.SNADMIN = userObj.SNADMIN;

		this.gridVazia = false;

		let objNotas = JSON.parse(IDG083);
		console.log(objNotas);
		
		this.IDG043_selecionada = objNotas.IDG043;
		this.IDG051_selecionada = objNotas.IDG051;
		this.IDG046_selecionada = objNotas.G046_IDG046;
		this.IDG083_selecionada = objNotas.IDG083;



		let controllerView =
		{
			'IDG043': this.IDG043_selecionada,
			'IDG051': this.IDG051_selecionada,
			'NFE': false,
			'IT_NFE': false,
			'CTE': true,
			'NT_CTE': true,
			'CARGA': true,
			'RASTREIO': false,
			'TRACKING': true,
			'EMAIL': true,
			'IDG046': this.IDG046_selecionada,
			'IDG083': this.IDG083_selecionada,
			'NFE_AG': true,
			'IT_NFE_AG': true,
			'RASTREIO_AG': true,
		}

		this.loadInformacoesNotaFiscal(controllerView);

		this.set(1, 'Informações', 'visualizarNota', IDG083, 'fa fa-file-alt');

		this.exibir = 2;

		this.viewDatas(objNotas);

	}

	enviarSatisfacaoUnico(event): void {
		console.log("enviarSatisfacaoUnico ", event);
		if (typeof event === 'object') {
			if (event.DSEMAIL != '' && event.IDG051 != '' && event.IDG005 != '') {
				this.utilServices.loadGridShow();
				this.deliveryNfService.enviarSatisfacaoUnico(event).subscribe(
					data => {
						this.componenteEnvioRastreio.closeModalConfirmaEnvio();
						this.toastr.success('Enviado com sucesso!');
						this.utilServices.loadGridHide();
					},
					err => {
						this.toastr.error('Não foi possível enviar o rastreio.');
						this.utilServices.loadGridHide();
					}
				);
			} else {
				this.toastr.error('Não foi possível enviar a pesquisa');
			}
		} else {
			this.toastr.error('Não foi possível enviar a pesquisa');
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

	guardFilter() {
		if (this.filterAux == 1) {
			if (this.objFormFilterH.controls['G043_DTENTREG'].value != null) {
				this.selected1 = false;
			} else {
				this.selected1 = true;
			}
			if (this.objFormFilterHome.controls['G051_TPTRANSP'].value != null) {
				this.selected2 = false;
			} else {
				this.selected2 = true;
			}
			if (this.objFormFilterH.controls['G043_SNAG'].value != null) {
				this.selected3 = false;
			} else {
				this.selected3 = true;
			}
			if (this.objFormFilterHome.controls['G051_STCTRC'].value != null) {
				this.selected4 = false;
			} else {
				this.selected4 = true;
			}
			if (this.objFormFilterH.controls['A008_IDA008'].value != null) {
				this.selected5 = false;
			} else {
				this.selected5 = true;
			}
			if (this.objFormFilterH.controls['G043_DTBLOQUE'].value != null) {
				this.selected6 = false;
			} else {
				this.selected6 = true;
			}

			if (this.objFormFilterH.controls['G051_IDI015'].value != null) {
				this.selected7 = false;
			} else {
				this.selected7 = true;
			}


			this.auxGoHome = true;

			if (this.objAux.dataInicioAux[0] != null || this.objAux.dataInicioAux[0] != undefined) {
				this.dtInicioDefault = this.objAux.dataInicioAux;
			} else {
				this.dtInicioDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1 }];
			}

			if (this.objAux.dataFimAux[0] != null || this.objAux.dataFimAux[0] != undefined) {
				this.dtTerminoDefault = this.objAux.dataFimAux;
			} else {
				this.dtTerminoDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate() }];
			}

		} else {
			this.selected1 = true;
			this.selected2 = true;
			this.selected3 = true;
			this.selected4 = true;
			this.selected5 = true;
			this.selected6 = true;
			this.selected7 = true;
			this.selected8 = true;

			this.dtInicioDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1 }];
			this.dtTerminoDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate() }]
		}
	}


	backHome(): void {

		this.guardFilter();

		this.arBreadcrumbsLocal = [];
		this.exibir = 1;
	}


	closeModal(): void {
		this.modal.closeModal();
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

	/*######################################################################*/
	/*Tratativa para saber qual data será mostrada como previsão de entrega*/
	/*######################################################################*/

	viewDatas(objNotas) {

		this.previsao1 = false;
		this.previsao2 = false;
		this.previsao3 = false;
		this.previsao4 = false;
		this.previsao5 = false;
		this.markEntrega = false;
		let dataPreent   = objNotas.G051_DTPREENT != null ? objNotas.G051_DTPREENT.split('/') : null;
		dataPreent = dataPreent != null ? new Date(dataPreent[2], dataPreent[1], dataPreent[0]) : null;
		
		if (objNotas.IDG014 == 5) {
			if (objNotas.DTENTREG != 'n.i.') {
				this.markEntrega = true;

			}else if (objNotas.G051_DTCOMBIN != 'n.i.') {
				this.previsao2 = true;
				
			} else if (objNotas.G051_DTAGENDA != 'n.i.') {
				this.previsao1 = true;
				
			} else if (objNotas.DTENTPLA != null) {
				this.previsao3 = true;
				
			} else if (objNotas.DTENTCON != 'n.i.') {
				this.previsao4 = true;

			}
		} else {
			if (objNotas.DTENTREG != 'n.i.') {
				this.markEntrega = true;

			} else if (objNotas.G051_DTCOMBIN != 'n.i.' && (this.dataHoje < dataPreent)) {
				this.previsao2 = true;
				
			} else if (objNotas.G051_DTAGENDA != 'n.i.' && (this.dataHoje < dataPreent)) {
				this.previsao1 = true;
				
			} else if (objNotas.DTCALDEP != null && (this.dataHoje < dataPreent)) {
				this.previsao5 = true;
				
			} else if (objNotas.DTENTPLA != null && (this.dataHoje < dataPreent)) {
				this.previsao3 = true;

			} else {
				this.previsao4 = true;

			}
			
		}

	}



}
