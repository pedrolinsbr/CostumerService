import { Routes } from '@angular/router';

import { BloqueioComponent } from './bloqueio.component';

export const BloqueioRoutes: Routes = [{
  path: '',
  component: BloqueioComponent,
  data: {
    heading: 'Bloqueio NF'
  }
}];
