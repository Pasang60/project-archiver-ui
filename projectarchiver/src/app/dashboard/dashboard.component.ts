
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { ToastService } from '../common/toast.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

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
  totalArchive: number = 0;
  userArchive: number = 0;
  verifiedUsers: number = 0;
  compressedData: any[] = [];
  selectedFile: any = null;
  pendingProjects: any[] = [];

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private http: HttpClient
  ) {}

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
      this.authService.getAdminCompressedData().subscribe(
        (response) => {
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
    this.authService.getArchiveCount().subscribe(
      (response: any) => {
        this.totalArchive = response.data;
      },
      (error) => {
        console.error('Error fetching archive count:', error);
        this.toast.showError('Failed to fetch archive count');
      }
    );
  }

  countUsers() {
    this.authService.getUserCount().subscribe(
      (response: any) => {
        this.verifiedUsers = response.data;
      },
      (error) => {
        console.error('Error fetching user count:', error);
        this.toast.showError('Failed to fetch user count');
      }
    );
  }

  userCountArchive() {
    this.authService.getUserArchiveCount().subscribe(
      (response: any) => {
        this.userArchive = response.data;
      },
      (error) => {
        console.error('Error fetching user archive count:', error);
        this.toast.showError('Failed to fetch user archive count');
      }
    );
  }

  toggleUploadArea() {
    this.showUploadArea = !this.showUploadArea;
  }


  onUploadComplete(uploadedData: any): void {
    this.showUploadArea = false;
    this.compressedData = [...this.compressedData, uploadedData];
    this.loadCompressedData();
    this.userCountArchive();
  }

  approveProject(project: any) {
    project.status = 'approved';
  }

  rejectProject(project: any) {
    project.status = 'rejected';
  }

  deleteProject(id: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`/api/v1/algorithm/delete/${id}`).subscribe({
          next: () => {
            this.compressedData = this.compressedData.filter((data: any) => data.archiveId !== id);
            this.userCountArchive();
            this.toast.showSuccess('File deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting file:', error);
            this.toast.showError('Failed to delete file');
          }
        });
      } else {
        this.toast.showInfo('Deletion canceled');
      }
    });
  }

  downloadFile(data: any): void {
    const id = data.archiveId;
    const compressionType = data.compressedAlgorithm;

    this.authService.downloadFile(id, compressionType).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) {
          this.toast.showError('No file data received');
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = compressionType === 'ZIP Deflate'
          ? `${data.fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}.zip`
          : data.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.toast.showSuccess('File downloaded successfully');
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        if (error.status === 404) {
          this.toast.showError('File not found');
        } else if (error.status === 401) {
          this.toast.showError('Unauthorized: Please log in again');
        } else {
          this.toast.showError('Failed to download file');
        }
      }
    });
  }



  openViewModal(fileData: any): void {
    this.selectedFile = fileData;
    console.log('Opening modal for file:', fileData);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
    else if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MB`;
    else return `${(bytes / 1073741824).toFixed(2)} GB`;
  }

  getTotalSpaceSaved(): string {
    const totalSaved = this.compressedData.reduce(
      (total: number, project: any) => total + (project.originalSize - project.compressedSize),
      0
    );
    return this.formatFileSize(totalSaved);
  }

  protected readonly Math = Math;
}
