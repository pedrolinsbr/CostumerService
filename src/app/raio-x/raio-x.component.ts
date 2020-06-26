import { Component, OnInit, ViewChild, TemplateRef, HostListener, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
//import { GlobalsServices            } from '../shared/componentesbravo/src/app/services/globals.services';
import { GlobalsServices            } from '../services/globals.services';
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
  selector: 'app-raio-x',
  templateUrl: './raio-x.component.html',
  styleUrls: ['./raio-x.component.scss']
})

export class RaioXComponent implements OnInit,DoCheck {

	token = localStorage.getItem('token');

	global = new GlobalsServices();
	// - Utilitário para funcionar o Breadcrumbs
	@ViewChild('breadcrumbs') breadcrumbs;

	@ViewChild('dgNotasFiscaisHome') dgNotasFiscaisHome;
	@ViewChild('modalCargaCompleta') modalCargaCompleta;
	@ViewChild('modalNfeCompleta') modalNfeCompleta;
	@ViewChild('modalConhecimento') modalConhecimento;
	
	

	controllerFirstSearch: boolean = false;

	// ##### ARRAYS // OBJECTS
	arIdCte = [];
	arIdNfe =[];
	arIdCargaLog = [];

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
	};

	showCDUF = true;


	// - Formgroup que representa o filtro da Datagrid inicial da home
	objFormFilterNotas: FormGroup;
	objFormFilterCarga: FormGroup;
	objFormFilterAux: FormGroup;

	// - Objeto de Nota Fiscal Resumida
	nfeObj			: NotaFiscal;

	public loading = false;

	// - Nota Fiscal Selecionada
	IDG043_selecionada: number;
	IDG051_selecionada: number;


	// - Controlador de Filtro Avançado ou Simplificado
	advancedFilter: boolean = true;

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

	dataHoje = new Date();
	dataColetaAux = null;
	snCheckColetado = 0;

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

	controlView = 1;

	idCargaView = 0;

	idConhecimentoView = 0;


	url = this.global.getApiHost();

	constructor(
		private formBuilder: FormBuilder,
		private grid : DatagridComponent,
		private atendimentosService: AtendimentosService,
		private deliveryNfService: DeliverysNfService,
		private utilServices: UtilServices,
		private toastr: ToastrService,
		private adminLayoutService: AdminLayoutService,
		private modal : ModalComponent) {


		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterNotas = formBuilder.group({
			NF: [],
			IDG043:			[],
			IDG051:			[],
			IDG046:			[],
			IDG005RE:		[],
			IDG005DE:		[],
			IDG005_TRANSP:	[],
			NRNOTA:			[],
			NRCTE:			[],
			DTINICIO:		[],
			DTFIM:			[],
			DESTINATARIO:	[],
			G043_DTEMINOT:	[],
			G043_NRNOTA:	[],
			G051_IDG051:	[],
			G051_CDCTRC:	[],
			G051_IDG046:	[],
			G043_IDG005RE:	[],
			G043_IDG005DE:	[],
			G051_IDG024:	[],
			G051_TPTRANSP:	[],
			G051_IDG005CO:	[],
			G043_SNAG:		[],
			G043_DTENTREG:	[],
			G043_DTBLOQUE: [],
			G043_DTDESBLO: [],
			G051_CDCARGA: [],
			G051_STCTRC: 	[],
			A005_IDA001: 	[],
			G046_IDG024:	[],
			G051_IDG005RE:	[]
		});

		this.objFormFilterCarga = formBuilder.group({
			IDG051:			[],
			IDG046:			[],
			IDG005RE:		[],
			IDG005DE:		[],
			IDG005_TRANSP:	[],
			NRCTE:			[],
			G051_IDG051:	[],
			G051_CDCTRC:	[],
			G051_IDG046:	[],
			G051_IDG024:	[],
			G051_TPTRANSP:	[],
			G051_IDG005CO:	[],
			G051_CDCARGA: [],
			G051_STCTRC: 	[],
			G046_IDG024:	[],
			G051_IDG005RE:	[]
		});

		this.objFormFilterAux = formBuilder.group({
			DTINICIO: 		[],
			DTFIM: 			[],
			G043_NRNOTA: 	[],
			G051_CDCTRC:	[],
			G043_IDG005RE:	[],
			G043_IDG005DE: 	[],
			G051_IDG024: 	[],
			G051_IDG005CO: 	[],
			G051_IDG046: 	[],
			G043_DTENTREG:	[],
			G043_SNAG:		[],
			G043_DTBLOQUE: [],
			G043_DTDESBLO: [],
			G051_CDCARGA: [],
			G051_STCTRC: 	[],
			A005_IDA001: 	[],
			G046_IDG024:	[],
			G051_IDG005RE:	[]
		});

	}
	

	pFiltroIndicadores(){

		if (!this.objFormFilterNotas.controls['G043_DTEMINOT'].value && !this.controllerFirstSearch) {

			this.controllerFirstSearch = true;

			
			this.objFormFilterNotas.controls['G043_DTEMINOT'].setValue(
				[
					this.dataC(this.dtInicioDefault[0]),
					this.dataC(this.dtTerminoDefault[0])
				]
			);
		}


		this.grid.findDataTable('listarNotasFiscais', 'objFormFilterNotas');
	}

	IdCargaLog = {in:[]}
	  	  
	filtrarNotas() : void {


		this.objAux.IdCte = {in:[]};
		this.objAux.idNfe = {in:[]};
		this.IdCargaLog = {in:[]};

			
		if((this.objFormFilterAux.controls['DTFIM'].value != null) && (this.objFormFilterAux.controls['DTINICIO'].value !=null)){
			this.objFormFilterNotas.controls['G043_DTEMINOT'].setValue(
				[
				this.dataC(this.objFormFilterAux.controls['DTINICIO'].value),
				this.dataC(this.objFormFilterAux.controls['DTFIM'].value)
				]
				);
		}else{
			this.objFormFilterNotas.controls['G043_DTEMINOT'].setValue(null);
		}
			
		if(this.arIdNfe.length > 0 ){
			for(let i of this.arIdNfe){
			this.objAux.idNfe.in.push(i.name)
			}
			this.objFormFilterNotas.controls['G043_NRNOTA'].setValue(this.objAux.idNfe);
		}else{
			this.objFormFilterNotas.controls['G043_NRNOTA'].setValue(null);
		}

		if(this.arIdCte.length > 0 ){
			for(let i of this.arIdCte){
			this.objAux.IdCte.in.push(i.name)
			}
			this.objFormFilterNotas.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
		}else{
			this.objFormFilterNotas.controls['G051_CDCTRC'].setValue(null);
		}

		if(this.arIdCargaLog.length > 0 ){
			for(let i of this.arIdCargaLog){
			this.IdCargaLog.in.push(i.name)
			}
			this.objFormFilterNotas.controls['G051_CDCARGA'].setValue(this.IdCargaLog);
		}else{
			this.objFormFilterNotas.controls['G051_CDCARGA'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G043_IDG005RE'].value &&  this.objFormFilterAux.controls['G043_IDG005RE'].value.length != 0){
			this.objFormFilterNotas.controls['G043_IDG005RE'].setValue({in:this.objFormFilterAux.controls['G043_IDG005RE'].value});

		}else{
			this.objFormFilterNotas.controls['G043_IDG005RE'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G043_IDG005DE'].value && this.objFormFilterAux.controls['G043_IDG005DE'].value.length != 0){
			this.objFormFilterNotas.controls['G043_IDG005DE'].setValue({in:this.objFormFilterAux.controls['G043_IDG005DE'].value});
		}else{
			this.objFormFilterNotas.controls['G043_IDG005DE'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G046_IDG024'].value && this.objFormFilterAux.controls['G046_IDG024'].value.length != 0){
			this.objFormFilterNotas.controls['G046_IDG024'].setValue({in:this.objFormFilterAux.controls['G046_IDG024'].value});

		}else{
			this.objFormFilterNotas.controls['G046_IDG024'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G051_IDG024'].value && this.objFormFilterAux.controls['G051_IDG024'].value.length != 0){
			this.objFormFilterNotas.controls['G051_IDG024'].setValue({in:this.objFormFilterAux.controls['G051_IDG024'].value});

		}else{
			this.objFormFilterNotas.controls['G051_IDG024'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G051_IDG046'].value){
			this.objFormFilterNotas.controls['G051_IDG046'].setValue(this.objFormFilterAux.controls['G051_IDG046'].value.text);
		}else{
			this.objFormFilterNotas.controls['G051_IDG046'].setValue(null);
		}

		if (this.objFormFilterAux.controls['G043_SNAG'].value == 0) {
			this.objFormFilterNotas.controls['G043_SNAG'].setValue({ 'null' : true });
		} else if (this.objFormFilterAux.controls['G043_SNAG'].value == 1) {
			this.objFormFilterNotas.controls['G043_SNAG'].setValue({ 'null' : false });
		} else if (this.objFormFilterAux.controls['G043_SNAG'].value == 2) {
			this.objFormFilterNotas.controls['G043_SNAG'].setValue('');
		}

		if (this.objFormFilterAux.controls['G043_DTENTREG'].value == 0) {
			this.objFormFilterNotas.controls['G043_DTENTREG'].setValue({ 'null' : true });
		} else if (this.objFormFilterAux.controls['G043_DTENTREG'].value == 1) {
			this.objFormFilterNotas.controls['G043_DTENTREG'].setValue({ 'null' : false });
		} else {
			this.objFormFilterNotas.controls['G043_DTENTREG'].setValue('');
		}

		if(this.objFormFilterAux.controls['G051_IDG005CO'].value && this.objFormFilterAux.controls['G051_IDG005CO'].value.length != 0){
			this.objFormFilterNotas.controls['G051_IDG005CO'].setValue({in:this.objFormFilterAux.controls['G051_IDG005CO'].value});
		}else{
			this.objFormFilterNotas.controls['G051_IDG005CO'].setValue(null);
		}

		if (this.objFormFilterAux.controls['G043_DTBLOQUE'].value == 0) {
			this.objFormFilterNotas.controls['G043_DTDESBLO'].setValue({ 'null' : false });
			this.objFormFilterNotas.controls['G043_DTBLOQUE'].setValue({'null' : false});
		} else if (this.objFormFilterAux.controls['G043_DTBLOQUE'].value == 1) {
			this.objFormFilterNotas.controls['G043_DTBLOQUE'].setValue({ 'null' : false });
			this.objFormFilterNotas.controls['G043_DTDESBLO'].setValue({'null' : true});
		} else if (this.objFormFilterAux.controls['G043_DTBLOQUE'].value == 2) {
			this.objFormFilterNotas.controls['G043_DTBLOQUE'].setValue('');
			this.objFormFilterNotas.controls['G043_DTDESBLO'].setValue('');
		}

		this.grid.findDataTable('listarNotasFiscais', 'objFormFilterNotas');
		
	}


	filtrarCarga() : void {


		this.objAux.IdCte = {in:[]};
		this.IdCargaLog = {in:[]};

		if(this.arIdCte.length > 0 ){
			for(let i of this.arIdCte){
			this.objAux.IdCte.in.push(i.name)
			}
			this.objFormFilterCarga.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
		}else{
			this.objFormFilterCarga.controls['G051_CDCTRC'].setValue(null);
		}

		if(this.arIdCargaLog.length > 0 ){
			for(let i of this.arIdCargaLog){
			this.IdCargaLog.in.push(i.name)
			}
			this.objFormFilterCarga.controls['G051_CDCARGA'].setValue(this.IdCargaLog);
		}else{
			this.objFormFilterCarga.controls['G051_CDCARGA'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G046_IDG024'].value && this.objFormFilterAux.controls['G046_IDG024'].value.length != 0){
			this.objFormFilterCarga.controls['G046_IDG024'].setValue({in:this.objFormFilterAux.controls['G046_IDG024'].value});

		}else{
			this.objFormFilterCarga.controls['G046_IDG024'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G051_IDG024'].value && this.objFormFilterAux.controls['G051_IDG024'].value.length != 0){
			this.objFormFilterCarga.controls['G051_IDG024'].setValue({in:this.objFormFilterAux.controls['G051_IDG024'].value});

		}else{
			this.objFormFilterCarga.controls['G051_IDG024'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G051_IDG046'].value){
			this.objFormFilterCarga.controls['G051_IDG046'].setValue(this.objFormFilterAux.controls['G051_IDG046'].value.text);
		}else{
			this.objFormFilterCarga.controls['G051_IDG046'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G051_IDG005CO'].value && this.objFormFilterAux.controls['G051_IDG005CO'].value.length != 0){
			this.objFormFilterCarga.controls['G051_IDG005CO'].setValue({in:this.objFormFilterAux.controls['G051_IDG005CO'].value});
		}else{
			this.objFormFilterCarga.controls['G051_IDG005CO'].setValue(null);
		}

		if(this.objFormFilterAux.controls['G051_IDG005RE'].value &&  this.objFormFilterAux.controls['G051_IDG005RE'].value.length != 0){
			this.objFormFilterCarga.controls['G051_IDG005RE'].setValue({in:this.objFormFilterAux.controls['G051_IDG005RE'].value});

		}else{
			this.objFormFilterCarga.controls['G051_IDG005RE'].setValue(null);
		}

		this.grid.findDataTable('carga', 'objFormFilterCarga');
		
	}


	limparNotas(){
		this.objFormFilterAux.reset();
		this.objFormFilterNotas.reset();
		this.arIdCte.length = 0;
		this.arIdNfe.length = 0;
		this.arIdCargaLog.length = 0;
	}

	limparCarga(){
		this.objFormFilterAux.reset();
		this.objFormFilterCarga.reset();
		this.arIdCte.length = 0;
		this.arIdCargaLog.length = 0;
	}


	// - Função para carregar informações da Nota Fiscal
	loadInformacoesNotaFiscal(objReq): void {
		this.loading = true;

		this.deliveryNfService.getInformacoesNotaFiscal(objReq).subscribe(
			data => {
				this.nfeObj = data.NFE;
				this.loading = false;
				this.modal.open(this.modalNfeCompleta,{ size: 'lg', windowClass: 'modal-adaptive' });
		
			
			},
			err => {
				this.toastr.error('Erro ao buscar informações. ');
			}
		);
	}


	ngOnInit() {

	}

	ngDoCheck(){
		if(this.adminLayoutService.exibir == true){
			this.exibir = 1;
			this.arBreadcrumbsLocal = [];
			this.adminLayoutService.exibir = false;
		}
	}



	dataClick(event){
		if(event != null){
			let dia = event.year + '-' + event.month + '-' + event.day;
			this.diaSelecionado = new Date(dia);
			this.dataClicou = event;
			this.anoSelecionado = event.year;
		}
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

	changeOptionView(opc){

		this.advancedFilter = true;

		this.controlView = opc;
		// if(this.objFormFilter.controls['TPDOCUME'].value.id == 1) {
		//   this.isCTRC = false;
		//   this.isDelivery = true;
		// } else {
		//   this.isCTRC = true;
		//   this.isDelivery = false;
		// }
	
		// this.validOptionsView = opc;
		// this.filtrar(true);
	  }

	viewCarga(id) {
		console.log(id);
	
		this.idCargaView = id;		
	
		this.modal.open(this.modalCargaCompleta,{ size: 'lg', windowClass: 'modal-adaptive' });
	}

	closeModal() {
		this.modal.closeModal();
	}

	viewNota(objNotas) : void {
		

		this.IDG043_selecionada = objNotas.IDG043;
		this.IDG051_selecionada = objNotas.IDG051;

		let controllerView =
		{
			'IDG043'	:	this.IDG043_selecionada,
			'IDG051'	:	this.IDG051_selecionada,
			'NFE'		:	true,
			'IT_NFE'	:	true,
			'CTE'		:	false,
			'NT_CTE'	:	false,
			'CARGA'		:	false,
			'RASTREIO'	:	false,
			'TRACKING'	:	false,
			'EMAIL'		:	false
		}

		this.loadInformacoesNotaFiscal(controllerView);		
		
	}

	goHome(event) {
		this.arBreadcrumbsLocal = [];
		this.exibir = 1;

		return false;
	}

	viewConhecimento(obj) {
   

		this.idConhecimentoView = obj;
   
		console.log('codigo',obj);

		
		this.modal.open(this.modalConhecimento, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
   
	 }
	
		
   
	

}
