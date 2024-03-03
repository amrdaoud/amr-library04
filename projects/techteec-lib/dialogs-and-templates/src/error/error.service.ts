import { Injectable, inject } from '@angular/core';
import { Unsubscriber } from 'techteec-lib/common';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class ErrorService extends Unsubscriber {
  private currentCode: number | null = null;
  private snackBar = inject(MatSnackBar);
  open(code: number, message: string) {
    if (this.currentCode !== code) {
      this.currentCode = code;
      this._otherSubscription = this.snackBar.open(`Error Code #${code} \n ${message}`, 'OK',
        { verticalPosition: 'top', panelClass: 'techteec-snack-error' })
        .afterDismissed().subscribe(() => this.currentCode = null)
    }
  }
  get isOpenedCode(): number | null {
    return this.currentCode;
  }
}
