import { Component, OnInit, Input } from '@angular/core';
import { IndicadorHome } from '../../models/indicador-home.model';

@Component({
	selector: 'app-indicadores-group',
	templateUrl: './indicadores-group.component.html'
})
export class IndicadoresGroupComponent implements OnInit {

	@Input() objIndicadoresHome: IndicadorHome[];

	constructor() {		

	}

	ngOnInit() {

	}

}
