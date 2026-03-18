import '../index.css'
import Header from '../components/Header'
import Hero from '../components/Hero'
import How_It_Works from '../components/How_It_Works';
import About_Us from '../components/About_Us';
import Footer from '../components/Footer';

export default function Home_Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About_Us />
      <How_It_Works />
      <Footer />
    </div>
  );
}