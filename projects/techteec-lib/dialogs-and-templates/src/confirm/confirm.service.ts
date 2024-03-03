import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmModel } from './confirm';
import { ConfirmComponent } from './confirm-dialog/confirm.component';
@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private dialog = inject(MatDialog)
  constructor() { }
  open(data?: ConfirmModel): Observable<boolean> {
    return this.dialog.open(ConfirmComponent,{data: data, panelClass: 'techteec-confirm-dialog'})
    .afterClosed()
  }
}
