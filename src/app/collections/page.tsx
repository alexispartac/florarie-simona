'use client';

import Carousel from "../../components/ui/animations/Carousel";

const shopCategories = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Handcrafted from premium denim with a worn-in look',
    image: '/path-to-image.jpg',
  },
  {
    id: '2',
    title: 'Vintage Denim Jacket',
    description: 'Handcrafted from premium denim with a worn-in look',
    image: '/path-to-image.jpg',
  },
];

const Page = () => {
    return (
    <div className="w-full h-screen flex items-center justify-center ">
      <Carousel items={shopCategories} autoPlay={true} interval={3000} />
    </div>
  );
}

export default Page;