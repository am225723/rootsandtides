# Therapist Connection Features - Design Document

## Overview
The Therapist Connection feature enables users to securely share their app data with therapists, counselors, or support workers, creating a bridge between self-guided grief support and professional care.

## Objectives

1. **Bridging Self-Guided & Professional Support**
   - Enable therapists to see client progress between sessions
   - Provide insights into daily patterns and emotional states
   - Facilitate more informed therapy sessions

2. **Secure Data Sharing**
   - User-controlled access with explicit consent
   - Privacy-first design with secure encryption
   - Easy revocation of access at any time

3. **Professional Insights**
   - Progress tracking and trend analysis
   - Mood patterns and triggers identification
   - Engagement metrics across different features

---

## User Stories

### As a User (Grieving Individual)
- I want to share my progress with my therapist so they can better understand my journey
- I want to control what data I share and with whom
- I want to easily revoke access if I change my mind
- I want to prepare reports before therapy sessions
- I want to export my data as PDF to show my therapist

### As a Therapist
- I want to see my client's mood history and patterns
- I want to understand which exercises and tools my client uses
- I want to track progress between sessions
- I want to see journal entries my client wants to share
- I want to receive updates when significant events occur

---

## Core Features

### 1. Therapist Invitation System

#### User Side: Invite a Therapist
**Location:** ProfileScreen → Settings → Therapist Connections

**UI Components:**
```tsx
interface TherapistInviteScreen {
  therapistName: string;
  therapistEmail: string;
  accessLevel: 'full' | 'limited';
  dataCategories: DataCategory[];
  message?: string;
}

type DataCategory = 
  | 'moodHistory'
  | 'journalEntries'
  | 'moduleProgress'
  | 'vaultCollections'
  | 'anniversaryDates';
```

**Flow:**
1. User navigates to "Connect with Therapist"
2. Enters therapist's email and name
3. Selects access level (full vs limited)
4. Chooses which data categories to share
5. Adds optional personal message
6. System generates secure access code
7. User shares access code with therapist (via email, text, or in-person)

**Notifications:**
- Therapist receives email with access code and instructions
- User receives confirmation when therapist accepts invitation
- User is notified when therapist views their data

#### Therapist Side: Accept Invitation
**Location:** Dedicated therapist portal or web interface

**Flow:**
1. Therapist receives invitation email with access code
2. Navigates to therapist portal
3. Enters access code to accept invitation
4. Creates therapist account (if new) or logs in
5. Reviews access permissions requested
6. Accepts invitation with specified permissions

---

### 2. Access Control & Consent Management

#### Data Access Levels

**Limited Access:**
- Mood history (last 30 days)
- Basic module progress
- Anniversary dates
- No journal entries or vault contents

**Full Access:**
- Complete mood history
- All journal entries (unless explicitly excluded)
- Full module progress and engagement
- Vault collections (if user opts in)
- Anniversary dates and patterns
- Exercise completion history

#### Explicit Consent Granularity

Users can control access at the data category level:
```
Data Sharing Preferences:
☑ Mood History & Trends (Last 90 days)
☑ Module Progress & Engagement
☑ Journal Entries (select specific entries)
☑ Vault Collections (select specific collections)
☑ Anniversary Dates & Reminders
☑ Exercise Completion History
☑ Reflection Prompts History
```

#### Consent UI Components

**Connection Card (User Dashboard):**
```tsx
interface TherapistConnectionCard {
  therapistName: string;
  therapistEmail: string;
  accessLevel: 'full' | 'limited';
  lastAccessDate: Date;
  status: 'active' | 'pending' | 'revoked';
  dataCategories: DataCategory[];
  onManageAccess: () => void;
  onRevokeAccess: () => void;
}
```

**Manage Access Modal:**
- Toggle individual data categories on/off
- View access history (when therapist accessed data)
- Download activity report
- One-click revoke access
- Temporary suspension option

---

### 3. Progress Report Generation

#### Pre-Session Report (User Side)

**Location:** Profile → Prepare for Therapy Session

**Features:**
- Select date range for report (e.g., "Since last session on Jan 15")
- Automatic compilation of:
  - Mood trends with charts
  - Top 5 emotions experienced
  - Exercises completed and frequency
  - Journal entries summary
  - Module progress updates
  - Notable events (anniversaries, etc.)
- User can add notes for therapist
- Export as PDF or share directly via link

**Report Structure (PDF):**
```
# Grief Journey Progress Report
Client: [Name] | Date: [Date Range]

## Executive Summary
[AI-generated summary of overall progress]

## Mood Trends
[Line chart showing mood over time]
[Key observations: most common moods, patterns]

## Activities & Engagement
- Check-ins completed: X of Y days
- Journal entries: X entries
- Modules completed: X
- Exercises practiced: [list with frequency]

## Journal Highlights
[Top 3 meaningful journal entries]

## Notable Events
[Anniversaries, milestones, significant emotions]

## Notes from Client
[User's optional notes for therapist]
```

#### Therapist Dashboard (Therapist Side)

**Client Overview:**
```tsx
interface TherapistClientCard {
  clientName: string;
  lastSessionDate: Date;
  moodTrend: 'improving' | 'stable' | 'declining';
  engagementLevel: number; // 0-100
  recentActivity: string[];
  nextScheduledSession?: Date;
  onViewFullProfile: () => void;
}
```

**Client Detail View:**
- **Mood Timeline:** Interactive chart with filters (7 days, 30 days, 90 days)
- **Engagement Metrics:** 
  - Daily check-in streak
  - Journal entry frequency
  - Module completion rate
  - Exercise usage patterns
- **Journal Entries:** Paginated list with search and filters
- **Module Progress:** Visual progress indicators for each module
- **Anniversary Calendar:** Upcoming anniversaries with past reactions
- **Coping Strategies:** Most used exercises and effectiveness ratings
- **Flags & Alerts:** 
  - Crisis events (SOS button presses)
  - Extended low mood periods
  - Significant changes in engagement

---

### 4. Secure Data Export

#### Export Formats

**PDF Reports:**
- Pre-therapy session reports
- Monthly summary reports
- Custom date range reports
- Anonymized versions (for research/sharing)

**JSON Data Export:**
- Full data export for backup
- Structured format for analysis
- Includes metadata timestamps
- Encrypted file with user password

**CSV Export:**
- Mood history spreadsheet
- Journal entries list
- Exercise completion log

#### Export UI

```tsx
interface ExportModal {
  exportType: 'pdf' | 'json' | 'csv';
  dateRange: DateRange;
  includeData: DataCategory[];
  anonymize?: boolean;
  encrypt?: boolean;
}
```

**Security Features:**
- All exports require user authentication
- Encrypted files require password to open
- Exports include audit trail (who exported, when)
- Temporary export links (expire after 7 days)
- Watermarking for therapist downloads

---

### 5. Therapist Portal Features

#### Client Management
- List of connected clients
- Quick search and filter
- Flagged clients for attention
- Session notes integration
- Next session reminders

#### Data Visualization
- Comparative client data (anonymized)
- Population trends (with consent)
- Benchmark comparison (user vs average)
- Progress tracking over multiple sessions

#### Communication Tools
- Secure messaging with clients
- Assignment of specific exercises/modules
- Review and comment on journal entries (if shared)
- Send check-in prompts or encouragement

#### Session Preparation
- Pre-session checklist for therapists
- Recent activity summary
- Discussion points based on data
- Print-ready reports for sessions

---

## Data Architecture

### Database Schema Extensions

```typescript
interface TherapistConnection {
  id: string;
  userId: string;
  therapistId: string;
  therapistName: string;
  therapistEmail: string;
  accessLevel: 'full' | 'limited';
  dataCategories: DataCategory[];
  status: 'pending' | 'active' | 'revoked' | 'suspended';
  createdAt: Date;
  acceptedAt?: Date;
  revokedAt?: Date;
  lastAccessDate?: Date;
  consentVersion: string;
}

interface DataAccessLog {
  id: string;
  connectionId: string;
  accessedBy: 'therapist' | 'system';
  dataCategories: DataCategory[];
  accessType: 'view' | 'download' | 'export';
  timestamp: Date;
  ipAddress?: string;
}

interface TherapistProfile {
  id: string;
  email: string;
  name: string;
  credentials: string;
  organization?: string;
  verified: boolean;
  createdAt: Date;
}

interface ExportRecord {
  id: string;
  userId: string;
  exportedBy: 'user' | 'therapist';
  exportType: 'pdf' | 'json' | 'csv';
  dataCategories: DataCategory[];
  dateRange: { start: Date; end: Date };
  expiresAt: Date;
  downloadUrl: string;
  encryptionKey?: string;
  createdAt: Date;
}
```

### API Endpoints

```
POST /api/therapist/invite
POST /api/therapist/accept/:code
GET  /api/therapist/connections
PUT  /api/therapist/connections/:id/access
DELETE /api/therapist/connections/:id
GET  /api/therapist/access-log/:connectionId

GET  /api/client/data/mood-history
GET  /api/client/data/journal-entries
GET  /api/client/data/module-progress
GET  /api/client/data/engagement-metrics

POST /api/export/generate
GET  /api/download/:exportId
GET  /api/therapist/clients
GET  /api/therapist/clients/:clientId

POST /api/session-report/generate
GET  /api/session-report/:reportId/pdf
```

---

## Privacy & Security

### Consent Model
- **Explicit Consent:** User must opt-in for each therapist connection
- **Granular Control:** Fine-grained control over data categories
- **Informed Access:** Clear descriptions of what data is shared
- **Easy Revocation:** One-click revoke access at any time
- **Audit Trail:** Complete log of all data access events

### Security Measures
- **Encryption:** All data encrypted at rest and in transit
- **Access Tokens:** Time-limited tokens for therapist access
- **Rate Limiting:** Prevent bulk data scraping
- **IP Restrictions:** Optional geolocation restrictions
- **Two-Factor Authentication:** For therapist accounts
- **Data Anonymization:** Option to export anonymized data

### Compliance
- **HIPAA Considerations:** Design with healthcare privacy standards
- **GDPR Compliance:** Right to be forgotten, data portability
- **Data Retention:** Clear policies on data storage duration
- **Breach Notification:** Protocol for security incidents

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- [ ] Basic therapist invitation system
- [ ] Access control UI (full/limited only)
- [ ] Mood history sharing
- [ ] Simple progress reports (PDF)
- [ ] Therapist portal basic view

### Phase 2: Enhanced Features
- [ ] Granular data category control
- [ ] Journal entry sharing
- [ ] Module progress visualization
- [ ] Export functionality (JSON/CSV)
- [ ] Access logs and notifications

### Phase 3: Advanced Features
- [ ] Therapist messaging
- [ ] Exercise assignments
- [ ] Comparative analytics
- [ ] Session preparation tools
- [ ] HIPAA compliance certification

---

## Success Metrics

### User Adoption
- % of users who invite at least one therapist
- Average number of therapists per user
- Frequency of report generation

### Engagement
- Therapist portal daily active users
- Average session frequency improvements
- Therapist-reported value (NPS)

### Privacy & Trust
- % of users who review access logs
- Revoke rate and reasons
- Privacy setting utilization

---

## Risks & Mitigation

### Risk 1: Therapist Adoption
**Mitigation:** 
- Easy onboarding flow
- Clear value proposition
- Training materials and support

### Risk 2: User Privacy Concerns
**Mitigation:**
- Transparent data sharing
- Granular control
- Easy revocation
- Clear privacy policy

### Risk 3: Data Security Breaches
**Mitigation:**
- Enterprise-grade encryption
- Regular security audits
- Incident response plan
- Cyber insurance

---

## Future Enhancements

1. **Integration with EHR Systems:** Connect to electronic health records
2. **AI-Powered Insights:** Therapist-specific trend analysis
3. **Teletherapy Platform Integration:** Direct video session integration
4. **Progress Goals:** Collaborative goal setting and tracking
5. **Outcome Measures:** Standardized assessment tools integration