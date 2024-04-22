import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input('media_query') mobileQueryMax: boolean = false;
  @Output('toggle') navtoggle = new EventEmitter();
  notificationCount = 99;
  onClickNavToggle() {
    this.navtoggle.emit();
  }
}
