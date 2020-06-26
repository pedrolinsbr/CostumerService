import { Component, OnInit, ViewChild, TemplateRef, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

import { AtendimentosService } 		from '../../services/crud/atendimentos.service';
import { DeliverysNfService } 		from '../../services/crud/deliverysNf.service';
import { IndicadorHome } 			from '../../models/indicador-home.model';
import { NotaFiscal } 				from '../../models/nota-fiscal.model';
import { ConhecimentoTransporte } 	from '../../models/conhecimento-transporte.model';
import { InformacoesCarga } 		from '../../models/informacoes-carga.model';
import { InformacoesRastreio } 		from '../../models/informacoes-rastreio.model';
import { InformacoesTracking } 		from '../../models/tracking.model';

import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-backlog',
	templateUrl: './backlog.component.html',
	styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit, DoCheck {
	global = new GlobalsServices();

	@ViewChild('modalConfirmaRemocao') modalConfirmaRemocao;

	IDA001_remover: number;
	
	public loadingModalAtendimento: boolean = false;

	arrayBotoes = [];

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
		dataFimAux:		[]
	};

	selected = true;
	auxGoBacklog = false;

	// - Controlador do Loading de Busca da NFE
	loadingNfe: boolean = false;

	// - Formgroup que representa o filtro da Datagrid inicial da Sac/Backlog
	objFormFilter : FormGroup;
	objFormFilterH: FormGroup;
	// - Formgroup que representa o filtro da Datagrid inicial da Sac/Backlog
	objFormFilterNfe: FormGroup;
	// - Formgroup para representar a busca de Nota Fiscal
	objFormSearchNfe: FormGroup;

	// - Formulario para exclusão do atendimento
	objFormRemoveAtendimento: FormGroup;

	// - Controlador de Filtro Avançado ou Simplificado
	advancedFilter: boolean = true;

	// - Controlador de busca de nota fiscal
	buscouNotaFiscal: boolean = false;

	// - Utilitário para componente de datepicker
	data             = new Date();
	dataMinima       = [{year: '', month: '', day: ''}];
	dataMaxima       = [{year: '', month: '', day: ''}];
	dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
	dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}];
	dataInicio       : any;
	horas            = [];
	busca            = '';
	mesSelecionado   = '';
	anoSelecionado   = '';
	diaDaSemana      : any;
	dataClicou       = [];
	diaSelecionado;
	DTinici 				 : any
	DTfinal 				 : any

	// - Utilitário para funcionar o Breadcrumbs
	@ViewChild('breadcrumbs') breadcrumbs;
	
	// - Objeto de Nota Fiscal Resumida
	nfeObj: NotaFiscal;
	cteObj: ConhecimentoTransporte;
	cargaObj: InformacoesCarga;
	rastreioObj: InformacoesRastreio;
	trackingObj: InformacoesTracking;

	// - Atendimento Selecionado pela Datagrid inicial.
	IDA001_selected: number;

	// - IDG043 - Nota Fiscal Buscada
	IDG043_searched: number;

	// - Valor responsável por informar em qual breadcrumbs nós estamos
	exibir = 1;
	// - Array que armazena os passos do Breadcrumbs
	arBreadcrumbsLocal = [];
	url = this.global.getApiHost();
	constructor(
		private formBuilder : FormBuilder,
		private grid 			  : DatagridComponent,
		private atendimentosService: AtendimentosService,
		private deliveryNfService: DeliverysNfService,
		private utilServices: UtilServices,
		private adminLayoutService: AdminLayoutService,
		private modal: ModalComponent,
		private toastr: ToastrService) {

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilter = formBuilder.group({
			NF				: [],
			IDG043			: [],
			IDG051			: [],
			G046_IDG046  	: [],
			G043_IDG005RE	: [],
			G043_IDG005DE	: [],
			G043_IDG024TR	: [],
			G043_IDG043  	: [],
			G043_NRNOTA		: [],
			G051_IDG051  	: [],
			G051_CDCTRC		: [],
			DESTINATARIO 	: [],
			A001_DTREGIST	: [],
			A008_IDA008  	: [],
			G051_TPTRANSP	: [],
			A006_DSSITUAC	: [],
			G051_IDG005CO: [],
			A001_SNDELETE:	[]
		});

		this.objFormFilterH = formBuilder.group({
			DTI				: [],
			DTF				: [],
			A008_IDA008		: [],
			G043_IDG005RE	: [],
			G043_IDG005DE	: [],
			G051_IDG005CO: []
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormSearchNfe = formBuilder.group({
			IDG043: []
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterNfe = formBuilder.group({
			NF: []
		});

		this.objFormRemoveAtendimento = formBuilder.group({
			DSREMOTI: [],
			IDA001: []
		})

	}

	ngOnInit() {

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

		this.objFormFilter.controls['A006_DSSITUAC'].setValue({in: ['Aberto','Encaminhado']});
	}

	ngDoCheck(){
		if(this.adminLayoutService.exibir == true){
			this.exibir = 1;
			this.arBreadcrumbsLocal = [];
			this.adminLayoutService.exibir = false;
			/*this.selected = false;
			this.auxGoBacklog = true;
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

	dataClick(event){
		let dia = event.year + '-' + event.month + '-' + event.day;
		this.diaSelecionado = new Date(dia);
		this.dataClicou = event;
		this.anoSelecionado = event.year;
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
		this.auxGoBacklog = true;
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
		this.auxGoBacklog = true;
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

	// - Função para abrir atendimento
	criarAtendimento() : void {
		this.set(1,"Novo Atendimento", "criarAtendimento", '', "fa fa-plus-square");
		this.exibir = 2;
	}


	movimentarAtendimento(IDA001) : void {
		this.IDA001_selected = IDA001;
		this.set(2,'Detalhes do Atendimento', 'movimentarAtendimento', '', 'fa fa-file-alt');
		this.exibir = 2;
	}

	backToAtendimento() : void {
		this.breadcrumbs.goBack();
		this.exibir = 1;

		this.selected = false;
		this.auxGoBacklog = true;
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

	showNFe() {
		this.set(2,"Detalhes da NFe", "showNFe", '', "fa fa-file-alt");
		this.exibir = 4;
		return false;
	}

	showCTe() {
		this.set(2,"Detalhes da CTe", "showCTe", '', "fa fa-file-alt");
		this.exibir = 5;
		return false;
	}

	filtrar(){

		this.objAux.IdCte = {in:[]};
		this.objAux.idNfe = {in:[]};
		this.objAux.G043_IDG005DE = [];
		this.objAux.G043_IDG005RE = [];
		this.objAux.G051_IDG005CO = [];

		if(this.objFormFilterH.controls['DTI'].value && this.objFormFilterH.controls['DTF'].value){
			this.objFormFilter.controls[ 'A001_DTREGIST' ].setValue([this.dataC(this.objFormFilterH.controls['DTI'].value),this.dataC(this.objFormFilterH.controls['DTF'].value)]);
		}else{
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

		if(this.objFormFilterH.controls['A008_IDA008'].value){
			if(this.objFormFilterH.controls['A008_IDA008'].value == 0){
				this.objFormFilter.controls['A008_IDA008'].setValue({in: [1,2]});
			}else{
				this.objFormFilter.controls['A008_IDA008'].setValue(this.objFormFilterH.controls['A008_IDA008'].value);

			}
		}

		if(this.objFormFilter.controls['A006_DSSITUAC'].value == null){
			this.objFormFilter.controls['A006_DSSITUAC'].setValue("Aberto");
		}

		if(this.objFormFilterH.controls['G051_IDG005CO'].value && this.objFormFilterH.controls['G051_IDG005CO'].value.length != 0){
			this.objAux.G051_IDG005CO = this.objFormFilterH.controls['G051_IDG005CO'].value;
			this.objFormFilter.controls['G051_IDG005CO'].setValue({in:this.objFormFilterH.controls['G051_IDG005CO'].value});
		}else{
			this.objFormFilter.controls['G051_IDG005CO'].setValue(null);
			this.objAux.G051_IDG005CO = null;
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

		this.find('gridAtendimentosCriados');
	}

	limpar(){
		this.objFormFilter.reset();
		this.objFormFilterH.reset();
		this.arIdCte.length = 0;
		this.arIdNfe.length = 0;
		this.objFormFilterH.controls['A008_IDA008'].setValue(0);
		this.objFormFilter.controls['A006_DSSITUAC'].setValue("Aberto");
	}

	find(id){ //ATUALIZAR DATA GRID
		this.grid.findDataTable(id);
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
					this.filtrar();
				},
				err => {
					console.log(err);
					this.loadingModalAtendimento = false;
					this.toastr.error("Erro ao remover o atendimento");
				}
			
			);
		}

	}

	closeModal(): void {
		this.modal.closeModal();
	}
}
