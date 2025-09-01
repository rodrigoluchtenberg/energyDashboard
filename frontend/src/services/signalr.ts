import * as signalR from '@microsoft/signalr';
import { ConsumoRealtime, Estatisticas } from '../types';

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private readonly hubUrl: string;

  constructor() {
    this.hubUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5010') + '/energyhub';
  }

  public async startConnection(): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
    } catch (err) {
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
    }
  }

  public onEnergyDataReceived(callback: (data: ConsumoRealtime[]) => void): void {
    if (this.connection) {
      this.connection.on('ReceiveEnergyData', callback);
    }
  }

  public onStatisticsReceived(callback: (data: Estatisticas) => void): void {
    if (this.connection) {
      this.connection.on('ReceiveStatistics', callback);
    }
  }

  public offEnergyDataReceived(): void {
    if (this.connection) {
      this.connection.off('ReceiveEnergyData');
    }
  }

  public offStatisticsReceived(): void {
    if (this.connection) {
      this.connection.off('ReceiveStatistics');
    }
  }

  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection ? this.connection.state : null;
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();