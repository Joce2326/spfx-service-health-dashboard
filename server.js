require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ConfidentialClientApplication } = require('@azure/msal-node');
require('isomorphic-fetch');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET
    }
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getAccessToken()
{
    const clientCredentialRequest = {
        scopes: ['https://graph.microsoft.com/.default']
    };

    const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);

    if (!response || !response.accessToken)
    {
        throw new Error('Could not acquire access token.');
    }

    return response.accessToken;
}

async function getGraphClient()
{
    const accessToken = await getAccessToken();

    return Client.init({
        authProvider: (done) =>
        {
            done(null, accessToken);
        }
    });
}

app.get('/health', async (req, res) =>
{
    try
    {
        const graphClient = await getGraphClient();

        const result = await graphClient
            .api('/admin/serviceAnnouncement/healthOverviews')
            .version('v1.0')
            .get();

        const services = result.value.map(item => ({
            id: item.id,
            service: item.service,
            status: item.status
        }));

        const summary = {
            total: services.length,
            operational: services.filter(s => s.status === 'serviceOperational').length,
            degraded: services.filter(s => s.status === 'serviceDegradation').length,
            others: services.filter(
                s => !['serviceOperational', 'serviceDegradation'].includes(s.status)
            ).length
        };

        res.json({
            summary,
            services
        });
    } catch (error)
    {
        console.error('Error calling Microsoft Graph:', error);
        res.status(500).json({
            error: 'Failed to retrieve service health data',
            details: error.message
        });
    }
});

app.get('/health/:id/issues', async (req, res) =>
{
    console.log('Issues route hit for:', req.params.id);

    try
    {
        const graphClient = await getGraphClient();

        const issuesResponse = await graphClient
            .api('/admin/serviceAnnouncement/issues')
            .version('v1.0')
            .get();

        const matchingIssues = (issuesResponse.value || [])
            .filter(issue =>
                Array.isArray(issue.service)
                    ? issue.service.some(serviceId => serviceId.toLowerCase() === req.params.id.toLowerCase())
                    : false
            )
            .map(issue => ({
                id: issue.id,
                title: issue.title,
                classification: issue.classification,
                status: issue.status,
                feature: issue.feature,
                impactDescription: issue.impactDescription,
                startDateTime: issue.startDateTime,
                endDateTime: issue.endDateTime,
                origin: issue.origin
            }));

        res.json({
            serviceId: req.params.id,
            totalIssues: matchingIssues.length,
            issues: matchingIssues
        });
    } catch (error)
    {
        console.error('Error retrieving service issues:', error);
        res.status(500).json({
            error: 'Failed to retrieve service issues',
            details: error.message
        });
    }
});

app.get('/health/messages', async (req, res) => {
  try {
    const graphClient = await getGraphClient();

    const response = await graphClient
      .api('/admin/serviceAnnouncement/messages')
      .version('v1.0')
      .get();

    const messages = (response.value || []).map(msg => ({
      id: msg.id,
      title: msg.title,
      category: msg.category,
      severity: msg.severity,
      createdDateTime: msg.createdDateTime,
      lastModifiedDateTime: msg.lastModifiedDateTime,
      actionRequiredByDateTime: msg.actionRequiredByDateTime
    }));

    res.json({
      total: messages.length,
      messages
    });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({
      error: 'Failed to retrieve messages',
      details: error.message
    });
  }
});

app.get('/health/:id', async (req, res) => {
  try {
    const graphClient = await getGraphClient();

    const result = await graphClient
      .api('/admin/serviceAnnouncement/healthOverviews')
      .version('v1.0')
      .get();

    const service = result.value.find(
      item => item.id.toLowerCase() === req.params.id.toLowerCase()
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({
      id: service.id,
      service: service.service,
      status: service.status
    });
  } catch (error) {
    console.error('Error calling Microsoft Graph:', error);
    res.status(500).json({
      error: 'Failed to retrieve service health data',
      details: error.message
    });
  }
});

app.listen(port, () =>
{
    console.log(`API running on http://localhost:${port}`);
});