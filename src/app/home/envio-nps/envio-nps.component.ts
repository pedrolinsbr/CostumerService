import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { EnvioRastreio } from '../../models/envio-nps.model';

import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';

@Component({
	selector: 'app-envio-nps',
	templateUrl: './envio-nps.component.html',
	styleUrls: ['./envio-nps.component.css']
})
export class EnvioNpsComponent implements OnInit {

	// - Formgroup que representa o filtro da Datagrid inicial da home
	objFormNpsEmailCliente: FormGroup;

	// - Componentes Filhos
	@ViewChild('modalConfirmaEnvio') private modalConfirmaEnvio;

	// - Input de Valores
	@Input() objEnvioNps: EnvioRastreio = {
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

	@Output() shareNps = new EventEmitter<any>();

	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private modal : ModalComponent) {
		// - Filtro da Datagrid Inicial da Home
		this.objFormNpsEmailCliente = formBuilder.group({
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
		if (this.objEnvioNps == undefined) {
			this.init();
		}
	}

	showModalConfirmaEnvio() : void {
		// if(!this.envSyngenta){
		// 	if (!this.objFormNpsEmailCliente.controls['DSEMAIL'].value || this.objFormNpsEmailCliente.controls['DSEMAIL'].value == '' || this.objFormNpsEmailCliente.controls['DSEMAIL'].value == null) {
		// 		this.objFormNpsEmailCliente.controls['DSEMAIL'].setValue(this.objEnvioNps.DSEMAIL);
		// 	}
		// }else{
		// 	if (!this.objFormNpsEmailCliente.controls['DSEMASYN'].value || this.objFormNpsEmailCliente.controls['DSEMASYN'].value == '' || this.objFormNpsEmailCliente.controls['DSEMASYN'].value == null) {
		// 		this.objFormNpsEmailCliente.controls['DSEMASYN'].setValue(this.objEnvioNps.DSEMASYN);
		// 	}
		// 	if (!this.objFormNpsEmailCliente.controls['DSEMASYN'].value || this.objFormNpsEmailCliente.controls['DSEMASYN'].value == '' || this.objFormNpsEmailCliente.controls['DSEMASYN'].value == null) {
		// 		this.objFormNpsEmailCliente.controls['DSEMAIL'].setValue(this.objEnvioNps.DSEMASYN);
		// 	}else{
		// 		this.objFormNpsEmailCliente.controls['DSEMAIL'].setValue(this.objFormNpsEmailCliente.controls['DSEMASYN'].value);
		// 	}
		// }

		this.modal.open(this.modalConfirmaEnvio);
	}

	init(): void {
		this.objEnvioNps = {
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

	enviarNps() {

		if (this.envSyngenta) {
			this.objFormNpsEmailCliente.controls['DSEMAIL'].setValue(this.objFormNpsEmailCliente.controls['DSEMASYN'].value);
		}

		this.objFormNpsEmailCliente.controls['IDG005'].setValue(this.objEnvioNps.IDG005CO);
		this.objFormNpsEmailCliente.controls['IDG005DE'].setValue(this.objEnvioNps.IDG005DE);
		this.objFormNpsEmailCliente.controls['IDG051'].setValue(this.objEnvioNps.IDG051);
		this.objFormNpsEmailCliente.controls['IDG043'].setValue(this.objEnvioNps.IDG043);
		this.objFormNpsEmailCliente.controls['IDS001'].setValue(localStorage.getItem('ID_USER'));
		this.shareNps.emit(this.objFormNpsEmailCliente.value);
	}

	closeModalConfirmaEnvioNps() {
		this.modal.closeModal();
	}

}
