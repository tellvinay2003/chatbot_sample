import { Message, Agent } from '../types/agent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;
  private isAvailable: boolean = false;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.checkConnection();
  }

  private async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      this.isAvailable = response.ok;
      console.log(`🔗 API Status: ${this.isAvailable ? 'Connected to Real LangChain+LangGraph API' : 'API Unavailable'}`);
    } catch (error) {
      this.isAvailable = false;
      console.log('🔗 API Status: Unavailable - Please start the Python backend');
    }
  }

  async sendMessage(message: string, userId: string): Promise<Message> {
    if (!this.isAvailable) {
      await this.checkConnection();
      
      if (!this.isAvailable) {
        throw new Error('API is not available. Please start the Python backend with: cd API && python run.py');
      }
    }

    try {
      console.log('🚀 Sending message to LangChain+LangGraph API...');
      
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          user_id: userId
        })
      });

      if (!response.ok) {
        console.error('❌ API request failed:', response.status, response.statusText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        ...data.message,
        timestamp: new Date(data.message.timestamp)
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message to API'
      );
    }
  }

  async getAgents(): Promise<Agent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/agents`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`);
      }
      const data = await response.json();
      return data.success ? data.data.agents : [];
    } catch (error) {
      console.error('❌ Failed to fetch agents:', error);
      return [];
    }
  }

  getConnectionStatus(): boolean {
    return this.isAvailable;
  }
}

export const apiService = new ApiService();