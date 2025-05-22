import {Component, EventEmitter, OnInit, Output, signal} from '@angular/core';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  archives: any[] = [];
  filteredArchives: any[] = [];
  loading = true;
  showUploadArea = false;
  searchTerm = '';
  sortBy = 'date';
  applyFilters = signal<any | null>(null);

  constructor(private authService: AuthService) {}
  @Output() uploadComplete = new EventEmitter<any>();
  @Output() cancelUpload = new EventEmitter<void>();


  ngOnInit() {
    this.fetchArchives();
  }

  fetchArchives() {
    // Simulate an API call
    setTimeout(() => {
      this.archives = [
        // Example data
        { name: 'Sample Archive', size: '500 MB', date: '2025-05-18' },
      ];
      this.loading = false; // Set loading to false after data is loaded
    }, 2000); // Simulated delay
  }

  toggleUploadArea() {
    this.showUploadArea = !this.showUploadArea;
  }


  onUploadComplete($event: any) {
    // Handle the upload completion event
    this.archives.push($event);
    this.showUploadArea = false; // Hide the upload area after upload
  }


}
