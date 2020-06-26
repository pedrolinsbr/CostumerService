import { Routes } from '@angular/router';

import { BacklogComponent } from './backlog/backlog.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const TransporteRoutes: Routes = [
    {
        path: '',
        children: [
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
        }    
    ]
    }
];