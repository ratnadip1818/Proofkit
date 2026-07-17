// Motion DNA Tokens v1.0
// Centralizes duration and easing values to ensure absolute consistency across CSS and Framer Motion.

export const MOTION_TIMINGS = {
  hover: 180,    // 180ms
  button: 180,   // 180ms
  card: 200,     // 200ms
  drawer: 220,   // 220ms
  dialog: 220,   // 220ms
  toast: 180,    // 180ms
};

// Premium Easing Curve: cubic-bezier(0.16, 1, 0.3, 1) [out-expo]
export const EASING_CURVE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Standard Framer Motion Transition configurations
export const TRANSITIONS = {
  hover: {
    duration: MOTION_TIMINGS.hover / 1000,
    ease: EASING_CURVE,
  },
  button: {
    duration: MOTION_TIMINGS.button / 1000,
    ease: EASING_CURVE,
  },
  card: {
    duration: MOTION_TIMINGS.card / 1000,
    ease: EASING_CURVE,
  },
  drawer: {
    duration: MOTION_TIMINGS.drawer / 1000,
    ease: EASING_CURVE,
  },
  dialog: {
    duration: MOTION_TIMINGS.dialog / 1000,
    ease: EASING_CURVE,
  },
  toast: {
    duration: MOTION_TIMINGS.toast / 1000,
    ease: EASING_CURVE,
  },
};
