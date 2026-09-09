import Navbar from '../sections/Navbar.jsx';
import Footer from '../sections/Footer.jsx';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
