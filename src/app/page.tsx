import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), {
  ssr: false, // Отключаем Server-Side Rendering
});

export default function Home() {
  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      <Map />
    </main>
  );
}