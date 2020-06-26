import { Routes } from '@angular/router';

import { VisualizacaoAgComponent } from './visualizacaoAg.component';

export const VisualizacaoAgRoutes: Routes = [{
	path: '',
	component: VisualizacaoAgComponent,
	data: {
		heading: 'Visualização AG'
	}
}];
