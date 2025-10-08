import { Routes } from '@angular/router';
import { DropArea } from './drop-area/drop-area';

export const routes: Routes = [
    { path: '', redirectTo: 'translate', pathMatch: 'full' },
    { path: 'translate', component: DropArea },
];
