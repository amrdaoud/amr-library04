import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'contact-messages', loadComponent:() => import('./contact-messages/contact-message-list/contact-message-list.component').then(c => c.ContactMessageListComponent)},
];
