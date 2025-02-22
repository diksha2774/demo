import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import '../css/CanvasEditor.css';
import { jsPDF } from 'jspdf';

const CanvasEditor = () => {
    const [canvas, setCanvas] = useState(null);
    const canvasRef = useRef(null);
    const [activeTab, setActiveTab] = useState(null);
    const [selectedText, setSelectedText] = useState(null);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawingTool, setDrawingTool] = useState('pencil');
    const [drawingColor, setDrawingColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(2);
    const [selectedShape, setSelectedShape] = useState(null);
    const [shapeColor, setShapeColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    useEffect(() => {
        const fabricCanvas = new fabric.Canvas('canvas', {
            width: 800,
            height: 600,
            backgroundColor: 'white',
            selection: true,
            preserveObjectStacking: true,
            interactive: true,
        });

        fabricCanvas.on('object:selected', (options) => {
            if (options.target && options.target.type === 'i-text') {
                setSelectedText(options.target); // Update selectedText state
            } else {
                setSelectedText(null); // Clear if not IText
            }
        });

        // Handle text selection
        fabricCanvas.on('mouse:down', function(options) {
            if (options.target && options.target.type === 'i-text') {
                setSelectedText(options.target);
            } else {
                setSelectedText(null);
            }
        });

        fabricCanvas.on('selection:created', function(options) {
            if (options.target && options.target.type === 'i-text') {
                setSelectedText(options.target);
            }
        });

        fabricCanvas.on('selection:updated', function(options) {
            if (options.target && options.target.type === 'i-text') {
                setSelectedText(options.target);
            }
        });

        fabricCanvas.on('selection:cleared', function() {
            setSelectedText(null);
        });

        // Handle text modifications
        fabricCanvas.on('text:changed', function(options) {
            if (options.target) {
                setSelectedText(options.target);
            }
        });

        setCanvas(fabricCanvas);

        return () => {
            fabricCanvas.dispose();
        };
    }, []);

    const handleaddtext = () => {
        if (!canvas) return;

        const text = new fabric.IText('Click to edit text', {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fontSize: 40,
            fontFamily: 'Arial',
            fill: '#333333',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            selectable: true,
            editable: true,
            hasControls: true,
            hasBorders: true,
            borderColor: '#2196F3',
            cornerColor: '#2196F3',
            cornerSize: 8,
            transparentCorners: false
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        setSelectedText(text); // Set selected text immediately
        canvas.requestRenderAll();
    };

    const handleTextPropertyChange = (property, value) => {
        if (!canvas || !selectedText) return; // Guard clause
    
        const activeObject = canvas.getActiveObject();
        if (!activeObject || activeObject.type !== 'i-text') return;
    
        try {
            switch (property) {
                case 'fontFamily':
                    activeObject.set('fontFamily', value);
                    break;
                case 'fontSize':
                    let newSize = parseInt(value);
                    if (isNaN(newSize)) newSize = 40;
                    newSize = Math.min(Math.max(newSize, 8), 200); // Keep within valid range
    
                    // Apply new font size without modifying width
                    activeObject.set('fontSize', newSize);
                    activeObject.setCoords(); // Ensure it updates correctly
                    break;
                case 'fill':
                    activeObject.set('fill', value);
                    break;
                case 'fontWeight':
                    activeObject.set('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold');
                    break;
                case 'fontStyle':
                    activeObject.set('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic');
                    break;
                case 'underline':
                    activeObject.set('underline', !activeObject.underline);
                    break;
            }
            canvas.requestRenderAll(); // Refresh canvas after update
        } catch (error) {
            console.error('Error updating text property:', error);
        }
    };
    
    const handleDrawingToolChange = (tool) => {
        if (!canvas) return;

        setDrawingTool(tool);
        canvas.isDrawingMode = true;
        setDrawingMode(true);

        // Always use PencilBrush for both pencil and eraser
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

        if (tool === 'eraser') {
            canvas.freeDrawingBrush.color = '#ffffff'; // White color for eraser
            canvas.freeDrawingBrush.width = brushSize * 2; // Make eraser slightly bigger
        } else if (tool === 'pencil') {
            canvas.freeDrawingBrush.color = drawingColor;
            canvas.freeDrawingBrush.width = brushSize;
        } else if (tool === 'pen') {
            canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
            canvas.freeDrawingBrush.color = drawingColor;
            canvas.freeDrawingBrush.width = brushSize;
        }

        canvas.renderAll();
    };

    const handleBrushSizeChange = (size) => {
        if (!canvas) return;
        setBrushSize(size);
        // Make eraser slightly bigger than the brush size
        canvas.freeDrawingBrush.width = drawingTool === 'eraser' ? size * 2 : size;
    };

    const handleDrawingColorChange = (color) => {
        if (!canvas || drawingTool === 'eraser') return;
        setDrawingColor(color);
        canvas.freeDrawingBrush.color = color;
    };

    const handleAddShape = (shapeType) => {
        if (!canvas) return;

        let shape;
        switch (shapeType) {
            case 'square':
                shape = new fabric.Rect({
                    width: 100,
                    height: 100,
                    fill: shapeColor,
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center'
                });
                break;
            case 'circle':
                shape = new fabric.Circle({
                    radius: 50,
                    fill: shapeColor,
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center'
                });
                break;
            case 'line':
                shape = new fabric.Line([50, 50, 200, 50], {
                    stroke: shapeColor,
                    strokeWidth: 2,
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center'
                });
                break;
            case 'triangle':
                shape = new fabric.Triangle({
                    width: 100,
                    height: 100,
                    fill: shapeColor,
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center'
                });
                break;
            case 'ellipse':
                shape = new fabric.Ellipse({
                    rx: 75,
                    ry: 50,
                    fill: shapeColor,
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center'
                });
                break;
            case 'star':
                const points = [
                    {x: 0, y: 0},
                    {x: 100, y: 0},
                    {x: 125, y: 50},
                    {x: 150, y: 0},
                    {x: 250, y: 0},
                    {x: 175, y: 100},
                    {x: 200, y: 200},
                    {x: 125, y: 150},
                    {x: 50, y: 200},
                    {x: 75, y: 100}
                ];
                shape = new fabric.Polygon(points, {
                    fill: shapeColor,
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center',
                    scaleX: 0.4,
                    scaleY: 0.4
                });
                break;
        }

        if (shape) {
            canvas.add(shape);
            canvas.setActiveObject(shape);
            canvas.requestRenderAll();
        }
    };

    const handleAddGraphic = (graphicType) => {
        if (!canvas) return;

        switch (graphicType) {
            case 'splatter1':
                fabric.loadSVGFromURL('/path/to/splatter1.svg', function(objects, options) {
                    const graphic = fabric.util.groupSVGElements(objects, options);
                    graphic.set({
                        left: canvas.width / 2,
                        top: canvas.height / 2,
                        originX: 'center',
                        originY: 'center',
                        scaleX: 0.5,
                        scaleY: 0.5
                    });
                    canvas.add(graphic);
                    canvas.setActiveObject(graphic);
                    canvas.requestRenderAll();
                });
                break;
            // Add more graphics as needed
        }
    };

    const handleDownloadAsPNG = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        const link = document.createElement('a');
        link.download = 'poster.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAsPDF = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(dataURL, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('poster.pdf');
    };

    const handleBackgroundColorChange = (color) => {
        if (!canvas) return;
        canvas.setBackgroundColor(color, () => {
            canvas.requestRenderAll();
        });
        setBackgroundColor(color);
    };

    return (
        <div className="main-container">
            <div className="sidebar">
                <div className="sidebar-item" onClick={() => setActiveTab('design')}>
                    <span className="sidebar-icon">□</span>
                    <span className="sidebar-text">Design</span>
                </div>
                <div className="sidebar-item" onClick={() => setActiveTab('elements')}>
                    <span className="sidebar-icon">⧈</span> {/* Replace with your icon */}
                    <span className="sidebar-text">Elements</span>
                </div>
                <div className="sidebar-item" onClick={() => setActiveTab('text')}>
                    <span className="sidebar-icon">T</span>
                    <span className="sidebar-text">Text</span>
                </div>
                <div className="sidebar-item" onClick={() => setActiveTab('uploads')}>
                    <span className="sidebar-icon">☁</span> 
                    <span className="sidebar-text">Downloads</span>
                </div>
                <div className="sidebar-item" onClick={() => setActiveTab('draw')}>
                    <span className="sidebar-icon">✎</span> 
                    <span className="sidebar-text">Draw</span>
                </div>
            </div>

            {activeTab === 'text' && (
                <div className="text-options">
                    <button className="add-text-box" onClick={handleaddtext}>
                        <span className="text-icon">T</span>
                        Add a text box
                    </button>
                    
                    {/* Show formatting options by default */}
                    <div className="text-formatting">
                        <select 
                            className="font-family-select"
                            value={selectedText ? selectedText.fontFamily : 'Arial'}
                            onChange={(e) => handleTextPropertyChange('fontFamily', e.target.value)}
                            disabled={!selectedText}
                        >
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Courier New">Courier New</option>
                        </select>

                        <input 
    type="number" 
    min="8" 
    max="200" 
    step="1"
    value={selectedText ? Math.round(selectedText.fontSize) : 40}
    onChange={(e) => {
        const newValue = parseInt(e.target.value);
        if (!isNaN(newValue)) {
            handleTextPropertyChange('fontSize', newValue);
        }
    }}
    onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const currentSize = selectedText?.fontSize || 40;
            const change = e.key === 'ArrowUp' ? 1 : -1;
            handleTextPropertyChange('fontSize', currentSize + change);
        }
    }}
    className="font-size-input"
    disabled={!selectedText}
/>


                        <input 
                            type="color" 
                            value={selectedText ? selectedText.fill : '#000000'}
                            onChange={(e) => handleTextPropertyChange('fill', e.target.value)}
                            className="color-picker"
                            disabled={!selectedText}
                        />

                        <div className="text-style-buttons">
                            <button 
                                className={`style-btn ${selectedText?.fontWeight === 'bold' ? 'active' : ''}`}
                                onClick={() => handleTextPropertyChange('fontWeight')}
                                disabled={!selectedText}
                            >
                                B
                            </button>
                            <button 
                                className={`style-btn ${selectedText?.fontStyle === 'italic' ? 'active' : ''}`}
                                onClick={() => handleTextPropertyChange('fontStyle')}
                                disabled={!selectedText}
                            >
                                I
                            </button>
                            <button 
                                className={`style-btn ${selectedText?.underline ? 'active' : ''}`}
                                onClick={() => handleTextPropertyChange('underline')}
                                disabled={!selectedText}
                            >
                                U
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'draw' && (
                <div className="drawing-options">
                    <div className="tool-buttons">
                        <button 
                            className={`tool-btn ${drawingTool === 'pencil' ? 'active' : ''}`}
                            onClick={() => handleDrawingToolChange('pencil')}
                        >
                            <span className="tool-icon">✏️</span>
                            Pencil
                        </button>
                        <button 
                            className={`tool-btn ${drawingTool === 'pen' ? 'active' : ''}`}
                            onClick={() => handleDrawingToolChange('pen')}
                        >
                            <span className="tool-icon">🖊️</span>
                            Pen
                        </button>
                        <button 
                            className={`tool-btn ${drawingTool === 'eraser' ? 'active' : ''}`}
                            onClick={() => handleDrawingToolChange('eraser')}
                        >
                            <span className="tool-icon">🧹</span>
                            Eraser
                        </button>
                    </div>

                    <div className="drawing-properties">
                        <div className="property-group">
                            <label>Size</label>
                            <input 
                                type="range"
                                min="1"
                                max="50"
                                value={brushSize}
                                onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
                                className="brush-size-slider"
                            />
                            <span className="size-value">{brushSize}px</span>
                        </div>

                        <div className="property-group">
                            <label>Color</label>
                            <input 
                                type="color"
                                value={drawingColor}
                                onChange={(e) => handleDrawingColorChange(e.target.value)}
                                className="color-picker"
                                disabled={drawingTool === 'eraser'}
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'elements' && (
                <div className="elements-options">
                    <div className="elements-section">
                        <div className="section-header">
                            <h3>Shapes</h3>
                        </div>
                        
                        <div className="shape-color-picker">
                            <label>Shape Color</label>
                            <input 
                                type="color"
                                value={shapeColor}
                                onChange={(e) => setShapeColor(e.target.value)}
                                className="color-picker"
                            />
                        </div>

                        <div className="shapes-grid">
                            <button 
                                className="shape-btn" 
                                onClick={() => handleAddShape('square')}
                            >
                                <div 
                                    className="shape-preview square"
                                    style={{ backgroundColor: shapeColor }}
                                ></div>
                            </button>
                            <button 
                                className="shape-btn" 
                                onClick={() => handleAddShape('circle')}
                            >
                                <div 
                                    className="shape-preview circle"
                                    style={{ backgroundColor: shapeColor }}
                                ></div>
                            </button>
                            <button 
                                className="shape-btn" 
                                onClick={() => handleAddShape('line')}
                            >
                                <div 
                                    className="shape-preview line"
                                    style={{ backgroundColor: shapeColor }}
                                ></div>
                            </button>
                            <button 
                                className="shape-btn" 
                                onClick={() => handleAddShape('triangle')}
                            >
                                <div 
                                    className="shape-preview triangle"
                                    style={{ borderBottomColor: shapeColor }}
                                ></div>
                            </button>
                            <button 
                                className="shape-btn" 
                                onClick={() => handleAddShape('ellipse')}
                            >
                                <div 
                                    className="shape-preview ellipse"
                                    style={{ backgroundColor: shapeColor }}
                                ></div>
                            </button>
                            <button 
                                className="shape-btn" 
                                onClick={() => handleAddShape('star')}
                            >
                                <div 
                                    className="shape-preview star"
                                    style={{ backgroundColor: shapeColor }}
                                ></div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'uploads' && (
                <div className="download-options">
                    <button className="download-box" onClick={handleDownloadAsPNG}>
                        <span className="download-icon">📸</span>
                        Download as PNG
                    </button>
                    <button className="download-box" onClick={handleDownloadAsPDF}>
                        <span className="download-icon">📄</span>
                        Download as PDF
                    </button>
                    <div className="download-info">
                        <span>Download Options</span>
                        <p>Choose your preferred format to download the poster</p>
                    </div>
                </div>
            )}

            {activeTab === 'design' && (
                <div className="design-options">
                    <div className="section-header">
                        <h3>Background</h3>
                    </div>
                    <div className="background-color-picker">
                        <label>Canvas Color</label>
                        <div className="color-preview">
                            <input 
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                                className="color-picker"
                            />
                            <span className="color-value">{backgroundColor}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="canvas-area">
                <canvas ref={canvasRef} id="canvas" />
            </div>
        </div>
    );
};

export default CanvasEditor;