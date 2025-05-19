import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {ToastService} from '../../common/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent implements OnInit{

  @ViewChild('otp1') otp1!: ElementRef<HTMLInputElement>;
  @ViewChild('otp2') otp2!: ElementRef<HTMLInputElement>;
  @ViewChild('otp3') otp3!: ElementRef<HTMLInputElement>;
  @ViewChild('otp4') otp4!: ElementRef<HTMLInputElement>;
  @ViewChild('otp5') otp5!: ElementRef<HTMLInputElement>;
  @ViewChild('otp6') otp6!: ElementRef<HTMLInputElement>;

  otpDetails!: FormGroup;
  expirationTime: string = '';
  remainingTime: number = 0;
  timerInterval: any;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.startCountdown();

    setTimeout(() => {
      this.renderer.selectRootElement(this.otp1.nativeElement).focus();
    }, 0);

    // Add event listener for backspace key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace') {
        this.handleBackspace();
      }
    });
  }

  moveToNext(currentInput: HTMLInputElement, nextInput: HTMLInputElement): void {
    if (currentInput.value.length === 1) {
      nextInput.focus();
    } else if (currentInput.value.length === 0 && nextInput.value.length === 1) {
      currentInput.focus();
    }
  }

  handleBackspace(): void {
    const inputs = [this.otp1, this.otp2, this.otp3, this.otp4, this.otp5, this.otp6];
    const focusedInput = document.activeElement as HTMLInputElement;
    const index = inputs.findIndex(input => input.nativeElement === focusedInput);

    if (index > 0 && !focusedInput.value) {
      inputs[index - 1].nativeElement.focus();
    }
  }

  handlePaste(event: ClipboardEvent, currentInput: HTMLInputElement, nextInput: HTMLInputElement): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text').trim();
    if (pastedText) {
      const chars = pastedText.split('');
      chars.forEach((char, index) => {
        if (index < 6) {
          currentInput.value = char;
          currentInput.dispatchEvent(new Event('input'));
          this.moveToNext(currentInput, nextInput);
          currentInput = nextInput;
          nextInput = this.getNextInput(nextInput);
        }
      });
    }
  }

  getNextInput(currentInput: HTMLInputElement): HTMLInputElement {
    switch (currentInput) {
      case this.otp1.nativeElement:
        return this.otp2.nativeElement;
      case this.otp2.nativeElement:
        return this.otp3.nativeElement;
      case this.otp3.nativeElement:
        return this.otp4.nativeElement;
      case this.otp4.nativeElement:
        return this.otp5.nativeElement;
      case this.otp5.nativeElement:
        return this.otp6.nativeElement;
      default:
        return currentInput;
    }
  }

  initForm(): void {
    this.otpDetails = this.formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required],
    });
  }

  otpCheck(): void {
    if (this.otpDetails.invalid) {
      this.toast.showError('Please fill out all fields correctly.');
      return;
    }

    const concatenatedOTP = Object.values(this.otpDetails.value).join('');
    this.authService.checkOtp({
      email: localStorage.getItem('email'),
      otp: concatenatedOTP,
    }).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toast.showSuccess('OTP Validation Successful.');
        // localStorage.removeItem('expirationTime');
        this.router.navigate(['auth/login']);
      },
      error: () => {
        this.toast.showError('Invalid OTP');
      },
    });
  }

  startCountdown(): void {
    const expirationDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
    const expirationTime = Date.now() + expirationDuration; // Set expiration time

    this.timerInterval = setInterval(() => {
      this.remainingTime = expirationTime - Date.now();
      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }


  formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${(+seconds < 10 ? '0' : '')}${seconds}`;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }


}
