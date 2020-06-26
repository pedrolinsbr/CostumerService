import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NotaFiscal } from '../../models/nota-fiscal.model';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';

@Component({
	selector: 'app-info-nfe',
	templateUrl: './info-nfe.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./info-nfe.component.css']
})
export class InfoNfeComponent implements OnInit {

	// - Componentes Filhos
	@ViewChild('modalNfeCompleta') private modalNfeCompleta;
	@ViewChild('modalDanfe') modalDanfe;

	@Input() IDG083: number;
	@Input() buttonDanfe: boolean = false;

	// - Input de Valores
	@Input() objNotaFiscal: NotaFiscal = {
		NRCHADOC: 		'',
		DSMODENF: 		'n.i.',
		NRSERINF: 		'n.i.',
		TPDELIVE: 		'n.i.',
		NRNOTA: 		0,
		VALOR: 			'',
		DTEMINOT: 		'',
		VALOR_TOTAL: 	'',
		PSLIQUID: 		'',
		PSBRUTO: 		'',
		CJCLIENTRE: 	'',
		NMCLIENTRE: 	'n.i.',
		IECLIENTRE: 	0,
		NMCIDADERE:		'n.i.',
		CDESTADORE: 	'n.i.',
		CJCLIENTDE: 	'',
		NMCLIENTDE: 	'n.i.',
		IECLIENTDE: 	0,
		NMCIDADEDE:		'n.i.',
		CDESTADODE: 	'n.i.',
		ITENS_NFE: 		[],
		NMTRANSP: 		'n.i.',
		CJTRANSP:		'',
		DSINFCPL: 		'',
		CDCTRC:			'',
		IDG051:			0
	};

	controlViewDados = [];

	constructor(private modal : ModalComponent) { }

	ngOnInit() {
		if (this.objNotaFiscal == undefined) {
			this.init();
		}
	}

	showModalNfeCompleta() : void {
		//this.modal.open(this.modalNfeCompleta, { size: 'xl' as 'lg',windowClass: 'modal-adaptive' });
		//this.modal.open(this.modalNfeCompleta,{ size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
		this.modal.open(this.modalNfeCompleta,{ size: 'lg' });
	}

	init() {
		this.objNotaFiscal = {
			NRCHADOC: 		'',
			DSMODENF: 		'n.i.',
			NRSERINF: 		'n.i.',
			TPDELIVE: 		'n.i.',
			NRNOTA: 		0,
			VALOR: 			'',
			DTEMINOT: 		'',
			VALOR_TOTAL: 	'',
			PSLIQUID: 		'',
			PSBRUTO: 		'',
			CJCLIENTRE: 	'',
			NMCLIENTRE: 	'n.i.',
			IECLIENTRE: 	0,
			NMCIDADERE:		'n.i.',
			CDESTADORE: 	'n.i.',
			CJCLIENTDE: 	'',
			NMCLIENTDE: 	'n.i.',
			IECLIENTDE: 	0,
			NMCIDADEDE:		'n.i.',
			CDESTADODE: 	'n.i.',
			ITENS_NFE: 		[],
			NMTRANSP: 		'n.i.',
			CJTRANSP:		'',
			DSINFCPL: 		'',
			CDCTRC:			'',
			IDG051:			0
		};
	}

	closeModalNfeCompleta() {
		this.modal.closeModal();
	}

	controlView(item, i) {

		if (!this.controlViewDados[i]) {
			this.controlViewDados[i] = true;
		} else {
			this.controlViewDados[i] = false;
		}
	}

	openModalDanfe() {
		this.closeModalNfeCompleta();
		this.modal.open(this.modalDanfe, { size: 'lg' });
	}

}
