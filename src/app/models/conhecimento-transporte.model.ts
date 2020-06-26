import { NotasFiscaisConhecimento } from '../models/notas-fiscais-conhecimento.model';

export interface ConhecimentoTransporte {
	NRCHADOC:				string;
	CDCTRC: 				number;
	NRSERINF:				number;
	DSMODENF:				string;
	DTEMICTR:				string;
	VRMERCAD:				string;
	PSLIQUID:				string;
	PSBRUTO:				string;
	NMCLIENTRE: 			string;
	CJCLIENTRE: 			string;
	NMCLIENTDE: 			string;
	CJCLIENTDE: 			string;
	NMCLIENTRC: 			string;
	CJCLIENTRC: 			string;
	NMCLIENTEX: 			string;
	CJCLIENTEX: 			string;
	NMCLIENTCO: 			string;
	CJCLIENTCO: 			string;
	NMTRANSP:				string;
	NOTAS_CTE: 				NotasFiscaisConhecimento[];
	DSINFCPL:				string;
	STCTRC:					string;
	IDCJCLIENTCO: 			string;
}