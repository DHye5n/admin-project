import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'types/interface/slider.css';
import { IonIcon } from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

export interface SliderProps {
    dots: boolean;
    infinite: boolean;
    speed: number;
    slidesToShow: number;
    slidesToScroll: number;
    arrows: boolean;
    images: string[]; // 이미지 배열
}

const ImageSlider: React.FC<SliderProps> = ({ dots, infinite, speed, slidesToShow, slidesToScroll, arrows, images, }) => {
    const settings = {
        dots: dots,
        infinite: infinite,
        speed: speed,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToScroll,
        arrows: arrows,
        nextArrow: (
          <div className="slick-arrow slick-next">
              <IonIcon icon={chevronForwardOutline} className='ion-icon' />
          </div>
        ),
        prevArrow: (
          <div className="slick-arrow slick-prev">
              <IonIcon icon={chevronBackOutline} className='ion-icon' />
          </div>
        ),
        style: { width: '100%', height: '100%' }
    };

    return (
          <div className="image-slider">
            <Slider {...settings}>
                {images.map((image, index) => (
                      <div key={index} className="image-slide">
                        <img src={image} alt={`slide ${index}`} className="slide-image" />
                      </div>
                ))}
            </Slider>
          </div>
    );
};

export default ImageSlider;