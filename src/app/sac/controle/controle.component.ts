// - Angular Components
import { Component, OnInit, ViewChild, DoCheck, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
// - Services
import { AtendimentosService } 		from '../../services/crud/atendimentos.service';
import { DeliverysNfService } 		from '../../services/crud/deliverysNf.service';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
//import { GlobalsServices } from '../../services/globals.services';
// - Models
import { IndicadorHome } 			from '../../models/indicador-home.model';
import { NotaFiscal } 				from '../../models/nota-fiscal.model';
import { ConhecimentoTransporte } 	from '../../models/conhecimento-transporte.model';
import { InformacoesCarga } 		from '../../models/informacoes-carga.model';
import { InformacoesRastreio } 		from '../../models/informacoes-rastreio.model';
import { InformacoesTracking } 		from '../../models/tracking.model';
import { ToastrService } from 'ngx-toastr';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { find } from 'rxjs/operator/find';

@Component({
	selector: 'app-controle',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './controle.component.html',
	styleUrls: ['./controle.component.css']
})
export class ControleComponent implements OnInit, DoCheck {
	@ViewChild('componentAtendentes') componentAtendentes: any;
	@ViewChild('componentClientes') componentClientes: any;
	@ViewChild('modalVinculoAtendente') modalVinculoAtendente: any;
	@ViewChild('modalDeleteVinculoAtend') modalDeleteVinculoAtend: any;
	// - Utilitário para funcionar o Breadcrumbs
	@ViewChild('breadcrumbs') breadcrumbs;
	@ViewChild('tab') tab;

	// ##### ARRAYS // OBJECTS
	arIdCte = [];
	arIdNfe =[];

	objStyle             = {
		'background' : '#43295b',
		'color'      : '#ffffff',
		'iconColor'  : '#ffffff',
		'iconOpacity': '0.5'
	};

	objAux = {
		IdCte: 			{in:[]},
		idNfe: 			{in:[]},
		G043_IDG005RE:	[],
		G043_IDG005DE: 	[],
		G051_IDG005CO: 	[],
		dataInicioAux:  [],
		dataFimAux:		[],
		//G043_SNAG:		[],
		G051_TPTRANSP:  []
	};

	selected = true;
	auxGoCockpit = false;

	DTfinal: any;
	DTinici: any;

	// - Global Services
	global = new GlobalsServices();
	url = this.global.getApiHost();

	// - Controller para saber se o usuário buscou nota fiscal.
	buscouNotaFiscal: boolean = false;

	// - Atendimento Selecionado pela Datagrid inicial.
	IDA001_selected: number;

	// - IDG043 - Nota Fiscal Buscada
	IDG043_searched: number;

	// - Controller do loading de busca da nota fiscal
	loadingNfe: boolean = false;

	loadingModal: boolean = false;

	// - ID da tabela de vinculo de atendentes com a operação
	IDA018: number;

	// - FormGroups
	objFormFilter : FormGroup;
	objFormFilterH: FormGroup;
	objFormSearchNfe: FormGroup; // - Formgroup para representar a busca de Nota Fiscal
	objFormVinculoAtendimento: FormGroup;
	
	// - Controller do app-card-filter para filtros avançados
	advancedFilter: boolean = false;

	// - Array de Atendentes e Clientes selecionados.
	arAtendentesSelecionados = [];
	arClientesSelecionados = [];
	
	arOperacoes = [];

	// - Array que armazena os passos do Breadcrumbs
	arBreadcrumbsLocal = [];

	//- Controller para saber em que passo você está do breadcrumbs.
	exibir: number = 1;

	// - Objetos para bindagem dos components
	nfeObj: NotaFiscal;
	cteObj: ConhecimentoTransporte;
	cargaObj: InformacoesCarga;
	rastreioObj: InformacoesRastreio;
	trackingObj: InformacoesTracking;

	constructor(
		private formBuilder 		: FormBuilder,
		private grid 			  	: DatagridComponent,
		private atendimentosService	: AtendimentosService,
		private deliveryNfService	: DeliverysNfService,
		private toastr:		ToastrService,
		private mensagens : MensagensComponent,
		private adminLayoutService: AdminLayoutService,
		private modal: ModalComponent,) {
		// - Filtro da Datagrid Inicial da Home
		this.objFormFilter = formBuilder.group({
			NF    			: [],
			IDG043			: [],
			IDG051			: [],
			G046_IDG046  	: [],
			S001_IDS001  	: [],
			G043_IDG005RE	: [],
			G043_IDG005DE	: [],
			G043_IDG024TR	: [],
			G043_IDG043  	: [],
			G043_NRNOTA		: [],
			G051_IDG051  	: [],
			G051_CDCTRC		: [],
			A001_DTREGIST	: [],
			A008_IDA008  	: [],
			A006_DSSITUAC 	: [],
			G014_IDG014		: [],
			G051_IDG005CO	: [],
			G043_SNAG		: [],
			G051_TPTRANSP	: [],
			G051_IDG005RE	: []
		});

		this.objFormFilterH = formBuilder.group({
			DTI			 : [],
			DTF			 : [],
			A008_IDA008  : [],
			G043_IDG005RE: [],
			G043_IDG005DE: [],
			G051_IDG005CO: [],
			G043_SNAG	 : [],
			G051_TPTRANSP: [],
			G051_IDG005RE: [] 	 
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormSearchNfe = formBuilder.group({
			IDG043: []
		});

		this.objFormVinculoAtendimento = formBuilder.group({
			S001_IDS001: [],
			G014_IDG014: []
		});

	}

	ngOnInit() {

	}

	ngDoCheck(){
		if(this.adminLayoutService.exibir == true){
			this.exibir = 1;
			this.arBreadcrumbsLocal = [];
			this.adminLayoutService.exibir = false;

			/*this.selected = false;
			this.auxGoCockpit = true;

			if(this.objAux.dataInicioAux[0] != null){
				this.DTinici = this.objAux.dataInicioAux;
			}else{
				this.DTinici = null;
			}
			if(this.objAux.dataFimAux[0] != null){
				this.DTfinal = this.objAux.dataFimAux;
			}else{
				this.DTfinal = null;
			}*/
		}
	}

	getAtendentesSelecionados(event) {
		this.arOperacoes = [];

		if (this.tab.activeId == 'atendentes') {
			this.arAtendentesSelecionados = event;

			for (let i = 0; i < event.length; i++){
				this.arOperacoes.push(event[i].IDG014);
			}
			this.objFormFilter.controls['G014_IDG014'].setValue({in: this.arOperacoes});
		}
		
		this.find('gridAt');
	}

	stFiltrandoAtendentes= false;
	getStFiltrandoAtendentes(event){
		if (event) {
			this.stFiltrandoAtendentes = true;
		} else {
			this.stFiltrandoAtendentes = false;
		}
	}

	stFiltrandoClientes= false;
	getStFiltrandoClientes(event) {
		if (event) {
			this.stFiltrandoClientes = true;
		} else {
			this.stFiltrandoClientes = false;
		}
	}

	getClientesSelecionados(event) {
		if (this.tab.activeId != 'atendentes') {
			this.arClientesSelecionados = event;
			this.objFormFilter.controls['G014_IDG014'].setValue({ in: event });
			this.objFormFilter.controls['S001_IDS001'].setValue(null);
		}
		
		this.find('gridAt');
	}

	filtrar() {

		this.objAux.IdCte = {in:[]};
		this.objAux.idNfe = {in:[]};
		this.objAux.G051_IDG005CO = [];
		this.objAux.G043_IDG005DE = [];
		this.objAux.G043_IDG005RE = [];

		if(this.objFormFilterH.controls['DTI'].value && this.objFormFilterH.controls['DTF'].value) {
			this.objFormFilter.controls[ 'A001_DTREGIST' ].setValue([this.dataC(this.objFormFilterH.controls['DTI'].value),this.dataC(this.objFormFilterH.controls['DTF'].value)]);
		}else{
			this.toastr.warning('Realizando o filtro sem data ínicio e data fim.');
			this.objFormFilter.controls[ 'A001_DTREGIST' ].setValue(null);
		}

		this.objAux.dataInicioAux[0] = this.objFormFilterH.controls['DTI'].value;
		this.objAux.dataFimAux[0] = this.objFormFilterH.controls['DTF'].value;

		if(this.objFormFilterH.controls['G043_IDG005RE'].value &&  this.objFormFilterH.controls['G043_IDG005RE'].value.length != 0){
			this.objAux.G043_IDG005RE = this.objFormFilterH.controls['G043_IDG005RE'].value;
			this.objFormFilter.controls['G043_IDG005RE'].setValue({in:this.objFormFilterH.controls['G043_IDG005RE'].value});
		}else{
			this.objAux.G043_IDG005RE = null;
		}

		if(this.objFormFilterH.controls['G043_IDG005DE'].value && this.objFormFilterH.controls['G043_IDG005DE'].value.length != 0){
			this.objAux.G043_IDG005DE = this.objFormFilterH.controls['G043_IDG005DE'].value;
			this.objFormFilter.controls['G043_IDG005DE'].setValue({in:this.objFormFilterH.controls['G043_IDG005DE'].value});
		}else{
			this.objAux.G043_IDG005DE = null;
		}

		if(this.arIdNfe.length > 0 ){
			for(let i of this.arIdNfe){
			  this.objAux.idNfe.in.push(i.name)
			}
			this.objFormFilter.controls['G043_NRNOTA'].setValue(this.objAux.idNfe);
		}else{
			this.objFormFilter.controls['G043_NRNOTA'].setValue(null);
		  }

		if(this.arIdCte.length > 0 ){
			for(let i of this.arIdCte){
			  this.objAux.IdCte.in.push(i.name)
			}
			this.objFormFilter.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
		}else{
			this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
		}

		if(this.objFormFilterH.controls['A008_IDA008'].value){
			if(this.objFormFilterH.controls['A008_IDA008'].value == 0){
				this.objFormFilter.controls['A008_IDA008'].setValue({in: [1,2]});
			}else{
				this.objFormFilter.controls['A008_IDA008'].setValue({in: this.objFormFilterH.controls['A008_IDA008'].value});
			}
		}

		if(this.objFormFilterH.controls['G051_IDG005CO'].value && this.objFormFilterH.controls['G051_IDG005CO'].value.length != 0){
			this.objAux.G051_IDG005CO = this.objFormFilterH.controls['G051_IDG005CO'].value;
			this.objFormFilter.controls['G051_IDG005CO'].setValue({in:this.objFormFilterH.controls['G051_IDG005CO'].value});
		}else{
			this.objFormFilter.controls['G051_IDG005CO'].setValue(null);
			this.objAux.G051_IDG005CO = null;
		}

		//Operação AG
		if (this.objFormFilterH.controls['G043_SNAG'].value == 0) {
			this.objFormFilter.controls['G043_SNAG'].setValue({ 'null': true });
		} else if (this.objFormFilterH.controls['G043_SNAG'].value == 1) {
			this.objFormFilter.controls['G043_SNAG'].setValue({ 'null': false });
		} else if (this.objFormFilterH.controls['G043_SNAG'].value == 2) {
			this.objFormFilter.controls['G043_SNAG'].setValue('');
		}

		//Tipo de operação
		if (this.objFormFilterH.controls['G051_TPTRANSP'].value && this.objFormFilterH.controls['G051_TPTRANSP'].value.length != 0) {
			this.objAux.G051_TPTRANSP = this.objFormFilterH.controls['G051_TPTRANSP'].value;
			this.objFormFilter.controls['G051_TPTRANSP'].setValue({ in: this.objFormFilterH.controls['G051_TPTRANSP'].value });
		} else {
			this.objFormFilter.controls['G051_TPTRANSP'].setValue(null);
			this.objAux.G051_TPTRANSP = null;
		}

		//Filial
		if(this.objFormFilterH.controls['G051_IDG005RE'].value &&  this.objFormFilterH.controls['G051_IDG005RE'].value.length != 0){
			this.objFormFilter.controls['G051_IDG005RE'].setValue({in:this.objFormFilterH.controls['G051_IDG005RE'].value});
		}else{
			this.objFormFilter.controls['G051_IDG005RE'].setValue(null);
		}

		if(this.objFormFilter.controls['A006_DSSITUAC'].value == null){
			this.objFormFilter.controls['A006_DSSITUAC'].setValue({in: ['Aberto','Encaminhado']});
		}
		
		if (this.tab.activeId == 'atendentes') {
			this.componentAtendentes.getAtendentes(this.objFormFilter.value);
			this.componentAtendentes.selecionados();
		} else {
			this.componentClientes.getClientes(this.objFormFilter.value);
			this.componentClientes.selecionados();
		}

		//this.find('gridAt');
	}

	limpar(){
		this.objFormFilter.reset();
		this.objFormFilterH.reset();
		this.arIdCte.length = 0;
		this.arIdNfe.length = 0;
		this.objFormFilterH.controls['A008_IDA008'].setValue(0);
		if (this.stFiltrandoAtendentes) {

			this.arOperacoes = [];
			for (let i = 0; i < this.arAtendentesSelecionados.length; i++){
				this.arOperacoes.push(event[i].IDG014);
			}

			this.objFormFilter.controls['G014_IDG014'].setValue({in: this.arOperacoes});
		}

		if (this.stFiltrandoClientes) {
			this.objFormFilter.controls['G014_IDG014'].setValue({in: this.arClientesSelecionados});
		}

	}

	find(id) { //ATUALIZAR DATA GRID
		if(this.objFormFilter.controls['A006_DSSITUAC'].value == null){
			this.objFormFilter.controls['A006_DSSITUAC'].setValue({in: ['Aberto','Encaminhado']});
		}
		this.grid.findDataTable(id);
	}

	qualClick(){
		this.arAtendentesSelecionados = [];
		this.arOperacoes = [];
		this.componentAtendentes.stFiltrando = false;
		this.stFiltrandoAtendentes= false;
		for(let i of this.componentAtendentes.arrayDNada){
			i.selected = true;
		}
		this.componentAtendentes.selecionados();
		this.objFormFilter.controls['S001_IDS001'].setValue(null);
		this.find('gridAt');
	}

	qualClick2(){
		this.arClientesSelecionados = [];
		this.componentClientes.stFiltrando = false;
		this.stFiltrandoClientes= false;
		for(let i of this.componentClientes.arrayDNada){
			i.selected = true;
		}
		this.componentClientes.selecionados();
		this.objFormFilter.controls['G014_IDG014'].setValue(null);
		this.find('gridAt');
	}

	dataC(event) {
		let thiscontext = '';
		if(event.day < 10){
			thiscontext = "0"+event.day;
		} else {
			thiscontext = event.day;
		}

		if (event.month < 10) {
			thiscontext += "/0"+event.month;
		} else {
			thiscontext += "/"+event.month;
		}
		thiscontext += "/"+event.year;
		return thiscontext;
	}

	funcNd() {
		console.log(this.tab.activeId);
		if (this.tab.activeId == 'atendentes') { 
			this.componentAtendentes.selecionados();
		} else {
			this.componentClientes.selecionados();
		}
		
		
	}

	backToAtendimento() : void {
		this.breadcrumbs.goBack();
		this.exibir = 1;

		this.selected = false;
		this.auxGoCockpit = true;

		if(this.objAux.dataInicioAux[0] != null){
			this.DTinici = this.objAux.dataInicioAux;
		}else{
			this.DTinici = null;
		}
		if(this.objAux.dataFimAux[0] != null){
			this.DTfinal = this.objAux.dataFimAux;
		}else{
			this.DTfinal = null;
		}
	}

	movimentarAtendimento(IDA001) : void {
		this.IDA001_selected = IDA001;
		this.set(2,'Detalhes do Atendimento', 'movimentarAtendimento', '', 'fa fa-file-alt');
		this.exibir = 2;
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
		this.cancelarCadastro();
		this.selected = false;
		this.auxGoCockpit = true;

		if(this.objAux.dataInicioAux[0] != null){
			this.DTinici = this.objAux.dataInicioAux;
		}else{
			this.DTinici = null;
		}
		if(this.objAux.dataFimAux[0] != null){
			this.DTfinal = this.objAux.dataFimAux;
		}else{
			this.DTfinal = null;
		}

	}

	// - Função que volta para o primeiro indice do Breadcrumbs
	cancelarCadastro() {
		this.arBreadcrumbsLocal = [];
		this.exibir = 1;

		this.selected = false;
		this.auxGoCockpit = true;

		if(this.objAux.dataInicioAux[0] != null){
			this.DTinici = this.objAux.dataInicioAux;
		}else{
			this.DTinici = null;
		}
		if(this.objAux.dataFimAux[0] != null){
			this.DTfinal = this.objAux.dataFimAux;
		}else{
			this.DTfinal = null;
		}

		return false;
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
		this.arBreadcrumbsLocal = ar
	}

	buscarNotaFiscal() : void {
		if (
			this.objFormSearchNfe.controls['IDG043'].value.id != null &&
			this.objFormSearchNfe.controls['IDG043'].value.id != undefined &&
			this.objFormSearchNfe.controls['IDG043'].value.id != '') {

			this.IDG043_searched = this.objFormSearchNfe.controls['IDG043'].value.id;
			this.buscouNotaFiscal = true;

			let controllerView =
			{
				'IDG043'	: 	this.IDG043_searched,
				'NFE'		:	true,
				'IT_NFE'	: 	true,
				'CTE'		:	true,
				'NT_CTE'	:	true,
				'CARGA'		:	true,
				'RASTREIO'	:	true,
				'TRACKING'	:	true
			}

			this.loadInformacoesNotaFiscal(controllerView);

		}
	}

	// - Função para carregar informações da Nota Fiscal
	loadInformacoesNotaFiscal(objReq): void {
		this.loadingNfe = true;

		this.deliveryNfService.getInformacoesNotaFiscal(objReq).subscribe(
			data => {
				this.nfeObj = data.NFE;
				this.cteObj = data.CTE;
				this.cargaObj = data.CARGA;
				this.rastreioObj = data.RASTREAMENTO;
				this.trackingObj = data.TRACKING;
				this.loadingNfe = false;
			},
			err => {
				this.loadingNfe = false;
			}
		);
	}

	configAtendentes() {
		this.set(3,'Vinculo de Atendentes', 'configAtendentes', '', 'fas fa-user');
		this.exibir = 3;
	}

	openVincularAtendente() {
		this.modal.open(this.modalVinculoAtendente,{ size: 'lg' });
	}

	openDeleteVinculoAtend(id) {
		this.modal.open(this.modalDeleteVinculoAtend);
		this.IDA018 = id;
	}

	vincularAtendOperac() {
		if (this.objFormVinculoAtendimento.controls['S001_IDS001'].value == null || this.objFormVinculoAtendimento.controls['S001_IDS001'].value == '') {
			this.toastr.warning('O campo do atendente é obrigatório');
		} else if (this.objFormVinculoAtendimento.controls['G014_IDG014'].value == null || this.objFormVinculoAtendimento.controls['G014_IDG014'].value == '') {
			this.toastr.warning('O campo da operação é obrigatório');
		} else {

			this.loadingModal = true;

			let objParam = {
				IDS001: this.objFormVinculoAtendimento.controls['S001_IDS001'].value.id,
				IDG014: this.objFormVinculoAtendimento.controls['G014_IDG014'].value.id
			}

			this.atendimentosService.vincularAtendente(objParam).subscribe(
				data => {
					console.log(data);
					this.objFormVinculoAtendimento.reset();
					this.toastr.success('Vínculo criado com sucesso');
					this.loadingModal = false;
					this.closeModal();
					this.find('gridVinculoAtend');
					
				},
				err => {
					console.log(err);
					this.loadingModal = false;
					this.toastr.error('Erro ao criar vínculo');
				}
			)
		}

		
	}

	removerVinculoAtend() {
		this.loadingModal = true;

		let objParam = {
			IDA018: this.IDA018
		}

		this.atendimentosService.removerVinculoAtend(objParam).subscribe(
			data => {
				console.log(data);
				this.toastr.success('Vínculo do atendente removido com sucesso');
				this.closeModal();
				this.loadingModal = false;
				this.find('gridVinculoAtend');
			},
			err => {
				console.log(err);
				this.toastr.error('Erro ao remover o vínculo do atendente');
				this.loadingModal = false;
			}
		)

	}

	closeModal(): void {
		this.modal.closeModal();
	}
	
}