import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { InformacoesTracking } from '../../models/tracking.model';

import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';

@Component({
	selector: 'app-info-rastreio-detalhado',
	templateUrl: './info-rastreio-detalhado.component.html',
	styleUrls: ['./info-rastreio-detalhado.component.css']
})
export class InfoRastreioDetalhadoComponent implements OnInit {

	// - Componentes Filhos
	@ViewChild('modalTrackingCompleto') modalTrackingCompleto;

	nfbloqued: any = '';

	@Input() entreg:boolean = false;

	// - Input de Valores
	@Input() objTracking: InformacoesTracking[] = [{
		INDEX	:	0,
		IDG060	: 	0,
		IDG043	:	0,
		DTPOSICA:	'',
		DSLOCALI:	'',
		NRLATITU:	'',
		NRLONGIT:	'',
		DTBLOQUE:	'',
		DTDESBLO:	''
	}];

	constructor(private modal : ModalComponent) { }

	ngOnInit() {
		if (this.objTracking == undefined) {
			this.init();
		}
	}

	showModalTrackingCompleto(): void {
		this.modal.open(this.modalTrackingCompleto,{ size: 'lg' });
	}

	init() {
		this.objTracking = [{
			INDEX	:	0,
			IDG060	: 	0,
			IDG043	:	0,
			DTPOSICA:	'',
			DSLOCALI:	'n.i.',
			NRLATITU:	'n.i.',
			NRLONGIT:	'n.i.',
			DTBLOQUE:	'',
			DTDESBLO:	''
		}]
	}

	closeModalTrackingCompleto(): void {
		this.modal.closeModal();
	}

	ngDoCheck() {
		let result = this.objTracking.filter(function( obj ) {
			return obj.DTBLOQUE && !obj.DTDESBLO;
		});

		this.nfbloqued = result;
	}
}
