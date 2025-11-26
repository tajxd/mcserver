import React, { useState, useRef } from 'react';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config';
import './HighlightsUpload.css';

export default function HighlightsUpload({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFile(e.target.result);
        setFileName(selectedFile.name);
        
        // Vytvorenie preview
        if (selectedFile.type.startsWith('image/')) {
          setPreview(e.target.result);
        } else if (selectedFile.type.startsWith('video/')) {
          setPreview(URL.createObjectURL(selectedFile));
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragDropClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title || !file || !uploadedBy) {
        setMessageType('warning');
        setMessage('Prosím vyplňte všetky povinné polia');
        setLoading(false);
        return;
      }

      const fileType = file.startsWith('data:image/') ? 'image' : 'video';

      await axios.post(`${API_URL}/api/highlights`, {
        title,
        description,
        fileType,
        fileData: file,
        fileName,
        uploadedBy
      });

      setMessageType('success');
      setMessage('Highlight bol úspešne nahraný!');
      
      // Reset formulára
      setTitle('');
      setDescription('');
      setUploadedBy('');
      setFile(null);
      setFileName('');
      setPreview(null);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessageType('danger');
      setMessage(error.response?.data?.error || 'Chyba pri nahrávaní highlights');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="highlights-upload">
      <h3 className="upload-title">
        <i className="fas fa-cloud-upload-alt"></i> Nahrať Highlight
      </h3>

      {message && (
        <Alert
          variant={messageType}
          dismissible
          onClose={() => setMessage('')}
          className="upload-alert"
        >
          {messageType === 'success' ? (
            <><i className="fas fa-check-circle"></i> {message}</>
          ) : messageType === 'warning' ? (
            <><i className="fas fa-exclamation-triangle"></i> {message}</>
          ) : (
            <><i className="fas fa-exclamation-circle"></i> {message}</>
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Drag and Drop Area */}
        <div
          className={`drag-drop-area ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleDragDropClick}
          style={{ cursor: 'pointer' }}
        >
          {preview ? (
            <div className="preview-container">
              {file.startsWith('data:image/') ? (
                <img src={preview} alt="Preview" className="preview-image" />
              ) : (
                <video className="preview-video" controls>
                  <source src={preview} type="video/mp4" />
                </video>
              )}
              <div className="preview-overlay">
                <i className="fas fa-check-circle"></i>
                <p>{fileName}</p>
              </div>
            </div>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt"></i>
              <p className="drag-text">Pretiahnite súbor sem alebo kliknite na výber</p>
              <span className="supported-files">Podporované: JPG, PNG, MP4, WebM (Max 100MB)</span>
            </>
          )}
          <input
            type="file"
            onChange={handleInputChange}
            accept="image/*,video/*"
            className="file-input"
            id="file-input"
            ref={fileInputRef}
          />
        </div>

        <label htmlFor="title" className="form-label">
          <i className="fas fa-heading"></i> Nadpis
        </label>
        <input
          id="title"
          type="text"
          className="minecraft-input form-control"
          placeholder="Názov highlight..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
        />

        <label htmlFor="description" className="form-label">
          <i className="fas fa-align-left"></i> Popis (Voliteľný)
        </label>
        <textarea
          id="description"
          className="minecraft-input form-control"
          placeholder="Popis highlight..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          maxLength={500}
        />

        <label htmlFor="uploadedBy" className="form-label">
          <i className="fas fa-user"></i> Vaše Meno
        </label>
        <input
          id="uploadedBy"
          type="text"
          className="minecraft-input form-control"
          placeholder="Vaše Minecraft meno..."
          value={uploadedBy}
          onChange={(e) => setUploadedBy(e.target.value)}
          maxLength={50}
          required
        />

        <button
          type="submit"
          className="btn btn-minecraft w-100"
          disabled={loading || !file}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Nahrávam...
            </>
          ) : (
            <>
              <i className="fas fa-upload"></i> Nahrať Highlight
            </>
          )}
        </button>
      </form>
    </div>
  );
}
