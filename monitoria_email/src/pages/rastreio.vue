<template>
  <q-layout style="height: 100% !important; background-color: #e6e6e6 !important;">
     <div class="q-pa-md q-gutter-sm">
     <q-dialog v-model="confirmarDescadastro">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar descadastro de e-mail.</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <p>Deseja realmente confirmar o descadastro de recebimento deste e-mail?</p>        
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn label="Confirmar" color="green" @click="removeEmail" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>    
  </div>
  
    <div class="row bod2" style="margin-right: 0px !important;" v-if="!validaSyngenta && !validaFmc && !validaAdama">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 text-center">
        <img src="../../assets/images/bravo-logo-01.png" alt="">
      </div>
    </div>

    <div class="row bod2" v-if="validaSyngenta && !validaFmc && !validaAdama">
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
      <div class="col-sm-4 col-md-2 col-lg-2 col-xs-4">
        <img src="../../assets/images/1.1.4-Horizontal-Sem_Slongan-Sem_Fundo.png" alt="" style="margin-top: 20%; max-width: 100%;">
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 col-xs-4"></div>
      <div class="col-md-2 col-sm-4 col-lg-2 col-xs-4">
        <img src="../../assets/images/syngenta.png" alt="" style="margin-top: 16%; max-width: 100%; ">
      </div>
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
    </div>

    <div class="row bod2" v-if="!validaSyngenta && validaFmc && !validaAdama">
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
      <div class="col-sm-4 col-md-2 col-lg-2 col-xs-4">
        <img src="../../assets/images/1.1.4-Horizontal-Sem_Slongan-Sem_Fundo.png" alt="" style="margin-top: 60%; max-width: 100%; ">
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 col-xs-4"></div>
      <div class="col-md-2 col-sm-4 col-lg-2 col-xs-4">
        <img src="../../assets/images/logo_FMC_final_rgb.png" alt="" style="margin-top: 54%; max-width: 100%;">
      </div>
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
    </div>

    <div class="row bod2" v-if="!validaSyngenta && !validaFmc && validaAdama">
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
      <div class="col-sm-4 col-md-2 col-lg-2 col-xs-4">
        <img src="../../assets/images/1.1.4-Horizontal-Sem_Slongan-Sem_Fundo.png" alt="" style="margin-top: 60%; max-width: 100%; ">
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 col-xs-4"></div>
      <div class="col-md-2 col-sm-4 col-lg-2 col-xs-4">
        <img src="../../assets/images/Logo_ADAMA.png" alt="" style="margin-top: 54%; max-width: 100%;">
      </div>
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
    </div>

    <div class="row bod" style="margin-right: 0px !important; padding-top: 5px !important;">
      <div class="col-md-2 col-lg-2 col-sm-0 col-xs-0"></div>
      <div class="col-md-8 col-sm-12 col-lg-8 col-xs-12 content">
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 content-title text-uppercase">
            {{this.txtTitleBar}}
          </div>
        </div>

        <div v-if="isLoading" class="alert alert-warning" role="alert">
          <br />
          <div class="row vertical-align">
            <div class="col-xs-3 col-sm-3 col-md-1 col-lg-1">
              <q-spinner
                color="orange"
                size="50px"
              />
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-10">
              &nbsp;<strong>Carregando...</strong>
            </div>
          </div>
        </div>

        <div v-if="!validEntrega && !isLoading && descadastroOK">
          <div class="row" style="padding-top: 20px; padding-bottom: 20px;">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">

              <div class="mt-0 mb-0 text-uppercase text-center" style="font-size:22px;">
                  Descadastramento realizado com sucesso!
              </div>
            </div>
          </div>
        </div>

        <div v-if="!validEntrega && !isLoading && descadastro" class="alert alert-success" role="alert">
          <div class="row">
            <div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div>
            <div class="col-xs-10 col-sm-10 col-md-6 col-lg-6 text-center">
              Descreva o motivo para o descastramento de seu e-mail
              <div class="form-group" style="margin-top: 15px;">
                <q-input
                  v-model="comentUnsub"
                  filled
                  type="textarea"
                  placeholder="Digite seu comentário..."
                  style="resize:none;"
                  :rules="[ val => val.length <= 255 || 'Use no máximo 255 characters']"
                />
              </div>
            </div>
            <div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div>
          </div>
          <div class="row vertical-align"  style="margin-bottom: 20px;">
            <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 text-center">              
              <br>
              <q-btn label="Confirmar" color="green" @click="confirmarDescadastro = true" v-close-popup />
              <br>
            </div>
          </div>
        </div>

        <div v-if="!validEntrega && !isLoading && !descadastro && !descadastroOK">
          <div class="row" style="padding-top: 100px;">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">

              <div class="mt-0 mb-0 text-uppercase text-center" style="font-size:22px;">
                  Olá, Digite o código de rastreio
              </div>
              <div class="mt-0 mb-0 text-uppercase text-center" style="font-size:22px;">
                  para acompanhar sua entrega:
              </div>

            </div>

          </div>
          <div class="row">
            <div class="col-xs-2 col-sm-2 col-md-3 col-lg-3"></div>
            <div class="col-xs-8 col-sm-8 col-md-6 col-lg-6 text-center">
              <div style="margin-top: 15px;">
                <q-input filled v-model="cdrastreio" placeholder="Digite o código de rastreio..." :dense="dense"/>
              </div>
            </div>
            <div class="col-xs-2 col-sm-2 col-md-3 col-lg-3"></div>
          </div>
          <div class="row" style="margin-top: 5px">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center" style="font-size: 20px">
              <q-btn @click="buscarNotaFiscal" color="deep-orange" label="Buscar" style="margin-bottom: 15px;"/>
              <br />
            </div>
          </div>
			  </div>

        <div v-if="showNotasCte && !isLoading">
         <q-card  bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Nota(s) da(s) entrega(s)</div>
              <div class="text-subtitle2">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-left ">
                  Clique sobre a nota que deseja ver o rastreamento.
                  <br><br>
                  <b>Notas do CTE:</b>
                </div>
              </div>
            </q-card-section>

            <q-separator  inset />

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-left" style="font-size: 13px" v-for="item of objDeliveryCte" :key="item.NRCHADOC">
                  <span @click="abreDetalheNota(item)" style="cursor: pointer"><b>{{item.NRNOTA}}</b> Chave:
                    {{item.NRCHADOC}} </span>
                </div>
              </div>
            </q-card-section>
          </q-card>

			  </div>

        <div v-if="validEntrega && !isLoading">

          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">

            <q-card  bordered class="my-card">
              <q-card-section>
                <div class="text-h6">Rastreamento</div>
              </q-card-section>

              <q-separator  inset />

              <q-card-section>
                <div class="row" v-if="DTBLOQUE || DTDESBLO">
                  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 text-left font-weight-bold">
                    Data de Bloqueio:
                  </div>
                  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 text-left">
                    {{ DTBLOQUE ? (DTBLOQUE) : ('n.i.') }}
                  </div>
                  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 text-left font-weight-bold">
                    Data de Desbloqueio:
                  </div>
                  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 text-left">
                    {{ DTDESBLO ? (DTDESBLO ) : ('n.i.') }}
                  </div>
                </div>
                <br v-if="DTBLOQUE && !DTDESBLO" />
                <div class="row" v-if="DTBLOQUE && !DTDESBLO">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="alert alert-danger" role="alert">
                      A nota fiscal está bloqueada.
                    </div>
                  </div>
                </div>
         
                <br /><br />
                <q-stepper
                  v-model="step"
                  ref="stepper"
                  alternative-labels
                  done-color="green-9"
                  inactive-color="deep-purple-6"
                  animated
                >
                  <q-step
                    name="DTEMINOT"
                    title="Nota Fiscal"
                    :caption="DTEMINOT"
                    icon="description"
                    :done="DTEMINOT !== null && DTEMINOT !== ''"
                  >
                  </q-step>

                  <!--################ Tratativa da data de coleta 4PL ################-->
                  <q-step
                    name="DTCOLETA"
                    title="Previsão de Coleta"
                    :caption="textDTCOLETA"
                    icon="local_shipping"
                    v-if="(DTSAICAR == null || DTSAICAR == '') && (DTENTREG == null || DTENTREG == '') && (objValidaMilestone.SNHABCOL !== 1) && validaSyngenta"
                  >
                  </q-step>

                  <q-step
                    name="DTSAICAR"
                    title="Data de Coleta"
                    :caption="DTSAICAR"
                    icon="local_shipping"
                    :done="DTSAICAR !== null && DTSAICAR !== '' && validaSyngenta"
                    v-if="DTSAICAR !== null && DTSAICAR !== '' && validaSyngenta"
                  >
                  </q-step>

                  <q-step
                    name="DTCOLETA"
                    title="Data de Coleta"
                    :caption="textDTCOLETA"
                    icon="local_shipping"
                    :done="(DTSAICAR == null || DTSAICAR == '') && (DTENTREG !== null && DTENTREG !== '') && validaSyngenta"
                    v-if="(DTSAICAR == null || DTSAICAR == '') && (DTENTREG !== null && DTENTREG !== '') && validaSyngenta"
                  >
                  </q-step>

                  <q-step
                    name="DTCOLETA"
                    title="Data de Coleta"
                    :caption="textDTCOLETA"
                    icon="local_shipping"
                    :done="(DTSAICAR == null || DTSAICAR == '') && (DTENTREG == null || DTENTREG == '') && (objValidaMilestone.SNHABCOL == 1)  && validaSyngenta"
                    v-if="(DTSAICAR == null || DTSAICAR == '') && (DTENTREG == null || DTENTREG == '') && (objValidaMilestone.SNHABCOL == 1)  && validaSyngenta"
                  >
                  </q-step>
                  <!-- ################################################################################ -->

                  <!--################ Tratativa da data de coleta quando não é 4PL ################-->
                  <q-step
                    name="DTCOLETA"
                    title="Previsão de Coleta"
                    :caption="textDTCOLETA"
                    icon="local_shipping"
                    v-if="(objValidaMilestone.SNHABCOL !== 1) && !validaSyngenta"
                  >
                  </q-step>

                  <q-step
                    name="DTCOLETA"
                    title="Data de Coleta"
                    :caption="textDTCOLETA"
                    icon="local_shipping"
                    :done="(objValidaMilestone.SNHABCOL == 1) && !validaSyngenta"
                    v-if="(objValidaMilestone.SNHABCOL == 1) && !validaSyngenta"
                  >
                  </q-step>
                  <!--################################################################################-->

                  <q-step
                    name="DTBLOQUE"
                    title="Previsão de Entrega"
                    icon="lock"
                    v-if="DTBLOQUE != '' && DTBLOQUE != null && ( DTDESBLO == '' || DTDESBLO == null )"
                    disable
                  >
                  </q-step>

                  <q-step
                    name="DTPREENT"
                    title="Previsão de Entrega"
                    :caption="DTPREENT"
                    :done="DTENTREG !== null && DTENTREG !== ''"
                    icon="event_available"
                    v-if="(DTBLOQUE == '' || DTBLOQUE == null ||
                        (
                          DTBLOQUE != '' &&
                          DTBLOQUE != null &&
                          DTDESBLO != '' &&
                          DTDESBLO != null
                        )) && (DTENTREG !== null && DTENTREG !== '')"
                  >
                  </q-step>

                  <q-step
                    name="DTENTREG"
                    title="Data de Entrega"
                    :caption="DTENTREG"
                    icon="check_box"
                    :done="DTENTREG !== null && DTENTREG !== ''"
                    v-if="(DTBLOQUE == '' || DTBLOQUE == null ||
                        (
                          DTBLOQUE != '' &&
                          DTBLOQUE != null &&
                          DTDESBLO != '' &&
                          DTDESBLO != null
                        )) && (DTENTREG !== null && DTENTREG !== '')"
                  >
                  </q-step>

                  <q-step
                    name="DTPREENT"
                    title="Previsão de Entrega"
                    :caption="DTPREENT"
                    icon="event_available"
                    v-if="(DTBLOQUE == '' || DTBLOQUE == null ||
                        (
                          DTBLOQUE != '' &&
                          DTBLOQUE != null &&
                          DTDESBLO != '' &&
                          DTDESBLO != null
                        )) && (DTENTREG == null || DTENTREG == '')"
                  >
                  </q-step>

                </q-stepper> 
              </q-card-section>
            </q-card>
          </div>

          <q-dialog v-model="modalNfeCompleta">
            
            <q-card style="width: 1000px; max-width: 80vw;">
              <q-card-section>
                <div class="text-h6" style="font-family: 'Montserrat', sans-serif;"><strong>Detalhes da Nota Fiscal</strong></div>
              </q-card-section>

              <q-separator />

              <q-card-section class="scroll">
                <div style="color: #464444">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="row">
                      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="card card-body my-bg" style="padding: 10px 10px 10px 10px;">
                          <div class="d-flex">
                            <div class="mr-auto">
                              <div class="mt-0 mb-0 text-uppercase text-h5">
                                <small class="fw-300" style="font-family: 'Montserrat', sans-serif;">Dados da </small><strong>NF-e</strong>
                              </div>
                            </div>
                          </div>
                          <div style="margin-top: 15px">
                            <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Chave de Acesso</strong></a>
                                    <div>{{ objNotaFiscal.NRCHADOC }}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Data de emissão</strong></a>
                                    <div>{{ objNotaFiscal.DTEMINOT? (objNotaFiscal.DTEMINOT) : ('n.i') }}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Modelo</strong></a>
                                    <div>{{ objNotaFiscal.DSMODENF }}</div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Número</strong></a>
                                    <div>{{ objNotaFiscal.NRNOTA }}</div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Tipo</strong></a>
                                    <div>{{ objNotaFiscal.TPDELIVE }}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Série</strong></a>
                                    <div>{{ objNotaFiscal.NRSERINF }}</div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Peso Bruto (Kg)</strong></a>
                                    <div>{{ objNotaFiscal.PSBRUTO ? (objNotaFiscal.PSBRUTO.toFixed(2)):('n.i.') }}</div>
                                  </div>
                                </div>	
                              </div>
                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Peso Líquido (Kg)</strong></a>
                                    <div>{{ objNotaFiscal.PSLIQUID ? (objNotaFiscal.PSLIQUID.toFixed(2)):('n.i.') }}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Observação da Nota</strong></a>
                                    <div>{{ objNotaFiscal.DSINFCPL }}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="card card-body my-bg" style="padding: 10px 10px 10px 10px;">
                          <div class="d-flex">
                            <div class="mr-auto">
                              <div class="mt-0 mb-0 text-uppercase text-h5">
                                <small class="fw-300" style="font-family: 'Montserrat', sans-serif;">Dados do </small><strong>Emitente</strong>
                              </div>
                            </div>
                          </div>

                          <div style="margin-top: 15px">
                            <div class="row">
                              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>CNPJ</strong></a>
                                    <div>{{objNotaFiscal.CJCLIENTRE }}</div>
                                  </div>
                                </div>
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Razão Social</strong></a>
                                    <div>{{ objNotaFiscal.NMCLIENTRE }}</div>
                                  </div>

                                </div>

                              </div>
                              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Inscrição Estadual</strong></a>
                                    <div>{{objNotaFiscal.IECLIENTRE}}</div>
                                  </div>

                                </div>
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>UF</strong></a>
                                    <div>{{ objNotaFiscal.NMCIDADERE }} - {{ objNotaFiscal.CDESTADORE}}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="card card-body my-bg" style="padding: 10px 10px 10px 10px;">
                          <div class="d-flex">
                            <div class="mr-auto">
                              <div class="mt-0 mb-0 text-uppercase text-h5">
                                <small class="fw-300" style="font-family: 'Montserrat', sans-serif;">Dados do </small><strong>Destinatário</strong>
                              </div>
                            </div>
                          </div>
                          <div style="margin-top: 15px">
                            <div class="row">
                              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>CNPJ</strong></a>
                                    <div>{{objNotaFiscal.CJCLIENTDE }}</div>
                                  </div>
                                </div>
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Razão Social</strong></a>
                                    <div>{{ objNotaFiscal.NMCLIENTDE }}</div>
                                  </div>

                                </div>

                              </div>
                              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>Inscrição Estadual</strong></a>
                                    <div>{{objNotaFiscal.IECLIENTDE}}</div>
                                  </div>
                                </div>
                                <div class="d-flex align-items-center marg">
                                  <div class="mr-auto">
                                    <a href="javascript:;" class="ff-headers text-color cursorDefault"><strong>UF</strong></a>
                                    <div>{{ objNotaFiscal.NMCIDADEDE }} - {{objNotaFiscal.CDESTADODE}}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  

                <div style="margin-top: 15px">
                  <div class="table-responsive">

                    <q-table
                      title="Itens da Nota Fiscal"
                      :data="data"
                      :columns="columns"
                      row-key="name"
                    />
                  </div>
                </div>
                        

              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn flat label="Fechar" color="primary" @click="modalNfeCompleta = false" />
              </q-card-actions>
            </q-card>
          </q-dialog>


          <q-card  bordered class=" my-card">
            <q-card-section>
              <div class="text-h6">Informações da Nota Fiscal&nbsp;&nbsp;
                <i
                class="fas fa-eye fa-fw fa-lg btn-fieldset"
                alt="Detalhes da NF-e"
                title="Detalhes da NF-e"
                @click="modalNfeCompleta = true"
                style="cursor: pointer"
                >
                </i>
              </div>

            </q-card-section>

            <q-separator  inset />

            <q-card-section>
              <div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-left font-weight-bold">
                  <strong>Nº da NF</strong>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 text-left">
                  {{objNotaFiscal.NRNOTA}}
                </div>
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-left font-weight-bold" >
                  <strong>Dt. Emi. NF</strong>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 text-left">
                  {{ objNotaFiscal.DTEMINOT? (objNotaFiscal.DTEMINOT) : ('n.i') }}
                </div>
              </div>
              <div class="row separator"></div>
              <div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-left font-weight-bold">
                  <strong>Emissor</strong>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 text-left">
                  {{ objNotaFiscal.NMCLIENTRE }} [ {{ objNotaFiscal.CJCLIENTRE }} ]
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-left font-weight-bold">
                  <strong>Transportadora</strong>
                  {{objNotaFiscal.NMTRANSP}} [ {{ objNotaFiscal.CJTRANSP }} ]
                
                </div>
              </div>
              <div class="row separator"></div>
              <div class="row">
                <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-left font-weight-bold">
                  <strong>Destino</strong>
                </div>
                <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xl-10 text-left">
                  {{ objNotaFiscal.NMCLIENTDE }} [ {{ objNotaFiscal.CJCLIENTDE }} ]
                </div>
              </div>
            </q-card-section>
          </q-card>

        </div>

      </div>
      <div class="col-xs-0 col-sm-0 col-md-2 col-lg-2"></div>
    </div>
    <footer v-if="validaSyngenta && !validaFmc" class="bod3">
      <small>Em caso de dúvidas ou esclarecimentos entrar em contato com o Centro Avançado Syngenta de Atendimento</small><br>
      <img src="../../assets/images/casa.png" alt="" width="150px"> <br />
        0800 704 4304
    </footer>
  </q-layout>
</template>

<style>

  @import url('https://fonts.googleapis.com/css?family=Montserrat');

  .content-title{
    background: #f06724;
    color: #fff;
    text-align: center;
    padding-top: 7px;
    padding-bottom: 7px;
  }

  .bod2{
    padding-top: 40px !important;
   /* padding-bottom: 20px !important;*/
    background: #e6e6e6 !important;
    /* width: 100% !important; */
    overflow-x: hidden !important;
  }
  

  .content{
    background-color: #f5f5f5;
    /* height: 440px !important; */
    height: 100% !important;
  }

  .string{
    color: red !important;
  }

  .btnPersonal{
    background: #f06724;
    color: #fff;
  }

  .configuration {
    width: 240px;
    position: fixed;
    right: 0;
    top: 150px;
    margin-left: 0;
    z-index: 99999999;
    transition: transform .3s ease-in-out;
    transform: translate(100%, 0);
  }

  .configuration > .card{
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    margin: 0;
    border-radius: 0;
  }

  .configuration.active {
    transform: translate(0, 0);
  }
  .configuration-cog {
    width: 50px;
    height: 50px;
    position: absolute;
    left: -50px;
    line-height: 50px;
    font-size: 24px;
    text-align: center;
    background: #fff;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    cursor: pointer;

  }

  .configuration-cog > i:before {
    line-height: 50px;
  }

  a.navigation-link:hover {
    background: #0091ea;
      background: -moz-linear-gradient(-45deg, #0091ea 0%, #0091ea 100%);
      background: -webkit-linear-gradient(-45deg, #0091ea 0%, #0091ea 100%);
      background: linear-gradient(135deg, #0091ea 0%, #0091ea 100%);
      /*filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=$qp-color-1, endColorstr=$qp-color-2,GradientType=1 );*/
      -webkit-transition: opacity 0.2s ease-out;
      -moz-transition: opacity 0.2s ease-out;
      -o-transition: opacity 0.2s ease-out;
      transition: opacity 0.2s ease-out;
      -webkit-transition: width 0.3s ease-in-out;
      -moz-transition: width 0.3s ease-in-out;
      -o-transition: width 0.3s ease-in-out;
      transition: width 0.3s ease-in-out;
  }

  a.navigation-link.relative {
    border-left: 2px solid #0091ea;
  }

  .bod3{
    background: #e6e6e6 !important;
    /* width: 100% !important;
    height: 75% !important; */
    overflow-x: hidden !important;
    text-align: center;
  }

  .bod{
    padding-top: 20px !important;
    padding-bottom: 30px !important;
    background: #e6e6e6 !important;
    /* width: 100% !important;
    height: 75% !important; */
    overflow-x: hidden !important;
  }

  fieldset.scheduler-border {
    border: 1px groove #ddd !important;
    padding: 0 1.4em 1.4em 1.4em !important;
    margin: 10px 10px 1.5em 10px !important;
    border-radius: 5px;
  }

  legend.scheduler-border {
    background: #122f3b !important;
    color: #fff !important;
    padding: 5px 10px !important;
    min-width: 300px !important;
    font-size: 14px !important;
    border-radius: 5px !important;
    box-shadow: 0 0 0 3px #ddd !important;
    margin-left: 20px !important;
    font-weight: normal !important;
    font-size: 1.1em !important;
    width: inherit !important;
    padding: 1px 10px;
  } 

  .my-bg{
    background-color: #eff0f9;
  }

  .marg{
    padding-bottom: 17px !important;
  }

  .bg-g{
    background-color: #ababab;
  }

  .ts > tbody > tr:nth-child(2n+1) > td, .table-striped > tbody > tr:nth-child(2n+1) > th {
    background-color: #98989842;
  }

  .text-color{
    color: #464444 !important;
  }

  .dangerSpan {
    font-size: 0.8rem;
    color: rgb(244, 67, 54);
    position: relative;
  }

  .auxRow {
    margin-top: 15px;
  }


</style>

<script>

import axios from 'axios'

export default {
  data () {
    return {
      txtTitleBar : 'RASTREIE SUA ENTREGA',
      url: '',
      id: '',
      nota: '',
      idg005de: '',
      idg014: '',
      comentUnsub: '',
      descadastro: false,
      descadastroOK: false,
      confirmarDescadastro: false,
      validaSyngenta: false,
      validaFmc: false,
      validaAdama: false,
      showNotasCte: false,
      validEntrega: false,
      step: 1,
      cdrastreio: '',
      objDeliveryCte: [],
      objValidaMilestone: { SNHABCOL: 0 },
      dataColetaAux: null,
      DTBLOQUE: '',
      DTDESBLO: '',
      DTEMINOT: '',
      DTCOLETA: '',
      DTSAICAR: '',
      DTENTREG: '',
      DTPREENT: '',
      textDTCOLETA: '',
      dataHoje: new Date(),
      isLoading: false,
      dense: false,
      objNotaFiscal: {
        NRNOTA: '',
        DTEMINOT: '',
        NMCLIENTRE: '',
        CJCLIENTRE: '',
        NMTRANSP: '',
        CJTRANSP: '',
        NMCLIENTDE: '',
        CJCLIENTDE: '',
        NRCHADOC: '',
        DSMODENF: '',
        TPDELIVE: '',
        NRSERINF: '',
        PSBRUTO: '',
        PSLIQUID: '',
        DSINFCPL: '',
        IECLIENTRE: '',
        NMCIDADEDE: '',
        NMCIDADERE: '',
        CDESTADORE: '',
        IECLIENTDE: '',
        CDESTADODE: ''
      },
      modalNfeCompleta: false,
      cdDeliveAg: '',
      nrNotaAg: '',

      columns: [
       
        { name: 'DSPRODUT', align: 'left', label: 'Descrição do Produto', field: 'DSPRODUT', sortable: false },
        { name: 'QTPRODUT', label: 'Quantidade', align: 'left', field: 'QTPRODUT', sortable: true },
        // { name: 'VRUNIPRO', label: 'Valor Unitário', align: 'left', field: 'VRUNIPRO', sortable: true},
        // { name: 'VLTOTAL', label: 'Valor Total', align: 'left', field: 'VLTOTAL', sortable: true },
        { name: 'CDUNIDAD', label: 'Unidade', align: 'left', field: 'CDUNIDAD', sortable: true }
      ],

      data: ['']
    }
  },

  methods: {
    buscarNotaFiscal: function () {

      let codigoRastreio = {};
      this.isLoading = true;

      //this.utilServices.loadGridShow();

      if (this.cdrastreio !== null && this.cdrastreio !== '') {
        codigoRastreio = {CDRASTRE : this.cdrastreio.trim()};

        axios.post(this.url+'/api/mo/deliverynf/validaRastreio', codigoRastreio).then(response => {

          if (responde.data.IDG043 !== ''  && response.data.ISLIBERA !== 0) {
            this.objDeliveryCte = response.data.IDG043;
            
            this.showNotasCte = true;
            //this.utilServices.loadGridHide();
            
            if(response.data.CDOPERAC == 5){
              this.validaSyngenta = true;
              this.validaFmc = false;
              this.validaAdama = false;
            }else if (response.data.CDOPERAC == 93) {
              this.validaSyngenta = false;
              this.validaFmc = true;
              this.validaAdama = false;
            }else if (response.data.CDOPERAC == 71) {
              this.validaSyngenta = false;
              this.validaFmc = false;
              this.validaAdama = true;
            }else{
              this.validaSyngenta = false;
              this.validaFmc = false;
              this.validaAdama = false;
            }
            this.isLoading = false;
          } else {
            //this.utilServices.loadGridHide();
            this.isLoading = false;
            this.$q.notify({
              message: 'Não foi possível exibir o rastreio.',
              color: 'negative',
              position: 'top-right'
            })
          }
        }).catch( error => {
          //this.utilServices.loadGridHide();
          this.isLoading = false;
          this.$q.notify({
            message: 'Não foi possível exibir o rastreio.',
            color: 'negative',
            position: 'top-right'
          })
          console.log('Não foi possível exibir o rastreio.');
        })

      } else if (this.id !== null && this.id !== '' && (this.cdDeliveAg == null || this.cdDeliveAg == '' ||  this.cdDeliveAg == undefined) 
        && (this.nota !== '' && this.nota !== null && this.nota !== undefined)) {
        
        if(this.idg005de != null && this.idg005de != undefined && this.idg005de != ''
          && this.idg014 != null && this.idg014 != undefined && this.idg014 != '') {

          this.descadastro = true;
          this.isLoading = false;

        } else {

          codigoRastreio = {CDRASTRE : this.id.trim(), IDG043: this.nota};         

            axios.post(this.url+'/api/mo/deliverynf/validaRastreio', codigoRastreio).then(response => {

              if (response.data.IDG043 != ''  && response.data.ISLIBERA != 0) {
                this.objDeliveryCte = response.data.IDG043;
                
                //this.showNotasCte = true;
                //this.utilServices.loadGridHide();
      
                if(response.data.CDOPERAC == 5){
                  this.validaSyngenta = true;
                  this.validaFmc = false;
                  this.validaAdama = false;
                }else if (response.data.CDOPERAC == 93) {
                  this.validaSyngenta = false;
                  this.validaFmc = true;
                  this.validaAdama = false;
                }else if (response.data.CDOPERAC == 71) {
                  this.validaSyngenta = false;
                  this.validaFmc = false;
                  this.validaAdama = true;
                }else{
                  this.validaSyngenta = false;
                  this.validaFmc = false;
                  this.validaAdama = false;
                }
                //this.isLoading = false;
                this.abreDetalheNota(this.objDeliveryCte[0]);
              } else {
                //this.utilServices.loadGridHide();
                this.isLoading = false;
                this.$q.notify({
                  message: 'Não foi possível exibir o rastreio.',
                  color: 'negative',
                  position: 'top-right'
                })
                console.log('Não foi possível exibir o rastreio.');
              }
            }).catch( error => {
              //this.utilServices.loadGridHide();
              this.isLoading = false;
              this.$q.notify({
                message: 'Não foi possível exibir o rastreio.',
                color: 'negative',
                position: 'top-right'
              })
              console.log('Não foi possível exibir o rastreio.');
            })
        }

      }else if (this.id !== null && this.id !== '' && this.cdDeliveAg !== null 
        && this.cdDeliveAg !== '' && this.cdDeliveAg !== undefined) {
        codigoRastreio = {
          CDRASTRE : this.id.trim(),
          CDDELIVE: this.cdDeliveAg,
          NRNOTA: this.nrNotaAg ? this.nrNotaAg : null
        };

          axios.post(this.url+'/api/mo/deliverynf/validaRastreioAg', codigoRastreio).then(response => {

            if (response.data.IDG043 != '') {
              this.objDeliveryCte = response.data.IDG043;

              
              //this.showNotasCte = true;
              //this.utilServices.loadGridHide();

              //this.isLoading = false;
              this.abreDetalheNota(this.objDeliveryCte[0]);
            } else {
              //this.utilServices.loadGridHide();
              this.isLoading = false;
              this.$q.notify({
                message: 'Não foi possível exibir o rastreio.',
                color: 'negative',
                position: 'top-right'
              })
              console.log('Não foi possível exibir o rastreio.');
            }
          }).catch( error => {
            //this.utilServices.loadGridHide();
            this.isLoading = false;
            this.$q.notify({
              message: 'Não foi possível exibir o rastreio.',
              color: 'negative',
              position: 'top-right'
            })
            console.log('Não foi possível exibir o rastreio.');
          })
      } else {
        //this.utilServices.loadGridHide();
        this.isLoading = false;
        this.$q.notify({
          message: 'Não foi possível exibir o rastreio.',
          color: 'negative',
          position: 'top-right'
        })
        console.log('Não foi possível exibir o rastreio.');
      }
    },
    removeEmail: function () {
      
      if(this.comentUnsub == '' || this.comentUnsub.length  > 255 ){
        this.$q.notify({
              message: 'Preencha o campo motivo (Até 255 caracteres).',
              color: 'negative',
              position: 'top-right'
            })
      }else{
        let Obj = {IDG005DE: this.idg005de, COMMENT: this.comentUnsub, IDG014: this.idg014};
        axios.post(this.url+'/api/mo/deliverynf/descadastroRastreio', Obj).then(response => {            
            this.descadastro = false;
            this.descadastroOK = true;
          }).catch( error => {
            this.isLoading = false;
            this.$q.notify({
              message: 'Não foi possível realizar a operação.',
              color: 'negative',
              position: 'top-right'
            })
          })
      }
    },
    abreDetalheNota: function (item) {
      console.log(item);
      this.isLoading = true;
      let controllerView;

      if(this.cdDeliveAg !== '' && this.cdDeliveAg !== null && this.cdDeliveAg !== undefined){
        controllerView =
        {
          'IDG043'	: 	item.IDG043,
          'IDG051'	: 	item.IDG051,
          'NFE'		:	false,
          'IT_NFE'	: 	false,
          'CTE'		:	true,
          'NT_CTE'	:	false,
          'RASTREIO'	:	false,
          'TRACKING'	:	true,
          'NFE_AG': true,
          'IT_NFE_AG': true,
          'RASTREIO_AG': true,
          'IDG083': item.IDG083,
        }

        axios.post(this.url+'/api/mo/deliverynf/getNfefromRastreio', controllerView).then(response => {

        // Validação do milestone mostrar coletado apenas quando a data de coleta
        // for igual ou maior que a data de hoje
        let dtColAux = null;
        let dtColAux2 = null;
        let dtColAux3 = null;
        let timerCole = null;
        let timerHoje = null;
        let dtHojeAux2 = null;
        let dtHojeAux = this.dataHoje.toLocaleDateString("pt-BR");
        let dtHojeAux3 = dtHojeAux.split('/');
        //sempre que cvhamar detalhe da nota, seta como 0 para não ficar dados de outras consultas
        this.objValidaMilestone = {
          SNHABCOL : 0
        };

        if(response.data.RASTREAMENTO_AG.DTCOLETA != null && response.data.RASTREAMENTO_AG.DTCOLETA != ''){
          //trata data da coleta vinda do banco
          this.dataColetaAux = new Date(response.data.RASTREAMENTO_AG.DTCOLETA);
          dtColAux = this.dataColetaAux.toLocaleDateString("pt-BR");
          dtColAux3 = dtColAux.split('/');
          dtColAux2 = new Date(Number(dtColAux3[2]),Number(dtColAux3[1]), Number(dtColAux3[0]));
          timerCole = dtColAux2.getTime();
          //trata data "Hoje"
          dtHojeAux2 = new Date(Number(dtHojeAux3[2]),Number(dtHojeAux3[1]), Number(dtHojeAux3[0]));
          timerHoje = dtHojeAux2.getTime();
          //compara as duas datas
          if(timerHoje >= timerCole){
            //flag para deixar como completo o milestone da data de coleta
            this.objValidaMilestone = {
              SNHABCOL : 1
            };
          }
        }

        //preenche as informações do stepper
        this.DTBLOQUE = response.data.RASTREAMENTO_AG.DTBLOQUE;
        this.DTDESBLO = response.data.RASTREAMENTO_AG.DTDESBLO;
        this.DTEMINOT = response.data.RASTREAMENTO_AG.DTEMINOT;
        this.DTCOLETA = (response.data.RASTREAMENTO_AG.DTCOLETA).split("-").reverse().join("/");
        this.DTSAICAR = response.data.RASTREAMENTO_AG.DTSAICAR;
        this.DTENTREG = response.data.RASTREAMENTO_AG.DTENTREG;
        this.DTPREENT = response.data.RASTREAMENTO_AG.DTPREENT;

        //preenche as informações da nota
        this.objNotaFiscal.NRNOTA = response.data.NFE_AG.NRNOTA;
        this.objNotaFiscal.DTEMINOT = response.data.NFE_AG.DTEMINOT;
        this.objNotaFiscal.NMCLIENTRE = response.data.NFE_AG.NMCLIENTRE;
        this.objNotaFiscal.CJCLIENTRE = response.data.NFE_AG.CJCLIENTRE.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5");
        this.objNotaFiscal.NMTRANSP = response.data.NFE_AG.NMTRANSP;
        this.objNotaFiscal.CJTRANSP = response.data.NFE_AG.CJTRANSP.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5");
        this.objNotaFiscal.NMCLIENTDE = response.data.NFE_AG.NMCLIENTDE;
        this.objNotaFiscal.CJCLIENTDE = response.data.NFE_AG.CJCLIENTDE.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5");
        this.objNotaFiscal.NRCHADOC = response.data.NFE_AG.NRCHADOC;
        this.objNotaFiscal.DSMODENF = response.data.NFE_AG.DSMODENF;
        this.objNotaFiscal.TPDELIVE = response.data.NFE_AG.TPDELIVE;
        this.objNotaFiscal.NRSERINF = response.data.NFE_AG.NRSERINF;
        this.objNotaFiscal.PSBRUTO = response.data.NFE_AG.PSBRUTO;
        this.objNotaFiscal.PSLIQUID = response.data.NFE_AG.PSLIQUID;
        this.objNotaFiscal.DSINFCPL = response.data.NFE_AG.DSINFCPL;
        this.objNotaFiscal.IECLIENTRE = response.data.NFE_AG.IECLIENTRE;
        this.objNotaFiscal.NMCIDADEDE = response.data.NFE_AG.NMCIDADEDE;
        this.data = response.data.NFE_AG.ITENS_NFE;
        this.objNotaFiscal.NMCIDADERE = response.data.NFE_AG.NMCIDADERE;
        this.objNotaFiscal.CDESTADORE = response.data.NFE_AG.CDESTADORE;
        this.objNotaFiscal.IECLIENTDE = response.data.NFE_AG.IECLIENTDE;
        this.objNotaFiscal.CDESTADODE = response.data.NFE_AG.CDESTADODE;
        
        

        if((this.DTCOLETA && !this.DTBLOQUE) || (this.DTCOLETA && this.DTBLOQUE && this.DTDESBLO)){
          this.textDTCOLETA = this.DTCOLETA;
        }else{
          this.textDTCOLETA = '';
        }

        //this.utilServices.loadGridHide();
        this.validEntrega = true;
        this.showNotasCte = true;
        this.isLoading = false;
        }).catch( error => {
          //this.utilServices.loadGridHide();
          this.isLoading = false;
          this.$q.notify({
            message: 'Não foi possível exibir o rastreio.',
            color: 'negative',
            position: 'top-right'
          })
          console.log('Não foi possível exibir o rastreio.');
          console.log(error);
        })

      }else{
        //console.log("chegou no abreDetalheNota", item);
        //this.utilServices.loadGridShow();
        controllerView =
        {
          'IDG043'	: 	item.IDG043,
          'IDG051'	: 	item.IDG051,
          'NFE'		:	true,
          'IT_NFE'	: 	true,
          'CTE'		:	true,
          'NT_CTE'	:	false,
          'RASTREIO'	:	true,
          'TRACKING'	:	true,
          'IDG083': item.IDG083

        }

        axios.post(this.url+'/api/mo/deliverynf/getNfefromRastreio', controllerView).then(response => {

          // Validação do milestone mostrar coletado apenas quando a data de coleta
          // for igual ou maior que a data de hoje
          let dtColAux = null;
          let dtColAux2 = null;
          let dtColAux3 = null;
          let timerCole = null;
          let timerHoje = null;
          let dtHojeAux2 = null;
          let dtHojeAux = this.dataHoje.toLocaleDateString("pt-BR");
          let dtHojeAux3 = dtHojeAux.split('/');
          //sempre que cvhamar detalhe da nota, seta como 0 para não ficar dados de outras consultas
          this.objValidaMilestone = {
            SNHABCOL : 0
          };

          if(response.data.RASTREAMENTO.DTCOLETA != null && response.data.RASTREAMENTO.DTCOLETA != ''){
            //trata data da coleta vinda do banco
            this.dataColetaAux = new Date(response.data.RASTREAMENTO.DTCOLETA);
            dtColAux = this.dataColetaAux.toLocaleDateString("pt-BR");
            dtColAux3 = dtColAux.split('/');
            dtColAux2 = new Date(Number(dtColAux3[2]),Number(dtColAux3[1]), Number(dtColAux3[0]));
            timerCole = dtColAux2.getTime();
            //trata data "Hoje"
            dtHojeAux2 = new Date(Number(dtHojeAux3[2]),Number(dtHojeAux3[1]), Number(dtHojeAux3[0]));
            timerHoje = dtHojeAux2.getTime();
            //compara as duas datas
            if(timerHoje >= timerCole){
              //flag para deixar como completo o milestone da data de coleta
              this.objValidaMilestone = {
                SNHABCOL : 1
              };
            }
          }

          //preenche as informações do stepper
          this.DTBLOQUE = response.data.RASTREAMENTO.DTBLOQUE;
          this.DTDESBLO = response.data.RASTREAMENTO.DTDESBLO;
          this.DTEMINOT = response.data.RASTREAMENTO.DTEMINOT;
          this.DTCOLETA = (response.data.RASTREAMENTO.DTCOLETA).split("-").reverse().join("/");
          this.DTSAICAR = response.data.RASTREAMENTO.DTSAICAR;
          this.DTENTREG = response.data.RASTREAMENTO.DTENTREG;
          this.DTPREENT = response.data.RASTREAMENTO.DTPREENT;

          //preenche as informações da nota
          this.objNotaFiscal.NRNOTA = response.data.NFE.NRNOTA;
          this.objNotaFiscal.DTEMINOT = response.data.NFE.DTEMINOT;
          this.objNotaFiscal.NMCLIENTRE = response.data.NFE.NMCLIENTRE;
          this.objNotaFiscal.CJCLIENTRE = response.data.NFE.CJCLIENTRE != null ? response.data.NFE.CJCLIENTRE.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5") : '';
          this.objNotaFiscal.NMTRANSP = response.data.NFE.NMTRANSP;
          this.objNotaFiscal.CJTRANSP = response.data.NFE.CJTRANSP != null ? response.data.NFE.CJTRANSP.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5") : '';
          this.objNotaFiscal.NMCLIENTDE = response.data.NFE.NMCLIENTDE;
          this.objNotaFiscal.CJCLIENTDE = response.data.NFE.CJCLIENTDE != null ? response.data.NFE.CJCLIENTDE.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5") : '';
          this.objNotaFiscal.NRCHADOC = response.data.NFE.NRCHADOC;
          this.objNotaFiscal.DSMODENF = response.data.NFE.DSMODENF;
          this.objNotaFiscal.TPDELIVE = response.data.NFE.TPDELIVE;
          this.objNotaFiscal.NRSERINF = response.data.NFE.NRSERINF;
          this.objNotaFiscal.PSBRUTO = response.data.NFE.PSBRUTO;
          this.objNotaFiscal.PSLIQUID = response.data.NFE.PSLIQUID;
          this.objNotaFiscal.DSINFCPL = response.data.NFE.DSINFCPL;
          this.objNotaFiscal.IECLIENTRE = response.data.NFE.IECLIENTRE;
          this.objNotaFiscal.NMCIDADEDE = response.data.NFE.NMCIDADEDE;
          this.objNotaFiscal.NMCIDADERE = response.data.NFE.NMCIDADERE;
          this.objNotaFiscal.CDESTADORE = response.data.NFE.CDESTADORE;
          this.objNotaFiscal.IECLIENTDE = response.data.NFE.IECLIENTDE;
          this.objNotaFiscal.CDESTADODE = response.data.NFE.CDESTADODE;

          this.data = response.data.NFE.ITENS_NFE;

          this.data = this.data.map( obj => {
            obj.VRUNIPRO = obj.VRUNIPRO.toFixed(2);
            obj.VLTOTAL = obj.VLTOTAL.toFixed(2);
            return obj;
          });

          
          

          if((this.DTCOLETA && !this.DTBLOQUE) || (this.DTCOLETA && this.DTBLOQUE && this.DTDESBLO)){
            this.textDTCOLETA = this.DTCOLETA;
          }else{
            this.textDTCOLETA = '';
          }

          //this.utilServices.loadGridHide();
          this.validEntrega = true;
          this.showNotasCte = true;
          this.isLoading = false;
          }).catch( error => {
            //this.utilServices.loadGridHide();
            this.isLoading = false;
            this.$q.notify({
              message: 'Não foi possível exibir o rastreio.',
              color: 'negative',
              position: 'top-right'
            })
            console.log('Não foi possível exibir o rastreio.');
            console.log(error);
          })
      }
      
    }

  },


  created () {

    var url_atual = window.location.href;
    var url_https = url_atual.slice(0, 5);

    this.id = this.$route.query.id;
    this.nota = this.$route.query.nota;
    this.nrNotaAg = this.$route.query.nr;
    this.cdDeliveAg = this.$route.query.cd;
    this.idg005de = this.$route.query.user;
    this.idg014 = this.$route.query.op;

    if(url_atual.indexOf("bravo2020") != -1) {
      url_atual = url_atual.replace("bravo2020","evolog");
      location.replace(url_atual);
    }

    if (url_https == 'https') {
      this.url = 'https://monitoria.evolog.com.br';
    }else{
      this.url = 'http://monitoria.evolog.com.br';
    }

    if(this.id) {
      this.buscarNotaFiscal();
    }
  }

}
</script>
