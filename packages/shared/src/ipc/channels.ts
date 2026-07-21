export const IpcChannels = {
  SYSTEM: {
    PING: 'system.ping',
    HEALTH: 'system.health',
  },
  PROJECT: {
    OPEN: 'project.open',
    SAVE: 'project.save',
  },
  RENDER: {
    START: 'render.start',
    PROGRESS: 'render.progress', // Used for Main -> Renderer events
  }
} as const;

export type IpcChannel = 
  | typeof IpcChannels.SYSTEM.PING
  | typeof IpcChannels.SYSTEM.HEALTH
  | typeof IpcChannels.PROJECT.OPEN
  | typeof IpcChannels.PROJECT.SAVE
  | typeof IpcChannels.RENDER.START
  | typeof IpcChannels.RENDER.PROGRESS;
