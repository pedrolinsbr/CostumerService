import { VirtualScrollComponent } from './../shared/componentesbravo/src/app/componentes/ng-select/virtual-scroll.component';
import { Component, HostListener, OnInit, ViewChild, TemplateRef, DoCheck, ElementRef, ViewEncapsulation } from '@angular/core';
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

import { AdminLayoutComponent } from '../../app/layouts/admin/admin-layout.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import * as moment from 'moment';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, DoCheck {

	token = localStorage.getItem('token');
	
	global = new GlobalsServices();
	// - Utilitário para funcionar o Breadcrumbs
	@ViewChild('breadcrumbs') breadcrumbs;

	@ViewChild('componenteEnvioRastreio') componenteEnvioRastreio;
	@ViewChild('componentRastreio') componentRastreio;
	@ViewChild('dgNotasFiscaisHome') dgNotasFiscaisHome:ElementRef;
	@ViewChild('modalConfirmaRemocao') modalConfirmaRemocao;
	@ViewChild('modalDanfe') modalDanfe;
	@ViewChild('modalDacte') modalDacte;

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
		G051_IDG024: [],
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
		G032_IDG032: [],
		G051_TPTRANSP: []
	};

	objButtonDocs = {
		dacteButton: false,
		danfeButton: false
	}

	SNADMIN;
	auxGoHome = false;
	showCDUF = true;

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

	// - Formgroup para representar a criação de um atendimento
	objFormNewAtendimento: FormGroup;

	// - Formgroup para representar o formulário da NF-e
	objFormNotaFiscal: FormGroup;

	// - Formgroup para representar a Nf-e selecionada para
	objFormBuscaAtendimentoByNfe: FormGroup;

	// - Formgroup para o motivo da exclusão do atendimento
	objFormRemoveAtendimento: FormGroup;

	// - Objeto de Indicadores
	indicadores: IndicadorHome[] = [];
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
	IDA001_selected: number;


	public loading = false;
	public loadingModalAtendimento: boolean = false;

	// - Nota Fiscal Selecionada
	IDG043_selecionada: number;
	IDG051_selecionada: number;
	IDG046_selecionada: number;// - Nesse caso a prioridade é a carga 4PL
	IDG083_selecionada: number;
	IDG014_selecionada: number;
	ultCarga_selecionada: number;

	IDA001_remover:number;

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
	dtInicioDefault = [{ year: moment().subtract(15, 'days').year(), month: moment().subtract(15, 'days').month() + 1, day: moment().subtract(15, 'days').date() }];
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
	DTENTMOB: string = ''; // Data de entrega Mobile
	DTCANHOT: string = ''; // Data do canhoto
	// DTENTRAS: string = ''; // Data do Rastreador

	//variaveis para controle de datas view
	previsao1: boolean = false;
	previsao2: boolean = false;
	previsao3: boolean = false;
	previsao4: boolean = false;
	previsao5: boolean = false;
	markEntrega: boolean = false;

	modalAtendimento: boolean = false;

	rowSelectedGrid = null;//linha selecionada na grid para criar Atendimento

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

	usarHome = 0;

	constructor(
		private formBuilder: FormBuilder,
		private grid: DatagridComponent,
		private atendimentosService: AtendimentosService,
		private deliveryNfService: DeliverysNfService,
		private utilServices: UtilServices,
		private toastr: ToastrService,
		private adminLayoutService: AdminLayoutService,
		private modal: ModalComponent,
		private adminLayout: AdminLayoutComponent,
		private router: Router) {

		// - Carrega os Indicadores na página
		this.indicadores.push(
			{ desc: 'Atendimentos', value: this.vlQtdAtendimentos + '', color: 'green', icon: 'icon-basic-headset' },
			{ desc: 'Ocorrências', value: this.vlQtdOcorrencias + '', color: 'red', icon: 'icon-basic-gear' },
			{ desc: 'Entregas Realizadas', value: 'NFE: ' + this.vlQtdEntregas + '/' + 'CTE: ' + this.vlQtdEntregasCTE, color: 'teal', icon: 'icon-ecommerce-cart-check' },
			{ desc: 'Satisfação', value: this.vlPercSatisfacao + '%', color: 'blue', icon: 'icon-ecommerce-graph-increase' }
		);

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
			G051_IDG024: [],
			G051_TPTRANSP: [],
			G051_IDG005CO: [],
			G043_SNAG: [],
			G043_DTENTREG: [],
			G043_DTBLOQUE: [],
			G043_DTDESBLO: [],
			G051_CDCARGA: [],
			G051_STCTRC: [],
			A005_IDA001: [],
			A002_IDA008: [],
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
			TPOPERAC: []

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
			G051_IDG024: [],
			G051_IDG005CO: [],
			G046_IDG046: [],
			G043_DTENTREG: [],
			G043_SNAG: [],
			G043_DTBLOQUE: [],
			G043_DTDESBLO: [],
			G051_CDCARGA: [],
			G051_STCTRC: [],
			A005_IDA001: [],
			A002_IDA008: [],
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
			G051_TPTRANSP: [],
			TPOPERAC: []
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormNewAtendimento = formBuilder.group({
			NF: [],
		});

		// - Filtro do formulário de Nf-e
		this.objFormBuscaAtendimentoByNfe = formBuilder.group({
			G043_IDG043: [],
			G083_IDG083: [],
			SNNOTA: []
		});


		// - Motivo setado para a exclusão do atendimento/ocorrência
		this.objFormRemoveAtendimento = formBuilder.group({
			DSREMOTI: [],
			IDA001: []
		})


	}

	// - Função responsável por atualizar e montar os Indicadores
	filtrarIndicadores(): void {
		// - Montar Indicadores da Home
		if (!this.controllerFirstSearch) {

			this.controllerFirstSearch = true;
			
			this.objFormFilterH.controls['G051_DTAGENDA'].setValue(null);
			this.objFormFilterHome.controls['G051_DTAGENDA'].setValue(null);

			this.objFormFilterH.controls['DTPREENT'].setValue(null);
			this.objFormFilterHome.controls['DTPREENT'].setValue(null);

			this.objFormFilterHome.controls['G051_STCTRC'].setValue('A');
			//this.objFormFilterHome.controls['SNTRANSP'].setValue('1');
		}

		this.atendimentosService.getIndicadoresEmAberto(this.objFormFilterHome.value).subscribe(
			data => {
				this.vlQtdAtendimentos = data[0].QTD_ATENDIMENTOS;
				this.vlQtdOcorrencias = data[0].QTD_OCORRENCIAS;
				this.vlQtdEntregas = data[0].QTD_ENTREGAS;
				this.vlQtdEntregasCTE = data[0].QTD_ENTREGAS_CTE;
				this.vlPercSatisfacao = data[0].SATISFACAO ? parseFloat((data[0].SATISFACAO).toFixed(2)) : 0;
				this.refreshIndicadores();
			},
			err => {
				this.toastr.error('Erro ao buscar estatísticas. ');
			}
		);



		
	}

	filtrarHome(): void {


		if ((this.objFormFilterH.controls['G051_IDI015'].value != 2 && this.objFormFilterH.controls['G051_IDI015'].value != null) && (this.objFormFilterH.controls['G043_DTENTREG'].value == '' || this.objFormFilterH.controls['G043_DTENTREG'].value == null)) {
			this.toastr.error('Coloque sim ou não em Notas Entregues');
		} else {
			this.filterAux = 1;

			this.objAux.IdCte = { in: [] };
			this.objAux.idNfe = { in: [] };
			this.objAux.G051_IDG024 = [];
			this.objAux.G051_IDG005CO = [];
			this.objAux.G043_IDG005DE = [];
			this.objAux.G043_IDG005RE = [];
			this.objAux.G051_IDG005RE = [];
			this.objAux.IdCargaLog = { in: [] };


			if ((this.objFormFilterH.controls['DTFIM'].value != null && this.objFormFilterH.controls['DTFIM'].value != '')
					&& (this.objFormFilterH.controls['DTINICIO'].value != null && this.objFormFilterH.controls['DTINICIO'].value != '')) {
				this.objFormFilterHome.controls['G083_DTEMINOT'].setValue(
					[
						this.dataC(this.objFormFilterH.controls['DTINICIO'].value),
						this.dataC(this.objFormFilterH.controls['DTFIM'].value)
					]
				);
			} else {
				this.objFormFilterHome.controls['G083_DTEMINOT'].setValue(null);
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
			
			this.objAux.dataInicioAux[0] = this.objFormFilterH.controls['DTINICIO'].value;
			this.objAux.dataFimAux[0] = this.objFormFilterH.controls['DTFIM'].value;
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

			
			if (this.objFormFilterH.controls['G051_TPTRANSP'].value && this.objFormFilterH.controls['G051_TPTRANSP'].value.length != 0) {
				this.objAux.G051_TPTRANSP = this.objFormFilterH.controls['G051_TPTRANSP'].value;
				this.objFormFilterHome.controls['G051_TPTRANSP'].setValue({ in: this.objFormFilterH.controls['G051_TPTRANSP'].value });

			} else {
				this.objFormFilterHome.controls['G051_TPTRANSP'].setValue(null);
				this.objAux.G051_TPTRANSP = null;
			}
			

			if (this.objFormFilterH.controls['G046_IDG024'].value && this.objFormFilterH.controls['G046_IDG024'].value.length != 0) {
				this.objAux.G046_IDG024 = this.objFormFilterH.controls['G046_IDG024'].value;
				this.objFormFilterHome.controls['G046_IDG024'].setValue({ in: this.objFormFilterH.controls['G046_IDG024'].value });

			} else {
				this.objFormFilterHome.controls['G046_IDG024'].setValue(null);
				this.objAux.G046_IDG024 = null;
			}

			if(this.objFormFilterH.controls['G051_IDG024'].value && this.objFormFilterH.controls['G051_IDG024'].value.length != 0){
				this.objAux.G051_IDG024 = this.objFormFilterH.controls['G051_IDG024'].value;
				this.objFormFilterHome.controls['G051_IDG024'].setValue({in:this.objFormFilterH.controls['G051_IDG024'].value});

			}else{
				this.objFormFilterHome.controls['G051_IDG024'].setValue(null);
				this.objAux.G051_IDG024 = null;
			}

			if(this.objFormFilterH.controls['G046_IDG046'].value){
				this.objFormFilterHome.controls['G046_IDG046'].setValue(this.objFormFilterH.controls['G046_IDG046'].value.text);
			} else {
				this.objFormFilterHome.controls['G046_IDG046'].setValue(null);
			}

			if (this.objFormFilterH.controls['G043_SNAG'].value == 0) {
				this.objFormFilterHome.controls['G043_SNAG'].setValue('1');
			} else if (this.objFormFilterH.controls['G043_SNAG'].value == 1) {
				this.objFormFilterHome.controls['G043_SNAG'].setValue('2');
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

			if (this.objFormFilterH.controls['A002_IDA008'].value == 0) {
				this.objFormFilterHome.controls['A002_IDA008'].setValue(null);
			} else if (this.objFormFilterH.controls['A002_IDA008'].value == 1) {
				this.objFormFilterHome.controls['A002_IDA008'].setValue('1');
			} else if (this.objFormFilterH.controls['A002_IDA008'].value == 2) {
				this.objFormFilterHome.controls['A002_IDA008'].setValue('2');
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

			if (this.objFormFilterH.controls['G051_STCTRC'].value == 'A' || this.objFormFilterH.controls['G051_STCTRC'].value == 'C') {
				this.objFormFilterHome.controls['G051_STCTRC'].setValue(this.objFormFilterH.controls['G051_STCTRC'].value);
			} else if (this.objFormFilterH.controls['G051_STCTRC'].value == 'N') {
				this.objFormFilterHome.controls['G051_STCTRC'].setValue('');
			} else {
				this.objFormFilterHome.controls['G051_STCTRC'].setValue('A');
			}


			if (this.objFormFilterH.controls['TPOPERAC'].value == 1) {
				this.objFormFilterHome.controls['TPOPERAC'].setValue('1');
			} else if (this.objFormFilterH.controls['TPOPERAC'].value == 2) {
				this.objFormFilterHome.controls['TPOPERAC'].setValue('2');
			} else {
				this.objFormFilterHome.controls['TPOPERAC'].setValue(null);
			}
			
			// if (this.objFormFilterH.controls['SNTRANSP'].value == 1 || this.objFormFilterH.controls['SNTRANSP'].value == null) {
			// 	this.objFormFilterHome.controls['SNTRANSP'].setValue('1');
			// } else {
			// 	this.objFormFilterHome.controls['SNTRANSP'].setValue('2');
			// }

			
			this.grid.findDataTable('listarNotasFiscaisHome', 'objFormFilterHome');
			this.filtrarIndicadores();
		}
	}


	limparHome() {
		this.objFormFilterH.reset();
		this.objFormFilterHome.reset();
		this.arIdCte.length = 0;
		this.arIdNfe.length = 0;
		this.arIdCargaLog.length = 0;
		//this.grid.findDataTable('listarNotasFiscaisHome', 'objFormFilterHome');
	}

	pFiltroIndicadores() {
		this.grid.findDataTable('listarNotasFiscaisHome', 'objFormFilterHome');
	}

	// - Função para atualizar os valores do Indicador
	refreshIndicadores(): void {
		this.indicadores = [];
		this.indicadores.push(
			{
				desc: 'Atendimentos',
				value: this.vlQtdAtendimentos + '',
				color: 'green',
				icon: 'icon-basic-headset'
			},
			{ desc: 'Ocorrências', value: this.vlQtdOcorrencias + '', color: 'red', icon: 'icon-basic-gear' },
			{ desc: 'Entregas Realizadas', value: 'NFE: ' + this.vlQtdEntregas + '/' + 'CTE: ' + this.vlQtdEntregasCTE, color: 'teal', icon: 'icon-ecommerce-cart-check' },
			{ desc: 'Satisfação', value: this.vlPercSatisfacao + '%', color: 'blue', icon: 'icon-ecommerce-graph-increase' }
		);
	}


	// - Função para carregar informações da Nota Fiscal
	loadInformacoesNotaFiscal(objReq): void {
		this.loading = true;

		this.deliveryNfService.getInformacoesNotaFiscal(objReq).subscribe(
			data => {
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

				if (data.RASTREAMENTO.DTCOLETA != null && data.RASTREAMENTO.DTCOLETA != '') {
					//trata data da coleta vinda do banco
					dtColAux = data.RASTREAMENTO.DTCOLETA.split("-").reverse().join("/");
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

				console.log(data.NFE);
				this.nfeObj = data.NFE;
				this.cteObj = data.CTE;
				this.cargaObj = data.CARGA;
				this.rastreioObj = data.RASTREAMENTO;
				this.trackingObj = data.TRACKING;
				this.envioRastreioObj = data.EMAIL;

				this.numNF = data.NFE.NRNOTA;

				if (data.RASTREAMENTO.DTENTREG) {
					this.entregTracking = true;
				} else {
					this.entregTracking = false;
				}

				if (data.EMAIL.IDG014 == 5) {
					this.validSyngenta = true;
				} else {
					this.validSyngenta = false;
				}

				let obj = { IDS001: localStorage.getItem('ID_USER'), IDS022: 42, idAcoes: [95, 96] };//Tabela S023 está as ações
				
				this.deliveryNfService.buscarAcoes(obj).subscribe(
					data => {
						for (let key of data) { 
							switch (key.IDS023) { 
								case 95:
									this.objButtonDocs.danfeButton = true;
									break;
								case 96:
									this.objButtonDocs.dacteButton = true;
									break;
							}
						}
					},
					err => {
						this.toastr.error('Erro ao validar botões.');
					}
				);


				this.deliveryNfService.getDatasToAtendimento({IDG043: this.IDG043_selecionada, IDG083: this.IDG083_selecionada}).subscribe(
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
						this.DTENTMOB = data.DTENTMOB;
						this.DTCANHOT = data.DTCANHOT;
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
		console.log('compartilharRastreio, event: ',event);
		if (typeof event === 'object') {
			if (event.DSEMAIL != '' && event.IDG043 != '' && event.IDG005 != '') {

				this.utilServices.loadGridShow();

				this.deliveryNfService.isValidSendRastreio(event).subscribe(
					data => {
						console.log("adasdsadas ", data);
						if (data.VALIDO > 0 && data.VALIDO < 72) {
							//valida se a delivery tem permissao de enviar rastreio
							/*this.deliveryNfService.validaPermissaoRastreio(event).subscribe(
								data2 => { 
									// para fazer o envio é necessário o IDG077 ser nulo ou vazio (não conter registro na g077)
									// e o campo SNENVRAS (G005) da indústria estar setado como 1
									if(data2.SNENVRAS == 1 && (data2.IDG077 == null || data2.IDG077 == '')){	*/
							// - Vamos fazer o envio
							event.IDG014 = this.IDG014_selecionada;
							this.deliveryNfService.sendRastreio(event).subscribe(
								data => {
									this.componenteEnvioRastreio.closeModalConfirmaEnvio();
									this.toastr.success('Enviado com sucesso!');
									this.utilServices.loadGridHide();
								}, err => {
									this.toastr.error(err.error.armensag ? err.error.armensag : 'Não foi possível enviar o rastreio.');
									this.utilServices.loadGridHide();
								}
							);
							/*}else{
								this.toastr.error('Este cliente não possiu permissão de envio para essa operação.');
								this.utilServices.loadGridHide();
							}								
						})*/
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

	// compartilharNps(event): void {
	// 	console.log("compartilharNps",event);
	// 	if (typeof event === 'object') {
	// 		if (event.DSEMAIL != '' && event.IDG051 != '' && event.IDG005 != '') {

	// 			this.utilServices.loadGridShow();
	// 				//valida se a delivery tem permissao de enviar rastreio
	// 				this.deliveryNfService.validaPermissaoRastreio(event).subscribe(
	// 					data2 => {
	// 						// para fazer o envio é necessário o IDG077 ser nulo ou vazio (não conter registro na g077)
	// 						// e o campo SNENVRAS (G005) da indústria estar setado como 1
	// 						if(data2.SNENVRAS == 1 && (data2.IDG077 == null || data2.IDG077 == '')){										
	// 							// - Vamos fazer o envio
	// 							this.deliveryNfService.sendRastreio(event).subscribe(
	// 								data => {
	// 									this.componenteEnvioRastreio.closeModalConfirmaEnvio();
	// 									this.toastr.success('Enviado com sucesso!');
	// 									this.utilServices.loadGridHide();
	// 								}, err => {
	// 									this.toastr.error('Não foi possível enviar o rastreio.');
	// 									this.utilServices.loadGridHide();
	// 								}
	// 							);
	// 						}else{
	// 							this.toastr.error('Este cliente não possiu permissão de envio para essa operação.');
	// 							this.utilServices.loadGridHide();
	// 						}								
	// 					}
	// 				)

	// 		} else {
	// 			this.toastr.error('Não foi possível encaminhar o rastreio');
	// 		}
	// 	} else {
	// 		this.toastr.error('Não foi possível encaminhar o rastreio');
	// 	}
	// }

	ngOnInit() {
		var data = [];
		if(typeof this.adminLayout.menuItensAux != 'undefined'){
			data = this.adminLayout.menuItensAux;
		}
		
		var homeAux = 0;
		for (let i = 0; i < data.length; i++) {
			if (data[i].IDS022 == 42) {
				homeAux = 1;
			}
		}

		if (homeAux == 0 && this.router.url == '/home') {
			location.href = "/#/";
			return false;
		} else {
			this.usarHome = 1;
		}
 

		//valida usuario admin
		let userAdmin = JSON.parse(localStorage.getItem('user'));

		if (userAdmin.SNADMIN == 1) {
			this.arrayBotoes = [
				{ 'id': 6, 'metodo': 'movimentarAtendimento', 'icone': 'fa fa-comment' },
				{ 'id': 71, 'metodo': 'openModalRemocaoAtendimento', 'icone': 'fas fa-trash-alt' }
			];
		} else {
			this.arrayBotoes = [
				{ 'id': 6, 'metodo': 'movimentarAtendimento', 'icone': 'fa fa-comment' }
			];
		}
		
		// - Chamar função de atualizar indicadores.
		//this.filtrarIndicadores();

	}

	ngDoCheck() {

		

	/* 	if (this.adminLayoutService.exibir == true) {
			this.exibir = 1;
			this.arBreadcrumbsLocal = [];
			this.adminLayoutService.exibir = false;

			this.vlQtdAtendimentos = 0;
			this.vlQtdOcorrencias = 0;
			this.vlQtdEntregas = 0;
			this.vlQtdEntregasCTE = 0;
			this.vlPercSatisfacao = 0;
			this.refreshIndicadores();
		}	 */
			/*this.selected = false;
			this.auxGoHome = true;
			if(this.objAux.dataInicioAux[0] != null){
				this.dtInicioDefault = this.objAux.dataInicioAux;
			}else{
				this.dtInicioDefault = null;
			}
			if(this.objAux.dataFimAux[0] != null){
				this.dtTerminoDefault = this.objAux.dataFimAux;
			}else{
				this.dtTerminoDefault = null;
			}*/
		

		// if(this.exibir == 2){
		// 	var that = this;

		// 	$('input[type="hidden"][name^="obj_checkbox_atendimentoGrid_"]').each(function (obj) {
		// 		var arrObj = JSON.parse(($(this).val()));
		// 		that.objAtendimento.push(arrObj);

		// 		if(that.objAtendimento.length > 0){
		// 			console.log('entrei');
		// 			that.viewControlGrid = false;
		// 		}else{
		// 			console.log('não entrei');
		// 			that.viewControlGrid = true;
		// 		}

		// 	})
		// }
		
	}

	filtrarAtendimentoByNfe(): void {
		this.objFormBuscaAtendimentoByNfe.controls['G043_IDG043'].setValue(this.IDG043_selecionada);
		this.objFormBuscaAtendimentoByNfe.controls['G083_IDG083'].setValue(this.IDG083_selecionada);
		this.objFormBuscaAtendimentoByNfe.controls['SNNOTA'].setValue(true);
		this.grid.findDataTable('gridAtendimentosCriados', 'objFormBuscaAtendimentoByNfe');
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
		//this.cancelarCadastro();
		
		this.exibir = 1;
		
		//this.grid.findDataTable('listarNotasFiscaisHome', 'objFormFilterHome');
	}

	dataClick(event) {
		if (event != null) {
			let dia = event.year + '-' + event.month + '-' + event.day;
			this.diaSelecionado = new Date(dia);
			this.dataClicou = event;
			this.anoSelecionado = event.year;
		}
	}

	voltar(){
		this.exibir = 1;
		this.cancelarCadastro();
	}
	// - Função que volta para o primeiro indice do Breadcrumbs
	cancelarCadastro() {
		this.objFormNewAtendimento.reset()
		this.arBreadcrumbsLocal = [];
		this.exibir = 1;

		this.vlQtdAtendimentos = 0;
		this.vlQtdOcorrencias = 0;
		this.vlQtdEntregas = 0;
		this.vlQtdEntregasCTE = 0;
		this.vlPercSatisfacao = 0;
		this.refreshIndicadores();

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

	// - Criar Atendimento
	criarAtendimento(): void {
		this.set(2, 'Novo Atendimento', 'criarAtendimento', '', 'fa fa-comment');
		this.exibir = 5;
	}

	// - Função para abrir atendimento
	abrirAtendimento(): void {
		this.set(1, "Novo Atendimento", "abrirAtendimento", '', "fa fa-plus-square");
		this.exibir = 2;
	}

	movAtendimento(IDA001) {
		console.log(IDA001)
		this.IDA001_selected = IDA001;
		if(!this.modalAtendimento) {
			this.set(2, 'Detalhes do Atendimento', 'movimentarAtendimento', '', 'fa fa-file-alt');
		}
		this.exibir = 6;
	}
	// - Método responsável para redirecionar para tela de criar novo atendimento direto do menu ações
	criarNovoAtendimento(IDG043){
		this.rowSelectedGrid = IDG043;
		let objNotas = JSON.parse(IDG043);

		this.IDG043_selecionada = objNotas.IDG043;
		this.IDG051_selecionada = objNotas.IDG051;
		this.IDG046_selecionada = objNotas.IDG046;
		this.IDG083_selecionada = objNotas.IDG083;
		this.ultCarga_selecionada = objNotas.G051_IDG046;

		let controllerView =
		{
			'IDG043': this.IDG043_selecionada,
			'IDG051': this.IDG051_selecionada,
			'NFE': true,
			'IT_NFE': true,
			'CTE': true,
			'NT_CTE': true,
			'CARGA': true,
			'RASTREIO': true,
			'TRACKING': true,
			'EMAIL': true,
			'IDG046': this.IDG046_selecionada,
			'IDG083': this.IDG083_selecionada
		}

		this.viewDatas(objNotas);

		this.loadInformacoesNotaFiscal(controllerView);
		this.criarAtendimento();
	}
	// - Método responsável para redirecionar
	visualizarNota(IDG043): void {
		let userObj = JSON.parse(localStorage.getItem('user'));
		this.SNADMIN = userObj.SNADMIN;

		this.gridVazia = false;

		let objNotas = JSON.parse(IDG043);
		console.log(objNotas);
		this.rowSelectedGrid = IDG043;
		
		this.IDG043_selecionada = objNotas.IDG043;
		this.IDG051_selecionada = objNotas.IDG051;
		this.IDG046_selecionada = objNotas.IDG046;
		this.IDG083_selecionada = ((objNotas.IDG083 != null && objNotas.IDG083 != undefined) ? objNotas.IDG083 : null);
		this.IDG014_selecionada = objNotas.IDG014;
		this.ultCarga_selecionada = objNotas.G051_IDG046;


		let controllerView =
		{
			'IDG043': this.IDG043_selecionada,
			'IDG051': this.IDG051_selecionada,
			'NFE': true,
			'IT_NFE': true,
			'CTE': true,
			'NT_CTE': true,
			'CARGA': true,
			'RASTREIO': true,
			'TRACKING': true,
			'EMAIL': true,
			'IDG046': this.IDG046_selecionada,
			'IDG083': this.IDG083_selecionada
		}

		this.loadInformacoesNotaFiscal(controllerView);

		this.set(1, 'Informações', 'visualizarNota', IDG043, 'fa fa-file-alt');

		this.exibir = 2;

		this.viewDatas(objNotas);

		// this.viewControlGrid = true;
		// this.objAtendimento = [];

		// setTimeout(() => {
		// 	this.filtrarAtendimentoByNfe();
		// }, 10000);
	}

	// visualizarNotaHome(IDG043) : void {
	// 	console.log(IDG043);
	// 	let res = IDG043.IDG043;
	// 	let objNotas = JSON.parse(res);
	// 	objNotas = IDG043;

	// 	this.IDG043_selecionada = objNotas.IDG043;
	// 	this.IDG051_selecionada = objNotas.IDG051;

	// 	let controllerView =
	// 	{
	// 		'IDG043'	:	this.IDG043_selecionada,
	// 		'IDG051'	:	this.IDG051_selecionada,
	// 		'NFE'		:	true,
	// 		'IT_NFE'	:	true,
	// 		'CTE'		:	true,
	// 		'NT_CTE'	:	true,
	// 		'CARGA'		:	true,
	// 		'RASTREIO'	:	true,
	// 		'TRACKING'	:	true,
	// 		'EMAIL'		:	true
	// 	}

	// 	this.loadInformacoesNotaFiscal(controllerView);

	// 	this.set(1,'Informações', 'visualizarNota', res, 'fa fa-file-alt');

	// 	this.exibir = 2;
	// }

	backToAtendimento(): void {
		this.breadcrumbs.goBack();
		this.set(1, 'Detalhes da NF-e', 'visualizarNota', '', 'fa fa-file-alt');
		this.exibir = 2;
	}

	movimentarAtendimento(IDA001): void {
		this.IDA001_selected = IDA001;
		this.exibir = 0;
		if(!this.modalAtendimento) {
			this.set(2, 'Detalhes do Atendimento', 'movimentarAtendimento', '', 'fa fa-file-alt');
		}
		setTimeout(() => {
			this.exibir = 6;
		});
	}

	enviarSatisfacaoUnico(event): void {
		console.log("enviarSatisfacaoUnico ", event);
		if (typeof event === 'object') {
			if (event.DSEMAIL != '' && event.IDG051 != '' && event.IDG005 != '') {
				event.IDG014 = this.IDG014_selecionada;
				this.utilServices.loadGridShow();
				this.deliveryNfService.enviarSatisfacaoUnico(event).subscribe(
					data => {
						this.componenteEnvioRastreio.closeModalConfirmaEnvio();
						this.toastr.success('Enviado com sucesso!');
						this.utilServices.loadGridHide();
					},
					err => {
						this.toastr.error(err.error.armensag ? err.error.armensag : 'Não foi possível enviar a pesquisa');
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
			if (this.objFormFilterH.controls['A002_IDA008'].value != null) {
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

			if (this.objFormFilterH.controls['TPOPERAC'].value != null) {
				this.selected8 = false;
			} else {
				this.selected8 = true;
			}

			this.auxGoHome = true;

			if (this.objAux.dataInicioAux[0] != null || this.objAux.dataInicioAux[0] != undefined) {
				this.dtInicioDefault = this.objAux.dataInicioAux;
			} else {
				this.dtInicioDefault = [{ year: moment().subtract(15, 'days').year(), month: moment().subtract(15, 'days').month() + 1, day: moment().subtract(15, 'days').date() }];
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

			this.dtInicioDefault = [{ year: moment().subtract(15, 'days').year(), month: moment().subtract(15, 'days').month() + 1, day: moment().subtract(15, 'days').date() }];
			this.dtTerminoDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate() }]
		}
	}

	inserirMotivo(IDG043) {

		let objNotas = JSON.parse(IDG043);

		if (objNotas.DTBLOQUE != 'n.i.' || (objNotas.DTBLOQUE != 'n.i.' && objNotas.DTDESBLO == 'n.i.')) {
			this.toastr.error('Nota bloqueada.');
			return false;
		}
		if (objNotas.IDG046 == 0 || objNotas.IDG046 == '' || objNotas.IDG046 == null) {
			this.toastr.error('Nota sem carga vinculada.');
			return false;
		}

		this.utilServices.loadGridShow();
		if (objNotas.IDI015 == null && (objNotas.DTENTREG != 'n.i.' || objNotas.DTENTPLA != null)) {
			this.IDG043_selecionada = objNotas.IDG043;
			this.IDG051_selecionada = objNotas.IDG051;
			this.IDG046_selecionada = objNotas.IDG046;

			let controllerView =
			{
				'IDG043': this.IDG043_selecionada,
				'IDG051': this.IDG051_selecionada,
				'NFE': true,
				'IT_NFE': true,
				'CTE': true,
				'NT_CTE': true,
				'CARGA': true,
				'RASTREIO': true,
				'TRACKING': true,
				'EMAIL': true,
				'IDG046' : this.IDG046_selecionada
			}

			this.loadInformacoesNotaFiscal(controllerView);

			this.set(2, 'Inserir Motivo', 'inserirMotivo', '', 'fas fa-edit');
			this.exibir = 7;
			this.utilServices.loadGridHide();

		} else if(objNotas.IDI015 != null) {
			this.utilServices.loadGridHide();
			this.toastr.error('Essa nota já possui motivo.');
			return false;
		} else if(objNotas.DTENTREG == 'n.i.'){
			this.utilServices.loadGridHide();
			this.toastr.error('Essa nota não foi entregue.');
			return false;
		} else if(objNotas.DTENTPLA == null){
			this.utilServices.loadGridHide();
			this.toastr.error('Essa nota não possui data planejada.');
			return false;
		}
	}

	backHome(): void {
/* 
		this.guardFilter();

		this.arBreadcrumbsLocal = []; */
		this.exibir = 1;
		this.grid.findDataTable('listarNotasFiscaisHome', 'objFormFilterHome');
/* 		this.vlQtdAtendimentos = 0;
		this.vlQtdOcorrencias = 0;
		this.vlQtdEntregas = 0;
		this.vlQtdEntregasCTE = 0;
		this.vlPercSatisfacao = 0;
		this.refreshIndicadores(); */
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

	  recebeEmit(respostaFilho){
		if(this.exibir == 2 && respostaFilho.gridId == 'gridAtendimentosCriados' && respostaFilho.col == true){
			this.gridVazia = false;
		}else{
			this.gridVazia = true;
		}
		
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
		let dataPreent   = objNotas.G051_DTPREENT.split('/');
		dataPreent = new Date(dataPreent[2], (dataPreent[1] - 1), dataPreent[0]);
		let dtHoje = new Date( this.dataHoje.getFullYear(), (this.dataHoje.getMonth()), this.dataHoje.getDate());
		
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

			} else if (objNotas.G051_DTCOMBIN != 'n.i.' && (dtHoje <= dataPreent)) {
				this.previsao2 = true;
				
			} else if (objNotas.G051_DTAGENDA != 'n.i.' && (dtHoje <= dataPreent)) {
				this.previsao1 = true;
				
			} else if (objNotas.DTCALDEP != null && (dtHoje <= dataPreent)) {
				this.previsao5 = true;
				
			} else if (objNotas.DTENTPLA != null && (dtHoje <= dataPreent)) {
				this.previsao3 = true;

			} else {

				if (objNotas.DTCALDEP) {
					let dataSLA   = objNotas.DTENTCON.split('/');
					dataSLA = new Date(dataSLA[2], (dataSLA[1] - 1), dataSLA[0]);

					let dataCalDep = objNotas.DTCALDEP.split('/');
					dataCalDep = new Date(dataCalDep[2], (dataCalDep[1] - 1), dataCalDep[0]);

					if (dataCalDep > dataSLA) {
						this.previsao5 = true;
					} else {
						this.previsao4 = true;
					}

				} else {
					this.previsao4 = true;
				}

			}
			
		}

	}

	openModalRemocaoAtendimento(IDA001) {
		this.IDA001_remover = IDA001;
		this.modal.open(this.modalConfirmaRemocao, { size: 'lg' });
	}

	removerAtendimento() {

		if (this.objFormRemoveAtendimento.controls['DSREMOTI'].value == null || this.objFormRemoveAtendimento.controls['DSREMOTI'].value == '') {
			this.toastr.error("Insira o motivo da exclusão");
		} else {
			this.loadingModalAtendimento = true;

			this.objFormRemoveAtendimento.controls['IDA001'].setValue(this.IDA001_remover);

			let objParam = {
				IDA001: this.objFormRemoveAtendimento.controls['IDA001'].value,
				DSREMOTI: this.objFormRemoveAtendimento.controls['DSREMOTI'].value
			};

			this.atendimentosService.removeAtendimento(objParam).subscribe(
				data => {
					console.log("Sucess: " + data);
					this.toastr.success("Atendimento removido com sucesso!"); 
					this.loadingModalAtendimento = false;
					this.closeModal();
					this.filtrarAtendimentoByNfe();
				},
				err => {
					console.log(err);
					this.loadingModalAtendimento = false;
					this.toastr.error("Erro ao remover o atendimento");
				}
			
			);
		}

	}


	openModalAtendimento(objNotas) {
		this.modalAtendimento = true;
		this.IDG043_selecionada = objNotas.IDG043;
		this.IDG051_selecionada = objNotas.IDG051;
		this.IDG046_selecionada = objNotas.IDG046;
		this.IDG083_selecionada = ((objNotas.IDG083 != null && objNotas.IDG083 != undefined) ? objNotas.IDG083 : null);
		document.querySelector('.main-content').scrollTop = 0;
	}

	closeModalAtendimento() {
		this.modalAtendimento = false;
		this.exibir = 1;
	}

	imprimirDanfe(obj) {
		let objNotas = JSON.parse(obj);
		this.IDG083_selecionada = objNotas.IDG083;
		this.modal.open(this.modalDanfe,{ size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
	}

	imprimirDacte(obj) {
		let objNotas = JSON.parse(obj);
		this.IDG051_selecionada = objNotas.IDG051;
		this.modal.open(this.modalDacte, { size: 'lg' });
	}

}
