import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

const ImageEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeImage, setActiveImage] = useState<fabric.Image | null>(null);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.6,
        backgroundColor: '#f3f3f3',
      });
      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = function (f) {
        const imgObj = new Image();
        imgObj.src = f.target?.result as string;
        imgObj.onload = function () {
          const img = new fabric.Image(imgObj);
          img.scaleToWidth(500);
          canvas.add(img);
          setActiveImage(img);
          canvas.renderAll();
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = () => {
    if (activeImage) {
      activeImage.filters = [];

      activeImage.filters.push(new fabric.filters.Brightness({
        brightness: brightness / 100,
      }));

      activeImage.filters.push(new fabric.filters.Contrast({
        contrast: contrast / 100,
      }));

      activeImage.applyFilters();
      canvas?.renderAll();
    }
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBrightness(value);
    applyFilters();
  };

  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setContrast(value);
    applyFilters();
  };

  const saveImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        multiplier: 1,
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'edited_image.png';
      link.click();
    }
  };

  return (
    <div style={styles.container}>
      <h2>Online Image Editor</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {activeImage && (
        <div style={styles.controls}>
          <div>
            <label>Brightness: {brightness}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={brightness}
              onChange={handleBrightnessChange}
              style={styles.slider}
            />
          </div>
          <div>
            <label>Contrast: {contrast}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={contrast}
              onChange={handleContrastChange}
              style={styles.slider}
            />
          </div>
        </div>
      )}

      <div style={styles.canvasContainer}>
        <canvas ref={canvasRef} />
      </div>

      <button onClick={saveImage} style={styles.saveButton}>
        Save Image
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    minHeight: '100vh',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    marginBottom: '20px',
  },
  canvasContainer: {
    display: 'flex',
    justifyContent: 'center' as 'center',
    marginTop: '20px',
  },
  slider: {
    width: '300px',
    margin: '10px',
  },
  saveButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
  },
};

export default ImageEditor;