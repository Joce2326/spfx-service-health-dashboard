
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowClockwise24Regular,
  CheckmarkCircle20Filled,
  ErrorCircle20Filled} from '@fluentui/react-icons';
import {

  Button,

  CardHeader,
  Input,
  Spinner,
  Switch,
  Text,
  Title1,
  makeStyles,
  mergeClasses
} from '@fluentui/react-components';

import { api } from '../services/api';

type ServiceHealthItem = {
  id: string;
  service: string;
  status: string;
};

type HealthSummary = {
  total: number;
  operational: number;
  degraded: number;
  others: number;
};

type ServiceIssue = {
  id: string;
  title?: string;
  classification?: string;
  status?: string;
  feature?: string;
  impactDescription?: string;
  startDateTime?: string;
  endDateTime?: string | null;
  origin?: string;
};



type MessageItem = {
  id: string;
  title?: string;
  category?: string;
  severity?: string;
  createdDateTime?: string;
};

const useStyles = makeStyles({

    detailsHeader: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px'
},

detailsTitle: {
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '20px'
},

detailsMeta: {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginTop: '12px'
},

metaPill: {
  backgroundColor: '#f3f2f1',
  border: '1px solid #d1d1d1',
  borderRadius: '999px',
  padding: '4px 10px',
  fontSize: '12px',
  color: '#323130'
},

selectedServiceGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  marginTop: '16px',
  marginBottom: '16px'
},

selectedServiceItem: {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
},

selectedLabel: {
  fontSize: '12px',
  color: '#605e5c'
},

selectedValue: {
  fontSize: '16px',
  fontWeight: 600
},

    sectionHeader: {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  marginBottom: '10px'
},

sectionTitleText: {
  fontSize: '16px',
  fontWeight: 600,
  color: '#242424'
},

sectionSubtitle: {
  fontSize: '12px',
  color: '#605e5c'
},

  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
   padding: '24px',
backgroundColor: '#f5f4f2',
minHeight: '100vh'

  },
  pageTitle: {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
},
  headerRow: {
     display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  padding: '18px 24px',
  backgroundColor: '#fbfaf8',
  border: '1px solid #e6e2dc',
  borderRadius: '14px',
  boxShadow: '0 1px 3px rgba(0,0,0,.04)',
  marginBottom: '12px'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px'
  },
cardList: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '10px'
},
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  searchBox: {
  minWidth: '260px'
},

clickableCard: {
  cursor: 'pointer'
},
selectedCard: {
  border: 'none',
  boxShadow:'0 0 0 2px rgba(15,108,189,.20)'
},
detailsCard: {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '12px'
},

sectionTitle: {
  marginTop: '12px'
},

messageTitleCell: {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
},
filtersRow: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap'
},
pillCell: {
  display: 'flex',
  alignItems: 'center'
},
kpiCard: {
  padding: '20px',
  borderRadius: '14px',
  border: '1px solid #e6e2dc',
  backgroundColor: '#f8f7f5',
  boxShadow: '0 1px 2px rgba(0,0,0,.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
},

dashboardSection: {
  marginTop: '20px'
},
serviceCard: {
  padding:'12px 14px',
  minHeight:'74px',
  background:'#fbfaf8',
  border:'1px solid #e6e2dc',
  borderRadius:'12px',

  boxShadow:
    '0 1px 2px rgba(0,0,0,.03), 0 4px 12px rgba(0,0,0,.025)',

  transition:'all .15s ease',

  ':hover':{
    transform:'translateY(-1px)',
    boxShadow:
     '0 3px 10px rgba(0,0,0,.06)'
  }
},

panelCard: {
 backgroundColor:'#fbfaf8',
 border:'1px solid #e6e2dc',
 borderLeft:'3px solid #d6d0c8',
 boxShadow:'0 2px 6px rgba(0,0,0,.04)',
 borderRadius:'14px'
},

messageBadgeRow: {
  display: 'flex',
  gap: '8px',
  marginTop: '8px'
},
kpiDanger: {
  backgroundColor: '#fff1f0',
  border: '1px solid #f1c6c4'
},
kpiSuccess: {
  backgroundColor: '#eef7ee',
  border: '1px solid #d6ead6'
},
emptyState: {
  padding: '16px',
  backgroundColor: '#fafafa',
  border: '1px dashed #c8c8c8',
  borderRadius: '8px'
},
serviceOperational: {
 borderLeft:'3px solid #c8d8cb',
 backgroundColor:'#fbfcfa'
},
serviceDegraded: {
 borderLeft:'3px solid #e39a9c',
 backgroundColor:'#fff9f8'
},
serviceMeta: {
  color: '#8a8886',
  fontSize: '12px',
  marginTop: '8px'
},
messageTitle: {
  lineHeight: '20px'
},
toolbarCard: {
  padding: '12px',
  borderRadius: '10px'
},

messageMetaRow: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '20px',
  flexWrap: 'wrap',
  marginTop: '12px'
},

messageDate: {
  marginTop: '8px',
  color: '#605e5c'
},
messageList: {
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid #e5e5e5'
},

closeButton: {
  borderRadius: '20px',
  border: '1px solid #d1d1d1',
  backgroundColor: '#ffffff',
  padding: '6px 14px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#323130',
  cursor: 'pointer',
  boxShadow: '0 1px 2px rgba(0,0,0,.04)',

  ':hover': {
    backgroundColor: '#f5f5f5',
    //borderColor: '#b3b3b3'
  }
},

messageRow: {
  display: 'grid',
  gridTemplateColumns:
'1.4fr 3fr 100px 140px 100px',
  gap: '12px',
  alignItems: 'center',
  padding: '10px 12px',
  borderBottom: '1px solid #e5e5e5',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: '#f5f9ff',
    ':nth-child(even)': {
 backgroundColor:'#fafafa'
},
  }
},

messageRowHeader: {
  display: 'grid',
  gridTemplateColumns:
'1.4fr 3fr 100px 140px 100px',
  gap: '12px',
  padding: '10px 12px',
  fontWeight: 600,
  color: '#605e5c',
  borderBottom: '1px solid #d1d1d1'
},

kpiNeutral: {
  backgroundColor: '#f3f6fa',
  border: '1px solid #dde6f0'
},

serviceCell: {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
},

messageIcon: {
  display: 'flex',
  alignItems: 'center',
  color: '#0078d4'
},

messageTitleCompact: {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
},

messageAction: {
  justifySelf: 'end'
},
actionButton: {
  color: '#0078d4',
  fontWeight: 600,
  minWidth: '60px'
},

statusPill: {
  padding: '3px 10px',
  borderRadius: '999px',
  fontWeight: 600,
  border: 'none'
},

categoryPill: {
  padding: '3px 10px',
  borderRadius: '999px',
  fontWeight: 600,
  border: 'none'
},

serviceIconWrap: {
  display: 'flex',
  alignItems: 'center',
  color: '#0078d4'
},

servicePanelHeader: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
},
severityPill: {
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 600,
  lineHeight: '16px',
  minWidth: '52px',
  justifyContent: 'center',
  border: 'none'
},

/*categoryPill: {
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 600,
  lineHeight: '16px',
  minWidth: '86px',
  justifyContent: 'center',
  border: 'none'
},*/


appIcon: {
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '10px',
  fontWeight: 700,
  flexShrink: 0
},

teamsIcon: {
  backgroundColor: '#6264a7'
},

exchangeIcon: {
  backgroundColor: '#0078d4'
},

purviewIcon: {
  backgroundColor: '#038387'
},

copilotIcon: {
  backgroundColor: '#742774'
},

defaultAppIcon: {
  backgroundColor: '#605e5c'
},

serviceNameCell: {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0
},
buttonRow: {
 display: 'flex',
 justifyContent: 'flex-end',
 marginTop: '20px',
 paddingTop: '12px',
 borderTop: '1px solid #f0f0f0'
},
serviceSummaryGrid: {
  display:'grid',
  gridTemplateColumns:'repeat(3,minmax(180px,1fr))',
  gap:'18px',
  marginTop:'18px',
  marginBottom:'20px'
},

summaryBlock: {
  display:'flex',
  flexDirection:'column',
  gap:'4px'
},

summaryLabel: {
  fontSize:'12px',
  color:'#605e5c'
},

summaryValue: {
  fontSize:'16px',
  fontWeight:600
},

});



const formatStatus = (status: string) => {
  switch (status) {
    case 'serviceOperational':
      return 'Operational';
    case 'serviceDegradation':
      return 'Degraded';
    default:
      return status;
  }
};

 

const formatCategory = (category?: string) => {
  switch (category) {
    case 'stayInformed':
      return 'Stay informed';
    case 'planForChange':
      return 'Plan for change';
    case 'preventOrFixIssue':
      return 'Prevent or fix issue';
    default:
      return category || 'N/A';
  }
};



export const ServiceHealth = () => {
  const styles = useStyles();

  const [services, setServices] = useState<ServiceHealthItem[]>([]);
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showDegradedOnly, setShowDegradedOnly] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>('');

  const [selectedService, setSelectedService] = useState<ServiceHealthItem | null>(null);
const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
const [detailsError, setDetailsError] = useState<string>('');



const [messages, setMessages] = useState<MessageItem[]>([]);
const [messagesLoading, setMessagesLoading] = useState(false);
const [messagesError, setMessagesError] = useState('');

const [serviceIssues, setServiceIssues] = useState<ServiceIssue[]>([]);
const [issuesLoading, setIssuesLoading] = useState<boolean>(false);
const [issuesError, setIssuesError] = useState<string>('');

const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const loadData = async (isRefresh = false) => {
  try {
    setError('');

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const response = await api.get('/health');
    console.log('API response:', response.data);

    if (Array.isArray(response.data)) {
      setServices(response.data);
      setSummary({
        total: response.data.length,
        operational: response.data.filter((s: any) => s.status === 'serviceOperational').length,
        degraded: response.data.filter((s: any) => s.status === 'serviceDegradation').length,
        others: response.data.filter(
          (s: any) => !['serviceOperational', 'serviceDegradation'].includes(s.status)
        ).length
      });
    } else {
      setServices(response.data.services || []);
      setSummary(response.data.summary || null);
    }
  } catch (err) {
    console.error('API error full object:', err);
    setError('Failed to load service health data.');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

const loadServiceDetails = async (serviceId: string) => {
  try {
    setDetailsError('');
    setIssuesError('');
    setDetailsLoading(true);
    setIssuesLoading(true);

    const [serviceResponse, issuesResponse] = await Promise.all([
      api.get<ServiceHealthItem>(`/health/${serviceId}`),
      api.get<{ serviceId: string; totalIssues: number; issues: ServiceIssue[] }>(
        `/health/${serviceId}/issues`
      )
    ]);

    setSelectedService(serviceResponse.data);
    setServiceIssues(issuesResponse.data.issues || []);
  } catch (err) {
    console.error('Details API error:', err);
    setDetailsError('Failed to load service details.');
    setIssuesError('Failed to load service issues.');
    setSelectedService(null);
    setServiceIssues([]);
  } finally {
    setDetailsLoading(false);
    setIssuesLoading(false);
  }
};

const loadMessages = async () => {
  try {
    setMessagesLoading(true);
    setMessagesError('');

    const res = await api.get('/health/messages');
    setMessages((res.data.messages || []).slice(0, 10));
  } catch (err) {
    console.error('Messages API error:', err);
    setMessagesError('Failed to load messages.');
  } finally {
    setMessagesLoading(false);
  }
};

  useEffect(() => {
    void loadData();
    void loadMessages();
  }, []);

  const openMessageDetails = (message: MessageItem) => {
  setSelectedMessage(message);
};

const filteredServices = useMemo(() => {
  let result = [...services];

  if (showDegradedOnly) {
    result = result.filter(item => item.status === 'serviceDegradation');
  }

  if (searchText.trim()) {
    const term = searchText.toLowerCase();

    result = result.filter(
      item =>
        (item.service || '').toLowerCase().includes(term) ||
(item.id || '').toLowerCase().includes(term)
    );
  }

  result.sort((a, b) => {
    if (a.status === 'serviceDegradation' && b.status !== 'serviceDegradation') {
      return -1;
    }

    if (a.status !== 'serviceDegradation' && b.status === 'serviceDegradation') {
      return 1;
    }

    return (a.service || '').localeCompare(b.service || '');
  });

  return result;
}, [services, showDegradedOnly, searchText]);

  if (loading) {
    return <Spinner label="Loading service health..." />;
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.pageTitle}>
 <div>
  <Text
    style={{
      fontSize:'22px',
      fontWeight:600
    }}
  >
    Service Health Dashboard
  </Text>

  <Text
    style={{
      color:'#605e5c',
      fontSize:'12px'
    }}
  >
    Microsoft 365 health overview
  </Text>
</div>
  <Text size={300}>Microsoft 365 health, incidents, and message center updates</Text>
</div>
        <Text>{error}</Text>
        <Button appearance="primary" onClick={() => void loadData()}>
  Try again
</Button>
      </div>
    );
  }

const getAppIconClass = (title?: string) => {
  const value = (title || '').toLowerCase();

  if (value.includes('teams')) {
    return 'teams';
  }

  if (value.includes('exchange')) {
    return 'exchange';
  }

  if (value.includes('purview')) {
    return 'purview';
  }

  if (value.includes('copilot')) {
    return 'copilot';
  }

  return 'default';
};

const getAppIconLabel = (title?: string) => {
  const value = (title || '').toLowerCase();

  if (value.includes('teams')) return 'T';
  if (value.includes('exchange')) return 'E';
  if (value.includes('purview')) return 'P';
  if (value.includes('copilot')) return 'C';

  return 'M';
};

return (
<div className={styles.page}>

{/* HEADER */}
<div className={styles.headerRow}>
<Title1>Service Health Dashboard</Title1>

<div className={styles.controls}>
<Input
placeholder="Search by service name or id"
value={searchText}
onChange={(_, data) => setSearchText(data.value)}
/>

<Switch
checked={showDegradedOnly}
label="Show degraded only"
onChange={(_, data) => setShowDegradedOnly(data.checked)}
/>

<Button
appearance="primary"
icon={<ArrowClockwise24Regular />}
onClick={() => void loadData(true)}
disabled={refreshing}
>
{refreshing ? 'Refreshing...' : 'Refresh'}
</Button>
</div>
</div>


{/* KPI CARDS */}
{summary && (
<div className={styles.summaryGrid}>

<div className={mergeClasses(styles.kpiCard, styles.kpiNeutral)}>
<Text size={300}>Total Services</Text>
<Text size={800} weight="bold">{summary.total}</Text>
</div>

<div className={mergeClasses(styles.kpiCard, styles.kpiSuccess)}>
<Text size={300}>Operational</Text>
<Text size={800} weight="bold">
{summary.operational}
</Text>
</div>

<div className={mergeClasses(styles.kpiCard, styles.kpiDanger)}>
<Text size={300}>Degraded</Text>
<Text size={800} weight="bold">
{summary.degraded}
</Text>
</div>

<div className={styles.kpiCard}>
<Text size={300}>Other Statuses</Text>
<Text size={800} weight="bold">
{summary.others}
</Text>
</div>

</div>
)}


{detailsLoading && <Text>Loading service details...</Text>}
{detailsError && <Text>{detailsError}</Text>}


{/* MESSAGE DETAILS */}
{selectedMessage && (
  <div className={styles.panelCard}>
    <div className={styles.detailsHeader}>
      <div>
        <Text className={styles.detailsTitle}>
          Message Details
        </Text>

        <Text>
          {selectedMessage.title}
        </Text>

        <div
 style={{
   display:'flex',
   gap:'10px',
   flexWrap:'wrap',
   marginTop:'14px'
 }}
>

<span
 style={{
   background:'#f6f8f5',
   border:'1px solid #d7dfd2',
   color:'#2f3b2f',
   padding:'5px 12px',
   borderRadius:'18px',
   fontSize:'12px',
   fontWeight:500
 }}
>
 Category • {formatCategory(selectedMessage.category)}
</span>

<span
 style={{
   background:'#eef3f8',
   border:'1px solid #d9e2ec',
   color:'#334155',
   padding:'5px 12px',
   borderRadius:'18px',
   fontSize:'12px',
   fontWeight:500
 }}
>
 Severity • {selectedMessage.severity || 'Normal'}
</span>

<span
 style={{
   background:'#f7f6f4',
   border:'1px solid #ddd8d2',
   color:'#605e5c',
   padding:'5px 12px',
   borderRadius:'18px',
   fontSize:'12px',
   fontWeight:500
 }}
>
 Modified • {
   selectedMessage.createdDateTime
   ? new Date(
       selectedMessage.createdDateTime
     ).toLocaleDateString()
   : 'N/A'
 }
</span>

</div>
      </div>
<Button
 appearance="subtle"
 onClick={() => setSelectedMessage(null)}
 style={{
   background:'#f5f5f2',
   border:'1px solid #d8d6d1',
   color:'#323130',
   padding:'6px 16px',
   borderRadius:'18px',
   fontWeight:600,
   boxShadow:'0 1px 2px rgba(0,0,0,.05)'
 }}
>
 ✕ Dismiss
</Button>
      
    </div>
  </div>
)}


{/* MESSAGE CENTER */}
<div className={styles.panelCard}>

<div className={styles.sectionHeader}>
  <Text className={styles.sectionTitleText}>
    Service Announcement Messages
  </Text>

  <Text className={styles.sectionSubtitle}>
    Showing {messages.length} recent posts
  </Text>
</div>

{messagesLoading && <Text>Loading messages...</Text>}
{messagesError && <Text>{messagesError}</Text>}

{!messagesLoading &&
!messagesError &&
messages.length > 0 && (

<div className={styles.messageList}>

<div className={styles.messageRowHeader}>
<Text>Service</Text>
<Text>Title</Text>
<Text>Severity</Text>
<Text>Category</Text>
<Text>Action</Text>
</div>

{messages.map(msg => (

<div
key={msg.id}
className={styles.messageRow}
>

<div className={styles.serviceNameCell}>

<span
className={mergeClasses(
styles.appIcon,
getAppIconClass(msg.title)==='teams' &&
styles.teamsIcon,
getAppIconClass(msg.title)==='exchange' &&
styles.exchangeIcon,
getAppIconClass(msg.title)==='purview' &&
styles.purviewIcon,
getAppIconClass(msg.title)==='copilot' &&
styles.copilotIcon,
getAppIconClass(msg.title)==='default' &&
styles.defaultAppIcon
)}
>
{getAppIconLabel(msg.title)}
</span>

<Text size={200}>
{msg.title?.includes('Teams')
? 'Microsoft Teams'
: msg.title?.includes('Purview')
? 'Microsoft Purview'
: msg.title?.includes('Exchange')
? 'Exchange Online'
: 'Microsoft 365'}
</Text>

</div>


<Text className={styles.messageTitleCompact}>
{msg.title}
</Text>

<span
  style={{
    background: '#eef3f8',
    color: '#323130',
    border: '1px solid #d9e2ec',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    display: 'inline-flex',
    justifyContent: 'center',
    minWidth: '72px'
  }}
>
  Normal
</span>





<span
  style={{
    background: msg.category === 'planForChange' ? '#fff4ce' : '#f3f2f1',
    color: '#323130',
    border: msg.category === 'planForChange'
      ? '1px solid #f2c94c'
      : '1px solid #d1d1d1',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    display: 'inline-flex',
    justifyContent: 'center',
    minWidth: '110px'
  }}
>
  {formatCategory(msg.category)}
</span>



<div
 onClick={() => openMessageDetails(msg)}
 style={{
   display:'inline-flex',
   alignItems:'center',
   justifyContent:'center',
   minWidth:'72px',

   background:'#f7f6f4',
   border:'1px solid #ddd8d2',

   color:'#323130',
   padding:'5px 12px',
   borderRadius:'20px',

   fontSize:'12px',
   fontWeight:600,

   boxShadow:'0 1px 2px rgba(0,0,0,.04)',
   cursor:'pointer'
 }}
>
 View
</div>

</div>

))}

</div>
)}

</div>


{/* SELECTED SERVICE DETAILS */}
{selectedService && !detailsLoading && (
  <div className={styles.panelCard}>
    <div className={styles.servicePanelHeader}>
      <Text weight="semibold" size={500}>
        Selected Service
      </Text>

<span
 style={{
   background:'#f6f8f5',
   border:'1px solid #d7dfd2',

   color:'#2f3b2f',

   padding:'4px 10px',
   borderRadius:'18px',

   fontSize:'11px',
   fontWeight:600,

   display:'inline-flex',
   alignItems:'center',
   gap:'5px',

   boxShadow:'0 1px 2px rgba(0,0,0,.03)'
 }}
>
 <CheckmarkCircle20Filled />
 Operational
</span>
    </div>

    <div className={styles.selectedServiceGrid}>
      <div className={styles.selectedServiceItem}>
        <Text className={styles.selectedLabel}>Service</Text>
        <Text className={styles.selectedValue}>{selectedService.service}</Text>
      </div>

      <div className={styles.selectedServiceItem}>
        <Text className={styles.selectedLabel}>Status</Text>
        <Text className={styles.selectedValue}>
          {formatStatus(selectedService.status)}
        </Text>
      </div>

      <div className={styles.selectedServiceItem}>
        <Text className={styles.selectedLabel}>Service ID</Text>
        <Text className={styles.selectedValue}>{selectedService.id}</Text>
      </div>
    </div>

    <Text weight="semibold">Related Issues</Text>

    {issuesLoading && <Text>Loading service issues...</Text>}
    {issuesError && <Text>{issuesError}</Text>}

    {!issuesLoading && !issuesError && (
      serviceIssues.length === 0 ? (
        <div className={styles.emptyState}>
          <Text>No active issues found for this service.</Text>
        </div>
      ) : (
        serviceIssues.map(issue => (
          <div key={issue.id} className={styles.detailsCard}>
            <Text weight="semibold">{issue.title || 'Untitled issue'}</Text>
            <Text>Status: {issue.status || 'Unknown'}</Text>
            <Text>Classification: {issue.classification || 'Unknown'}</Text>
            <Text>Feature: {issue.feature || 'N/A'}</Text>
            <Text>Impact: {issue.impactDescription || 'No description provided.'}</Text>
          </div>
        ))
      )
    )}

    <div className={styles.buttonRow}>
     <Button
 appearance="subtle"
 onClick={() => setSelectedService(null)}
 style={{
   background:'#eef3ee',
   border:'1px solid #cfd8cf',
   color:'#2f4f3e',
   padding:'7px 18px',
   borderRadius:'18px',
   fontWeight:600,
   boxShadow:'0 1px 2px rgba(0,0,0,.05)'
 }}
>
 ← Close Details
</Button>
    </div>
  </div>
)}


{/* SERVICE CARDS */}
<div className={styles.cardList}>

{filteredServices.map(item => (

<div
key={item.id}
className={mergeClasses(
styles.serviceCard,
item.status === 'serviceOperational' &&
styles.serviceOperational,
item.status === 'serviceDegradation' &&
styles.serviceDegraded,
selectedService?.id === item.id &&
styles.selectedCard
)}
onClick={() =>
void loadServiceDetails(item.id)
}
>

<CardHeader
header={
<Text size={100} weight="semibold">
{item.service}
</Text>
}

description={
item.status === 'serviceOperational'
? (
<span
style={{
background:'#f3f2f1',
color:'#323130',
border:'1px solid #d1d1d1',
padding:'2px 8px',
borderRadius:'999px',
fontSize:'11px',
fontWeight:600,
display:'inline-flex',
alignItems:'center',
gap:'5px',
width:'fit-content'
}}
>
<CheckmarkCircle20Filled />
Operational
</span>
)
: (
<span
 style={{
   background:'#fcf4f4',
   border:'1px solid #e8c8c8',

   color:'#8a2d2f',

   padding:'4px 10px',
   borderRadius:'18px',

   fontSize:'11px',
   fontWeight:600,

   display:'inline-flex',
   alignItems:'center',
   gap:'5px',

   boxShadow:'0 1px 2px rgba(0,0,0,.03)'
 }}
>
 <ErrorCircle20Filled />
 Degraded
</span>
)
}
/>

<Text
size={200}
className={styles.serviceMeta}
>
Last checked just now
</Text>

</div>

))}

</div>

</div>
);
  
  
}