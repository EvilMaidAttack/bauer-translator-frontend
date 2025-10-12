import { Routes } from '@angular/router';
import { DropArea } from './drop-area/drop-area';
import { Login } from './login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'translate', component: DropArea, canActivate: [authGuard] },
];
