import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-clientes-single',
  templateUrl: './clientes-single.component.html',
  styleUrls: ['./clientes-single.component.css']
})
export class ClientesSingleComponent implements OnInit {

	@Input('nome') nome: any;
	@Input('qtOcorrencias') qtOcorrencias: number;
	@Input('qtAtendimentos') qtAtendimentos: number;

	constructor() { }

	ngOnInit() {

	}

}
