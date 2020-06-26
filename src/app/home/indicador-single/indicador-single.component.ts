import { Component, OnInit, Input } from '@angular/core';
import { IndicadorHome } from '../../models/indicador-home.model';

@Component({
	selector: 'app-indicador-single',
	templateUrl: './indicador-single.component.html'
})
export class IndicadorSingleComponent implements OnInit {

	@Input('indicadorSingle') indicadorSingle: IndicadorHome;

	constructor() { }

	ngOnInit() {

	}
}
