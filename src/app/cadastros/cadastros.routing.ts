import { Routes } from '@angular/router';
import { AcoesComponent } from './acoes/acoes.component';
import { TelaClientesContatosComponent } from './tela-clientes-contatos/tela-clientes-contatos.component';
import { TelaClienteComponent } from './tela-cliente/tela-cliente.component';
import {GruposEmail} from './grupos-email/grupos-email.component';
import { DataCanhotoComponent } from './data-canhoto/data-canhoto.component';
import { EdiComponent } from './edi/edi.component'; 

export const CadastrosRoutes: Routes = [
    {
        path: '',
        children: [
        {
            path: 'clientes',
            component: TelaClienteComponent,
            data: {
                heading: 'Clientes'
            }
        },
        {
            path: 'tipos-acao',
            component: AcoesComponent,
            data: {
                heading: 'Ações'
            }
        },
        {
            path: 'clientes-contatos',
            component: TelaClientesContatosComponent,
            data: {
                heading: 'Contatos Clientes'
            }
        },
        {
            path: 'grupo-email',
            component: GruposEmail,
            data: {
                heading: 'Grupos de E-mails'
            }
        },
        {
            path: 'data-canhoto',
            component: DataCanhotoComponent,
            data: {
                heading: 'Data do Canhoto'
            }
        },
        {
            path: 'edi',
            component: EdiComponent,
            data: {
                heading: 'Edi Rastreio'
            }
        }
    ]
    }
];
