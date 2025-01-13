// state-manager.ts
import type { Message, ChatState } from './types/types';

export class StateManager {
  private state: ChatState;
  private listeners: Set<(state: ChatState) => void>;

  constructor(initialState?: ChatState) {
    this.state = initialState || {
      isOpen: false,
      isExpanded: false,
      isInitialized: false,
      isSending: false,
      messages: [],
      error: undefined
    };
    this.listeners = new Set();
  }
  

  public getState(): ChatState {
    return { ...this.state };
  }

  public subscribe(listener: (state: ChatState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setState(newState: Partial<ChatState>): void {
    const prevState = this.state;
    this.state = {
      ...this.state,
      ...newState
    };


    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      this.notifyListeners();
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // State update methods
  public toggleChat(): void {
    this.setState({ isOpen: !this.state.isOpen });
  }

  public toggleExpand(): void {
    this.setState({ isExpanded: !this.state.isExpanded });
  }
  public setOpen(open: boolean): void {
    this.setState({ isOpen: open });
  }

  public setInitialized(initialized: boolean): void {
    this.setState({ isInitialized: initialized });
  }

  public setSending(sending: boolean): void {
    this.setState({ isSending: sending });
  }

  public addMessage(message: Message): void {
    this.setState({
      messages: [...this.state.messages, message]
    });
  }

  public setError(error?: string): void {
    this.setState({ error });
  }

  public clearMessages(): void {
    this.setState({ messages: [] });
  }

  public updateMessage(messageId: string, updates: Partial<Message>): void {
    const updatedMessages = this.state.messages.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    );
    this.setState({ messages: updatedMessages });
  }

  public deleteMessage(messageId: string): void {
    const updatedMessages = this.state.messages.filter(msg => msg.id !== messageId);
    this.setState({ messages: updatedMessages });
  }

  // Helper methods
  public getMessageById(messageId: string): Message | undefined {
    return this.state.messages.find(msg => msg.id === messageId);
  }

  public getLastMessage(): Message | undefined {
    return this.state.messages[this.state.messages.length - 1];
  }

  public getMessageCount(): number {
    return this.state.messages.length;
  }

  public clearListeners(): void {
    this.listeners.clear();
  }
}