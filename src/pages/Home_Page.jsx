import '../index.css'
import Header from '../components/Header'
import Hero from '../components/Hero'
import How_It_Works from '../components/How_It_Works';

export default function Home_Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <How_It_Works />
    </div>
  );
}