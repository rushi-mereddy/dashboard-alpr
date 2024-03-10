import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MenuItem, Select, Button } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';


const DrawingSVG: React.FC<{ imageUrl: string; onCoordinatesSave: () => void }> = ({ imageUrl, onCoordinatesSave }) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shape, setShape] = useState('rectangle');
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [lines, setLines] = useState<{ startX: number; startY: number; endX: number; endY: number }[]>([]);
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const redraw = useCallback(() => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.drawImage(imageRef.current!, 0, 0, canvas!.width, canvas!.height);

      if (shape === 'rectangle') {
        ctx.beginPath();
        ctx.rect(startX, startY, endX - startX, endY - startY);
        ctx.stroke();
      } else if (shape === 'line') {
        lines.forEach(line => {
          ctx.beginPath();
          ctx.moveTo(line.startX, line.startY);
          ctx.lineTo(line.endX, line.endY);
          ctx.stroke();
        });
      } else if (shape === 'polygon') {
        drawPolygon();
      }
    }
  }, [canvas, ctx, shape, startX, startY, endX, endY, lines]);

  useEffect(() => {
    const redrawCallback = () => {
      if (ctx) {
        redraw();
      }
    };

    if (canvas) {
      setCtx(canvas.getContext('2d')!);
      imageRef.current = new Image();
      imageRef.current.onload = redrawCallback;
      imageRef.current.src = imageUrl;
    }
  }, [canvas, ctx, imageUrl, redraw]);

  const startShape = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const rect = canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (shape === 'rectangle') {
      setStartX(x);
      setStartY(y);
    } else if (shape === 'line') {
      setLines([...lines, { startX: x, startY: y, endX: x, endY: y }]);
    } else if (shape === 'polygon') {
      setPolygonPoints([...polygonPoints, { x, y }]);
    }
  };

  const drawShape = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const rect = canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (shape === 'rectangle') {
      setEndX(x);
      setEndY(y);
      redraw();
    } else if (shape === 'line') {
      const updatedLines = [...lines];
      updatedLines[updatedLines.length - 1].endX = x;
      updatedLines[updatedLines.length - 1].endY = y;
      setLines(updatedLines);
      redraw();
    } else if (shape === 'polygon') {
      redraw();
      drawPolygonPoint(x, y);
    }
  };

  const endShape = () => {
    setIsDrawing(false);
    if (shape === 'polygon') {
      drawPolygon();
    }
  };

  const drawPolygonPoint = (x: number, y: number) => {
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawPolygon = () => {
    if (ctx && polygonPoints.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) {
        ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  };

  const getCoordinates = () => {
    if (shape === 'rectangle') {
      const rectangleCoordinates = [
        `(${startX}px, ${startY}px)`,
        `(${endX}px, ${startY}px)`,
        `(${endX}px, ${endY}px)`,
        `(${startX}px, ${endY}px)`
      ];
      console.log('Rectangle Coordinates:', rectangleCoordinates);
    } else if (shape === 'line') {
      const lineCoordinates = lines.map(line => `(${line.startX}px, ${line.startY}px), (${line.endX}px, ${line.endY}px)`);
      console.log('Line Coordinates:', lineCoordinates);
    } else if (shape === 'polygon') {
      const polygonCoordinates = polygonPoints.map(point => `(${point.x}px, ${point.y}px)`);
      console.log('Polygon Coordinates:', polygonCoordinates);
    }
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    setShape(event.target.value);
  };
  
  

  const clearCanvas = () => {
    setLines([]);
    setPolygonPoints([]);

    if (imageRef.current!.complete) {
      if (ctx) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx.drawImage(imageRef.current!, 0, 0, canvas!.width, canvas!.height);
      }
    } else {
      imageRef.current!.onload = () => {
        if (ctx) {
          ctx.clearRect(0, 0, canvas!.width, canvas!.height);
          ctx.drawImage(imageRef.current!, 0, 0, canvas!.width, canvas!.height);
        }
      };
    }
  };

  return (
    <div>
      <canvas
        id="myCanvas"
        width="730"
        height="300"
        ref={(node) => setCanvas(node)}
        onMouseDown={startShape}
        onMouseMove={drawShape}
        onMouseUp={endShape}
        style={{ border: '1px solid black' }}
      ></canvas>
      <Select
        id="shapeSelect"
        value={shape}
        onChange={handleChange}
        style={{ marginTop: '2px', border: '1px solid #ccc' }}
      >
        <MenuItem value="rectangle">Rectangle</MenuItem>
        <MenuItem value="line">Line</MenuItem>
        <MenuItem value="polygon">Polygon</MenuItem>
      </Select>
      <Button onClick={clearCanvas}>Clear</Button>
      <Button
        variant="contained"
        style={{ marginTop: '2px', padding: '6px 16px', backgroundColor: '#1976D2', color: 'white', float: 'right' }}
        onClick={getCoordinates}
      >
        Save Coordinates
      </Button>
    </div>
  );
};

export default DrawingSVG;
