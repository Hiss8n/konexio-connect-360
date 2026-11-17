type ProfileItem = {
  name: string;
  role: string;
  location: string;
  organisation?: string;
  summary: string;
};

const learnerProfiles: ProfileItem[] = [
  { name: 'Amina Yusuf', role: 'Learner', location: 'Kakuma, Kenya', summary: 'Focused on digital skills and practical project work.' },
  { name: 'Kevin Otieno', role: 'Learner', location: 'Nairobi, Kenya', summary: 'Working through assignments and LMS modules with a strong interest in design.' },
];

const donorProfiles: ProfileItem[] = [
  { name: 'Sarah Njeri', role: 'Donor', location: 'London, UK', organisation: 'Open Future Fund', summary: 'Supports innovation and learner access to digital opportunities.' },
  { name: 'Daniel Mugo', role: 'Donor', location: 'New York, USA', organisation: 'Bright Path Foundation', summary: 'Funds education access and career progression programs.' },
];

const partnerProfiles: ProfileItem[] = [
  { name: 'Konexio Innovation Lab', role: 'Partner', location: 'Paris, France', organisation: 'Training Partner', summary: 'Collaborates on digital skills and mentorship programmes.' },
  { name: 'Milele Works', role: 'Partner', location: 'Lagos, Nigeria', organisation: 'Employer', summary: 'Provides internship and hiring opportunities for graduates.' },
];

const teamMembers = [
  { name: 'Lina Amara', title: 'Program Manager', location: 'Dakar, Senegal' },
  { name: 'Moussa Diop', title: 'Mentor Lead', location: 'Abidjan, Côte d’Ivoire' },
  { name: 'Grace Kamau', title: 'Community Coordinator', location: 'Nairobi, Kenya' },
];

const profileCardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 16,
  padding: 18,
  border: '1px solid #e2e8f0',
  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
};

const sectionStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 18,
};

export const LearnerProfilePage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>My profile</h3>
    <div style={{ ...profileCardStyle, marginBottom: 20 }}>
      <h4 style={{ margin: '0 0 8px' }}>Hissen Tutu</h4>
      <p style={{ margin: 0, color: '#475569' }}>Learner • Kakuma, Kenya</p>
      <p style={{ margin: '12px 0 0', color: '#334155' }}>Learning goal: grades and progression in digital and career readiness courses.</p>
    </div>

    <div style={sectionStyle}>
      {learnerProfiles.map((person) => (
        <div key={person.name} style={profileCardStyle}>
          <strong>{person.name}</strong>
          <div style={{ color: '#475569', marginTop: 8 }}>{person.role}</div>
          <div style={{ color: '#64748b', marginTop: 4 }}>{person.location}</div>
          <p style={{ color: '#334155', marginBottom: 0 }}>{person.summary}</p>
        </div>
      ))}
    </div>
  </div>
);

export const LearnerQuizzesPage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>Quizzes</h3>
    <div style={sectionStyle}>
      {['Digital literacy check', 'Career readiness quiz', 'Data basics assessment'].map((item) => (
        <div key={item} style={profileCardStyle}>
          <strong>{item}</strong>
          <p style={{ color: '#475569', marginBottom: 0 }}>Status: available • 20 mins</p>
        </div>
      ))}
    </div>
  </div>
);

export const LearnerAssignmentsPage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>Assignments</h3>
    <div style={sectionStyle}>
      {['Portfolio task', 'Project brief', 'Presentation review'].map((item) => (
        <div key={item} style={profileCardStyle}>
          <strong>{item}</strong>
          <p style={{ color: '#475569', marginBottom: 0 }}>Due this week</p>
        </div>
      ))}
    </div>
  </div>
);

export const LearnerClassmatesPage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>Classmates</h3>
    <div style={sectionStyle}>
      {learnerProfiles.map((person) => (
        <div key={person.name} style={profileCardStyle}>
          <strong>{person.name}</strong>
          <div style={{ color: '#475569', marginTop: 8 }}>{person.location}</div>
          <p style={{ color: '#334155', marginBottom: 0 }}>{person.summary}</p>
        </div>
      ))}
    </div>
  </div>
);

export const LearnerLMSPage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>LMS modules</h3>
    <div style={sectionStyle}>
      {['Module 1: Intro to the platform', 'Module 2: Digital communication', 'Module 3: Project planning'].map((item) => (
        <div key={item} style={profileCardStyle}>
          <strong>{item}</strong>
          <p style={{ color: '#475569', marginBottom: 0 }}>Open and continue reading</p>
        </div>
      ))}
    </div>
  </div>
);

export const DonorDirectoryPage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>Donor directory</h3>
    <div style={sectionStyle}>
      {[...donorProfiles, ...partnerProfiles].map((person) => (
        <div key={`${person.name}-${person.role}`} style={profileCardStyle}>
          <strong>{person.name}</strong>
          <div style={{ color: '#475569', marginTop: 8 }}>{person.role}</div>
          {person.organisation && <div style={{ color: '#64748b', marginTop: 4 }}>{person.organisation}</div>}
          <div style={{ color: '#64748b', marginTop: 4 }}>{person.location}</div>
          <p style={{ color: '#334155', marginBottom: 0 }}>{person.summary}</p>
        </div>
      ))}
    </div>
  </div>
);

export const DonorPartnersPage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>Partners</h3>
    <div style={sectionStyle}>
      {partnerProfiles.map((partner) => (
        <div key={partner.name} style={profileCardStyle}>
          <strong>{partner.name}</strong>
          <div style={{ color: '#475569', marginTop: 8 }}>{partner.organisation}</div>
          <div style={{ color: '#64748b', marginTop: 4 }}>{partner.location}</div>
          <p style={{ color: '#334155', marginBottom: 0 }}>{partner.summary}</p>
        </div>
      ))}
    </div>
  </div>
);

export const AlumniTeamsPage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>Teams</h3>
    <div style={sectionStyle}>
      {teamMembers.map((member) => (
        <div key={member.name} style={profileCardStyle}>
          <strong>{member.name}</strong>
          <div style={{ color: '#475569', marginTop: 8 }}>{member.title}</div>
          <div style={{ color: '#64748b', marginTop: 4 }}>{member.location}</div>
        </div>
      ))}
    </div>
  </div>
);

export const AlumniPartnersPage = () => (
  <div>
    <h3 style={{ marginTop: 0 }}>Partners</h3>
    <div style={sectionStyle}>
      {partnerProfiles.map((partner) => (
        <div key={partner.name} style={profileCardStyle}>
          <strong>{partner.name}</strong>
          <div style={{ color: '#475569', marginTop: 8 }}>{partner.organisation}</div>
          <div style={{ color: '#64748b', marginTop: 4 }}>{partner.location}</div>
          <p style={{ color: '#334155', marginBottom: 0 }}>{partner.summary}</p>
        </div>
      ))}
    </div>
  </div>
);

export const AccessDeniedPage = () => (
  <div style={{ ...profileCardStyle, maxWidth: 520 }}>
    <h3 style={{ marginTop: 0 }}>Access denied</h3>
    <p style={{ color: '#334155', marginBottom: 0 }}>
      This section is not available for your current role.
    </p>
  </div>
);
