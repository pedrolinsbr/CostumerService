import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { InformacoesCarga } from '../../models/informacoes-carga.model';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';

@Component({
	selector: 'app-info-carga',
	templateUrl: './info-carga.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./info-carga.component.css']
})
export class InfoCargaComponent implements OnInit {	

	// - Componentes Filhos
	@ViewChild('modalCargaCompleta') public modalCargaCompleta;

	@Input() objCarga: InformacoesCarga = {
		IDG046:			0,
		DSCARGA:		'n.i.',
		CDVIAOTI:		0,
		TPTRANSP:		'n.i.',
		DTSAICAR: 		'',
		DTPRESAI: 		'',
		NMTRANSP: 		'n.i.',
		DTBLOQUE: 		'',
		DTDESBLO: 		'',
		CDCARGA: 		0
	};

	constructor(
		public  modal : ModalComponent
	) { }

	ngOnInit() {
		if (this.objCarga == undefined) {
			this.init();
		}
	}

	init() {
		this.objCarga = {
			IDG046:			0,
			DSCARGA:		'n.i.',
			CDVIAOTI:		0,
			TPTRANSP:		'n.i.',
			DTSAICAR: 		'',
			DTPRESAI: 		'',
			NMTRANSP: 		'n.i.',
			DTBLOQUE: 		'',
			DTDESBLO: 		'',
			CDCARGA: 		0
		};
	}

	showModalCargaCompleta(): void {
		this.modal.open(this.modalCargaCompleta,{ size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
	}

	closeModalCargaCompleta() {
		this.modal.closeModal();
	}

}
