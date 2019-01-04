export const DISABLE_SCROLL = 'DISABLE_SCROLL';

/**
 * Action to disable or enable scrolling and swiping on the home screen.
 * This is used when previewing a transaction using Peek and Pop (3D Touch).
 */
export const disableScroll = (disable = true) => {
  return {
    type: DISABLE_SCROLL,
    disable
  };
};
