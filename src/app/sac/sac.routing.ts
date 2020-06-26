import { Routes } from '@angular/router';

import { BacklogComponent } from './backlog/backlog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAdmComponent } from './dashboardAdm/dashboard.component';
import { ControleComponent } from './controle/controle.component';

export const SacRoutes: Routes = [
    {
        path: '',
        children: [
        {
            path: 'cockpit',
            component: ControleComponent,
            data: {
                heading: 'Cockpit'
            }
        },
        {
            path: 'backlog',
            component: BacklogComponent,
            data: {
                heading: 'Backlog'
            }
        },
        {
            path: 'dashboard',
            component: DashboardComponent,
            data: {
                heading: 'Dashboard'
            }
        },
        {
            path: 'dashboardAdm',
            component: DashboardAdmComponent,
            data: {
                heading: 'Dashboard'
            }
        }     
    ]
    }
];