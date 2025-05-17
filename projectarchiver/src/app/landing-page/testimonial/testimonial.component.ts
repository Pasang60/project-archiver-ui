import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Carousel from 'bootstrap/js/dist/carousel';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent implements AfterViewInit {

  @ViewChild('testimonialCarousel') testimonialCarouselRef!: ElementRef;

  carouselInstance!: Carousel;

  ngAfterViewInit(): void {
    const carouselEl = this.testimonialCarouselRef.nativeElement;

    // Initialize Bootstrap Carousel
    this.carouselInstance = new Carousel(carouselEl, {
      interval: 4000,
      wrap: true,
      touch: true,
      pause: 'hover'
    });

    carouselEl.addEventListener('mouseenter', () => this.carouselInstance.pause());
    carouselEl.addEventListener('mouseleave', () => this.carouselInstance.cycle());
  }
}
