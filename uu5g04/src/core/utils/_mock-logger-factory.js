// TODO Revert commit where this file was introduced, when dockit is no longer forced to using uu5g05@0.x.

const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4, // not used in uu5g05, but it's here for consistent numbering & recognition in case uu5App sets it for uu_appg01 component
  UNKNOWN: 5,
  OFF: 6,
};

let logLevel = LEVELS[process.env.NODE_ENV === "production" ? "ERROR" : "WARN"];

const LoggerFactory = {
  get: (name) => Logger,
  init: () => {},
};

const Logger = {
  getName: () => "console",
  setLevel: (newLevel) => {
    let usedLevel = typeof newLevel === "string" ? LEVELS[newLevel.toUpperCase()] : undefined;
    if (usedLevel === undefined) usedLevel = Number(newLevel);
    if (!isNaN(usedLevel)) {
      logLevel = usedLevel;
    }
  },
  getLevel: () => logLevel,

  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  isDebugLoggable: () => logLevel <= LEVELS.DEBUG,
  isInfoLoggable: () => logLevel <= LEVELS.INFO,
  isWarnLoggable: () => logLevel <= LEVELS.WARN,
  isErrorLoggable: () => logLevel <= LEVELS.ERROR,

  // to be used only during development
  log: (...args) => {
    if (process.env.NODE_ENV === "production" || logLevel > LEVELS.UNKNOWN) return;
    console.log(...args);
  },
};

export { LoggerFactory };
