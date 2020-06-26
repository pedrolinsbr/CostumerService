//## IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, HostListener, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


//## COMPONENTES BRAVO
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

//## SERVICES
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { DeliverysNfService } from '../../services/crud/deliverysNf.service';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { parse } from 'querystring';



@Component({
	selector: 'app-arquivos-qm',
	encapsulation: ViewEncapsulation.None,
  templateUrl: './arquivos-qm.component.html',
  styleUrls: ['./arquivos-qm.component.scss']
})

export class ArquivosQmComponent implements OnInit {
	private global = new GlobalsServices();
	url = this.global.getApiHost();

	public Editor = ClassicEditor;

	@ViewChild('modalViewConteudoQM') private modalViewConteudoQM;
	@ViewChild('modalViewDetalheQM') private modalViewDetalheQM;

	//##### FORMS
	objFormFilter    : FormGroup;
	objFormFilterH: FormGroup;
	objFormFilterConteudo   : FormGroup;

	//###### DATAS
	data             = new Date();
	dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
	dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}]
	mesSelecionado   = '';
	anoSelecionado   = '';
	dataClicou       = [];
	diaSelecionado;

	//Variavel auxiliar para o select
	selected: boolean = true;

	//dados recebidos
	listArquivos = [];
	listConteudoQM = [];
	public detalheArquivo;

	//Parametro objeto 
	objParams = {
		TRANSPORTADORA: '',
		PASTA: '',
		ARQUIVO:'',
		NRNOTA:''
	}

	constructor(
	private formBuilder : FormBuilder,
	private grid        : DatagridComponent,
	private toastr      : ToastrService,
	private utilServices: UtilServices,
	private deliveryService: DeliverysNfService,
	private modal : ModalComponent) {
		
		this.objFormFilter = formBuilder.group({
			DT_PROCESS: [],
			NM_PASTA: 	[],
			NM_TRANSP: 	[],
			G043_NRNOTA:[]
		});


		this.objFormFilterH = formBuilder.group({
			DT_PROCESS: [],
			NM_PASTA: 	[],
			NM_TRANSP: 	[],
			G043_NRNOTA:[]
		});

		this.objFormFilterConteudo = formBuilder.group({
			NRNOTA: []
		});


	}

	ngOnInit() {

	}

	dataClick(event) {
		
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
			thiscontext += "_0"+event.month;
		}else{
			thiscontext += "_"+event.month;
		}
		thiscontext += "_"+event.year;
		return thiscontext;

	}


	filtrarHome() : void {

		// RANGE DATA EMISSÃO NF
		if (this.objFormFilterH.controls['DT_PROCESS'].value != null) {
			
			this.objFormFilter.controls['DT_PROCESS'].setValue(this.dataC(this.objFormFilterH.controls['DT_PROCESS'].value));

		}else{
			this.objFormFilter.controls['DT_PROCESS'].setValue(null);
		}

		if (this.objFormFilterH.controls['NM_PASTA'].value != null) {

			if (this.objFormFilterH.controls['NM_PASTA'].value == 2) {
				this.objFormFilter.controls['NM_PASTA'].setValue('in');
			} else if (this.objFormFilterH.controls['NM_PASTA'].value == 3) {
				this.objFormFilter.controls['NM_PASTA'].setValue('out');
			} else {
				this.objFormFilter.controls['NM_PASTA'].setValue(null);
			}
			
		} else {
			this.objFormFilter.controls['NM_PASTA'].setValue(null);
		}

		if (this.objFormFilterH.controls['NM_TRANSP'].value != null) {
			this.objFormFilter.controls['NM_TRANSP'].setValue(this.objFormFilterH.controls['NM_TRANSP'].value.text);
		} else {
			this.objFormFilter.controls['NM_TRANSP'].setValue(null);
		}

		if (this.objFormFilterH.controls['G043_NRNOTA'].value != null) {
			this.objFormFilter.controls['G043_NRNOTA'].setValue(this.objFormFilterH.controls['G043_NRNOTA'].value);
		} else {
			this.objFormFilter.controls['G043_NRNOTA'].setValue(null);
		}

		if (this.objFormFilterH.controls['NM_PASTA'].value == null) {
			this.toastr.error('O campo de Pasta é obrigatório');
		} else if (this.objFormFilterH.controls['NM_TRANSP'].value == null) {
			this.toastr.error('O campo de Transportadora é obrigatório');
		} else {

			let objParams = {
				DT_PROCESS: this.objFormFilter.controls['DT_PROCESS'].value,
				NM_PASTA: this.objFormFilter.controls['NM_PASTA'].value,
				NM_TRANSP: this.objFormFilter.controls['NM_TRANSP'].value,
				NRNOTA: this.objFormFilter.controls['G043_NRNOTA'].value
			}
	
			this.listarQM(objParams);
		}
		
	}

	limparHome() {
		
		this.objFormFilterH.reset();
		this.objFormFilter.reset();
		this.objFormFilterConteudo.reset();

	}

	listarQM(obj) {

		this.utilServices.loadGridShow();

		this.listArquivos = [];

		this.deliveryService.listarQM(obj).subscribe(
			data => {
				console.log('deu bom e chego isso: ');
				console.log(data);
				this.listArquivos = data;
				this.utilServices.loadGridHide();
			},
			err => {
				console.log('deu ruim e chego isso: ');
				console.log(err);
				this.toastr.error('Erro ao buscar as informações');
				this.utilServices.loadGridHide();
			}
		)
		
	}

	closeModal(): void {
		this.modal.closeModal();
		this.objParams.TRANSPORTADORA = '';
		this.objParams.PASTA = '';
		this.objParams.ARQUIVO = '';
		this.objParams.NRNOTA = '';
		this.objFormFilterConteudo.reset();
	}

	listarConteudoQM(obj) {

		console.log(obj);

		this.utilServices.loadGridShow();

		this.objParams.TRANSPORTADORA = obj.TRANSPORTADORA;
		this.objParams.PASTA = obj.PASTA;
		this.objParams.ARQUIVO = obj.ARQUIVO;

		this.listConteudoQM = [];

		this.deliveryService.listarConteudoQM(this.objParams).subscribe(
			data => {
				console.log('deu bom e chego isso: ');
				console.log(data);
				this.listConteudoQM = data;
				this.modal.open(this.modalViewConteudoQM,{  size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
				this.utilServices.loadGridHide();
			},
			err => {
				console.log('deu ruim e chego isso: ');
				console.log(err);
				this.toastr.error('Erro ao buscar as informações');
				this.utilServices.loadGridHide();
			}
		)
		
	}

	filtrarConteudo(): void {

		this.utilServices.loadGridShow();
		
		if (this.objFormFilterConteudo.controls['NRNOTA'].value != null && this.objFormFilterConteudo.controls['NRNOTA'].value != '') {
			this.objParams.NRNOTA = this.objFormFilterConteudo.controls['NRNOTA'].value;
		} else {
			this.objParams.NRNOTA = '';
		}

		this.listConteudoQM = [];

		this.deliveryService.listarConteudoQM(this.objParams).subscribe(
			data => {
				console.log('deu bom e chego isso: ');
				console.log(data);
				this.listConteudoQM = data;
				this.utilServices.loadGridHide();
			},
			err => {
				console.log('deu ruim e chego isso: ');
				console.log(err);
				this.toastr.error('Erro ao buscar as informações');
				this.utilServices.loadGridHide();
			}
		)

	}

	visualizarArquivo(obj) {

		this.utilServices.loadGridShow();

		this.deliveryService.visualizarQM(obj).subscribe(
			data => {

				this.detalheArquivo = data.split('"/>');

				for (let i = 0; i < (this.detalheArquivo.length - 1); i++) {
					this.detalheArquivo[i] = this.detalheArquivo[i] + '"/>';
				}

				this.modal.open(this.modalViewDetalheQM,{  size: 'xl' as 'lg', windowClass: 'modal-adaptive' });

				this.utilServices.loadGridHide();
			},
			err => {
				console.log('deu ruim e chego isso: ');
				console.log(err);
				this.toastr.error('Erro ao buscar as informações');
				this.utilServices.loadGridHide();
			}
		)
		
	}

}
