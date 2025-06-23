import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'], // Fixed typo: styleUrl -> styleUrls
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
  pendingProjects: any[] = []; // Added missing variable
  studentProjects: any[] = []; // Added missing variable

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private authService: AuthService) {}

  @Output() uploadComplete = new EventEmitter<any>();
  @Output() cancelUpload = new EventEmitter<void>();

  ngOnInit() {
    this.checkUserRole();
    this.loadDashboardData();
  }

  checkUserRole() {
    const roleData = localStorage.getItem('role');
    if (roleData) {
      const role = JSON.parse(roleData).name; // Parse the role JSON
      this.isAdmin = role === 'ROLE_ADMIN';
      this.isStudent = role === 'ROLE_USER';
    }
  }

  loadDashboardData() {
    if (this.isAdmin) {

      this.countArchive();
      this.countUsers();
      // Load admin dashboard data
      this.pendingProjects = [
        {
          id: '1',
          name: 'Web Development Project',
          description: 'Final year project for web development course',
          teamMembers: ['John Doe', 'Jane Smith'],
          originalSize: 15000000,
          compressedSize: 3750000,
          compressionRatio: 75,
          createdAt: new Date().toISOString(),
          userId: '2',
          status: 'pending',
        },
        // Add more mock projects
      ];
    } else if (this.isStudent) {

      this.userCountArchive();
      // Load student dashboard data
      this.studentProjects = [
        {
          id: '1',
          name: 'Mobile App Project',
          description: 'React Native mobile application',
          teamMembers: ['Current User', 'Team Member'],
          originalSize: 25000000,
          compressedSize: 5000000,
          compressionRatio: 80,
          createdAt: new Date().toISOString(),
          // userId: this.authService.getCurrentUser()?.id || '',
          status: 'approved',
        },
        // Add more mock projects
      ];
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

  userCountArchive(){
    this.authService.getUserArchiveCount().subscribe((response) => {
      this.userArchive = response.data;
    });
  }

  toggleUploadArea() {
    this.showUploadArea = !this.showUploadArea;
  }

  onUploadComplete(archive: any) {
    // Handle project upload
    this.showUploadArea = false;
    this.archives.push(archive);
    this.loadDashboardData();
  }

  approveProject(project: any) {
    project.status = 'approved';
    // Update project status
  }

  rejectProject(project: any) {
    project.status = 'rejected';
    // Update project status
  }

  deleteProject(project: any) {
    if (confirm('Are you sure you want to delete this project?')) {
      // Delete project logic
      this.studentProjects = this.studentProjects.filter((p) => p.id !== project.id);
    }
  }

  viewProject(project: any) {
    // Navigate to project details
    console.log('Viewing project:', project);
  }

  getStudentName(userId: string): string {
    // Get student name from userId
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
}
