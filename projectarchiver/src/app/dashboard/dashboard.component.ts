import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  archives: any[] = [];
  filteredArchives: any[] = [];
  loading = true;
  showUploadArea = false;
  searchTerm = '';
  sortBy = 'date';
  isAdmin = false;
  isStudent = false;
  totalArchive: any;
  userArchive: any;
  verifiedUsers: any;
  compressedData: any;
  // Selected file for modal
  selectedFile: any = null;
  pendingProjects: any[] = [];
  studentProjects: any[] = [];

  constructor(private authService: AuthService) {}

  @Output() uploadComplete = new EventEmitter<any>();
  @Output() cancelUpload = new EventEmitter<void>();

  ngOnInit() {
    this.checkUserRole();
    this.loadCompressedData();
    this.userCountArchive();
  }

  checkUserRole() {
    const roleData = localStorage.getItem('role');
    if (roleData) {
      const role = JSON.parse(roleData).name;
      this.isAdmin = role === 'ROLE_ADMIN';
      this.isStudent = role === 'ROLE_USER';
    }
  }

  loadCompressedData() {
    this.loading = true;
    if (this.isAdmin) {
      this.countArchive();
      this.countUsers();
      this.authService.getAdminCompressedData().subscribe((response) => {
          this.compressedData = response.data;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching admin compressed data:', error);
          this.loading = false;
        }
      );

    } else if (this.isStudent) {
      this.authService.getStudentCompressedData().subscribe(
        (response) => {
          this.compressedData = response.data;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching student compressed data:', error);
          this.loading = false;
        }
      );
    }
  }

  countArchive() {
    this.authService.getArchiveCount().subscribe((response) => {
      this.totalArchive = response.data;
    });
  }

  countUsers() {
    this.authService.getUserCount().subscribe((response) => {
      this.verifiedUsers = response.data;
    });
  }

  userCountArchive() {
    this.authService.getUserArchiveCount().subscribe((response) => {
      this.userArchive = response.data;
    });
  }

  toggleUploadArea() {
    this.showUploadArea = !this.showUploadArea;
  }

  onUploadComplete(archive: any) {
    this.showUploadArea = false;
    this.archives.push(archive);
  }

  approveProject(project: any) {
    project.status = 'approved';
  }

  rejectProject(project: any) {
    project.status = 'rejected';
  }

  deleteProject() {
    if (confirm('Are you sure you want to delete this project?')) {
    }
  }

  // Method to open view modal
  openViewModal(fileData: any): void {
    this.selectedFile = fileData;
    console.log('Opening modal for file:', fileData);
  }

  getStudentName(userId: string): string {
    return 'John Doe'; // Mock data
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
    else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MB`;
    else return `${(bytes / 1073741824).toFixed(2)} GB`;
  }

  getTotalSpaceSaved(): string {
    const totalSaved = this.pendingProjects.reduce(
      (total, project) => total + (project.originalSize - project.compressedSize),
      0
    );
    return this.formatFileSize(totalSaved);
  }

  protected readonly Math = Math;
}
