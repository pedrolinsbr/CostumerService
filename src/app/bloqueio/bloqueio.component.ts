import { Component, OnInit, ViewChild, TemplateRef, HostListener, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { GlobalsServices            } from '../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { ToastrService } from 'ngx-toastr';

import { AtendimentosService } from '../services/crud/atendimentos.service';
import { DeliverysNfService } from '../services/crud/deliverysNf.service';
import { IndicadorHome } from '../models/indicador-home.model';
import { NotaFiscal } from '../models/nota-fiscal.model';
import { ConhecimentoTransporte } from '../models/conhecimento-transporte.model';
import { InformacoesCarga } from '../models/informacoes-carga.model';
import { InformacoesRastreio } from '../models/informacoes-rastreio.model';

import { DOCUMENT } from '@angular/platform-browser';
import { AdminLayoutService } from '../services/admin-layout.service';

@Component({
  selector: 'app-bloqueio',
  templateUrl: './bloqueio.component.html',
  styleUrls: ['./bloqueio.component.scss']
})

export class BloqueioComponent implements OnInit, DoCheck {
	global = new GlobalsServices();
	// - Utilitário para funcionar o Breadcrumbs
	@ViewChild('breadcrumbs') breadcrumbs;

	// ##### ARRAYS // OBJECTS
	arIdCte = [];
	arIdNfe =[];
	arIdCargaLog = [];
	arIdDelivery = [];

	filterAux = 0;

	objStyle             = {
		'background' : '#43295b',
		'color'      : '#ffffff',
		'iconColor'  : '#ffffff',
		'iconOpacity': '0.5'
	  };

	objAux = {
		IdCte: 			{in:[]},
		idNfe: 			{in:[]},
		IdDelivery: 	{in:[]},
		G024_IDG024: 	[],
		G043_IDG005RE:	[],
		G043_IDG005DE: 	[],
		G051_IDG005CO: 	[],
		dataInicioAux:  [],
		dataFimAux:		[],
		G046_IDG024:	[]
	};

	auxGoBloqueio = false;
	selected = true;
	showCDUF = true;

	selected1 = true;
	selected2 = true;

	// - Formgroup que representa o filtro da Datagrid inicial da home
	objFormFilterHome: FormGroup;
	objFormFilterH: FormGroup;

	// - Formgroup para representar a criação de um atendimento
	objFormNewAtendimento: FormGroup;

	// - Formgroup para representar o formulário da NF-e
	objFormNotaFiscal: FormGroup;

	// - Formgroup para representar a Nf-e selecionada para
	objFormBuscaAtendimentoByNfe: FormGroup;

	// - Objeto de Indicadores
	indicadores: IndicadorHome[] = [];
	// - Objeto de Nota Fiscal Resumida
	nfeObj: NotaFiscal;
	cteObj: ConhecimentoTransporte;
	cargaObj: InformacoesCarga;
	rastreioObj: InformacoesCarga;

	// - Atendimento Selecionado para movimentação
	IDA001_selected: number;


	public loading = false;

	// - Nota Fiscal Selecionada
	IDG043_selecionada: number;
	IDG083_selecionada: number;
	IDG051_selecionada: number;

	// - Controlador de Filtro Avançado ou Simplificado
	advancedFilter: boolean = true;

	// - Valida se a nota selecionada é syngenta
	validSyngenta: boolean = false;

	// - Utilitário para componente de datepicker
	data             = new Date();
	dataMinima       = [{year: '', month: '', day: ''}];
	dataMaxima       = [{year: '', month: '', day: ''}];
	dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
	dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}]
	dataInicio       : any;
	horas            = [];
	busca            = '';
	mesSelecionado   = '';
	anoSelecionado   = '';
	diaDaSemana      : any;
	dataClicou       = [];
	diaSelecionado;

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
		private grid : DatagridComponent,
		private atendimentosService: AtendimentosService,
		private deliveryNfService: DeliverysNfService,
		private utilServices: UtilServices,
		private toastr: ToastrService,
		private adminLayoutService: AdminLayoutService) {

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterHome = formBuilder.group({
			NF: [],
			IDG043: 		 [],
			IDG051: 		 [],
			IDG046: 		 [],
			IDG005RE:		 [],
			IDG005DE:		 [],
			IDG005_TRANSP:	 [],
			NRNOTA: 		 [],
			NRCTE: 			 [],
			DTINICIO: 		 [],
			DTFIM: 			 [],
			DESTINATARIO: 	 [],
			//filtros que valem
			G043_DTEMINOT : [],
			G043_NRNOTA   : [],
			G043_CDDELIVE:  [],
			G051_IDG051   : [],
			G051_CDCTRC:	[],
			G051_IDG046   : [],
			G043_IDG005RE :	[],
			G043_IDG005DE : [],
			G024_IDG024   : [],
			G051_IDG005CO: 	[],
			G043_DTBLOQUE: [],
			G043_DTDESBLO: [],
			G051_CDCARGA: [],
			A005_IDA001: 	[],
			A008_IDA008:	[],
			G046_IDG024:	[]
		});

		this.objFormFilterH = formBuilder.group({
			DTINICIO    : [],
			DTFIM       : [],
			G043_NRNOTA : [],
			G051_CDCTRC	: [],
			G043_IDG005RE :	[],
			G043_IDG005DE : [],
			G024_IDG024   : [],
			G051_IDG046   : [],
			G051_IDG005CO: 	[],
			G043_DTBLOQUE: [],
			G043_DTDESBLO: [],
			A008_IDA008: [],
			G046_IDG024:	[]
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormNewAtendimento = formBuilder.group({
			NF: [],
		});

		// - Filtro do formulário de Nf-e
		this.objFormBuscaAtendimentoByNfe = formBuilder.group({
			G043_IDG043:	[]
		});


		// - Filtro para pesquisar nota-fiscal na Grid de Atendimentos

	}

	IdCargaLog = {in:[]}
		
	filtrarHome() : void {

		this.filterAux = 1;

		this.objAux.idNfe = {in:[]};
		this.objAux.IdCte = {in:[]};
		this.objAux.IdDelivery= {in:[]};
		this.objAux.G024_IDG024 = [];
		this.objAux.G051_IDG005CO = [];
		this.objAux.G043_IDG005DE = [];
		this.objAux.G043_IDG005RE = [];
		this.IdCargaLog = {in:[]};


		if ((this.objFormFilterH.controls['DTFIM'].value != null) &&
			(this.objFormFilterH.controls['DTINICIO'].value !=null)) {
			this.objFormFilterHome.controls['G043_DTEMINOT'].setValue(
				[
					this.dataC(this.objFormFilterH.controls['DTINICIO'].value),
					this.dataC(this.objFormFilterH.controls['DTFIM'].value)
				]
			);
		} else {
			this.objFormFilterHome.controls['G043_DTEMINOT'].setValue(null);
		}
		this.objAux.dataInicioAux[0] = this.objFormFilterH.controls['DTINICIO'].value;
		this.objAux.dataFimAux[0] = this.objFormFilterH.controls['DTFIM'].value;

		if(this.arIdNfe.length > 0 ){
			for(let i of this.arIdNfe){
			  this.objAux.idNfe.in.push(i.name)
			}
			this.objFormFilterHome.controls['G043_NRNOTA'].setValue(this.objAux.idNfe);
		  }else{
			this.objFormFilterHome.controls['G043_NRNOTA'].setValue(null);
		  }

		if(this.arIdCte.length > 0 ){
			for(let i of this.arIdCte){
			  this.objAux.IdCte.in.push(i.name)
			}
			this.objFormFilterHome.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
		}else{
			this.objFormFilterHome.controls['G051_CDCTRC'].setValue(null);
		}


		if(this.arIdDelivery.length > 0 ){
			for(let i of this.arIdDelivery){
			  this.objAux.IdDelivery.in.push(i.name)
			}
			this.objFormFilterHome.controls['G043_CDDELIVE'].setValue(this.objAux.IdDelivery);
		}else{
			this.objFormFilterHome.controls['G043_CDDELIVE'].setValue(null);
		}


		if(this.arIdCargaLog.length > 0 ){
			for(let i of this.arIdCargaLog){
			  this.IdCargaLog.in.push(i.name)
			}
			this.objFormFilterHome.controls['G051_CDCARGA'].setValue(this.IdCargaLog);
		  }else{
			this.objFormFilterHome.controls['G051_CDCARGA'].setValue(null);
		  }

		if(this.objFormFilterH.controls['G043_IDG005RE'].value &&  this.objFormFilterH.controls['G043_IDG005RE'].value.length != 0){
			this.objAux.G043_IDG005RE = this.objFormFilterH.controls['G043_IDG005RE'].value;
			this.objFormFilterHome.controls['G043_IDG005RE'].setValue({in:this.objFormFilterH.controls['G043_IDG005RE'].value});
		}else{
			this.objFormFilterHome.controls['G043_IDG005RE'].setValue(null);
			this.objAux.G043_IDG005RE = null;
		}

		if(this.objFormFilterH.controls['G043_IDG005DE'].value && this.objFormFilterH.controls['G043_IDG005DE'].value.length != 0){
			this.objAux.G043_IDG005DE = this.objFormFilterH.controls['G043_IDG005DE'].value;
			this.objFormFilterHome.controls['G043_IDG005DE'].setValue({in:this.objFormFilterH.controls['G043_IDG005DE'].value});
		}else{
			this.objFormFilterHome.controls['G043_IDG005DE'].setValue(null);
			this.objAux.G043_IDG005DE = null;
		}

		if(this.objFormFilterH.controls['G024_IDG024'].value && this.objFormFilterH.controls['G024_IDG024'].value.length != 0){
			this.objAux.G024_IDG024 = this.objFormFilterH.controls['G024_IDG024'].value;
			this.objFormFilterHome.controls['G024_IDG024'].setValue({in:this.objFormFilterH.controls['G024_IDG024'].value});
		}else{
			this.objFormFilterHome.controls['G024_IDG024'].setValue(null);
			this.objAux.G024_IDG024 = null;
		}

		if(this.objFormFilterH.controls['G051_IDG005CO'].value && this.objFormFilterH.controls['G051_IDG005CO'].value.length != 0){
			this.objAux.G051_IDG005CO = this.objFormFilterH.controls['G051_IDG005CO'].value;
			this.objFormFilterHome.controls['G051_IDG005CO'].setValue({in:this.objFormFilterH.controls['G051_IDG005CO'].value});
		}else{
			this.objFormFilterHome.controls['G051_IDG005CO'].setValue(null);
			this.objAux.G051_IDG005CO = null;
		}

		if(this.objFormFilterH.controls['G051_IDG046'].value){
			this.objFormFilterHome.controls['G051_IDG046'].setValue(this.objFormFilterH.controls['G051_IDG046'].value.text);
		}else{
			this.objFormFilterHome.controls['G051_IDG046'].setValue(null);
		}

		if (this.objFormFilterH.controls['G043_DTBLOQUE'].value == 0) {
			this.objFormFilterHome.controls['G043_DTDESBLO'].setValue({ 'null' : false });
			this.objFormFilterHome.controls['G043_DTBLOQUE'].setValue({'null' : false});
		} else if (this.objFormFilterH.controls['G043_DTBLOQUE'].value == 1) {
			this.objFormFilterHome.controls['G043_DTBLOQUE'].setValue({ 'null' : false });
			this.objFormFilterHome.controls['G043_DTDESBLO'].setValue({'null' : true});
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

		if(this.objFormFilterH.controls['G046_IDG024'].value && this.objFormFilterH.controls['G046_IDG024'].value.length != 0){
			this.objAux.G046_IDG024 = this.objFormFilterH.controls['G046_IDG024'].value;
			this.objFormFilterHome.controls['G046_IDG024'].setValue({in:this.objFormFilterH.controls['G046_IDG024'].value});

		}else{
			this.objFormFilterHome.controls['G046_IDG024'].setValue(null);
			this.objAux.G046_IDG024 = null;
		}

		this.grid.findDataTable('listarNotasBloq', 'objFormFilterHome');
	}

	limparHome(){
		this.objFormFilterH.reset();
		this.objFormFilterHome.reset();
		this.arIdCte.length = 0;
		this.arIdNfe.length = 0;
		this.arIdCargaLog.length = 0;
		//this.grid.findDataTable('listarNotasBloq', 'objFormFilterHome');
	}

	pFiltroIndicadores(){
		this.grid.findDataTable('listarNotasBloq', 'objFormFilterHome');
	}

	// - Função para carregar informações da Nota Fiscal
	loadInformacoesNotaFiscal(objReq): void {
		this.utilServices.loadGridShow();
		console.log(objReq);
		this.deliveryNfService.getInformacoesNotaFiscal(objReq).subscribe(
			data => {
				this.nfeObj = data.NFE;
				this.cteObj = data.CTE;
				this.cargaObj = data.CARGA;
				this.rastreioObj = data.RASTREAMENTO;
				this.utilServices.loadGridHide();
			},
			err => {
				this.utilServices.loadGridHide();
			}
		);
	}

	ngOnInit() {
		this.objFormFilterHome.controls['G043_DTEMINOT'].setValue(
			[
				this.dataC(this.dtInicioDefault[0]),
				this.dataC(this.dtTerminoDefault[0])
			]
		);
	}

	ngDoCheck(){
		if(this.adminLayoutService.exibir == true){
			this.exibir = 1;
			this.arBreadcrumbsLocal = [];
			this.adminLayoutService.exibir = false;

			/*this.selected = false;
			this.auxGoBloqueio = true;
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
		}
	}

	filtrarAtendimentoByNfe(): void {
		this.objFormBuscaAtendimentoByNfe.controls['G043_IDG043'].setValue(this.IDG043_selecionada);
		this.grid.findDataTable('gridAtendimentosCriados','objFormBuscaAtendimentoByNfe');
	}

	// - Função que seta novos passos no breadcrumbs
	set(id, name, functionName,parameter, icon){
		let valid = true;
		let data = {
			id: id,
			name: name,
			function: functionName,
			parameter: parameter,
			icon: icon
		}

		for(let item of this.arBreadcrumbsLocal){
			if(item.id == data.id || item.name == name){
				valid = false;
			}
		}

		if(valid){
			this.arBreadcrumbsLocal.push(data);
		}
	}

	// - Função que volta para a primeira posição do Breadcrumbs
	goHome(event){
		this.objFormNewAtendimento.reset()
		this.arBreadcrumbsLocal = [];
		this.exibir = 1;

		this.guardFilter();
	}

	dataClick(event){
		if(event != null){
			let dia = event.year + '-' + event.month + '-' + event.day;
			this.diaSelecionado = new Date(dia);
			this.dataClicou = event;
			this.anoSelecionado = event.year;
		}
	}

	// - Limpar novos passos do breadcrumbs
	clearNext(item){
		let ar = [];
		for(let itemFor of this.arBreadcrumbsLocal){
			ar.push(itemFor);
			if(item.id == itemFor.id){
				break;
			}
		}
		this.arBreadcrumbsLocal = ar;
	}

	// - Método responsável para redirecionar
	bloquearNfe(IDG043) : void {
		this.utilServices.loadGridShow();
		let objNotas = JSON.parse(IDG043);
		this.IDG043_selecionada = objNotas.IDG043;
		this.IDG083_selecionada = objNotas.IDG083;
		this.IDG051_selecionada = objNotas.IDG051;

		if (objNotas.IDG014 == 5) {
			this.validSyngenta = true;
		} else {
			this.validSyngenta = false;
		}

		this.deliveryNfService.getStatusGeralNota({IDG043: this.IDG043_selecionada}).subscribe(
			data => {
				this.utilServices.loadGridHide();
				if (data.DTBLOQUE != null && (data.DTDESBLO == null || data.DTDESBLO == '')) {
					this.toastr.error('A nota já está bloqueada.');
					return false;
				} else if (data.DTENTREG != null) {
					this.toastr.error('A nota já está entregue.');
					return false;
				} else if(data.IDG046 != null && false){
					this.toastr.error('Essa nota possui uma carga.');
				}
				 else {
					let controllerView =
					{
						'IDG043'	: 	this.IDG043_selecionada,
						'NFE'		:	true,
						'IT_NFE'	: 	true,
						'CTE'		:	true,
						'NT_CTE'	:	true,
						'CARGA'		:	true,
						'RASTREIO': true,
						'IDG083': this.IDG083_selecionada,
						'IDG051': this.IDG051_selecionada != null ? this.IDG051_selecionada : ''
					}

					this.loadInformacoesNotaFiscal(controllerView);

					this.set(1,'Informações', 'goHome', this.IDG043_selecionada, 'fa fa-file-alt');

					this.exibir = 2;
				}
			},
			err => {
				this.utilServices.loadGridHide();
			}
		);
	}
	
	// - Método responsável para redirecionar
	liberarNfe(IDG043) {
		this.utilServices.loadGridShow();
		let objNotas = JSON.parse(IDG043);
		this.IDG043_selecionada = objNotas.IDG043;
		this.IDG083_selecionada = objNotas.IDG083;
		this.IDG051_selecionada = objNotas.IDG051;

		this.deliveryNfService.getStatusGeralNota({IDG043: this.IDG043_selecionada}).subscribe(
			data => {
				this.utilServices.loadGridHide();
				if (data.DTDESBLO != null) {
					this.toastr.error('A nota já está desbloqueada.');
					return false;
				}

				if (data.DTENTREG != null) {
					this.toastr.error('A nota já está entregue.');
					return false;
				}

				if (data.DTBLOQUE != null) {
					let controllerView =
					{
						'IDG043'	: this.IDG043_selecionada,
						'NFE'		:	true,
						'IT_NFE'	: 	true,
						'CTE'		:	true,
						'NT_CTE'	:	true,
						'CARGA'		:	true,
						'RASTREIO': true,
						'IDG083': this.IDG083_selecionada,
						'IDG051': this.IDG051_selecionada != null ? this.IDG051_selecionada : ''
					
					}

					this.loadInformacoesNotaFiscal(controllerView);

					this.set(1,'Informações', 'goHome', this.IDG043_selecionada, 'fa fa-file-alt');

					this.exibir = 3;
				} else {
					this.toastr.error('A nota não está bloqueada.');
					return false;
				}
			},
			err => {
				this.utilServices.loadGridHide();
			}
		);	
	}

	// - Verifica se a nota está bloqueada.
	getStatusGeralNota(IDG043): any {
		// - Show Loader
		this.utilServices.loadGridShow();

		this.deliveryNfService.getStatusGeralNota({IDG043: IDG043}).subscribe(
			data => {
				this.utilServices.loadGridHide();
				return data;
			},
			err => {
				this.utilServices.loadGridHide();
			}
		);
	}

	backToHome() : void {
		this.objFormNewAtendimento.reset()
		this.arBreadcrumbsLocal = [];
		this.exibir = 1;

		this.guardFilter();
	}

	dataC(event) {
		let thiscontext = '';
		if(event.day < 10){
			thiscontext = "0"+event.day;
		}else{
			thiscontext = event.day;
		}
		if(event.month < 10){
			thiscontext += "/0"+event.month;
		}else{
			thiscontext += "/"+event.month;
		}
		thiscontext += "/"+event.year;
		return thiscontext;
	}

	movAtendimento(IDA001) {
		this.IDA001_selected = IDA001;
		this.set(2,'Detalhes do Atendimento', 'movimentarAtendimento', '', 'fa fa-file-alt');
		this.exibir = 4;
	}

	guardFilter(){
		if(this.filterAux == 1){
			if(this.objFormFilterH.controls['G043_DTBLOQUE'].value != null){
				this.selected1 = false;
			}else{
				this.selected1 = true;
			}
			if(this.objFormFilterHome.controls['A008_IDA008'].value != null){
				this.selected2 = false;
			}else{
				this.selected2 = true;
			}
	
			this.auxGoBloqueio = true;
			
			if(this.objAux.dataInicioAux[0] != null || this.objAux.dataInicioAux[0] != undefined){
				this.dtInicioDefault = this.objAux.dataInicioAux;
			}else{
				this.dtInicioDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
			}
			
			if(this.objAux.dataFimAux[0] != null || this.objAux.dataFimAux[0] != undefined){
				this.dtTerminoDefault = this.objAux.dataFimAux;	
			}else{
				this.dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}];
			}
			
		}else{
			this.selected1 = true;
			this.selected2 = true;

			this.dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
			this.dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}]
		}	
	}
}
