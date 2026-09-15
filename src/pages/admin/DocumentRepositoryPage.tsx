import React, { useState } from 'react';
import { 
  Files, 
  Search, 
  Download, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Fingerprint, 
  Sparkles,
  Layers
} from 'lucide-react';

export const DocumentRepositoryPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const documents = [
    {
      id: 'DOC-9941',
      title: 'Certified Registered Sale Deed (बैनामा)',
      fileName: 'Registry.pdf',
      khasraNo: '124/7',
      citizen: 'Rishi Sharma',
      fileSize: '4.2 MB',
      ocrScore: 96,
      hash: '0x8f2a11b98cf982e043bc123490aafe876251b',
      date: '14/08/2019'
    },
    {
      id: 'DOC-9942',
      title: 'Khatauni 12-Yearly Fasli Record',
      fileName: 'Khatauni_ROR_Dakpathar.pdf',
      khasraNo: '304/4',
      citizen: 'Sunita Devi Chauhan',
      fileSize: '2.1 MB',
      ocrScore: 74,
      hash: '0x3c7109ff8217bb4199aa0821bca9012351221',
      date: '10/09/2026'
    },
    {
      id: 'DOC-9943',
      title: 'Tehsildar Dakhil Kharij Sanction Order',
      fileName: 'Mutation_DakhilKharij_142.pdf',
      khasraNo: '142/2 Kha',
      citizen: 'Ramesh Chandra Joshi',
      fileSize: '3.2 MB',
      ocrScore: 99,
      hash: '0x1a88bb912300482caef0991482012bc091244',
      date: '12/11/2025'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold mb-1">
            <Files size={12} />
            <span>Digital Vault</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Document Repository (21,904 Processed)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically indexed repository of registered sale deeds, Khataunis, and mutation decrees.
          </p>
        </div>

        <button 
          onClick={() => alert('Exporting Document Index...')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
        >
          Export Vault Index
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document title, Khasra, or SHA-256 hash..."
            className="w-full max-w-sm pl-4 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50"
          />
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">{doc.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                      {doc.fileName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Khasra {doc.khasraNo} • {doc.citizen} • {doc.fileSize} • Uploaded: {doc.date}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                    <Fingerprint size={12} className="text-purple-600" />
                    <span>SHA-256: {doc.hash}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  OCR: {doc.ocrScore}%
                </span>
                <button
                  onClick={() => alert(`Downloading verified digital copy of ${doc.fileName}...`)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Download File"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
