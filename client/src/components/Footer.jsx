import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <p>
        <Link to="/faqs/">FAQs</Link>,{"  "}
        <Link to="/instructions/">How To Play</Link>,{"  "}
        <Link to="/about/">About</Link>
      </p>
      <p>&copy;Jingle Snake</p>
    </footer>
  );
}
