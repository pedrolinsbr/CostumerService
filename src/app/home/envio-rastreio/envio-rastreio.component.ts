import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { EnvioRastreio } from '../../models/envio-rastreio.model';

import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';

@Component({
	selector: 'app-envio-rastreio',
	templateUrl: './envio-rastreio.component.html',
	styleUrls: ['./envio-rastreio.component.css']
})
export class EnvioRastreioComponent implements OnInit {

	// - Formgroup que representa o filtro da Datagrid inicial da home
	objFormEmailCliente: FormGroup;

	// - Componentes Filhos
	@ViewChild('modalConfirmaEnvio') private modalConfirmaEnvio;

	// - Input de Valores
	@Input() objEnvioRastreio: EnvioRastreio = {
		IDG043	:	0,	// - Identificador da NFe
		IDG051	:	0,  // - Identificador do CTE
		IDG005CO:	0,  // - ID do Cliente.
		IDG005DE:	0,
		DSEMAIL :	'',	// - E-mail do cliente.
		DTDESBLO:	'', // - Data de Desbloqueio
		DTBLOQUE:	'',
		DSEMASYN: '' // - email especifico da syngenta
	};
	@Input() envSyngenta:boolean = false;

	@Output() shareRastreio = new EventEmitter<any>();

	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private modal : ModalComponent) {
		// - Filtro da Datagrid Inicial da Home
		this.objFormEmailCliente = formBuilder.group({
			DSEMAIL: 	[],
			IDG051:		[],
			IDG005:		[],
			IDG005DE:	[],
			IDG043:		[],
			DSEMASYN: [],
			IDS001:		[]
		});
	}

	ngOnInit() {
		if (this.objEnvioRastreio == undefined) {
			this.init();
		}
	}

	showModalConfirmaEnvio() : void {
		// if(!this.envSyngenta){
		// 	if (!this.objFormEmailCliente.controls['DSEMAIL'].value || this.objFormEmailCliente.controls['DSEMAIL'].value == '' || this.objFormEmailCliente.controls['DSEMAIL'].value == null) {
		// 		this.objFormEmailCliente.controls['DSEMAIL'].setValue(this.objEnvioRastreio.DSEMAIL);
		// 	}
		// }else{
		// 	if (!this.objFormEmailCliente.controls['DSEMASYN'].value || this.objFormEmailCliente.controls['DSEMASYN'].value == '' || this.objFormEmailCliente.controls['DSEMASYN'].value == null) {
		// 		this.objFormEmailCliente.controls['DSEMASYN'].setValue(this.objEnvioRastreio.DSEMASYN);
		// 	}
		// 	if (!this.objFormEmailCliente.controls['DSEMASYN'].value || this.objFormEmailCliente.controls['DSEMASYN'].value == '' || this.objFormEmailCliente.controls['DSEMASYN'].value == null) {
		// 		this.objFormEmailCliente.controls['DSEMAIL'].setValue(this.objEnvioRastreio.DSEMASYN);
		// 	}else{
		// 		this.objFormEmailCliente.controls['DSEMAIL'].setValue(this.objFormEmailCliente.controls['DSEMASYN'].value);
		// 	}			
		// }

		this.modal.open(this.modalConfirmaEnvio);		
	}

	init(): void {
		this.objEnvioRastreio = {
			IDG043	:	0,	// - Identificador da NFe
			IDG051	:	0,  // - Identificador do CTE
			IDG005CO:	0,  // - ID do Cliente.
			IDG005DE:	0,
			DSEMAIL :	'',	// - E-mail do cliente.
			DTDESBLO:	'', // - Data de Desbloqueio
			DTBLOQUE:	'',
			DSEMASYN: '' // - email especifico da syngenta
		};
	}

	salvarEmail() {
		this.objFormEmailCliente.controls['IDG005'].setValue(this.objEnvioRastreio.IDG005CO);
		this.objFormEmailCliente.controls['IDG005DE'].setValue(this.objEnvioRastreio.IDG005DE);
		this.objFormEmailCliente.controls['IDG051'].setValue(this.objEnvioRastreio.IDG051);
		this.objFormEmailCliente.controls['IDG043'].setValue(this.objEnvioRastreio.IDG043);
		this.objFormEmailCliente.controls['IDS001'].setValue(localStorage.getItem('ID_USER'));
		this.shareRastreio.emit(this.objFormEmailCliente.value);
	}

	closeModalConfirmaEnvio() {
		this.modal.closeModal();
	}

}
