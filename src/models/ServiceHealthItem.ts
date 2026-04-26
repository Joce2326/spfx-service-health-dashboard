export interface ServiceHealthItem {
    id: string;
    service: string;
    status: 'healthy' | 'serviceDegradation' | 'restoringService' | 'investigating' | 'incident';
    issue: string;
    lastUpdated: string;
}