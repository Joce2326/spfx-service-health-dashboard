import { ServiceHealthItem } from '../models/ServiceHealthItem';

export const mockServiceHealth: ServiceHealthItem[] = [
    {
        id: '1',
        service: 'Exchange Online',
        status: 'healthy',
        issue: 'No issues reported.',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '2',
        service: 'Microsoft Teams',
        status: 'incident',
        issue: 'Users may experience delays when sending messages.',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '3',
        service: 'SharePoint Online',
        status: 'serviceDegradation',
        issue: 'Some users may experience slow page loads.',
        lastUpdated: new Date().toISOString()
    }
];