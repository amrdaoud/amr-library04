import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
@Component({
    template:''
})
export class Unsubscriber implements OnDestroy {
    private subscription = new Subscription();
    ngOnDestroy():void {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    set _otherSubscription(value: Subscription) {
        this.subscription.add(value);
    }
}