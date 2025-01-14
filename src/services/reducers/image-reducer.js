const actionsWithoutHistory = [
  'SET_IMAGE_SRC',
  'SET_IMAGE',
  'SET_ORIGINAL_IMAGE',
  'SET_ACTIVE_TOOL',
  'SET_SHOW_ORIGINAL',
  'SET_IS_DRAG_OVER',
  'SET_TUNES',
];

const initialState = {
  imageSrc: null,
  imageFix: null,
  isDragOver: false,
  activeTool: 0,
  rotationAngle: 0,
  resizeDimensions: { width: 2000, height: 2000 },
  cropArea: { x: 0, y: 0 },
  mask: [],
  appliedMask: [],
  brushSize: 10,
  drawing: false,
  filter: 'none',
  showOriginal: false,
  originalImage: null,
  image: null,
  imageBeforeRemove: null,
  imageBeforeRemoveGoogle: null,
  past: [],
  future: [],
  hasInitializedResize: false,
  tune: {
    brightness: 50,
    contrast: 50,
    saturation: 50,
    blur: 0,
  },
  texts: [],
};

const getPresentState = (state) => {
  // eslint-disable-next-line no-unused-vars
  const { past, future, hasInitializedResize, ...present } = state;
  return present;
};

export const imageReducer = (state = initialState, action) => {
  const shouldAddToHistory = !actionsWithoutHistory.includes(
    action.type
  );

  switch (action.type) {
    case 'UNDO': {
      if (state.past.length === 0) {
        return state;
      }
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        ...previous,
        past: newPast,
        future: [getPresentState(state), ...state.future],
        hasInitializedResize: state.hasInitializedResize,
      };
    }

    case 'REDO': {
      if (state.future.length === 0) {
        return state;
      }
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...next,
        past: [...state.past, getPresentState(state)],
        future: newFuture,
        hasInitializedResize: state.hasInitializedResize,
      };
    }

    case 'SET_RESIZE_DIMENSIONS':
      if (!state.hasInitializedResize) {
        return {
          ...state,
          resizeDimensions: action.payload,
          hasInitializedResize: true,
        };
      } else {
        return {
          ...state,
          resizeDimensions: action.payload,
          ...(shouldAddToHistory
            ? {
                past: [...state.past, getPresentState(state)],
                future: [],
              }
            : {}),
          hasInitializedResize: true,
        };
      }

    case 'SET_ACTIVE_TOOL':
      return {
        ...state,
        activeTool: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_IMAGE_SRC':
      return {
        ...state,
        imageSrc: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_IS_DRAG_OVER':
      return {
        ...state,
        isDragOver: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_CROP_AREA':
      return {
        ...state,
        cropArea: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_CROP_DIMENSIONS':
      return {
        ...state,
        cropDimensions: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_ROTATION_ANGLE':
      return {
        ...state,
        rotationAngle: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_BRUSH_SIZE':
      return {
        ...state,
        brushSize: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_MASK':
      return {
        ...state,
        mask: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_APPLIED_MASK':
      return {
        ...state,
        appliedMask: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_DRAWING':
      return {
        ...state,
        drawing: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_SHOW_ORIGINAL':
      return {
        ...state,
        showOriginal: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_ORIGINAL_IMAGE':
      return {
        ...state,
        originalImage: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_IMAGE':
      return {
        ...state,
        image: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };

    case 'SET_IMAGE_BEFORE_REMOVE':
      return {
        ...state,
        imageBeforeRemove: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };
    case 'SET_IMAGE_BEFORE_REMOVE_GOOGLE':
      return {
        ...state,
        imageBeforeRemoveGoogle: action.payload,
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };
    case 'RESET_STATE': {
      return {
        ...initialState,
      };
    }
    case 'SET_TUNES': {
      return {
        ...state,
        tune: {
          ...state.tune,
          ...action.payload,
        },
        past: [...state.past, getPresentState(state)],
        future: [],
      };
    }
    case 'ADD_TEXT': {
      return {
        ...state,
        texts: [...state.texts, action.payload],
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };
    }
    case 'UPDATE_TEXT': {
      return {
        ...state,
        texts: state.texts.map((text) =>
          text.id === action.payload.id
            ? { ...text, ...action.payload.updates }
            : text
        ),
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };
    }
    case 'REMOVE_TEXT': {
      const id = action.payload;
      return {
        ...state,
        texts: state.texts.filter((text) => text.id !== id),
        ...(shouldAddToHistory
          ? {
              past: [...state.past, getPresentState(state)],
              future: [],
            }
          : {}),
      };
    }
    default:
      return state;
  }
};

export default imageReducer;
