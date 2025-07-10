'use client'

import React, { useEffect } from "react";
// TODO: Install swiper package to re-enable this component
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper";
import AOS from 'aos';
import 'aos/dist/aos.css';
// import "swiper/css";
// import "swiper/css/navigation";
import Image from "next/image";
// import "swiper/css/pagination";

function Slider() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const SliderImageList: string[] = [
    "/design1.webp",
    "/design2.webp",
    "/design3.webp",
    "/design4.webp",
    "/design7.jpg",
    "/design8.webp",
    "/design10.jpg",
    "/dsign_9.webp",
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Gallery</h2>
        <p className="text-gray-300">Slider temporarily disabled - Install swiper package to re-enable</p>
      </div>
      
      {/* Simple grid layout as placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SliderImageList.slice(0, 4).map((imageSrc, index) => (
          <div key={index} className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  /* Original Swiper implementation - commented out until swiper is installed
  return (
    <section className="bg-gradient-to-r from-gray-900 to-black py-16">
      <div className="container mx-auto px-4">
        <div data-aos="fade-up" className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Explore Our Gallery
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover stunning designs and innovations from our community
          </p>
        </div>
        
        <div data-aos="fade-up" data-aos-delay="200" className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {SliderImageList.map((imageSrc, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
                  <Image
                    src={imageSrc}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-lg font-semibold">View Details</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
  */
}

export default Slider;