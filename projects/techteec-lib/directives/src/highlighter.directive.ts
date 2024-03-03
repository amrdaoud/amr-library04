import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

export interface Highlight {
  Value: string | number | boolean;
  Operation: '=' | '<' | '>' | '<=' | '>=' | '<>'
  Color?: string;
  BackgroundColor?: string;
  AltText?: string;
}

@Directive({
  selector: '[amrHighlighter]',
  standalone: true
})
export class HighlighterDirective implements OnInit {
  @Input() amrHighlighter: Highlight[] | undefined;
  @Input() value!: string;
  private el = inject(ElementRef);
  constructor() {}
  ngOnInit(): void {
    if(this.amrHighlighter) {
      this.el.nativeElement.style.lineHeight = '20px';
      this.el.nativeElement.style.padding = '5px 10px';
    }
    const highlight = this.comparer();
    if(highlight) {
      this.el.nativeElement.style.borderRadius = '5px'
      this.el.nativeElement.style.backgroundColor = highlight.BackgroundColor;
      this.el.nativeElement.style.color = highlight.Color;
      if(highlight.AltText) {
        this.el.nativeElement.innerText = highlight.AltText;
      }
    }
  }
  comparer(): Highlight | undefined {
    if(!this.amrHighlighter) {
      return undefined;
    }
    const result = this.amrHighlighter.find(x => (x.Operation === '>' && this.value > x.Value)
                                              || (x.Operation === '<' && this.value < x.Value)
                                              || (x.Operation === '>=' && this.value >= x.Value)
                                              || (x.Operation === '<=' && this.value <= x.Value)
                                              || (x.Operation === '<>' && this.value !== x.Value)
                                              || (x.Operation === '=' && this.value === x.Value));
    return result;
  }

}
