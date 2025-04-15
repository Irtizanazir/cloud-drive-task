import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-work-in-progress',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="wip-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Work in Progress</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="wip-content">
            <mat-icon class="wip-icon">construction</mat-icon>
            <h2>{{ featureName }} is coming soon!</h2>
            <p>We're working hard to bring you this feature. Please check back later.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .wip-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 2rem;
    }
    .wip-content {
      text-align: center;
      padding: 2rem;
    }
    .wip-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
      color: #ffd700;
    }
    mat-card {
      max-width: 600px;
      width: 100%;
    }
    h2 {
      margin: 1rem 0;
      color: #333;
    }
    p {
      color: #666;
    }
  `]
})
export class WorkInProgressComponent implements OnInit {
  featureName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.featureName = data['featureName'] || 'This feature';
    });
  }
} 