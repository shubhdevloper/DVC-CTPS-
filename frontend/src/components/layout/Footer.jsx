function Footer() {
  return (
    /* app-footer: exact from reference */
    <footer style={{
      background: "#001f5b",
      color: "rgba(255,255,255,0.5)",
      textAlign: "center",
      padding: "10px",
      fontSize: "11px",
      borderTop: "3px solid #cc3300",
      marginTop: "auto",
    }}>
      © {new Date().getFullYear()} Damodar Valley Corporation — C.T.P.S. Chandrapura &nbsp;|&nbsp; Material Register System &nbsp;|&nbsp; Under Ministry of Power, Govt. of India
    </footer>
  );
}

export default Footer;