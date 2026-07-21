import { Timeline } from './models';
import { ICommand } from './commands';
import { TimelineValidator } from './validator';
import pino from 'pino';

const logger = pino({ name: 'timeline-history' });

export class TimelineHistoryManager {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];

  constructor(private timeline: Timeline) {}

  /**
   * Executes a command on the active timeline and saves it to the undo history.
   * Clears the redo stack.
   */
  execute(command: ICommand): void {
    command.execute(this.timeline);
    
    // Attempt validation after execution. If invalid, automatically undo and throw.
    try {
      TimelineValidator.validate(this.timeline);
    } catch (error) {
      command.undo(this.timeline);
      logger.error('Command validation failed, reverted changes.');
      throw error;
    }

    this.undoStack.push(command);
    this.redoStack = []; // Clear redo stack on new action
  }

  /**
   * Undoes the last executed command.
   */
  undo(): boolean {
    const command = this.undoStack.pop();
    if (!command) {
      logger.debug('Undo stack is empty');
      return false;
    }

    command.undo(this.timeline);
    // Assuming undo puts it back to a valid state, but let's double check
    TimelineValidator.validate(this.timeline);

    this.redoStack.push(command);
    return true;
  }

  /**
   * Redoes the last undone command.
   */
  redo(): boolean {
    const command = this.redoStack.pop();
    if (!command) {
      logger.debug('Redo stack is empty');
      return false;
    }

    command.execute(this.timeline);
    TimelineValidator.validate(this.timeline);

    this.undoStack.push(command);
    return true;
  }

  getUndoCount(): number {
    return this.undoStack.length;
  }

  getRedoCount(): number {
    return this.redoStack.length;
  }
}
