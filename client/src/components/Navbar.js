import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <BSNavbar 
      expand="lg" 
      expanded={expanded} 
      onToggle={setExpanded} 
      fixed="top" 
      className="minecraft-navbar"
    >
      <Container fluid>
        <BSNavbar.Brand as={Link} to="/" className="navbar-brand-custom" onClick={handleNavClick}>
          <i className="fas fa-cube"></i>
          <span className="brand-text">SPŠE Minecraft SMP</span>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" className="border-0">
          <span className="navbar-toggler-icon"></span>
        </BSNavbar.Toggle>
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto nav-items">
            <Nav.Link as={Link} to="/" className="nav-link-custom" onClick={handleNavClick}>
              <i className="fas fa-home"></i>
              <span>Domov</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/rules" className="nav-link-custom" onClick={handleNavClick}>
              <i className="fas fa-scroll"></i>
              <span>Pravidlá</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/admin" className="nav-link-custom nav-link-admin" onClick={handleNavClick}>
              <i className="fas fa-lock"></i>
              <span>Admin</span>
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
