import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { InformacoesRastreio } from '../../models/informacoes-rastreio.model';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { ValidaMilestone } from '../../models/valida-milestone.model';

@Component({
	selector: 'app-info-rastreio-email',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './info-rastreio-email.component.html',
	styleUrls: ['./info-rastreio-email.component.css']
})
export class InfoRastreioEmailComponent implements OnInit {

	@Input('resumido') resumido: boolean;
	@Input() validaMilestone: ValidaMilestone = {
		SNHABCOL:	0
	};
	@Input() objRastreio: InformacoesRastreio = {
		DTEMINOT: 	'',
		DTEMICTR:	'',
		DTENTCON:	'',
		DTCOLETA: 	'',
		DTPREENT:   '',
		DTENTREG:   '',
		DTBLOQUE:	'',
		DTDESBLO:	'',
		TXCANHOT:	'',
		IDG043: '',
		DTSAICAR: '',
		TPDELIVE: 0
	};	
	//@ViewChild('modalCanhoto') private modalCanhoto;

	private classOne: 	string = '';
	private classTwo: 	string = '';
	private classThree: string = '';
	private classFour: 	string = '';

	private labelFour:	string = 'Previsão de Entrega';

	constructor(
			private modal : ModalComponent
		) {		
		this.classOne = '';
		this.classTwo = '';
		this.classThree = '';
		this.classFour = '';

	}

	ngOnInit() {
		if (this.objRastreio == undefined || this.validaMilestone == undefined) {
			this.init();
		}
	}

	init() {
		this.validaMilestone = {
			SNHABCOL:	0
		}
		this.objRastreio = {
			DTEMINOT: 	'',
			DTEMICTR:	'',
			DTENTCON:	'',
			DTCOLETA: 	'',
			DTPREENT:   '',
			DTENTREG:   '',
			DTBLOQUE:	'',
			DTDESBLO:	'',
			TXCANHOT:	'',
			IDG043: '',
			DTSAICAR: '',
			TPDELIVE: 0
		};
	}
	// fecharCanhoto() {
	// 	this.modal.closeModal();
	// }
	// visualizarCanhoto(canhoto) {
	// 	console.log("chegou canhoto ",canhoto);
	// 	this.modal.open(this.modalCanhoto, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
		
	// }
	// baixarCanhoto(canhoto) {
	// 	console.log("baixarCanhoto ",canhoto);
	// 	let urlCanhoto = `http://www.bravo2020.com.br/api/xml/canhoto/img/${canhoto}`;
	// 	window.open(urlCanhoto);
	// }

	
}
