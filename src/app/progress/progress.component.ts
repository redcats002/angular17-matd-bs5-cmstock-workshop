import {
  ComponentPortal,
  TemplatePortal,
  DomPortal,
} from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { LoadingService } from 'app/services/loading.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css',
})
export class ProgressComponent implements AfterViewInit {
  constructor(
    private _viewContainerRef: ViewContainerRef,
    private loadingService: LoadingService
  ) {
    loadingService.intermidate.subscribe((_) => {
      this.mode = 'indeterminate';
    });

    loadingService.determinate.subscribe((value) => {
      this.value = value;
      this.mode = 'determinate';
    });
  }

  @ViewChild('templatePortalContent')
  templatePortalContent!: TemplateRef<unknown>;

  @Input() color: ThemePalette;
  @Input() strokeWidth: number = 10;
  @Input() diameter: number = 100;
  @Input() mode!: ProgressSpinnerMode;
  @Input() value!: number;

  ngAfterViewInit() {
    this.loadingService.attach(
      this.templatePortalContent,
      this._viewContainerRef
    );
  }
}
