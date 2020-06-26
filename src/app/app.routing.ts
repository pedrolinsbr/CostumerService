import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';


//import { RecoveryComponent } from './account/recovery/recovery.component';
//import { SignupComponent } from './account/signup/signup.component';

export const AppRoutes: Routes = [

  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: './home/home.module#HomeModule'
      },
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'sac',
        loadChildren: './sac/sac.module#SacModule'
      },
      {
        path: 'cadastros',
        loadChildren: './cadastros/cadastros.module#CadastrosModule'
      },
      {
        path: 'transporte',
        loadChildren: './transporte/transporte.module#TransporteModule'
      },
      {
        path: 'bloqueio',
        loadChildren: './bloqueio/bloqueio.module#BloqueioModule'
      },
      {
        path: 'relatorios',
        loadChildren: './relatorio/relatorio.module#RelatorioModule'
      },
      {
        path: 'cliente',
        loadChildren: './sac/sac.module#SacModule'
      },
      {
        path: 'raio-x',
        loadChildren: './raio-x/raio-x.module#RaioXModule'
      },
      {
        path: 'visualizacaoAg',
        loadChildren: './visualizacaoAg/visualizacaoAg.module#VisualizacaoAgModule'
      },

    ]
  },
  {
  path: 'admin',
  component: AuthLayoutComponent,
  children: [
    {
      path: 'login',
      loadChildren: './account/login/login.module#LoginModule'
    }
    /* ,
    {
      path: 'recovery',
      component: RecoveryComponent
    },
    {
      path: 'signup',
      component: SignupComponent
    } */
    ]
  }

];
