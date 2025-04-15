import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appMaxFileSize]',
})
export class MaxFileSizeDirective implements OnInit, OnDestroy {
  @Input('appMaxFileSize') maxFileSizeMB = 100;
  @Output() fileSizeExceeded = new EventEmitter<File[]>();

  private changeListener: (() => void) | undefined;

  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.changeListener = this.renderer.listen(this.el.nativeElement, 'change', (event: Event) => {
      this.checkFiles(event);
    });
  }

  ngOnDestroy(): void {
    if (this.changeListener) {
      this.changeListener();
    }
  }

  private checkFiles(event: Event): void {
    const input = this.el.nativeElement;
    if (!input.files || input.files.length === 0) return;

    const maxSizeBytes = this.maxFileSizeMB * 1024 * 1024;
    const exceededFiles = Array.from(input.files).filter(f => f.size > maxSizeBytes);

    if (exceededFiles.length > 0) {
      this.fileSizeExceeded.emit(exceededFiles);
      input.value = ''; // Reset the input
    }
  }
}
