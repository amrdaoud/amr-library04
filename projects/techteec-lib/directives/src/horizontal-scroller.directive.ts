import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, inject } from '@angular/core';

@Directive({
  selector: '[amrHorizontalScroller]',
  standalone: true
})
export class HorizontalScrollerDirective {
  isDragging = false;
  mouseDown = false;
  startX!: number;
  scrollLeft!: any;
  private el = inject(ElementRef);
  @Output() dragging = new EventEmitter<boolean>()
  @HostBinding('class') elementClass = 'horizontal-scroller';
  @HostListener('mousedown', ['$event']) onMouseDown(e: any) {
    this.startDragging(e);
  }
  @HostListener('mouseup', ['$event']) onMouseUp(e: any) {
    this.stopDragging(e);
    setTimeout(() => {
      this.dragging.emit(false);
    }, 10)
  }
  @HostListener('mouseleave', ['$event']) onMouseLeave(e: any) {
    this.stopDragging(e);
  }
  @HostListener('mousemove', ['$event']) onMouseMove(e: any) {
    this.inDragging(e);
  }
  startDragging(e: any) {
    this.mouseDown = true;
    this.startX = e.pageX - this.el.nativeElement.offsetLeft;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
  }
  stopDragging(e: any) {
    this.isDragging = false;
    this.mouseDown = false;
  }
  inDragging(e: any) {
    e.preventDefault();
    if (!this.mouseDown) {
      this.dragging.emit(false);
      return;
    }
    const x = e.pageX - this.el.nativeElement.offsetLeft;
    const scroll = x - this.startX;
    if (Math.abs(scroll) > 10) {
      this.dragging.emit(true);
    }
    this.el.nativeElement.scrollLeft = this.scrollLeft - scroll;
  }
  resetScroll() {
    this.el.nativeElement.scrollLeft = 0;
  }
}
