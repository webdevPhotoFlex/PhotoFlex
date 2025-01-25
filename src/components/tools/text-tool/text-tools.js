import React, { useState, useEffect } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import styles from '../text-tool/text-tools.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  addText,
  removeText,
  updateText,
} from '../../../services/actions/image-actions';
import {
  Button,
  Fab,
  FormControl,
  Input,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { SketchPicker } from 'react-color';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Text = ({ canvasRef }) => {
  const dispatch = useDispatch();
  const [textContent, setTextContent] = useState('');
  const [textColor, setTextColor] = useState('black');
  const [customColor, setCustomColor] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [uploadFont, setUploadFont] = useState(null);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const texts = useSelector((state) => state.image.texts);

  const colors = [
    { className: styles.black, color: 'black' },
    { className: styles.white, color: 'white' },
    { className: styles.red, color: 'red' },
    { className: styles.orange, color: 'orange' },
    { className: styles.yellow, color: 'yellow' },
    { className: styles.green, color: 'green' },
    { className: styles.blue, color: 'blue' },
    { className: styles.purple, color: 'purple' },
  ];
  const fontOptions = [
    'Arial',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Times New Roman',
    'Georgia',
    'Garamond',
    'Courier New',
    'Brush Script MT',
    'Comic Sans MS',
    'Impact',
    'Palatino Linotype',
    'Book Antiqua',
    'Arial Black',
    'Lucida Sans Unicode',
    'Century Gothic',
    'Franklin Gothic Medium',
    'Baskerville',
    'Candara',
    'Segoe UI',
    'Optima',
    'Futura',
    'Geneva',
    'Calibri',
  ];

  const handleFontUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fontName = file.name.split('.')[0];
      const reader = new FileReader();
      reader.onload = () => {
        const font = new FontFace(fontName, `url(${reader.result})`);
        font
          .load()
          .then((loadedFont) => {
            document.fonts.add(loadedFont);
            setFontFamily(fontName);
            setUploadFont(loadedFont);
          })
          .catch((error) => console.error(error));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFont = () => {
    setFontFamily('Arial');
    setUploadFont(null);
  };

  useEffect(() => {
    if (selectedTextId !== null) {
      const selectedText = texts.find((t) => t.id === selectedTextId);
      if (selectedText) {
        setTextContent(selectedText.content);
        setTextColor(selectedText.color);
        setFontSize(selectedText.fontSize);
        setFontFamily(selectedText.fontFamily);
      }
    }
  }, [selectedTextId]);

  const handleAddText = () => {
    if (textContent.trim()) {
      const newText = {
        id: Date.now(),
        content: textContent,
        x: 100,
        y: 100,
        color: textColor,
        fontSize,
        fontFamily,
      };
      dispatch(addText(newText));
      setSelectedTextId(newText.id);
      setTextContent('');
    }
  };

  const handleUpdateText = () => {
    if (selectedTextId !== null) {
      const currText = texts.find((t) => t.id === selectedTextId);
      if (currText) {
        dispatch(
          updateText(selectedTextId, {
            content: textContent || currText.content,
            color: textColor || currText.color,
            fontSize: fontSize || currText.fontSize,
            fontFamily: fontFamily || currText.fontFamily,
            x: currText.x,
            y: currText.y,
          })
        );
      }
    }
  };

  const handleSelectText = (id) => {
    setSelectedTextId(id);
    const selectedText = texts.find((t) => t.id === id);
    if (selectedText) {
      setTextContent(selectedText.content);
      setTextColor(selectedText.color);
      setFontSize(selectedText.fontSize);
      setFontFamily(selectedText.fontFamily);
    }
  };

  const handleDeselectText = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let clickedOnText = false;
    texts.forEach((text) => {
      const textWidth = text.content.length * text.fontSize * 0.6;
      const textHeight = text.fontSize;

      if (
        mouseX >= text.x &&
        mouseX <= text.x + textWidth &&
        mouseY >= text.y - textHeight &&
        mouseY <= text.y
      ) {
        clickedOnText = true;
      }
    });
    if (!clickedOnText) {
      setSelectedTextId(null);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleDeselectText);

    return () => {
      document.removeEventListener('mousedown', handleDeselectText);
    };
  }, [canvasRef, texts]);

  const handleDeleteText = (id) => {
    dispatch(removeText(id));
    if (selectedTextId === id) setSelectedTextId(null);
  };

  const handleKeyDown = (e) => {
    const text = texts.find((t) => t.id === selectedTextId);
    if (!text) return;

    const move = { x: text.x, y: text.y };
    if (e.key === 'ArrowUp') move.y -= 5;
    if (e.key === 'ArrowDown') move.y += 5;
    if (e.key === 'ArrowLeft') move.x -= 5;
    if (e.key === 'ArrowRight') move.x += 5;

    dispatch(updateText(selectedTextId, move));
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    texts.forEach((text) => {
      const textWidth = text.content.length * text.fontSize * 0.6;
      const textHeight = text.fontSize;

      if (
        mouseX >= text.x &&
        mouseX <= text.x + textWidth &&
        mouseY >= text.y - textHeight &&
        mouseY <= text.y
      ) {
        setSelectedTextId(text.id);
        setDragging(true);
        setDragOffset({ x: mouseX - text.x, y: mouseY - text.y });
      }
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging || selectedTextId === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    dispatch(updateText(selectedTextId, { x: newX, y: newY }));
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTextId, texts]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasRef, dragging, selectedTextId]);

  return (
    <div
      className={styles.sharedContainer}
      data-testid="text-component"
    >
      <div className={styles.textItem} data-testid="add-text-item">
        <AddCircleOutlineIcon
          onClick={handleAddText}
          className={styles.circle}
          style={{ fontSize: '80px' }}
          data-testid="add-text-icon"
        />
        <input
          type="text"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Введите текст"
          data-testid="text-input"
        />
        <p className={styles.label}>Добавить текст</p>
      </div>
      <div>
        <FormControl className={styles.textItem}>
          <Select
            labelId="font-select-label"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            data-testid="font-family-select"
            sx={{
              border: '1px solid rgba(185, 0, 255, 0.6)',
              backgroundColor: '#1e1e1e',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(185, 0, 255, 0.1)',
                borderColor: 'rgba(185, 0, 255, 0.8)',
              },
            }}
          >
            {fontOptions.map((font, index) => (
              <MenuItem key={index} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={styles.textItem}>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          className={styles.textItem}
          sx={{
            border: '1px solid rgba(185, 0, 255, 0.6)',
            backgroundColor: '#1e1e1e',
            '&:hover': {
              backgroundColor: 'rgba(185, 0, 255, 0.1)',
              borderColor: 'rgba(185, 0, 255, 0.8)',
            },
          }}
        >
          Загрузить шрифт
          <VisuallyHiddenInput
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFontUpload}
            data-testid="font-upload-input"
          />
        </Button>
        {uploadFont && (
          <div className={styles.textPreview}>
            <p data-testid="font-name">{fontFamily}</p>
            <DeleteIcon
              onClick={handleRemoveFont}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
              data-testid="remove-font-icon"
            />
          </div>
        )}
      </div>

      <div className={styles.textItem}>
        <div className={styles.colorContainer}>
          {colors.map((color, index) => (
            <div
              key={index}
              className={`${styles.colorBlock} ${
                textColor === color.color ? styles.selected : ''
              }`}
              style={{ backgroundColor: color.color }}
              onClick={() => setTextColor(color.color)}
              data-testid={`color-block-${index}`}
            >
              <CircleIcon
                className={color.className}
                style={{
                  fontSize: '40px',
                  border:
                    textColor === color.color
                      ? '2px solid #000'
                      : 'none',
                }}
                data-testid={`color-icon-${index}`}
              />
            </div>
          ))}
        </div>
        <Fab onClick={() => setColorPickerOpen(!colorPickerOpen)}>
          <AddIcon />
        </Fab>
        {colorPickerOpen && (
          <SketchPicker
            color={customColor}
            onChange={(color) => {
              setCustomColor(color.hex);
              setTextColor(color.hex);
            }}
            data-testid="custom-color-picker"
          />
        )}
        <p className={styles.label}>Выбор цвета</p>
      </div>
      <div className={styles.textItem}></div>

      <div className={styles.textItem}>
        <label className={styles.label}>
          Размер шрифта:
          <input
            type="number"
            value={fontSize}
            min="10"
            max="100"
            onChange={(e) => setFontSize(Number(e.target.value))}
            data-testid="font-size-input"
          />
        </label>
      </div>

      <div className={styles.textItem}>
        <Button
          variant="contained"
          onClick={handleUpdateText}
          className={styles.textItem}
          sx={{
            border: '1px solid rgba(185, 0, 255, 0.6)',
            backgroundColor: '#1e1e1e',
            '&:hover': {
              backgroundColor: 'rgba(185, 0, 255, 0.1)',
              borderColor: 'rgba(185, 0, 255, 0.8)',
            },
          }}
        >
          Обновить выбранный текст
        </Button>
      </div>

      <div data-testid="text-list">
        {texts.map((text) => (
          <div
            key={text.id}
            className={`${styles.textPreview} ${
              selectedTextId === text.id ? styles.selectedText : ''
            }`}
            onClick={() => handleSelectText(text.id)}
            style={{
              color: text.color,
              fontSize: `20px`,
              cursor: 'pointer',
              fontFamily: text.fontFamily,
            }}
            data-testid={`text-item-${text.id}`}
          >
            <span>{text.content}</span>
            <DeleteIcon
              onClick={() => handleDeleteText(text.id)}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
              data-testid={`delete-icon-${text.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Text;
