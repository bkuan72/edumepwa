import { CommonFn } from 'app/shared/common-fn';
import {
    Component,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    Input,
} from '@angular/core';
import { ProfileService } from 'app/main/pages/profile/profile.service';

export interface UploadFileIfc {
    name: string;
    title: string;
    img: string;
    fullImage: string;
    invalid: boolean;
    failUpload: boolean;
    invalidMsg?: string;
    uploaded: boolean;
}

@Component({
    selector: 'app-image-file-upload',
    templateUrl: './image-drop-upload.component.html',
    styleUrls: ['./image-drop-upload.component.scss'],
})
export class ImageDropUploadComponent {
    @Input() ownerOfPhotos: boolean;
    @Input() periodId: string;
    @Input() period: string;
    @Input() infoStr: string;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onFileInput: EventEmitter<any> = new EventEmitter();
    @Output() uploadStarted: EventEmitter<any> = new EventEmitter();
    @Output() uploadReadingFile: EventEmitter<string> = new EventEmitter();
    @Output() uploadUploadingFile: EventEmitter<string> = new EventEmitter();
    @Output() uploadEnded: EventEmitter<any> = new EventEmitter();

    currentPeriodId: string;
    uploadInProgress = false;
    progressMessage: string;

    @ViewChild('fileInput') imageFileInputFile: ElementRef;

    constructor(
        private _profileService: ProfileService,
        private _fn: CommonFn
    ) {
        this.currentPeriodId = this.periodId;
    }

    isHovering: boolean;

    files: File[] = [];
    fileNames: string[] = [];
    fileBlobs: UploadFileIfc[] = [];

    toggleHover(event: boolean): void {
        this.isHovering = event;
    }

    public loadFile(file: File, idx: number, fileList: FileList): Promise<void> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            let base64Data;

            reader.addEventListener('load', () => {
                base64Data = reader.result;
                this._fn
                    .resizeImage(base64Data, 0.05, 128)
                    .then((previewImg) => {
                        this._fn
                        .resizeImage(base64Data, 0.60, 128)
                        .then((fullImg) => {
                        this.fileBlobs.push({
                            name: file.name,
                            title: '',
                            img: previewImg,
                            fullImage: fullImg,
                            invalid: false,
                            failUpload: false,
                            uploaded: false
                        });
                        resolve();
                    });
                    });
            });
            reader.addEventListener('error', () => {
                resolve();
            });
            reader.addEventListener('loadstart', () => {
                this.progressMessage = 'Reading ' + (idx + 1).toString() +
                ' of ' + fileList.length.toString() +
                ' file : ' + file.name;
                this.uploadReadingFile.emit(file.name);
            });
            reader.addEventListener('loadend', () => {});
            reader.addEventListener('progress', () => {});
            reader.addEventListener('abort', () => {
                // Fired when a read has been aborted, for example because the program called FileReader.abort().
                // Also available via the onabort property.
                resolve();
            });

            reader.readAsDataURL(file); // convert to base64 string
        });
    }

    doUploadFile(idx: number, fileList: UploadFileIfc[], uploadNext: boolean): Promise<void> {
        return new Promise<void>((resolve) => {
            const fileToUpload = fileList[idx];

            const uploadNextImage = () => {
                if (idx + 1 < fileList.length) {
                    this.doUploadFile(idx + 1, fileList, uploadNext)
                        .finally(() => {
                            resolve();
                        });
                } else {
                    resolve();
                }
            }
            if (fileToUpload.uploaded) {
                if (uploadNext) {
                    uploadNextImage();
                }
                return;
            }
            if (fileToUpload.invalid) {
                if (uploadNext) {
                    uploadNextImage();
                }
                return;
            } else {
                if (this._fn.emptyStr(this.currentPeriodId)) {
                    this.uploadMediaPeriodToServer(fileList, idx).then((periodId) => {
                        this.currentPeriodId = periodId;
                        this.uploadMediaToServer(this.currentPeriodId, fileList, idx).then(() => {
                            if (uploadNext) {
                                uploadNextImage();
                            }
                            return;
                        });
                    })
                    .catch(() => {
                        fileList[idx].failUpload = true;
                        fileList[idx].invalid = true;
                        fileList[idx].invalidMsg = 'Failed To Upload Media Period To Server';
                        if (uploadNext) {
                            uploadNextImage();
                        }
                        return;
                    });
                } else {
                    this.uploadMediaToServer(this.currentPeriodId, fileList, idx).then(() => {
                        if (uploadNext) {
                            uploadNextImage();
                        }
                        return;
                    });
                }
            }
        });
    }
    private uploadMediaPeriodToServer(fileList: UploadFileIfc[],
                                      idx: number): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            this.progressMessage = 'Creating Folder ' + fileList[idx].name;
            this.uploadUploadingFile.emit(fileList[idx].name);
            this._profileService._mediaService
            .uploadMediaPeriodToServer(
                this.period,
                this.infoStr,
                fileList[idx]
            )
            .then((periodId) => {
                resolve(periodId);
            })
            .catch(() => {
                reject();
            });
        });
    }
    private uploadMediaToServer(periodId: string,
                                fileList: UploadFileIfc[],
                                idx: number): Promise<void> {
        return new Promise((resolve) => {
            this.progressMessage = 'Uploading ' + (idx + 1).toString() +
                                    ' of ' + fileList.length.toString() +
                                    ' file : ' + fileList[idx].name;
            this._profileService._mediaService
                .uploadFileToServer(
                    periodId,
                    this.period,
                    this.infoStr,
                    fileList[idx]
                )
                .then(() => {
                    fileList[idx].uploaded = true;
                    resolve();
                })
                .catch(() => {
                    fileList[idx].failUpload = true;
                    fileList[idx].invalid = true;
                    fileList[idx].invalidMsg = 'Failed To Upload To Server';
                    resolve();
                });
        });
    }

    doReadFile(idx: number, files: FileList): Promise<void> {
        return new Promise((resolve) => {
            const fileName = files[idx].name.toLowerCase();
            if (
                fileName.endsWith('.jpg') === false &&
                fileName.endsWith('.png') === false &&
                fileName.endsWith('.gif') === false
            ) {
                this.fileBlobs.push({
                    name: fileName,
                    title: '',
                    img: undefined,
                    fullImage: undefined,
                    invalid: true,
                    invalidMsg: 'Invalid File Format',
                    failUpload: false,
                    uploaded: false
                });
                if (idx < files.length) {
                    this.doReadFile(idx + 1, files).finally(() => {
                        resolve();
                    });
                } else {
                    resolve();
                    return;
                }

            } else {
                this.loadFile(files[idx], idx, files).finally(() => {
                    if (idx < files.length) {
                        this.doReadFile(idx + 1, files).finally(() => {
                            resolve();
                        });
                    } else {
                        resolve();
                        return;
                    }
                });
            }
        });
    }

    addFileToList(files: FileList): Promise<void> {
        return new Promise(async (resolve) => {
            this.doReadFile(0, files).finally(() => {
                this.imageFileInputFile.nativeElement.value = '';
                let anyValid = false;
                this.fileBlobs.some((file) => {
                    if (!file.invalid) {
                        anyValid = true;
                        return true;
                    }
                });
                if (anyValid) {
                    this.doUploadFile(0, this.fileBlobs, true).finally(() => {
                        this.imageFileInputFile.nativeElement.value = '';
                        resolve();
                    });
                } else {
                    this.imageFileInputFile.nativeElement.value = '';
                    resolve();
                }
            });

        });
    }

    public async uploadFile(fileList: FileList): Promise<any> {
        if (this.uploadInProgress) {
            return;
        }
        this.onFileInput.emit();
        if (fileList.length > 0) {
            const uploadFileList = fileList;
            this.uploadStarted.emit();
            this.uploadInProgress = true;
            this.addFileToList(uploadFileList).finally(() => {
                this.uploadInProgress = false;
                this.uploadEnded.emit();
            });
        }
    }

    onDrop(files: FileList): void {
        if (this.uploadInProgress) {
            return;
        }
        this.onFileInput.emit();
        if (files.length > 0) {
            const uploadFileList = files;
            this.uploadInProgress = true;
            this.uploadStarted.emit();
            this.addFileToList(uploadFileList).finally(() => {
                this.uploadInProgress = false;
                this.uploadEnded.emit();
            });
        }
    }

    deleteAttachment(index): void {
        this.fileBlobs.splice(index, 1);
    }

    uploadAttachment(index): void {
        this.uploadInProgress = true;
        this.uploadStarted.emit();
        this.doUploadFile(index, this.fileBlobs, false).then(() => {
            this.uploadInProgress = false;
            this.uploadEnded.emit();
        });
    }

    reset(periodId?: string): void {
        if (periodId) {
            this.currentPeriodId = periodId;
        } else {
            this.currentPeriodId = this.periodId;
        }
        this.files = [];
        this.fileNames = [];
        this.fileBlobs = [];
        this.imageFileInputFile.nativeElement.value = '';
    }
    doClickFileInput(): void {
        if (this.uploadInProgress) {
            return;
        }
        this.imageFileInputFile.nativeElement.click();
    }
}
