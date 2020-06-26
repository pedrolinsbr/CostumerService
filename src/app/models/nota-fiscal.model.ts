import { ItensNotaFiscal } from '../models/itens-nota-fiscal.model';

export interface NotaFiscal {
	NRCHADOC:				string;
	DSMODENF: 				string;
	NRSERINF:				string;
	TPDELIVE:				string;
	NRNOTA: 				number;
	VALOR: 					string;
	DTEMINOT:				string;
	VALOR_TOTAL:			string;
	PSLIQUID:				string;
	PSBRUTO:				string;
	CJCLIENTRE: 			string;
	NMCLIENTRE: 			string;
	IECLIENTRE: 			number;
	NMCIDADERE:				string;
	CDESTADORE: 			string;
	CJCLIENTDE:				string;
	NMCLIENTDE:				string;
	IECLIENTDE:				number;
	NMCIDADEDE:				string;
	CDESTADODE:				string;
	ITENS_NFE: 				ItensNotaFiscal[];
	NMTRANSP:				string;
	CJTRANSP:				string;
	DSINFCPL:				string;
	CDCTRC:					string;
	IDG051:					number;
}