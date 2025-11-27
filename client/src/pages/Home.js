import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config';
import HighlightsGallery from '../components/HighlightsGallery';
import HighlightsUpload from '../components/HighlightsUpload';
import PollWidget from '../components/PollWidget';
import './Home.css';

export default function Home({ whitelist, onWhitelistUpdate }) {
  const [minecraftName, setMinecraftName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [refreshGallery, setRefreshGallery] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activePolls, setActivePolls] = useState([]);

  useEffect(() => {
    fetchActivePolls();
  }, []);

  const fetchActivePolls = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls/public/all`);
      setActivePolls(response.data);
    } catch (error) {
      console.error('Chyba pri načítaní hlasovaní:', error);
    }
  };

  const handleUploadSuccess = () => {
    setRefreshGallery(prev => prev + 1);
    setShowUploadModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/whitelist`, { minecraftName });
      setMessageType('success');
      setMessage(response.data.message);
      setMinecraftName('');
      onWhitelistUpdate();

      // Skryť správu po 5 sekundách
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('danger');
      setMessage(error.response?.data?.error || 'Chyba pri pridaní na whitelist');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero sekcia */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <Container className="h-100">
          <Row className="h-100 align-items-center justify-content-center">
            <Col lg={8} className="text-center">
              <div className="hero-content" style={{ animation: 'pixelFade 0.8s ease' }}>
                <div className="hero-icon">
                  <i className="fas fa-cube"></i>
                </div>
                <h1 className="hero-title">SPŠE Minecraft SMP</h1>
                <p className="hero-subtitle">Pre žiakov najlepšej strednej školy na Slovensku</p>
                <p className="hero-description">
                  Joini pre srandu ne?
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">1.21.10</span>
                    <span className="stat-label">Server Verzia</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">67</span>
                    <span className="stat-label">Max Hráčov</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{whitelist.length}</span>
                    <span className="stat-label">Na Whiteliste</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Whitelist + Highlights sekcia */}
      <section className="whitelist-highlights-section">
        <Container>
          <Row className="whitelist-highlights-row">
            {/* CENTER: Whitelist only */}
            <Col lg={8} className="whitelist-upload-col">
              {/* Whitelist Form */}
              <div className="minecraft-card whitelist-card">
                <h2 className="section-subtitle">
                  <i className="fas fa-list-check"></i> Pridaj sa na whitelist
                </h2>
                <p className="section-description">
                  Vyplň svoje Minecraft meno a prihláste sa na server. Tvoje meno bude čo najskôr pridané adminom!
                  <br />
                  <strong style={{ color: '#ff6b6b', marginTop: '10px', display: 'block' }}>
                    ⚠️ Opakované/viac mien je zakázané zadávať. Ak porušíte toto pravidlo, budete zablokovaný zo serveru.
                  </strong>
                </p>

                {message && (
                  <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
                    {messageType === 'success' ? (
                      <><i className="fas fa-check-circle"></i> {message}</>
                    ) : (
                      <><i className="fas fa-exclamation-circle"></i> {message}</>
                    )}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="minecraftName" className="form-label">
                      <i className="fas fa-user"></i> Minecraft Meno
                    </label>
                    <input
                      id="minecraftName"
                      type="text"
                      className="minecraft-input form-control"
                      placeholder="Vlož tvoje Minecraft meno..."
                      value={minecraftName}
                      onChange={(e) => setMinecraftName(e.target.value)}
                      maxLength={16}
                      required
                    />
                    <small className="form-text">3-16 znakov, len písmená, čísla, _ a -</small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-minecraft w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Načítavam...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus-circle"></i> Pridaj ma na whitelist
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Highlights Upload Button */}
              <button
                className="btn btn-upload-highlight w-100"
                onClick={() => setShowUploadModal(true)}
              >
                <i className="fas fa-upload"></i> Nahrať Highlight
              </button>
            </Col>

            {/* RIGHT: Highlights Gallery */}
            <Col lg={4} className="highlights-col">
              <HighlightsGallery key={refreshGallery} />
            </Col>
          </Row>

          {/* Active Polls Section - Centrované */}
          {activePolls.length > 0 && (
            <Row className="mt-5">
              <Col lg={8} md={10} className="mx-auto">
                <div className="polls-container">
                  <h3 className="polls-title">
                    <i className="fas fa-poll"></i> Aktívne Hlasovania
                  </h3>
                  <div className="polls-grid">
                    {activePolls.map((poll) => (
                      <PollWidget key={poll._id} pollId={poll._id} />
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Features sekcia */}
      <section className="features-section">
        <Container>
          <h2 className="section-title">
            <i className="fas fa-star"></i> O serveri
          </h2>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-cube"></i>
                </div>
                <h4>Survival SMP</h4>
                <p>Čistý survival s vlastnými pravidlami a modmi.</p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-shield"></i>
                </div>
                <h4>Bezpečnosť</h4>
                <p>Ochrana pred hackermi a cheátmi s najnovšou anti-xray technológiou.</p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-zap"></i>
                </div>
                <h4>Výkon</h4>
                <p>Server je optimalizovaný pre plynulý gameplay bez lagovania.</p>
              </div>
            </Col>

            <Col md={6} lg={3}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h4>Eventy</h4>
                <p>Pravidelné PvP turnaje a iné vzrušujúce eventos pre komunitu.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Server Info sekcia */}
      <section className="server-info-section">
        <Container>
          <Row>
            <Col lg={6} className="mx-auto">
              <div className="minecraft-card info-card">
                <h2 className="section-subtitle">
                  <i className="fas fa-info-circle"></i> Informácie o serveri
                </h2>

                <div className="info-item">
                  <span className="info-label">
                    <i className="fas fa-network-wired"></i> IP Adresa
                  </span>
                  <span className="info-value">144.24.164.11</span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    <i className="fas fa-cube"></i> Verzia
                  </span>
                  <span className="info-value">1.21.10</span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    <i className="fas fa-users"></i> Max Hráčov
                  </span>
                  <span className="info-value">67 hráčov</span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    <i className="fas fa-gamepad"></i> Herný Mód
                  </span>
                  <span className="info-value">Survival Multiplayer</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
        size="lg"
        className="upload-modal"
      >
        <Modal.Header closeButton className="upload-modal-header">
          <Modal.Title>
            <i className="fas fa-upload"></i> Nahrať Highlight
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="upload-modal-body">
          <HighlightsUpload onUploadSuccess={handleUploadSuccess} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
