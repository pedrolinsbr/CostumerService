import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EdiService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHost();
  }

  // Serviços para manipulacao na tabela de campos de um EDI
  getEdiTrackingCliente(idg094) {
    return this.http.post<any>(this.url + "tp/edi/getEdiTrackingCliente", idg094);
  };

  updateEdi(formConfigEdi) { return this.http.post<any>(this.url + "tp/edi/atualizarConfigEdi", formConfigEdi) };

  disableEdi(idConfigEdi) { return this.http.post<any>(this.url + "tp/edi/desativarConfigEdi", idConfigEdi) };

  addConfigEdi(formConfigEdi) { return this.http.post<any>(this.url + "tp/edi/createConfigEdi", formConfigEdi) };

  getAllFieldsEdi(formConfigEdi) { return this.http.post<any>(this.url + "tp/edi/getAllFieldsEdi", formConfigEdi) };

  addFieldEdi(objFormNewFieldEdi) { return this.http.post<any>(this.url + "tp/edi/createNewFieldEdi", objFormNewFieldEdi) };

  removeFieldEdi(idFieldEdi) { return this.http.post<any>(this.url + "tp/edi/removeFieldEdi", idFieldEdi) };

  updateOrderField(form) { return this.http.post<any>(this.url + "tp/edi/updateOrderField", form) };

  listarArquivos(obj) {

		return this.http.post<any>(this.url + 'tp/edi/listarArquivos', obj);
  }

  visualizarArquivo(obj) {
		return this.http.post<any>(this.url + 'tp/edi/visualizarArquivo', obj);
  }

  downloadAnexo(objArquivo):Observable<any>{
    return this.http.post(this.url + "tp/edi/downloadEdiFile", objArquivo, {responseType: 'blob'});
  }

  processarEdi(id) { return this.http.post<any>(this.url + "tp/edi/processarEdi", id) };

  verificarErro(obj) {
		return this.http.post<any>(this.url + 'tp/edi/verificarErro', obj);
  }
 /* updateEdi(dgCamposEdi) { return this.http.post<any>(this.url + "tp/dgCamposEdi/atualizar", dgCamposEdi) };

  deleteEdi(dgCamposEdi) {
    dgCamposEdi = {'IDG101':dgCamposEdi}
    return this.http.post<any>(this.url + "it/dgCamposEdi/excluir", dgCamposEdi)
  }


  // Serviços para manipulacao na tabela de campos de um EDI
  getCampoEdiCliente(dgCamposEdi) { return this.http.post<any>(this.url + "it/dgCamposEdi/buscar", dgCamposEdi) };

  addCampoEdiCliente(dgCamposEdi) { return this.http.post<any>(this.url + "it/dgCamposEdi/salvar", dgCamposEdi) };

  updateCampoEdiCliente(dgCamposEdi) { return this.http.post<any>(this.url + "it/dgCamposEdi/atualizar", dgCamposEdi) };

  deleteCampoEdiCliente(dgCamposEdi) {
    dgCamposEdi = {'IDG101':dgCamposEdi}
    return this.http.post<any>(this.url + "it/dgCamposEdi/excluir", dgCamposEdi)
  }
 */
}
