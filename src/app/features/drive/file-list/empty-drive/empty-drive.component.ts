import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-empty-drive',
  templateUrl: './empty-drive.component.html',
  styleUrl: './empty-drive.component.scss'
})
export class EmptyDriveComponent {
@Input() isDriveEmpty!:boolean;

}
