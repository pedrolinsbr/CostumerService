import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-atendente-single',
	templateUrl: './atendente-single.component.html',
	styleUrls: ['./atendente-single.component.css']
})
export class AtendenteSingleComponent implements OnInit {

	@Input('nome') nome: any;
	@Input('qtOcorrencias') qtOcorrencias: number;
	@Input('qtAtendimentos') qtAtendimentos: number;
	@Input('color') color: string;

	constructor() {

	}


	ngOnInit() {

	}

}
