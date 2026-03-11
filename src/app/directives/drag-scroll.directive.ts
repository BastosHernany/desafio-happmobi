import { Directive, ElementRef, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appArrastarScroll]',
  standalone: true,
})
export class ArrastarScrollDirective implements OnDestroy {
  private pressionado = false;
  private xInicial = 0;
  private scrollInicial = 0;
  private desanexos: Array<() => void> = [];

  constructor(private elemento: ElementRef<HTMLElement>, private renderer: Renderer2) {
    const node = this.elemento.nativeElement;

    const aoPressionar = (e: PointerEvent) => {
      this.pressionado = true;
      node.setPointerCapture?.(e.pointerId);
      this.xInicial = e.pageX - node.offsetLeft;
      this.scrollInicial = node.scrollLeft;
      this.renderer.addClass(node, 'grabbing');
      this.renderer.setStyle(document.body, 'userSelect', 'none');
    };

    const aoMover = (e: PointerEvent) => {
      if (!this.pressionado) return;
      e.preventDefault();
      const x = e.pageX - node.offsetLeft;
      const desloc = (x - this.xInicial) * 1;
      node.scrollLeft = this.scrollInicial - desloc;
    };

    const aoSoltar = (e: PointerEvent) => {
      if (!this.pressionado) return;
      this.pressionado = false;
      try { node.releasePointerCapture?.(e.pointerId); } catch {}
      this.renderer.removeClass(node, 'grabbing');
      this.renderer.removeStyle(document.body, 'userSelect');
    };

    node.addEventListener('pointerdown', aoPressionar);
    node.addEventListener('pointermove', aoMover);
    window.addEventListener('pointerup', aoSoltar);

    this.desanexos.push(() => node.removeEventListener('pointerdown', aoPressionar));
    this.desanexos.push(() => node.removeEventListener('pointermove', aoMover));
    this.desanexos.push(() => window.removeEventListener('pointerup', aoSoltar));
  }

  ngOnDestroy(): void {
    this.desanexos.forEach((h) => h());
    this.renderer.removeStyle(document.body, 'userSelect');
  }
}
