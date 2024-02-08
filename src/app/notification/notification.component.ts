import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() positiveNotification: boolean = true;
  @Output() closeNotification = new EventEmitter<void>();

  ngOnInit(): void {
    setTimeout(() => {
      this.closeNotification.emit();
    }, 3000);
  }
}
