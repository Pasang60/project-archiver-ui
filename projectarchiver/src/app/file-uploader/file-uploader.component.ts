import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../auth/service/auth.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {
  @Output() uploadComplete = new EventEmitter<any>();
  @Output() cancelUpload = new EventEmitter<void>();

  files: File[] = [];
  isDragging = false;
  isUploading = false;
  uploadProgress = 0;

  constructor(private archiveService: AuthService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      this.addFiles(droppedFiles);
    }
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files) {
      const selectedFiles = Array.from(element.files);
      this.addFiles(selectedFiles);
    }
  }

  addFiles(newFiles: File[]) {
    // Add files that aren't already selected
    const uniqueFiles = newFiles.filter(newFile =>
      !this.files.some(existingFile =>
        existingFile.name === newFile.name &&
        existingFile.size === newFile.size
      )
    );

    this.files = [...this.files, ...uniqueFiles];
  }

  removeFile(index: number, event: MouseEvent) {
    event.stopPropagation(); // Prevent triggering the upload area click
    this.files = this.files.filter((_, i) => i !== index);
  }

  uploadFiles() {
    if (this.files.length === 0) return;

    this.isUploading = true;

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 5;
      }
    }, 300);

    this.archiveService.createArchive(this.files).subscribe({
      next: (archive) => {
        // Complete progress and emit the new archive
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.uploadComplete.emit(archive);
          this.resetUploader();
        }, 500);
      },
      error: (error) => {
        clearInterval(progressInterval);
        console.error('Error uploading files', error);
        this.isUploading = false;
        this.uploadProgress = 0;
        alert('Failed to upload files. Please try again.');
      }
    });
  }

  cancel() {
    this.resetUploader();
    this.cancelUpload.emit();
  }

  resetUploader() {
    this.files = [];
    this.isDragging = false;
    this.isUploading = false;
    this.uploadProgress = 0;
  }

  formatFileSize(bytes: number): string | null {
    // return this.archiveService.formatFileSize(bytes);
    return null;
  }

  getFileIconClass(file: File): string {
    const fileType = file.type;

    if (fileType.includes('image')) {
      return 'fa-solid fa-file-image';
    } else if (fileType.includes('pdf')) {
      return 'fa-solid fa-file-pdf';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return 'fa-solid fa-file-word';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return 'fa-solid fa-file-excel';
    } else if (fileType.includes('zip') || fileType.includes('compressed')) {
      return 'fa-solid fa-file-zipper';
    } else if (fileType.includes('text')) {
      return 'fa-solid fa-file-lines';
    } else if (fileType.includes('audio')) {
      return 'fa-solid fa-file-audio';
    } else if (fileType.includes('video')) {
      return 'fa-solid fa-file-video';
    } else {
      return 'fa-solid fa-file';
    }
  }

}
