import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(private overlay: Overlay) {
    this.intermidate.subscribe((show) => {
      if (show && !this.overlayRef.hasAttached()) {
        this.showSpinner();
      } else if (!show && this.overlayRef.hasAttached()) {
        this.hideSpinner();
      }
    });

    this.determinate.subscribe((number) => {
      if (number <= 100 && !this.overlayRef.hasAttached()) {
        this.showSpinner();
      } else if (number >= 100 && this.overlayRef.hasAttached()) {
        this.hideSpinner();
      }
    });
  }
  intermidate: Subject<boolean> = new Subject();
  determinate: Subject<number> = new Subject();
  private overlayRef: OverlayRef = this.createOverlay();
  private templatePortal!: TemplatePortal<any>;
  private createOverlay(): OverlayRef {
    return this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });
  }

  showSpinner() {
    this.overlayRef.attach(this.templatePortal);
  }
  hideSpinner() {
    this.overlayRef.detach();
  }

  attach(
    templatePortalContent: TemplateRef<any>,
    viewContainerRef: ViewContainerRef
  ) {
    this.templatePortal = new TemplatePortal(
      templatePortalContent,
      viewContainerRef
    );
  }
}
