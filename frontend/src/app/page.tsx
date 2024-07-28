'use client';

import dynamic from 'next/dynamic';

const DynamicHome = dynamic(() => import('../../components/Home'), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="container mx-auto p-4 ml-[30px]">
      <DynamicHome />
    </div>
  );
}
