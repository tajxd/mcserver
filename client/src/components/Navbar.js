import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <BSNavbar expanded={expanded} onToggle={setExpanded} sticky="top" className="minecraft-navbar">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <i className="fas fa-cube" style={{ marginRight: '10px', color: 'var(--mc-bright-green)' }}></i>
          <span className="brand-text">SPŠE Minecraft SMP</span>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-items">
            <Nav.Link as={Link} to="/" className="nav-link-custom" onClick={() => setExpanded(false)}>
              <i className="fas fa-home"></i> Domov
            </Nav.Link>
            <Nav.Link as={Link} to="/rules" className="nav-link-custom" onClick={() => setExpanded(false)}>
              <i className="fas fa-scroll"></i> Pravidlá
            </Nav.Link>
            <Nav.Link as={Link} to="/admin" className="nav-link-custom nav-link-admin" onClick={() => setExpanded(false)}>
              <i className="fas fa-lock"></i> Admin
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
