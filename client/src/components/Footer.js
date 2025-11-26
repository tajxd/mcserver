import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="minecraft-footer">
      <Container>
        <Row className="footer-content">
          <Col md={4} className="footer-section">
            <h5><i className="fas fa-cube"></i> SPŠE Minecraft SMP</h5>
            <p>Oficiálny školský Minecraft server s vlastným pravidlami a komunitou.</p>
          </Col>
          <Col md={4} className="footer-section">
            <h5><i className="fas fa-link"></i> Rýchle odkazy</h5>
            <ul>
              <li><a href="/">Domov</a></li>
              <li><a href="/rules">Pravidlá</a></li>
              <li><a href="/admin">Admin Panel</a></li>
            </ul>
          </Col>
          <Col md={4} className="footer-section">
            <h5><i className="fas fa-info-circle"></i> Info</h5>
            <p>Verzia: 1.21.10</p>
            <p>Server IP: 144.24.164.11</p>
          </Col>
        </Row>
        <Row className="footer-bottom">
          <Col className="text-center">
            <p>&copy; 2025 SPŠE Minecraft SMP. Všetky práva vyhradené.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
