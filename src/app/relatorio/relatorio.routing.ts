import { Routes } from '@angular/router';

import { AtendimentosComponent } from './atendimentos/atendimentos.component';
import { PerformanceComponent } from './performance/performance.component';
import { LogDatasComponent } from './log-datas/log-datas.component';
import { RastreioComponent } from './rastreio/rastreio.component';
import { ArquivosQmComponent } from './arquivos-QM/arquivos-qm.component';
import { TransferenciaComponent } from './transferencia/transferencia.component';
import { FluxoTranspComponent } from './fluxo-transp/fluxo-transp.component';
import { RelatorioAgComponent } from './relatorio-ag/relatorio-ag.component';
import { ReportNpsComponent } from './nps/report-nps.component';


export const RelatorioRoutes: Routes = [
	{
		path: 'atendimentos',
		component: AtendimentosComponent,
		data: {
			heading: 'Relatório Atendimentos'
		}
	},
	{
		path: 'performance',
		component: PerformanceComponent,
		data: {
			heading: 'Relatório Performance'
		}
	},
	{
		path: 'log-datas',
		component: LogDatasComponent,
		data: {
			heading: 'Log de Datas'
		}
	},
	{
		path: 'rastreio',
		component: RastreioComponent,
		data: {
			heading: 'Rastreio'
		}
	},
	{
		path: 'arquivos-qm',
		component: ArquivosQmComponent,
		data: {
			heading: 'Arquivos QM'
		}
	},
	{
		path: 'transferencia',
		component: TransferenciaComponent,
		data: {
			heading: 'Transferência'
		}
	},
	{
		path: 'fluxo-transp',
		component: FluxoTranspComponent,
		data: {
			heading: 'Fluxo Transportadora'
		}
	},
	{
		path: 'relatorio-ag',
		component: RelatorioAgComponent,
		data: {
			heading: 'Relatório AG'
		}
	},
	{
		path: 'nps',
		component: ReportNpsComponent,
		data: {
			heading: 'NPS'
		},
	}
];
