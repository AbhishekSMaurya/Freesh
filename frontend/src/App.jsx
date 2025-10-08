import React, { useState, useRef, useEffect } from 'react';
import { Download, Image, Type, Square, Circle, Trash2, RotateCcw, RotateCw, Upload, Save, FolderOpen, User } from 'lucide-react';
import './index.css';

const MattyAI = () => {
  const canvasRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@gncipl.com' });
  const [designs, setDesigns] = useState([
    { id: 1, title: 'Hotel Banner', thumbnail: '🏨', date: '2025-10-05' },
    { id: 2, title: 'Cafe Menu', thumbnail: '☕', date: '2025-10-06' }
  ]);
  const [activeTab, setActiveTab] = useState('editor');
  const [currentDesign, setCurrentDesign] = useState({ title: 'Untitled Design' });

  const addToHistory = (newElements) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const addText = () => {
    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'Double click to edit',
      x: 100,
      y: 100,
      fontSize: 24,
      color: '#000000',
      fontWeight: 'normal'
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
  };

  const addShape = (shapeType) => {
    const newElement = {
      id: Date.now(),
      type: shapeType,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      color: '#3b82f6'
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newElement = {
          id: Date.now(),
          type: 'image',
          src: event.target.result,
          x: 50,
          y: 50,
          width: 200,
          height: 200
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(null);
  };

  const updateElement = (id, updates) => {
    const newElements = elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
  };

  const exportDesign = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    elements.forEach(el => {
      if (el.type === 'text') {
        ctx.fillStyle = el.color;
        ctx.font = `${el.fontWeight} ${el.fontSize}px Arial`;
        ctx.fillText(el.content, el.x, el.y);
      } else if (el.type === 'rectangle') {
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.width, el.height);
      } else if (el.type === 'circle') {
        ctx.fillStyle = el.color;
        ctx.beginPath();
        ctx.arc(el.x + el.width / 2, el.y + el.height / 2, el.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (el.type === 'image' && el.src) {
        const img = new Image();
        img.src = el.src;
        ctx.drawImage(img, el.x, el.y, el.width, el.height);
      }
    });

    const link = document.createElement('a');
    link.download = `${currentDesign.title || 'design'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveDesign = () => {
    const newDesign = {
      id: Date.now(),
      title: currentDesign.title,
      thumbnail: '🎨',
      date: new Date().toISOString().split('T')[0],
      elements: elements
    };
    setDesigns([...designs, newDesign]);
    alert('Design saved successfully!');
  };

  const loadDesign = (design) => {
    if (design.elements) {
      setElements(design.elements);
      setCurrentDesign({ title: design.title });
      addToHistory(design.elements);
    }
    setActiveTab('editor');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    elements.forEach(el => {
      if (el.type === 'text') {
        ctx.fillStyle = el.color;
        ctx.font = `${el.fontWeight} ${el.fontSize}px Arial`;
        ctx.fillText(el.content, el.x, el.y);
      } else if (el.type === 'rectangle') {
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.width, el.height);
      } else if (el.type === 'circle') {
        ctx.fillStyle = el.color;
        ctx.beginPath();
        ctx.arc(el.x + el.width / 2, el.y + el.height / 2, el.width / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (el.type === 'image' && el.src) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, el.x, el.y, el.width, el.height);
        };
        img.src = el.src;
      }

      if (selectedElement === el.id) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        if (el.type === 'circle') {
          ctx.beginPath();
          ctx.arc(el.x + el.width / 2, el.y + el.height / 2, el.width / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.strokeRect(el.x, el.y, el.width || 200, el.height || 30);
        }
        ctx.setLineDash([]);
      }
    });
  }, [elements, selectedElement]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">M</div>
          <div className="title">
            <h1>Matty AI</h1>
            <p>by GNCIPL</p>
          </div>
        </div>
        <div className="header-right">
          <div className="tab-buttons">
            <button className={activeTab === 'editor' ? 'active' : ''} onClick={() => setActiveTab('editor')}>Editor</button>
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>My Designs</button>
          </div>
          <div className="user-info">
            <User className="user-icon" />
            <span>{user.name}</span>
          </div>
        </div>
      </header>

      {activeTab === 'editor' ? (
        <div className="editor-container">
          <div className="design-title">
            <input
              type="text"
              value={currentDesign.title}
              onChange={(e) => setCurrentDesign({ ...currentDesign, title: e.target.value })}
              placeholder="Design Title"
            />
          </div>
          <div className="editor-grid">
            {/* Toolbar */}
            <div className="toolbar panel">
              <h3>Tools</h3>
              <label className="tool-button">
                <Upload className="icon" />
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
              <button onClick={addText} className="tool-button">
                <Type className="icon" /> Add Text
              </button>
              <button onClick={() => addShape('rectangle')} className="tool-button">
                <Square className="icon" /> Rectangle
              </button>
              <button onClick={() => addShape('circle')} className="tool-button">
                <Circle className="icon" /> Circle
              </button>

              <h3>Actions</h3>
              <button onClick={undo} disabled={historyStep === 0} className="tool-button"> <RotateCcw className="icon" /> Undo</button>
              <button onClick={redo} disabled={historyStep === history.length - 1} className="tool-button"> <RotateCw className="icon" /> Redo</button>
              <button onClick={saveDesign} className="tool-button primary"> <Save className="icon" /> Save</button>
              <button onClick={exportDesign} className="tool-button success"> <Download className="icon" /> Export PNG</button>
            </div>

            {/* Canvas */}
            <div className="canvas-panel panel">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onClick={(e) => {
                  const rect = canvasRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const clicked = elements.find(el => {
                    if (el.type === 'circle') {
                      const dx = x - (el.x + el.width / 2);
                      const dy = y - (el.y + el.height / 2);
                      return Math.sqrt(dx * dx + dy * dy) <= el.width / 2;
                    }
                    return x >= el.x && x <= el.x + (el.width || 200) &&
                      y >= el.y && y <= el.y + (el.height || 30);
                  });

                  setSelectedElement(clicked ? clicked.id : null);
                }}
              />
            </div>

            {/* Properties Panel */}
            <div className="properties-panel panel">
              <h3>Properties</h3>
              {selectedElement ? (
                <div className="properties">
                  {elements.find(el => el.id === selectedElement)?.type === 'text' && (
                    <>
                      <label>Text Content</label>
                      <input type="text" value={elements.find(el => el.id === selectedElement)?.content}
                        onChange={(e) => updateElement(selectedElement, { content: e.target.value })} />
                      <label>Font Size</label>
                      <input type="number" value={elements.find(el => el.id === selectedElement)?.fontSize}
                        onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })} />
                      <label>Color</label>
                      <input type="color" value={elements.find(el => el.id === selectedElement)?.color}
                        onChange={(e) => updateElement(selectedElement, { color: e.target.value })} />
                    </>
                  )}
                  {(elements.find(el => el.id === selectedElement)?.type === 'rectangle' ||
                    elements.find(el => el.id === selectedElement)?.type === 'circle') && (
                      <>
                        <label>Fill Color</label>
                        <input type="color" value={elements.find(el => el.id === selectedElement)?.color}
                          onChange={(e) => updateElement(selectedElement, { color: e.target.value })} />
                      </>
                    )}
                  <button onClick={() => deleteElement(selectedElement)} className="tool-button danger">
                    <Trash2 className="icon" /> Delete Element
                  </button>
                </div>
              ) : (
                <p>Select an element to edit properties</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-container">
          <h2>My Designs</h2>
          <div className="design-grid">
            {designs.map(design => (
              <div key={design.id} className="design-card" onClick={() => loadDesign(design)}>
                <div className="thumbnail">{design.thumbnail}</div>
                <h3>{design.title}</h3>
                <p>Created: {design.date}</p>
                <button className="tool-button primary"><FolderOpen className="icon" /> Open Design</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MattyAI;
