import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <p>
        © {new Date().getFullYear()} SG Pequenos Reparos. Todos os direitos reservados
      </p>
      <div className="footer-links">
        <a href="" target="_blank" rel="noopener noreferrer">
          
        </a>
        <a href="" target="_blank" rel="noopener noreferrer">
          
        </a>
      </div>
    </footer>
  );
};

export default Footer;
