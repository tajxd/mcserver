import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config';
import './Admin.css';

export default function Admin({ whitelist, onWhitelistUpdate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [pendingHighlights, setPendingHighlights] = useState([]);
  const [approvedHighlights, setApprovedHighlights] = useState([]);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [polls, setPolls] = useState([]);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const getFilePath = (filePath) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    return `${API_URL}${filePath}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/admin/login`, { username, password });
      setIsAuthenticated(true);
      setMessage('');
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessageType('danger');
      setMessage('Nesprávne prihlasovacie údaje');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFromWhitelist = async (id) => {
    if (!window.confirm('Naozaj chcete vymazať tohto hráča z whiteliste?')) {
      return;
    }

    try {
      await axios.post(`${API_URL}/api/admin/whitelist/${id}`, { 
        username: process.env.REACT_APP_ADMIN_USERNAME || 'Admin',
        password: process.env.REACT_APP_ADMIN_PASSWORD || 'mcserver256i'
      });
      onWhitelistUpdate();
      setMessageType('success');
      setMessage('Hráč bol vymazaný z whiteliste');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('danger');
      setMessage('Chyba pri mazaní hráča');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const fetchHighlights = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/highlights/pending/all`, {
        params: {
          username: 'Admin',
          password: 'mcserver256i'
        }
      });
      setPendingHighlights(response.data.pending);
      setApprovedHighlights(response.data.approved);
    } catch (error) {
      console.error('Chyba pri načítaní highlights:', error);
    }
  };

  const fetchPolls = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/polls`, {
        params: {
          username: 'Admin',
          password: 'mcserver256i'
        }
      });
      setPolls(response.data);
    } catch (error) {
      console.error('Chyba pri načítaní polls:', error);
    }
  };

  const handleApproveHighlight = async (id) => {
    try {
      await axios.post(`${API_URL}/api/highlights/${id}/approve`, {
        username: 'Admin',
        password: 'mcserver256i'
      });
      setMessageType('success');
      setMessage('Highlight bol schválený!');
      fetchHighlights();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('danger');
      setMessage('Chyba pri schváľovaní');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDeleteHighlight = async (id) => {
    if (!window.confirm('Naozaj chcete vymazať tento highlight?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/highlights/${id}`, {
        data: {
          username: 'Admin',
          password: 'mcserver256i'
        }
      });
      setMessageType('success');
      setMessage('Highlight bol vymazaný!');
      fetchHighlights();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('danger');
      setMessage('Chyba pri mazaní');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleCreatePoll = async () => {
    const validOptions = pollOptions.filter(opt => opt.trim() !== '');
    
    if (!pollQuestion.trim() || validOptions.length < 2) {
      alert('Zadaj otázku a aspoň 2 možnosti!');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/polls`, {
        username: 'Admin',
        password: 'mcserver256i',
        question: pollQuestion,
        options: validOptions
      });
      
      setMessageType('success');
      setMessage('Poll bol vytvorený!');
      setShowPollModal(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      fetchPolls();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('danger');
      setMessage('Chyba pri vytváraní poll');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDeletePoll = async (id) => {
    if (!window.confirm('Naozaj chcete vymazať tento poll?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/polls/${id}`, {
        data: {
          username: 'Admin',
          password: 'mcserver256i'
        }
      });
      
      setMessageType('success');
      setMessage('Poll bol vymazaný!');
      fetchPolls();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('danger');
      setMessage('Chyba pri mazaní poll');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setMessage('');
  };

  useEffect(() => {
    if (isAuthenticated) {
      onWhitelistUpdate();
      fetchHighlights();
      fetchPolls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <Container>
          <Row>
            <Col lg={6} className="mx-auto mt-5">
              <div className="minecraft-card login-card">
                <h2 className="section-subtitle">
                  <i className="fas fa-lock"></i> Administrátorský Panel
                </h2>

                {message && (
                  <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
                    {messageType === 'danger' ? (
                      <><i className="fas fa-exclamation-circle"></i> {message}</>
                    ) : (
                      <><i className="fas fa-check-circle"></i> {message}</>
                    )}
                  </Alert>
                )}

                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">
                      <i className="fas fa-user"></i> Používateľ
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="minecraft-input form-control"
                      placeholder="Vlož používateľské meno..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-key"></i> Heslo
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="minecraft-input form-control"
                      placeholder="Vlož heslo..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-minecraft w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Overovanie...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt"></i> Prihlásiť sa
                      </>
                    )}
                  </button>
                </form>

                <p className="login-help">
                  <i className="fas fa-info-circle"></i> Prihláste sa s administrátorskými údajmi
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Container className="minecraft-container">
        <Row className="mb-4">
          <Col>
            <div className="admin-header">
              <h1 className="section-title">
                <i className="fas fa-lock"></i> Administrátorský Panel
              </h1>
              <button
                className="btn btn-minecraft-secondary"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Odhlásiť sa
              </button>
            </div>
          </Col>
        </Row>

        {message && (
          <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
            {messageType === 'success' ? (
              <><i className="fas fa-check-circle"></i> {message}</>
            ) : (
              <><i className="fas fa-exclamation-circle"></i> {message}</>
            )}
          </Alert>
        )}

        {/* Polls Section */}
        <Row className="mb-4">
          <Col>
            <div className="minecraft-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="section-subtitle mb-0">
                  <i className="fas fa-poll"></i> Hlasovania ({polls.length})
                </h2>
                <button
                  className="btn btn-minecraft"
                  onClick={() => setShowPollModal(true)}
                >
                  <i className="fas fa-plus"></i> Vytvoriť hlasovanie
                </button>
              </div>

              {polls.length > 0 ? (
                <div className="polls-list">
                  {polls.map((poll) => {
                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                    return (
                      <div key={poll._id} className={`poll-item ${poll.active ? 'active-poll' : 'inactive-poll'}`}>
                        <div className="poll-header">
                          <h4>{poll.question}</h4>
                          <span className={`poll-badge ${poll.active ? 'badge-active' : 'badge-inactive'}`}>
                            {poll.active ? 'Aktívny' : 'Neaktívny'}
                          </span>
                        </div>
                        <div className="poll-options-list">
                          {poll.options.map((option, idx) => {
                            const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                            return (
                              <div key={idx} className="poll-option-row">
                                <span className="option-text">{option.text}</span>
                                <span className="option-stats">
                                  {option.votes} hlasov ({percentage}%)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="poll-footer-info">
                          <span><i className="fas fa-users"></i> Celkom hlasov: {totalVotes}</span>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeletePoll(poll._id)}
                          >
                            <i className="fas fa-trash"></i> Vymazať
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>Zatiaľ nie sú žiadne hlasovania</p>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Pending Highlights Section */}
        {pendingHighlights.length > 0 && (
          <Row className="mb-4">
            <Col>
              <div className="minecraft-card">
                <h2 className="section-subtitle">
                  <i className="fas fa-hourglass-half"></i> Čakajúce na schválenie ({pendingHighlights.length})
                </h2>
                <div className="highlights-grid">
                  {pendingHighlights.map((highlight) => (
                    <div key={highlight._id} className="highlight-item pending">
                      <div 
                        className="highlight-preview"
                        onClick={() => {
                          setSelectedHighlight(highlight);
                          setShowHighlightModal(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {highlight.fileType === 'image' ? (
                          <img src={getFilePath(highlight.filePath)} alt={highlight.title} />
                        ) : (
                          <video width="100%" height="auto">
                            <source src={getFilePath(highlight.filePath)} type="video/mp4" />
                          </video>
                        )}
                      </div>
                      <div className="highlight-info">
                        <h4>{highlight.title}</h4>
                        <p className="text-muted small">{highlight.description}</p>
                        <p className="text-muted small">Nahral: {highlight.uploadedBy}</p>
                      </div>
                      <div className="highlight-actions">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApproveHighlight(highlight._id)}
                        >
                          <i className="fas fa-check"></i> Schváliť
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteHighlight(highlight._id)}
                        >
                          <i className="fas fa-trash"></i> Vymazať
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Approved Highlights Section */}
        {approvedHighlights.length > 0 && (
          <Row className="mb-4">
            <Col>
              <div className="minecraft-card">
                <h2 className="section-subtitle">
                  <i className="fas fa-check-circle"></i> Schválené Highlights ({approvedHighlights.length})
                </h2>
                <div className="highlights-grid">
                  {approvedHighlights.map((highlight) => (
                    <div key={highlight._id} className="highlight-item approved">
                      <div 
                        className="highlight-preview"
                        onClick={() => {
                          setSelectedHighlight(highlight);
                          setShowHighlightModal(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {highlight.fileType === 'image' ? (
                          <img src={getFilePath(highlight.filePath)} alt={highlight.title} />
                        ) : (
                          <video width="100%" height="auto" controls>
                            <source src={getFilePath(highlight.filePath)} type="video/mp4" />
                          </video>
                        )}
                      </div>
                      <div className="highlight-info">
                        <h4>{highlight.title}</h4>
                        <p className="text-muted small">{highlight.description}</p>
                        <p className="text-muted small">Schválil: {highlight.approvedBy}</p>
                      </div>
                      <div className="highlight-actions">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteHighlight(highlight._id)}
                        >
                          <i className="fas fa-trash"></i> Vymazať
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <div className="minecraft-card">
              <h2 className="section-subtitle">
                <i className="fas fa-list-check"></i> Whitelist ({whitelist.length})
              </h2>

              {whitelist.length > 0 ? (
                <div className="table-responsive">
                  <Table className="admin-table">
                    <thead>
                      <tr>
                        <th className="th-index">#</th>
                        <th className="th-name">
                          <i className="fas fa-user"></i> Minecraft Meno
                        </th>
                        <th className="th-date">
                          <i className="fas fa-calendar"></i> Pridané
                        </th>
                        <th className="th-actions">
                          <i className="fas fa-cogs"></i> Akcie
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {whitelist.map((entry, index) => (
                        <tr key={entry._id} className="table-row">
                          <td className="td-index">{index + 1}</td>
                          <td className="td-name">
                            <span className="player-name">{entry.minecraftName}</span>
                          </td>
                          <td className="td-date">
                            {new Date(entry.addedAt).toLocaleDateString('sk-SK', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="td-actions">
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteFromWhitelist(entry._id)}
                              title="Vymazať z whiteliste"
                            >
                              <i className="fas fa-trash-alt"></i> Vymazať
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>Zatiaľ nie sú žiadni hráči na whiteliste</p>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={6} className="mx-auto">
            <div className="minecraft-card stats-card">
              <h3 className="section-subtitle">
                <i className="fas fa-chart-bar"></i> Štatistika
              </h3>

              <div className="stat-row">
                <span className="stat-label">Celkový počet hráčov:</span>
                <span className="stat-value">{whitelist.length}</span>
              </div>

              <div className="stat-row">
                <span className="stat-label">Server Verzia:</span>
                <span className="stat-value">1.21.10</span>
              </div>

              <div className="stat-row">
                <span className="stat-label">Max Hráčov:</span>
                <span className="stat-value">67</span>
              </div>

              <div className="stat-row">
                <span className="stat-label">Obsadenosť:</span>
                <span className="stat-value">{Math.round((whitelist.length / 67) * 100)}%</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Highlight Modal */}
      <Modal
        show={showHighlightModal}
        onHide={() => {
          setShowHighlightModal(false);
          setSelectedHighlight(null);
        }}
        centered
        size="lg"
        className="highlight-modal-admin"
      >
        <Modal.Header closeButton className="highlight-modal-header">
          <Modal.Title>{selectedHighlight?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="highlight-modal-body">
          {selectedHighlight?.fileType === 'image' ? (
            <img
              src={getFilePath(selectedHighlight?.filePath)}
              alt={selectedHighlight?.title}
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
            <p className="highlight-description" style={{ marginTop: '15px', color: '#e8e8e8' }}>
              {selectedHighlight.description}
            </p>
          )}
          <div className="highlight-meta" style={{ marginTop: '15px', color: '#b0b0b0', fontSize: '0.9rem' }}>
            <span>
              <i className="fas fa-user"></i> Nahral: {selectedHighlight?.uploadedBy}
            </span>
            <span style={{ marginLeft: '20px' }}>
              <i className="fas fa-calendar"></i> {new Date(selectedHighlight?.uploadedAt).toLocaleString('sk-SK')}
            </span>
          </div>
        </Modal.Body>
      </Modal>

      {/* Poll Creation Modal */}
      <Modal
        show={showPollModal}
        onHide={() => {
          setShowPollModal(false);
          setPollQuestion('');
          setPollOptions(['', '']);
        }}
        centered
        size="lg"
        className="poll-modal"
      >
        <Modal.Header closeButton className="poll-modal-header">
          <Modal.Title>
            <i className="fas fa-poll"></i> Vytvoriť nové hlasovanie
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="poll-modal-body">
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-question-circle"></i> Otázka
            </label>
            <input
              type="text"
              className="minecraft-input form-control"
              placeholder="Napríklad: Povoliť Crystal PVP?"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-list"></i> Možnosti
            </label>
            {pollOptions.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="text"
                  className="minecraft-input form-control mb-2"
                  placeholder={`Možnosť ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...pollOptions];
                    newOptions[index] = e.target.value;
                    setPollOptions(newOptions);
                  }}
                />
                {pollOptions.length > 2 && (
                  <button
                    className="btn btn-sm btn-danger mb-2"
                    onClick={() => {
                      const newOptions = pollOptions.filter((_, i) => i !== index);
                      setPollOptions(newOptions);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
            
            <button
              className="btn btn-minecraft-secondary mt-2"
              onClick={() => setPollOptions([...pollOptions, ''])}
            >
              <i className="fas fa-plus"></i> Pridať možnosť
            </button>
          </div>

          <button
            className="btn btn-minecraft w-100 mt-3"
            onClick={handleCreatePoll}
          >
            <i className="fas fa-check"></i> Vytvoriť hlasovanie
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
