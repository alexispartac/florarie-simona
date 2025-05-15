import { NavbarDemo } from "./components/NavBar"
import PopUp from "./components/PopUp";
import { Footer } from "./components/Footer";
import Content from "./components/Content";

export default function Home() {
  return (
    <div>
      <PopUp />
      <NavbarDemo>
        <Content />
      </NavbarDemo>
      <Footer />
    </div>
  );
}
