import {Component, ViewChild, ElementRef, OnInit, Output, EventEmitter} from '@angular/core';
import {ApiService} from '../common/api.service';
import {FormBuilder} from '@angular/forms';
import {ToastService} from '../common/toast.service';
import {interval} from 'rxjs';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit{
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('folderInput') folderInputRef!: ElementRef<HTMLInputElement>;
  @Output() cancelUpload = new EventEmitter<void>();

  files: File[] = [];
  isDragging: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadType: 'files' | 'folder' | 'both' = 'files';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
  }

  handleUploadTypeChange(type: 'files' | 'folder' | 'both'): void {
    this.uploadType = type;
    this.files = [];
  }

  triggerFileInput(): void {
    if (this.uploadType === 'files') {
      this.fileInputRef.nativeElement.click();
    } else if (this.uploadType === 'folder') {
      this.folderInputRef.nativeElement.click();
    }
  }

  handleFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selectedFiles = Array.from(target.files || []);
    this.addFiles(selectedFiles);
  }

  addFiles(newFiles: File[]): void {
    const existingNames = this.files.map(f => f.name);
    const uniqueFiles = newFiles.filter(f => !existingNames.includes(f.name));
    this.files = [...this.files, ...uniqueFiles];
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    this.addFiles(droppedFiles);
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  removeFolderFiles(folderFiles: File[]): void {
    this.files = this.files.filter(f => !folderFiles.includes(f));
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIconClass(file: File): string {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const iconMap: { [key: string]: string } = {
      pdf: 'fa-file-pdf',
      doc: 'fa-file-word',
      xls: 'fa-file-excel',
      jpg: 'fa-file-image',
      mp4: 'fa-file-video',
      mp3: 'fa-file-audio',
      zip: 'fa-file-zipper',
      txt: 'fa-file-lines'
    };
    return iconMap[ext || ''] || 'fa-file';
  }

  getGroupedItems(): any[] {
    // Example grouping logic
    return this.files.map((file, index) => ({
      isFolder: false,
      file,
      originalIndex: index
    }));
  }

  getTotalSize(): string {
    const totalBytes = this.files.reduce((sum, file) => sum + file.size, 0);
    return this.formatFileSize(totalBytes);
  }


  uploadFiles(): void {
    if (this.files.length === 0) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();

    // Dynamically set the file name based on the first file or custom logic
    const fileName = this.files.length > 0 ? this.files[0].name : 'default.zip';
    formData.append('fileName', fileName); // Append dynamic fileName

    // Append each file individually
    this.files.forEach(file => {
      formData.append('file', file, file.name);
    });
    this.apiService.createArchive(formData).subscribe({
      next: (response: any) => {
        this.isUploading = false;
        this.uploadProgress = 100;
        this.toast.showSuccess('Files uploaded successfully');
        this.files = [];
      },
      error: (error: any) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        this.toast.showError('Failed to upload files');
        console.error('Upload error:', error);
      }
    });
  }

  cancel(): void {
    this.files = [];
    this.isDragging = false;
    this.isUploading = false;
    this.uploadProgress = 0;
    this.cancelUpload.emit();
  }

  ngOnInit(): void {
    this.uploadType = 'files'; // Default upload type
    this.files = [];
  }


}
