export const setImageSrc = (src) => ({
  type: 'SET_IMAGE_SRC',
  payload: src,
});

export const setIsDragOver = (isDragOver) => ({
  type: 'SET_IS_DRAG_OVER',
  payload: isDragOver,
});
export const setActiveTool = (toolIndex) => ({
  type: 'SET_ACTIVE_TOOL',
  payload: toolIndex,
});

export const setRotationAngle = (angle) => ({
  type: 'SET_ROTATION_ANGLE',
  payload: angle,
});

export const setCropArea = (cropArea) => ({
  type: 'SET_CROP_AREA',
  payload: cropArea,
});

export const setFilter = (filter) => ({
  type: 'SET_FILTER',
  payload: filter,
});

export const setBrushSize = (brushSize) => ({
  type: 'SET_BRUSH_SIZE',
  payload: brushSize,
});

export const setMask = (mask) => ({
  type: 'SET_MASK',
  payload: mask,
});

export const setDrawing = (drawing) => ({
  type: 'SET_DRAWING',
  payload: drawing,
});
export const setResizeDimensions = (dimensions) => ({
  type: 'SET_RESIZE_DIMENSIONS',
  payload: dimensions,
});
export const setShowOriginal = (show) => ({
  type: 'SET_SHOW_ORIGINAL',
  payload: show,
});
export const setOriginalImage = (originalImage) => ({
  type: 'SET_ORIGINAL_IMAGE',
  payload: originalImage,
});
export const setImage = (image) => ({
  type: 'SET_IMAGE',
  payload: image,
});

export const setImageBeforeRemove = (image) => ({
  type: 'SET_IMAGE_BEFORE_REMOVE',
  payload: image,
});
export const undo = () => ({
  type: 'UNDO',
});

export const redo = () => ({
  type: 'REDO',
});
export const resetState = () => ({
  type: 'RESET_STATE',
});
export const setTunes = (tuneSettings) => ({
  type: 'SET_TUNES',
  payload: tuneSettings,
});

export const setImageBeforeRemoveGoogle = (image) => ({
  type: 'SET_IMAGE_BEFORE_REMOVE_GOOGLE',
  payload: image,
});
export const addText = (text) => ({
  type: 'ADD_TEXT',
  payload: { id: Date.now(), ...text },
});

export const updateText = (id, updates) => ({
  type: 'UPDATE_TEXT',
  payload: { id, updates },
});

export const removeText = (id) => ({
  type: 'REMOVE_TEXT',
  payload: id,
});
