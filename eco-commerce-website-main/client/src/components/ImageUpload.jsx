import React, { useState, useRef, useCallback } from 'react';

function ImageUpload({ currentImage, onImageChange, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const cropRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(file);
        setPreviewUrl(e.target.result);
        // Reset crop area when new image is loaded
        setCropArea({ x: 50, y: 50, width: 200, height: 200 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, []);

  const handleCropMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...cropArea };

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      if (e.target.classList.contains('crop-handle')) {
        // Resize crop area
        const newWidth = Math.max(100, startCrop.width + deltaX);
        const newHeight = Math.max(100, startCrop.height + deltaY);
        setCropArea(prev => ({
          ...prev,
          width: newWidth,
          height: newHeight
        }));
      } else {
        // Move crop area
        setCropArea(prev => ({
          ...prev,
          x: Math.max(0, startCrop.x + deltaX),
          y: Math.max(0, startCrop.y + deltaY)
        }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const cropImage = () => {
    if (!previewUrl || !imageRef.current) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    // Set canvas size to crop area
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    
    // Calculate scale factor
    const scaleX = img.naturalWidth / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;
    
    // Draw cropped image
    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      cropArea.width,
      cropArea.height
    );
    
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleSave = () => {
    const croppedImage = cropImage();
    if (croppedImage) {
      onImageChange(croppedImage);
      onClose();
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    onClose();
  };

  const predefinedAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  ];

  return (
    <div className="image-upload-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <i className="fas fa-camera"></i>
            Edit Profile Picture
          </h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="upload-section">
          <div className="upload-tabs">
            <button className="tab active">Upload</button>
            <button className="tab">Choose Avatar</button>
          </div>

          <div className="upload-area">
            <div 
              className={`drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Drag & drop an image here or click to browse</p>
              <small>Supports: JPG, PNG, GIF (Max 5MB)</small>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="predefined-avatars">
            <h4>Or choose a predefined avatar:</h4>
            <div className="avatar-grid">
              {predefinedAvatars.map((avatar, index) => (
                <button
                  key={index}
                  className="avatar-option"
                  onClick={() => {
                    onImageChange(avatar);
                    onClose();
                  }}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {previewUrl && (
          <div className="preview-section">
            <h4>Crop your image:</h4>
            <div className="image-preview">
              <div className="crop-container">
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Preview"
                  className="preview-image"
                />
                <div
                  ref={cropRef}
                  className="crop-overlay"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height
                  }}
                  onMouseDown={handleCropMouseDown}
                >
                  <div className="crop-handle crop-handle-br"></div>
                </div>
              </div>
              
              <div className="crop-preview">
                <h5>Preview:</h5>
                <div className="avatar-preview">
                  {previewUrl && (
                    <div 
                      className="cropped-preview"
                      style={{
                        backgroundImage: `url(${previewUrl})`,
                        backgroundPosition: `-${cropArea.x}px -${cropArea.y}px`,
                        backgroundSize: `${imageRef.current?.offsetWidth || 300}px ${imageRef.current?.offsetHeight || 300}px`
                      }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          {currentImage && (
            <button onClick={handleRemoveImage} className="remove-btn">
              <i className="fas fa-trash"></i>
              Remove Photo
            </button>
          )}
          <div className="action-buttons">
            <button onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            {previewUrl && (
              <button onClick={handleSave} className="save-btn">
                <i className="fas fa-save"></i>
                Save Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .image-upload-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          position: relative;
          background: white;
          border-radius: 1rem;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .upload-section {
          padding: 2rem;
        }

        .upload-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .tab {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .tab.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .drop-zone {
          border: 2px dashed var(--border-color);
          border-radius: 1rem;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 2rem;
        }

        .drop-zone:hover,
        .drop-zone.dragging {
          border-color: var(--primary-color);
          background: var(--bg-secondary);
        }

        .drop-zone i {
          font-size: 3rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .drop-zone p {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .drop-zone small {
          color: var(--text-secondary);
        }

        .predefined-avatars h4 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 1rem;
        }

        .avatar-option {
          background: none;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          padding: 4px;
          cursor: pointer;
          transition: all 0.2s;
          width: 80px;
          height: 80px;
        }

        .avatar-option:hover {
          border-color: var(--primary-color);
          transform: scale(1.05);
        }

        .avatar-option img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .preview-section {
          padding: 0 2rem 2rem 2rem;
          border-top: 1px solid var(--border-color);
        }

        .preview-section h4 {
          margin: 2rem 0 1rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .image-preview {
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: 2rem;
          align-items: start;
        }

        .crop-container {
          position: relative;
          display: inline-block;
          max-width: 100%;
        }

        .preview-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: 0.5rem;
          user-select: none;
        }

        .crop-overlay {
          position: absolute;
          border: 2px solid var(--primary-color);
          background: rgba(37, 99, 235, 0.1);
          cursor: move;
          min-width: 100px;
          min-height: 100px;
        }

        .crop-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: var(--primary-color);
          border: 2px solid white;
          border-radius: 50%;
        }

        .crop-handle-br {
          bottom: -6px;
          right: -6px;
          cursor: se-resize;
        }

        .crop-preview h5 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .avatar-preview {
          display: flex;
          justify-content: center;
        }

        .cropped-preview {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 3px solid var(--border-color);
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .remove-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #dc2626;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .cancel-btn {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
        }

        .save-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .save-btn:hover {
          background: var(--primary-dark);
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .image-preview {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .modal-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .action-buttons {
            justify-content: center;
          }

          .avatar-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default ImageUpload;
