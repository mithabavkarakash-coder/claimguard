import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Unlock, 
  Plus, 
  FileText, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Trash2,
  FileSpreadsheet,
  Download
} from 'lucide-react';

export interface PatientCredential {
  id: string;
  title: string;
  category: 'Diagnostic' | 'Lab' | 'Surgery' | 'Pharmacy';
  icdCode: string;
  cptCode: string;
  provider: string;
  date: string;
  witnessHash: string;
  notes: string;
  isEncrypted: boolean;
}

export interface AccessGrant {
  id: string;
  granteeName: string;
  granteeAddress: string;
  scope: 'Eligibility Only' | 'Deductible Check' | 'Full Adjudication';
  grantedAt: string;
  expiresAt: string;
  status: 'Active' | 'Expired' | 'Revoked';
  accessCount: number;
}

const INITIAL_CREDENTIALS: PatientCredential[] = [
  {
    id: 'REC-2026-0482',
    title: 'Recurrent Focal Migraine & Diagnostic Imaging',
    category: 'Diagnostic',
    icdCode: 'G43.909 (ICD-10)',
    cptCode: '70450 (CT Head Scan)',
    provider: 'St. Jude Medical Center',
    date: '2026-09-15',
    witnessHash: '0x8f4a2b1c9e3d7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a21',
    notes: 'Patient evaluated for recurrent focal headache. Zero focal deficits noted. Contrast CT completed.',
    isEncrypted: true
  },
  {
    id: 'REC-2026-0312',
    title: 'Comprehensive Metabolic Panel & Lipid Screen',
    category: 'Lab',
    icdCode: 'Z00.00 (General Exam)',
    cptCode: '80053 (CMP Panel)',
    provider: 'BioHealth Diagnostic Labs',
    date: '2026-08-28',
    witnessHash: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a218f4a2b1c9e3d7a6f5e4d',
    notes: 'Routine outpatient blood analysis. All key markers within expected normative ranges.',
    isEncrypted: true
  },
  {
    id: 'REC-2026-0119',
    title: 'Outpatient Cardiac Stress Testing & ECG',
    category: 'Diagnostic',
    icdCode: 'I20.9 (Angina Pectoris)',
    cptCode: '93015 (Exercise Stress)',
    provider: 'Apex Cardiology Associates',
    date: '2026-07-14',
    witnessHash: '0x7e6d5c4b3a218f4a2b1c9e3d7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f',
    notes: 'Standard treadmill protocol. Ejection fraction stable at 62%. No acute ST changes.',
    isEncrypted: true
  }
];

const INITIAL_GRANTS: AccessGrant[] = [
  {
    id: 'GRANT-9021',
    granteeName: 'Dr. Vance (St. Jude Medical)',
    granteeAddress: 'addr1q8x94ed3920akslw02948271038102938472901847102938479x4e',
    scope: 'Full Adjudication',
    grantedAt: '2026-09-20 14:30',
    expiresAt: '2026-10-20 14:30',
    status: 'Active',
    accessCount: 4
  },
  {
    id: 'GRANT-8834',
    granteeName: 'Aegis Health Underwriting',
    granteeAddress: 'addr1q9y83fd2910bjsm193840294810293847102938401928401928371y5f',
    scope: 'Deductible Check',
    grantedAt: '2026-09-18 09:15',
    expiresAt: '2026-09-25 09:15',
    status: 'Expired',
    accessCount: 12
  }
];

export const PatientVaultPanel: React.FC = () => {
  const [credentials, setCredentials] = useState<PatientCredential[]>(INITIAL_CREDENTIALS);
  const [grants, setGrants] = useState<AccessGrant[]>(INITIAL_GRANTS);
  const [unlockedRecordIds, setUnlockedRecordIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Credential Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Diagnostic' | 'Lab' | 'Surgery' | 'Pharmacy'>('Diagnostic');
  const [newIcd, setNewIcd] = useState('');
  const [newCpt, setNewCpt] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // New Grant Generator Form State
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantTargetName, setGrantTargetName] = useState('');
  const [grantTargetAddress, setGrantTargetAddress] = useState('');
  const [grantScope, setGrantScope] = useState<'Eligibility Only' | 'Deductible Check' | 'Full Adjudication'>('Deductible Check');
  const [grantDurationDays, setGrantDurationDays] = useState('7');
  const [isGeneratingGrant, setIsGeneratingGrant] = useState(false);
  const [grantSuccessMsg, setGrantSuccessMsg] = useState<string | null>(null);

  const toggleUnlock = (id: string) => {
    if (unlockedRecordIds.includes(id)) {
      setUnlockedRecordIds(prev => prev.filter(item => item !== id));
    } else {
      setUnlockedRecordIds(prev => [...prev, id]);
    }
  };

  const handleCopyHash = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newIcd || !newCpt || !newProvider) {
      alert('Please complete all required fields.');
      return;
    }

    const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newRecord: PatientCredential = {
      id: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      category: newCategory,
      icdCode: `${newIcd} (ICD-10)`,
      cptCode: `${newCpt} (CPT)`,
      provider: newProvider,
      date: new Date().toISOString().split('T')[0],
      witnessHash: randomHash,
      notes: newNotes || 'Client-encrypted patient clinical witness attachment.',
      isEncrypted: true
    };

    setCredentials([newRecord, ...credentials]);
    setShowAddModal(false);
    setNewTitle('');
    setNewIcd('');
    setNewCpt('');
    setNewProvider('');
    setNewNotes('');
  };

  const handleCreateGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantTargetName || !grantTargetAddress) {
      alert('Please fill in provider name and wallet address.');
      return;
    }

    setIsGeneratingGrant(true);
    setTimeout(() => {
      const now = new Date();
      const expires = new Date();
      expires.setDate(now.getDate() + parseInt(grantDurationDays));

      const newGrant: AccessGrant = {
        id: `GRANT-${Math.floor(1000 + Math.random() * 9000)}`,
        granteeName: grantTargetName,
        granteeAddress: grantTargetAddress,
        scope: grantScope,
        grantedAt: now.toISOString().replace('T', ' ').substring(0, 16),
        expiresAt: expires.toISOString().replace('T', ' ').substring(0, 16),
        status: 'Active',
        accessCount: 0
      };

      setGrants([newGrant, ...grants]);
      setIsGeneratingGrant(false);
      setShowGrantModal(false);
      setGrantSuccessMsg(`ZK Access Grant successfully created for ${grantTargetName}`);
      setTimeout(() => setGrantSuccessMsg(null), 4000);
      setGrantTargetName('');
      setGrantTargetAddress('');
    }, 1200);
  };

  const handleRevokeGrant = (grantId: string) => {
    setGrants(prev => prev.map(g => g.id === grantId ? { ...g, status: 'Revoked' } : g));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <span>Encrypted Patient Vault & Consent Management</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight">
                Private Clinical Witness Vault
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl mt-1">
                Manage your zero-knowledge medical credentials on-device. Issue timed, scoped ZK access grants to healthcare providers without exposing raw diagnoses or clinical treatment narratives.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary font-semibold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Medical Record
            </button>
            <button
              onClick={() => setShowGrantModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-primary" />
              Issue ZK Access Grant
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 space-y-1">
            <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              Stored Records
            </div>
            <div className="text-xl font-bold font-tnum text-on-surface">{credentials.length} Records</div>
            <div className="text-[11px] text-emerald-600 font-semibold">100% Client Encrypted</div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 space-y-1">
            <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-secondary" />
              Active ZK Grants
            </div>
            <div className="text-xl font-bold font-tnum text-on-surface">
              {grants.filter(g => g.status === 'Active').length} Grants
            </div>
            <div className="text-[11px] text-secondary font-semibold">Scoped Consent Active</div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 space-y-1">
            <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              Nullifier Commitments
            </div>
            <div className="text-xl font-bold font-tnum text-on-surface">12 Nullifiers</div>
            <div className="text-[11px] text-amber-600 font-semibold">Anti-Replay Salted</div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/70 space-y-1">
            <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              Encryption Standard
            </div>
            <div className="text-xl font-bold text-on-surface">AES-GCM-256</div>
            <div className="text-[11px] text-indigo-600 font-semibold">Groth16 ZK Proving Key</div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {grantSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-semibold">{grantSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Section 1: Encrypted Medical Credentials List */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              Patient Medical Witness Credentials
            </h3>
            <p className="text-xs text-on-surface-variant">
              Clinical medical records stored inside your client witness environment. Diagnostic codes remain hidden unless explicitly unlocked with local credentials.
            </p>
          </div>
          <span className="text-xs text-on-surface-variant font-mono bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant">
            {credentials.length} Items Loaded
          </span>
        </div>

        <div className="space-y-4">
          {credentials.map(record => {
            const isUnlocked = unlockedRecordIds.includes(record.id);

            return (
              <div 
                key={record.id}
                className="bg-surface-container-low rounded-xl border border-outline-variant/80 p-5 space-y-4 hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/40 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      record.category === 'Diagnostic' ? 'bg-primary/10 text-primary border border-primary/20' :
                      record.category === 'Lab' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' :
                      'bg-purple-500/10 text-purple-700 border border-purple-500/20'
                    }`}>
                      {record.category}
                    </span>
                    <h4 className="font-bold text-sm text-on-surface">{record.title}</h4>
                    <span className="text-xs font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                      {record.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <span>Provider: <strong className="text-on-surface">{record.provider}</strong></span>
                    <span>•</span>
                    <span>Date: {record.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Diagnosis Code (ICD-10)</span>
                    <div className="font-mono font-bold text-on-surface flex items-center justify-between">
                      <span>{isUnlocked ? record.icdCode : '••••••••••••••••'}</span>
                      <button 
                        onClick={() => toggleUnlock(record.id)}
                        className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        title={isUnlocked ? 'Lock Clinical Code' : 'Unlock Code with Local Key'}
                      >
                        {isUnlocked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">Procedure Code (CPT)</span>
                    <div className="font-mono font-bold text-on-surface flex items-center justify-between">
                      <span>{isUnlocked ? record.cptCode : '••••••••••••••••'}</span>
                      <button 
                        onClick={() => toggleUnlock(record.id)}
                        className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        title={isUnlocked ? 'Lock Procedure Code' : 'Unlock Code with Local Key'}
                      >
                        {isUnlocked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">ZK Witness Commitment</span>
                    <div className="font-mono text-[11px] text-secondary flex items-center justify-between truncate">
                      <span className="truncate">{record.witnessHash.substring(0, 16)}...</span>
                      <button
                        onClick={() => handleCopyHash(record.witnessHash, record.id)}
                        className="text-on-surface-variant hover:text-secondary transition-colors ml-2 cursor-pointer"
                        title="Copy Witness Hash"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {copiedId === record.id && (
                      <span className="text-[10px] text-emerald-600 font-semibold block">Copied hash to clipboard!</span>
                    )}
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 text-xs text-on-surface-variant flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-on-surface">Clinical Witness Note: </strong>
                    {isUnlocked ? record.notes : 'Clinical text encrypted with patient AES-GCM-256 key. Proving engine extracts diagnosis witness parameters off-chain during claim generation.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Active ZK Access Grants & Delegation Audit */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-secondary" />
              Active Provider ZK Delegations & Access Grants
            </h3>
            <p className="text-xs text-on-surface-variant">
              Manage cryptographic access grants provided to clinics, physicians, or insurance adjusters. Revoke access instantly at any time.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/80 bg-surface-container-low text-on-surface-variant uppercase font-bold text-[10px]">
                <th className="p-3.5 rounded-tl-lg">Grant ID</th>
                <th className="p-3.5">Provider / Grantee</th>
                <th className="p-3.5">Granted Scope</th>
                <th className="p-3.5">Issued At</th>
                <th className="p-3.5">Expires At</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-mono">
              {grants.map(grant => (
                <tr key={grant.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="p-3.5 font-bold text-on-surface">{grant.id}</td>
                  <td className="p-3.5 font-sans">
                    <div className="font-semibold text-on-surface">{grant.granteeName}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono truncate max-w-[180px]">
                      {grant.granteeAddress}
                    </div>
                  </td>
                  <td className="p-3.5 font-sans">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {grant.scope}
                    </span>
                  </td>
                  <td className="p-3.5 text-on-surface-variant">{grant.grantedAt}</td>
                  <td className="p-3.5 text-on-surface-variant">{grant.expiresAt}</td>
                  <td className="p-3.5 font-sans">
                    {grant.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    ) : grant.status === 'Expired' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                        Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-700 border border-rose-500/20">
                        Revoked
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    {grant.status === 'Active' ? (
                      <button
                        onClick={() => handleRevokeGrant(grant.id)}
                        className="px-3 py-1 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 font-bold text-xs rounded-lg transition-colors border border-rose-500/20 cursor-pointer"
                      >
                        Revoke Grant
                      </button>
                    ) : (
                      <span className="text-[11px] text-on-surface-variant italic">Disabled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add New Medical Record */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
              <h3 className="font-extrabold text-lg text-on-surface flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Encrypted Medical Record
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCredential} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-on-surface">Record Title / Description</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Brain MRI Scans & Neurological Consult"
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                  >
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Lab">Lab</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Pharmacy">Pharmacy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Provider Name</label>
                  <input
                    type="text"
                    value={newProvider}
                    onChange={e => setNewProvider(e.target.value)}
                    placeholder="e.g. St. Jude Hospital"
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Diagnosis Code (ICD-10)</label>
                  <input
                    type="text"
                    value={newIcd}
                    onChange={e => setNewIcd(e.target.value)}
                    placeholder="e.g. G43.909"
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Procedure Code (CPT)</label>
                  <input
                    type="text"
                    value={newCpt}
                    onChange={e => setNewCpt(e.target.value)}
                    placeholder="e.g. 70450"
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">Clinical Notes (Private Witness)</label>
                <textarea
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Enter private clinical observations or treatment log..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 cursor-pointer shadow-md"
                >
                  Encrypt & Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Issue ZK Access Grant */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full border border-outline-variant shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
              <h3 className="font-extrabold text-lg text-on-surface flex items-center gap-2">
                <Share2 className="w-5 h-5 text-secondary" />
                Issue Timed ZK Access Grant
              </h3>
              <button
                onClick={() => setShowGrantModal(false)}
                className="text-on-surface-variant hover:text-on-surface text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateGrant} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-on-surface">Provider / Institution Name</label>
                <input
                  type="text"
                  value={grantTargetName}
                  onChange={e => setGrantTargetName(e.target.value)}
                  placeholder="e.g. Dr. Vance (St. Jude Medical)"
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-on-surface">Provider Wallet Address (Cardano/Midnight)</label>
                <input
                  type="text"
                  value={grantTargetAddress}
                  onChange={e => setGrantTargetAddress(e.target.value)}
                  placeholder="e.g. addr1q8x94ed3920..."
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Access Scope</label>
                  <select
                    value={grantScope}
                    onChange={e => setGrantScope(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                  >
                    <option value="Eligibility Only">Eligibility Only</option>
                    <option value="Deductible Check">Deductible Check</option>
                    <option value="Full Adjudication">Full Adjudication</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Validity Period</label>
                  <select
                    value={grantDurationDays}
                    onChange={e => setGrantDurationDays(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary outline-none"
                  >
                    <option value="1">1 Day</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-[11px] leading-relaxed">
                <strong>ZK Guarantee: </strong>
                This grant issues a signed zero-knowledge permission token. The grantee can trigger circuit evaluations without reading raw ICD-10 diagnosis codes.
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingGrant}
                  className="px-4 py-2 bg-secondary text-on-secondary rounded-xl font-bold hover:bg-secondary/90 cursor-pointer shadow-md flex items-center gap-2"
                >
                  {isGeneratingGrant && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isGeneratingGrant ? 'Generating ZK Grant...' : 'Issue Access Grant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
