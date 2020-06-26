import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConhecimentoTransporte } from '../../models/conhecimento-transporte.model';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';

@Component({
	selector: 'app-info-cte',
	templateUrl: './info-cte.component.html',
	styleUrls: ['./info-cte.component.css']
})
export class InfoCteComponent implements OnInit {

	// - Componentes Filhos
	@ViewChild('modalCteCompleta') private modalCteCompleta;
	@ViewChild('modalDacte') modalDacte;

	@Input() IDG051: number;
	@Input() buttonDacte: boolean = false;

	@Input() objCTE: ConhecimentoTransporte = {
		NRCHADOC:		'',
		CDCTRC: 		0,
		NRSERINF:		0,
		DSMODENF:		'n.i.',
		DTEMICTR:		'',
		VRMERCAD:		'',
		PSLIQUID:		'',
		PSBRUTO:		'',
		NMCLIENTRE: 	'n.i.',
		CJCLIENTRE: 	'n.i.',
		NMCLIENTDE: 	'n.i.',
		CJCLIENTDE: 	'n.i.',
		NMCLIENTRC: 	'n.i.',
		CJCLIENTRC: 	'n.i.',
		NMCLIENTEX: 	'n.i.',
		CJCLIENTEX: 	'n.i.',
		NMCLIENTCO: 	'n.i.',
		CJCLIENTCO: 	'n.i.',
		NMTRANSP:		'n.i.',
		NOTAS_CTE: 		[],
		DSINFCPL:		'',
		STCTRC:			'n.i.',
		IDCJCLIENTCO: 	'n.i'
	};

	constructor(private modal : ModalComponent) { }

	ngOnInit() {
		if (this.objCTE == undefined || this.objCTE == null) {
			this.init();
		}
	}

	init() {
		this.objCTE = {
			NRCHADOC:		'',
			CDCTRC: 		0,
			NRSERINF:		0,
			DSMODENF:		'n.i.',
			DTEMICTR:		'',
			VRMERCAD:		'',
			PSLIQUID:		'',
			PSBRUTO:		'',
			NMCLIENTRE: 	'n.i.',
			CJCLIENTRE: 	'n.i.',
			NMCLIENTDE: 	'n.i.',
			CJCLIENTDE: 	'n.i.',
			NMCLIENTRC: 	'n.i.',
			CJCLIENTRC: 	'n.i.',
			NMCLIENTEX: 	'n.i.',
			CJCLIENTEX: 	'n.i.',
			NMCLIENTCO: 	'n.i.',
			CJCLIENTCO: 	'n.i.',
			NMTRANSP:		'n.i.',
			NOTAS_CTE: 		[],
			DSINFCPL:		'',
			STCTRC:			'n.i.',
			IDCJCLIENTCO: 'n.i'
		};
		console.log(this.objCTE, 'teste' )
	}

	closeModalCteCompleta() {
		this.modal.closeModal();
	}

	showModalCteCompleta() : void {
		this.modal.open(this.modalCteCompleta, { size: 'lg' });
	}

	openModalDacte() {
		this.closeModalCteCompleta();
		this.modal.open(this.modalDacte, { size: 'lg' });
	}
}
