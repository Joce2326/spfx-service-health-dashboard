import { ServiceHealthItem } from '../models/ServiceHealthItem';
import { mockServiceHealth } from '../data/mockServiceHealth';

export class ServiceHealthService {
    public async getServiceHealth(): Promise<ServiceHealthItem[]> {
        return mockServiceHealth;
    }
}