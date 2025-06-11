import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <p>
        © {new Date().getFullYear()} SG Pequenos Reparos. Todos os direitos reservados a Felipe Parreiras.
      </p>
      <div className="footer-links">
        <a href="https://github.com/FelipeParreiras" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <span>|</span>
        <a href="https://www.linkedin.com/in/FelipeParreiras" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
    </footer>
  );
};

export default Footer;
