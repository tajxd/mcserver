import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import './HighlightsGallery.css';

export default function HighlightsGallery() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchHighlights = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/highlights');
      setHighlights(response.data);
    } catch (error) {
      console.error('Failed to fetch highlights:', error);
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const getFilePath = (filePath) => {
    if (!filePath) return '';
    // Ak už obsahuje http, vráť ako je
    if (filePath.startsWith('http')) return filePath;
    // Inak pridaj backend URL
    return `http://localhost:5000${filePath}`;
  };

  const handleShowModal = (highlight) => {
    setSelectedHighlight(highlight);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHighlight(null);
  };

  if (loading) {
    return (
      <div className="highlights-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Načítavam highlights...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="highlights-container">
        <div className="highlights-title">
          <h3>
            <i className="fas fa-video"></i> Highlighty
          </h3>
          <span className="highlights-count">{highlights.length}</span>
        </div>

        <div className="highlights-scroll">
          {highlights.length > 0 ? (
            highlights.map((highlight) => (
              <div
                key={highlight._id}
                className="highlight-item"
                onClick={() => handleShowModal(highlight)}
              >
                <div className="highlight-thumbnail">
                  {highlight.fileType === 'image' ? (
                    <>
                      <img src={getFilePath(highlight.filePath)} alt={highlight.title} />
                      <div className="highlight-badge">
                        <i className="fas fa-image"></i>
                      </div>
                    </>
                  ) : (
                    <>
                      <video 
                        width="100%" 
                        height="auto" 
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                        muted
                        playsInline
                      >
                        <source src={getFilePath(highlight.filePath)} type="video/mp4" />
                      </video>
                      <div className="highlight-badge video-badge">
                        <i className="fas fa-video"></i>
                      </div>
                    </>
                  )}
                </div>
                <div className="highlight-info">
                  <p className="highlight-title">{highlight.title}</p>
                  <span className="highlight-date">
                    {new Date(highlight.uploadedAt).toLocaleDateString('sk-SK')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-highlights">
              <i className="fas fa-inbox"></i>
              <p>Zatiaľ nie sú žiadne highlights</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal na prehrávanie */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        className="highlights-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>{selectedHighlight?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {selectedHighlight?.fileType === 'image' ? (
            <img
              src={getFilePath(selectedHighlight.filePath)}
              alt={selectedHighlight.title}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          ) : (
            <video
              key={selectedHighlight?._id}
              width="100%"
              height="auto"
              controls
              autoPlay
              playsInline
              style={{ borderRadius: '8px', backgroundColor: '#000', maxHeight: '500px' }}
            >
              <source src={getFilePath(selectedHighlight?.filePath)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {selectedHighlight?.description && (
            <p className="highlight-description">{selectedHighlight.description}</p>
          )}
          <div className="highlight-meta">
            <span>
              <i className="fas fa-user"></i> {selectedHighlight?.uploadedBy}
            </span>
            <span>
              <i className="fas fa-calendar"></i>{' '}
              {new Date(selectedHighlight?.uploadedAt).toLocaleString('sk-SK')}
            </span>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
