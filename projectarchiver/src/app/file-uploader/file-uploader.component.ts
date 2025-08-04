// import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
// import { ApiService } from '../common/api.service';
// import { FormBuilder } from '@angular/forms';
// import { ToastService } from '../common/toast.service';
//
// @Component({
//   selector: 'app-file-uploader',
//   templateUrl: './file-uploader.component.html',
//   styleUrls: ['./file-uploader.component.scss']
// })
// export class FileUploaderComponent implements OnInit {
//   @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
//   @ViewChild('folderInput') folderInputRef!: ElementRef<HTMLInputElement>;
//   @Output() cancelUpload = new EventEmitter<void>();
//   @Output() uploadComplete = new EventEmitter<any>();
//
//   files: File[] = [];
//   isDragging: boolean = false;
//   isUploading: boolean = false;
//   uploadProgress: number = 0;
//   uploadType: 'files' | 'folder' | 'both' = 'files';
//   description: string = '';
//
//   constructor(
//     private apiService: ApiService,
//     private fb: FormBuilder,
//     private toast: ToastService
//   ) {}
//
//   ngOnInit(): void {
//     this.uploadType = 'files';
//     this.files = [];
//     this.description = '';
//   }
//
//   handleUploadTypeChange(type: 'files' | 'folder' | 'both'): void {
//     this.uploadType = type;
//     this.files = [];
//   }
//
//   triggerFileInput(): void {
//     if (this.uploadType === 'files') {
//       this.fileInputRef.nativeElement.click();
//     } else if (this.uploadType === 'folder') {
//       this.folderInputRef.nativeElement.click();
//     }
//   }
//
//   handleFileSelected(event: Event): void {
//     const target = event.target as HTMLInputElement;
//     const selectedFiles = Array.from(target.files || []);
//     this.addFiles(selectedFiles);
//   }
//
//   addFiles(newFiles: File[]): void {
//     const existingNames = this.files.map(f => f.name);
//     const uniqueFiles = newFiles.filter(f => !existingNames.includes(f.name));
//     this.files = [...this.files, ...uniqueFiles];
//   }
//
//   removeFile(index: number): void {
//     this.files.splice(index, 1);
//   }
//
//   removeFolderFiles(folderFiles: File[]): void {
//     this.files = this.files.filter(f => !folderFiles.includes(f));
//   }
//
//   formatFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }
//
//   getFileIconClass(file: File): string {
//     const ext = file.name.split('.').pop()?.toLowerCase();
//     const iconMap: { [key: string]: string } = {
//       pdf: 'fa-file-pdf',
//       doc: 'fa-file-word',
//       xls: 'fa-file-excel',
//       jpg: 'fa-file-image',
//       mp4: 'fa-file-video',
//       mp3: 'fa-file-audio',
//       zip: 'fa-file-zipper',
//       txt: 'fa-file-lines'
//     };
//     return iconMap[ext || ''] || 'fa-file';
//   }
//
//   getGroupedItems(): any[] {
//     if (this.uploadType === 'folder') {
//       const folderMap = new Map<string, File[]>();
//       const individualFiles: File[] = [];
//
//       this.files.forEach(file => {
//         const filePath = (file as any).webkitRelativePath || file.name;
//         const pathParts = filePath.split('/');
//
//         if (pathParts.length > 1) {
//           const folderName = pathParts[0];
//           if (!folderMap.has(folderName)) {
//             folderMap.set(folderName, []);
//           }
//           folderMap.get(folderName)!.push(file);
//         } else {
//           individualFiles.push(file);
//         }
//       });
//
//       const result: any[] = [];
//
//       folderMap.forEach((files, folderName) => {
//         result.push({
//           isFolder: true,
//           folderName,
//           files
//         });
//       });
//
//       individualFiles.forEach(file => {
//         result.push({
//           isFolder: false,
//           file,
//           originalIndex: this.files.indexOf(file)
//         });
//       });
//
//       return result;
//     } else {
//       return this.files.map((file, index) => ({
//         isFolder: false,
//         file,
//         originalIndex: index
//       }));
//     }
//   }
//
//   getTotalSize(): string {
//     const totalBytes = this.files.reduce((sum, file) => sum + file.size, 0);
//     return this.formatFileSize(totalBytes);
//   }
//
//   uploadFiles(): void {
//     if (this.files.length === 0) return;
//
//     this.isUploading = true;
//     this.uploadProgress = 0;
//
//     const formData = new FormData();
//     const fileName = this.files.length > 0 ? this.files[0].name : 'default.zip';
//
//     formData.append('fileName', fileName);
//     formData.append('description', this.description);
//     this.files.forEach(file => {
//       formData.append('file', file, file.name);
//     });
//
//     this.apiService.createArchive(formData).subscribe({
//       next: (response: any) => {
//         this.isUploading = false;
//         this.uploadProgress = 100;
//         this.toast.showSuccess('Files uploaded successfully');
//         this.files = [];
//         this.description = '';
//       },
//       error: (error: any) => {
//         this.isUploading = false;
//         this.uploadProgress = 0;
//         this.toast.showError('Failed to upload files');
//         console.error('Upload error:', error);
//       }
//     });
//   }
//
//   // Drag and drop handlers
//   handleDragEnter(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = true;
//   }
//
//   handleDragLeave(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
//     const x = event.clientX;
//     const y = event.clientY;
//
//     if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
//       this.isDragging = false;
//     }
//   }
//
//   handleDragOver(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = true;
//   }
//
//   handleDrop(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = false;
//
//     const items = event.dataTransfer?.items;
//     const files = event.dataTransfer?.files;
//
//     if (this.uploadType === 'folder' && items) {
//       this.handleFolderDrop(items);
//     } else if (files) {
//       const droppedFiles = Array.from(files);
//       this.addFiles(droppedFiles);
//     }
//   }
//
//   private async handleFolderDrop(items: DataTransferItemList): Promise<void> {
//     const files: File[] = [];
//
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       if (item.kind === 'file') {
//         const entry = item.webkitGetAsEntry();
//         if (entry) {
//           await this.traverseFileTree(entry, files);
//         }
//       }
//     }
//
//     this.addFiles(files);
//   }
//
//   private async traverseFileTree(item: any, files: File[], path: string = ''): Promise<void> {
//     return new Promise((resolve) => {
//       if (item.isFile) {
//         item.file((file: File) => {
//           (file as any).webkitRelativePath = path + file.name;
//           files.push(file);
//           resolve();
//         });
//       } else if (item.isDirectory) {
//         const dirReader = item.createReader();
//         dirReader.readEntries(async (entries: any[]) => {
//           for (const entry of entries) {
//             await this.traverseFileTree(entry, files, path + item.name + '/');
//           }
//           resolve();
//         });
//       }
//     });
//   }
//
//   cancel(): void {
//     this.files = [];
//     this.isDragging = false;
//     this.isUploading = false;
//     this.uploadProgress = 0;
//     this.description = '';
//     this.cancelUpload.emit();
//   }
// }

//second runnable but bug code//
// import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
// import { ApiService } from '../common/api.service';
// import { FormBuilder } from '@angular/forms';
// import { ToastService } from '../common/toast.service';
//
// @Component({
//   selector: 'app-file-uploader',
//   templateUrl: './file-uploader.component.html',
//   styleUrls: ['./file-uploader.component.scss']
// })
// export class FileUploaderComponent implements OnInit {
//   @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
//   @ViewChild('folderInput') folderInputRef!: ElementRef<HTMLInputElement>;
//   @Output() cancelUpload = new EventEmitter<void>();
//   @Output() uploadComplete = new EventEmitter<any>();
//
//   files: File[] = [];
//   isDragging: boolean = false;
//   isUploading: boolean = false;
//   uploadProgress: number = 0;
//   uploadType: 'files' | 'folder' | 'both' = 'files';
//   description: string = '';
//
//   constructor(
//     private apiService: ApiService,
//     private fb: FormBuilder,
//     private toast: ToastService
//   ) {}
//
//   ngOnInit(): void {
//     this.uploadType = 'files';
//     this.files = [];
//     this.description = '';
//   }
//
//   handleUploadTypeChange(type: 'files' | 'folder' | 'both'): void {
//     this.uploadType = type;
//     this.files = [];
//   }
//
//   triggerFileInput(): void {
//     if (this.uploadType === 'files') {
//       this.fileInputRef.nativeElement.click();
//     } else if (this.uploadType === 'folder') {
//       this.folderInputRef.nativeElement.click();
//     }
//   }
//
//   handleFileSelected(event: Event): void {
//     const target = event.target as HTMLInputElement;
//     const selectedFiles = Array.from(target.files || []);
//     this.addFiles(selectedFiles);
//   }
//
//   addFiles(newFiles: File[]): void {
//     const existingNames = this.files.map(f => f.name);
//     const uniqueFiles = newFiles.filter(f => !existingNames.includes(f.name));
//     this.files = [...this.files, ...uniqueFiles];
//   }
//
//   removeFile(index: number): void {
//     this.files.splice(index, 1);
//   }
//
//   removeFolderFiles(folderFiles: File[]): void {
//     this.files = this.files.filter(f => !folderFiles.includes(f));
//   }
//
//   formatFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }
//
//   getFileIconClass(file: File): string {
//     const ext = file.name.split('.').pop()?.toLowerCase();
//     const iconMap: { [key: string]: string } = {
//       pdf: 'fa-file-pdf',
//       doc: 'fa-file-word',
//       xls: 'fa-file-excel',
//       jpg: 'fa-file-image',
//       mp4: 'fa-file-video',
//       mp3: 'fa-file-audio',
//       zip: 'fa-file-zipper',
//       txt: 'fa-file-lines'
//     };
//     return iconMap[ext || ''] || 'fa-file';
//   }
//
//   getGroupedItems(): any[] {
//     if (this.uploadType === 'folder') {
//       const folderMap = new Map<string, File[]>();
//       const individualFiles: File[] = [];
//
//       this.files.forEach(file => {
//         const filePath = (file as any).webkitRelativePath || file.name;
//         const pathParts = filePath.split('/');
//
//         if (pathParts.length > 1) {
//           const folderName = pathParts[0];
//           if (!folderMap.has(folderName)) {
//             folderMap.set(folderName, []);
//           }
//           folderMap.get(folderName)!.push(file);
//         } else {
//           individualFiles.push(file);
//         }
//       });
//
//       const result: any[] = [];
//
//       folderMap.forEach((files, folderName) => {
//         result.push({
//           isFolder: true,
//           folderName,
//           files
//         });
//       });
//
//       individualFiles.forEach(file => {
//         result.push({
//           isFolder: false,
//           file,
//           originalIndex: this.files.indexOf(file)
//         });
//       });
//
//       return result;
//     } else {
//       return this.files.map((file, index) => ({
//         isFolder: false,
//         file,
//         originalIndex: index
//       }));
//     }
//   }
//
//   getTotalSize(): string {
//     const totalBytes = this.files.reduce((sum, file) => sum + file.size, 0);
//     return this.formatFileSize(totalBytes);
//   }
//
//   uploadFiles(): void {
//     if (this.files.length === 0) return;
//
//     this.isUploading = true;
//     this.uploadProgress = 0;
//
//     const formData = new FormData();
//
//     // Extract folder name if uploading a folder
//     let fileName = 'default.zip';
//     if (this.uploadType === 'folder' && this.files.length > 0) {
//       const firstFile = this.files[0] as any;
//       const folderPath = firstFile.webkitRelativePath || firstFile.name;
//       fileName = folderPath.split('/')[0] + '.zip'; // Use the folder name
//     } else if (this.files.length > 0) {
//       fileName = this.files[0].name;
//     }
//
//     formData.append('fileName', fileName);
//     formData.append('description', this.description);
//     this.files.forEach(file => {
//       formData.append('file', file, (file as any).webkitRelativePath || file.name);
//     });
//
//     const endpoint = this.uploadType === 'folder' ? '/api/v1/algorithm/deflate/compress' : '/api/v1/algorithm/compress';
//     this.apiService.createArchive(formData, endpoint, { responseType: 'blob' }).subscribe({
//       next: (response: Blob) => {
//         this.isUploading = false;
//         this.uploadProgress = 100;
//
//         // Clear the uploaded files
//         this.files = [];
//         this.description = '';
//
//         // Emit the uploadComplete event to notify the parent component
//         this.uploadComplete.emit();
//
//         this.toast.showSuccess('Files compressed and uploaded successfully');
//       },
//       error: (error: any) => {
//         this.isUploading = false;
//         this.uploadProgress = 0;
//         this.toast.showError('Failed to upload files');
//         console.error('Upload error:', error);
//       }
//     });
//   }
//
//   // Drag and drop handlers
//   handleDragEnter(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = true;
//   }
//
//   handleDragLeave(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
//     const x = event.clientX;
//     const y = event.clientY;
//
//     if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
//       this.isDragging = false;
//     }
//   }
//
//   handleDragOver(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = true;
//   }
//
//   handleDrop(event: DragEvent): void {
//     event.preventDefault();
//     event.stopPropagation();
//     this.isDragging = false;
//
//     const items = event.dataTransfer?.items;
//     const files = event.dataTransfer?.files;
//
//     if (this.uploadType === 'folder' && items) {
//       this.handleFolderDrop(items);
//     } else if (files) {
//       const droppedFiles = Array.from(files);
//       this.addFiles(droppedFiles);
//     }
//   }
//
//   private async handleFolderDrop(items: DataTransferItemList): Promise<void> {
//     const files: File[] = [];
//
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       if (item.kind === 'file') {
//         const entry = item.webkitGetAsEntry();
//         if (entry) {
//           await this.traverseFileTree(entry, files);
//         }
//       }
//     }
//
//     this.addFiles(files);
//   }
//
//   private async traverseFileTree(item: any, files: File[], path: string = ''): Promise<void> {
//     return new Promise((resolve) => {
//       if (item.isFile) {
//         item.file((file: File) => {
//           (file as any).webkitRelativePath = path + file.name;
//           files.push(file);
//           resolve();
//         });
//       } else if (item.isDirectory) {
//         const dirReader = item.createReader();
//         dirReader.readEntries(async (entries: any[]) => {
//           for (const entry of entries) {
//             await this.traverseFileTree(entry, files, path + item.name + '/');
//           }
//           resolve();
//         });
//       }
//     });
//   }
//
//   cancel(): void {
//     this.files = [];
//     this.isDragging = false;
//     this.isUploading = false;
//     this.uploadProgress = 0;
//     this.description = '';
//     this.cancelUpload.emit();
//   }
// }


import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../common/api.service';
import { FormBuilder } from '@angular/forms';
import { ToastService } from '../common/toast.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('folderInput') folderInputRef!: ElementRef<HTMLInputElement>;
  @Output() cancelUpload = new EventEmitter<void>();
  @Output() uploadComplete = new EventEmitter<any>();

  files: File[] = [];
  isDragging: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadType: 'files' | 'folder' | 'both' = 'files';
  description: string = '';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.uploadType = 'files';
    this.files = [];
    this.description = '';
    this.resetFileInputs();
  }

  handleUploadTypeChange(type: 'files' | 'folder' | 'both'): void {
    this.uploadType = type;
    this.files = [];
    this.resetFileInputs();
  }

  resetFileInputs(): void {
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
    if (this.folderInputRef?.nativeElement) {
      this.folderInputRef.nativeElement.value = '';
    }
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
    if (this.uploadType === 'folder') {
      const folderMap = new Map<string, File[]>();
      const individualFiles: File[] = [];

      this.files.forEach(file => {
        const filePath = (file as any).webkitRelativePath || file.name;
        const pathParts = filePath.split('/');

        if (pathParts.length > 1) {
          const folderName = pathParts[0];
          if (!folderMap.has(folderName)) {
            folderMap.set(folderName, []);
          }
          folderMap.get(folderName)!.push(file);
        } else {
          individualFiles.push(file);
        }
      });

      const result: any[] = [];

      folderMap.forEach((files, folderName) => {
        result.push({
          isFolder: true,
          folderName,
          files
        });
      });

      individualFiles.forEach(file => {
        result.push({
          isFolder: false,
          file,
          originalIndex: this.files.indexOf(file)
        });
      });

      return result;
    } else {
      return this.files.map((file, index) => ({
        isFolder: false,
        file,
        originalIndex: index
      }));
    }
  }

  getTotalSize(): string {
    const totalBytes = this.files.reduce((sum, file) => sum + file.size, 0);
    return this.formatFileSize(totalBytes);
  }

  // uploadFiles(): void {
  //   if (this.files.length === 0) {
  //     this.toast.showError('No files selected for upload');
  //     return;
  //   }
  //
  //   this.isUploading = true;
  //   this.uploadProgress = 0;
  //
  //   const formData = new FormData();
  //   let fileName = 'archive.zip';
  //   if (this.uploadType === 'folder' && this.files.length > 0) {
  //     const firstFile = this.files[0] as any;
  //     const folderPath = firstFile.webkitRelativePath || firstFile.name;
  //     fileName = folderPath.split('/')[0].replace(/[^a-zA-Z0-9.-]/g, '_') + '.zip';
  //   } else if (this.files.length === 1) {
  //     fileName = this.files[0].name.replace(/[^a-zA-Z0-9.-]/g, '_');
  //   }
  //
  //   formData.append('fileName', fileName);
  //   formData.append('description', this.description);
  //   this.files.forEach(file => {
  //     formData.append('file', file, (file as any).webkitRelativePath || file.name);
  //   });
  //
  //   const endpoint = this.uploadType === 'folder' ? '/api/v1/algorithm/deflate/compress' : '/api/v1/algorithm/compress';
  //   this.apiService.createArchive(formData, endpoint, { responseType: 'json' }).subscribe({
  //     next: (response: any) => {
  //       this.isUploading = false;
  //       this.uploadProgress = 100;
  //       this.files = [];
  //       this.description = '';
  //       this.resetFileInputs();
  //       this.uploadComplete.emit(response.data);
  //       this.toast.showSuccess(`Files compressed and uploaded successfully using ${this.uploadType === 'folder' ? 'ZIP Deflate' : 'Huffman'} compression`);
  //     },
  //     error: (error: any) => {
  //       this.isUploading = false;
  //       this.uploadProgress = 0;
  //       this.toast.showError(`Failed to upload files: ${error.message || 'Unknown error'}`);
  //       console.error('Upload error:', error);
  //     },
  //     complete: () => {
  //       this.isUploading = false;
  //     }
  //   });
  // }


  uploadFiles(): void {
    if (this.files.length === 0) {
      this.toast.showError('No files selected for upload');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    let fileName = 'archive.zip';
    if (this.uploadType === 'folder' && this.files.length > 0) {
      const firstFile = this.files[0] as any;
      const folderPath = firstFile.webkitRelativePath || firstFile.name;
      fileName = folderPath.split('/')[0].replace(/[^a-zA-Z0-9.-]/g, '_') + '.zip';
    } else if (this.files.length === 1) {
      fileName = this.files[0].name.replace(/[^a-zA-Z0-9.-]/g, '_');
    }

    formData.append('fileName', fileName);
    formData.append('description', this.description);
    this.files.forEach(file => {
      formData.append('file', file, (file as any).webkitRelativePath || file.name);
    });

    const endpoint = this.uploadType === 'folder' ? '/api/v1/algorithm/deflate/compress' : '/api/v1/algorithm/compress';
    this.apiService.createArchive(formData, endpoint, { responseType: 'json' }).subscribe({
      next: (response: any) => {
        this.isUploading = false;
        this.uploadProgress = 100;
        this.files = [];
        this.description = '';
        this.resetFileInputs();
        this.uploadComplete.emit(response.data);
        this.toast.showSuccess(`Files compressed and uploaded successfully using ${this.uploadType === 'folder' ? 'ZIP Deflate' : 'Huffman'} compression`);
      },
      error: (error: any) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        this.toast.showError(`Failed to upload files: ${error.message || 'Unknown error'}`);
        console.error('Upload error:', error);
      }
    });
  }

  // Drag and drop handlers
  handleDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      this.isDragging = false;
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const items = event.dataTransfer?.items;
    const files = event.dataTransfer?.files;

    if (this.uploadType === 'folder' && items) {
      this.handleFolderDrop(items);
    } else if (files) {
      const droppedFiles = Array.from(files);
      this.addFiles(droppedFiles);
    }
  }

  private async handleFolderDrop(items: DataTransferItemList): Promise<void> {
    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await this.traverseFileTree(entry, files);
        }
      }
    }

    this.addFiles(files);
  }

  // private async traverseFileTree(item: any, files: File[], path: string = ''): Promise<void> {
  //   return new Promise((resolve) => {
  //     if (item.isFile) {
  //       item.file((file: File) => {
  //         (file as any).webkitRelativePath = path + file.name;
  //         files.push(file);
  //         resolve();
  //       });
  //     } else if (item.isDirectory) {
  //       const dirReader = item.createReader();
  //       dirReader.readEntries(async (entries: any[]) => {
  //         for (const entry of entries) {
  //           await this.traverseFileTree(entry, files, path + item.name + '/');
  //         }
  //         resolve();
  //       });
  //     }
  //   });
  // }


  private async traverseFileTree(item: any, files: File[], path: string = ''): Promise<void> {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file: File) => {
          const relativePath = path + file.name;
          if (!relativePath || relativePath.trim() === '') {
            console.warn('Invalid relative path for file:', file.name);
            resolve();
            return;
          }
          (file as any).webkitRelativePath = relativePath;
          console.log('File tree entry:', file.name, 'Path:', relativePath);
          files.push(file);
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async (entries: any[]) => {
          for (const entry of entries) {
            await this.traverseFileTree(entry, files, path + item.name + '/');
          }
          resolve();
        });
      }
    });
  }

  cancel(): void {
    this.files = [];
    this.isDragging = false;
    this.isUploading = false;
    this.uploadProgress = 0;
    this.description = '';
    this.resetFileInputs();
    this.cancelUpload.emit();
  }
}
