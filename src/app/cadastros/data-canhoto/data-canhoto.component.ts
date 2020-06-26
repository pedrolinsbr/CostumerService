//## IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, OnChanges, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


//## COMPONENTES BRAVO
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

//## SERVICES
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DeliverysNfService } from '../../services/crud/deliverysNf.service';
import { ConhecimentoTransporte } from '../../models/conhecimento-transporte.model';
import { isBuffer } from 'util';
import * as $ from 'jquery';
import { AtendimentosService } from '../../services/crud/atendimentos.service';


@Component({
	selector: 'app-data-canhoto',
	templateUrl: './data-canhoto.component.html',
	styleUrls: ['./data-canhoto.component.scss']
})

export class DataCanhotoComponent implements OnInit {
	
	private global = new GlobalsServices();
	url            = this.global.getApiHost();

	@ViewChild('modalCteCompleta') private modalCteCompleta;
	@ViewChild('chaveCte') chaveCte: ElementRef;
	@ViewChild('dataCanhoto') dataCanhoto: ElementRef;

	//##### FORMS
	objFormInfo    : FormGroup;

	//###### DATAS
	data             = new Date();
	dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
	dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}]
	mesSelecionado   = '';
	anoSelecionado   = '';
	dataClicou       = [];

	diaSelecionado;


	public mask: Array<string | RegExp>

	constructor(
		private formBuilder : FormBuilder,
		private grid        : DatagridComponent,
		private toastr      : ToastrService,
		private utilServices: UtilServices,
		private modal : ModalComponent,
		private deliveryNfService: DeliverysNfService,
		private atendimentosService: AtendimentosService,
	) {
	
		this.objFormInfo = formBuilder.group({
			G051_NRCHADOC: 		[],
			G051_DSMODENF:		[],
			G051_NRSERINF:		[],
			G051_DTEMICTR:		[],
			G032_DSVEICUL:		[],
			G032_NRPLAVEI:		[],
			G002_CDESTADOVE:	[],
			G005_NMCLIENTRE:		[],
			G005_CJCLIENTRE:	[],
			G005_IECLIENTRE:	[],
			G003_NMCIDADERE:	[],
			G005_NMCLIENTDE:		[],
			G005_CJCLIENTDE:	[],
			G005_IECLIENTDE:	[],
			G003_NMCIDADEDE:	[],
			G043_DTCANHOT:			[],
			G051_DTPREENT:		[],
			DSOBSERV:					[]
			
		});

	
	}

	ngOnInit() {
		this.chaveCte.nativeElement.focus();
		this.mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
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




	limparHome(){
		this.objFormInfo.reset();
	
	}



	showInfo(event): void {
		console.log(event);
		if (event.key == "Enter" || event.key == "Tab") {
			console.log(this.objFormInfo.controls['G051_NRCHADOC'].value.length);
			if (this.objFormInfo.controls['G051_NRCHADOC'].value.length != 44) {
				this.chaveCte.nativeElement.focus();
			} else {
				this.chaveCte.nativeElement.blur();
				this.dataCanhoto.nativeElement.focus();
				this.deliveryNfService.getInfoCTE({ NRCHADOC: this.objFormInfo.controls['G051_NRCHADOC'].value }).subscribe(
					data => {
						console.log(data);
						this.objFormInfo.controls['G051_DSMODENF'].setValue(data[0].DSMODENF);
						this.objFormInfo.controls['G051_NRSERINF'].setValue(data[0].NRSERINF);
						this.objFormInfo.controls['G051_DTEMICTR'].setValue(data[0].DTEMICTR);
						this.objFormInfo.controls['G005_NMCLIENTRE'].setValue(data[0].NMCLIENTRE);
						this.objFormInfo.controls['G005_CJCLIENTRE'].setValue(data[0].CJCLIENTRE);
						this.objFormInfo.controls['G005_IECLIENTRE'].setValue(data[0].IECLIENTRE);
						this.objFormInfo.controls['G003_NMCIDADERE'].setValue(data[0].CDESTADORE);
						this.objFormInfo.controls['G005_NMCLIENTDE'].setValue(data[0].NMCLIENTDE);
						this.objFormInfo.controls['G005_CJCLIENTDE'].setValue(data[0].CJCLIENTDE);
						this.objFormInfo.controls['G005_IECLIENTDE'].setValue(data[0].IECLIENTDE);
						this.objFormInfo.controls['G003_NMCIDADEDE'].setValue(data[0].CDESTADODE);
						this.objFormInfo.controls['G032_DSVEICUL'].setValue(data[0].DSVEICUL);
						this.objFormInfo.controls['G032_NRPLAVEI'].setValue(data[0].NRPLAVEI);
						this.objFormInfo.controls['G002_CDESTADOVE'].setValue(data[0].CDESTADOVL);
						this.objFormInfo.controls['G051_DTPREENT'].setValue(data[0].G051_DTPREENT);
					},
					err => {
						console.log(err);
						this.toastr.error("Erro ao buscar informações");
					}
				)
			}
		}
		
	}

	salvarData() {
		this.utilServices.loadGridShow();

		let objParam;

		if (this.objFormInfo.controls['DSOBSERV'].value == null || this.objFormInfo.controls['DSOBSERV'].value == '') {
			objParam = {
				G051_NRCHADOC: this.objFormInfo.controls['G051_NRCHADOC'].value,
				DTCANHOT: this.objFormInfo.controls['G043_DTCANHOT'].value
			}

			this.deliveryNfService.salvaDataCanhoto(objParam).subscribe(
				data => {
					console.log(data)
					this.utilServices.loadGridHide();
					this.toastr.success('Data salva com sucesso');
					this.objFormInfo.reset();
					this.chaveCte.nativeElement.focus();
				},
				err => {
					console.log(err);
					this.utilServices.loadGridHide();
					this.toastr.error('Erro ao salvar a data');
				}
			)

		} else {
			objParam = {
				G051_NRCHADOC: this.objFormInfo.controls['G051_NRCHADOC'].value,
				DTCANHOT: this.objFormInfo.controls['G043_DTCANHOT'].value,
				IDSOLIDO: localStorage.getItem('ID_USER'),
				DSOBSERV: this.objFormInfo.controls['DSOBSERV'].value,
				IDA002: 46
			}


			this.atendimentosService.salvarAtendimentoDataCanhot(objParam).subscribe(
				data => {
					console.log(data)
					this.utilServices.loadGridHide();
					this.toastr.success('Data salva com sucesso');
					this.objFormInfo.reset();
					this.chaveCte.nativeElement.focus();
				},
				err => {
					console.log(err);
					this.utilServices.loadGridHide();
					this.toastr.error('Erro ao salvar a data');
				}
			)
		}
	}

	formatDate() {
		if ($('#G043_DTCANHOT').val().length == 2) {
			this.objFormInfo.controls['G043_DTCANHOT'].setValue($('#G043_DTCANHOT').val()+'/');
		} else if ($('#G043_DTCANHOT').val().length == 5) {
			this.objFormInfo.controls['G043_DTCANHOT'].setValue($('#G043_DTCANHOT').val()+'/');
		}
	}

}
