import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Copy, Check, Download, FileText } from 'lucide-react';
import clsx from 'clsx';

function CopyBlock({ label, text }: { label: string, text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="text-xs font-mono text-bone/50 uppercase tracking-widest">{label}</label>
        <button 
          onClick={handleCopy}
          className={clsx(
            "flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded transition-all",
            copied ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-bone/60 hover:bg-white/10 hover:text-bone"
          )}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'COPIED' : 'COPY TEXT'}
        </button>
      </div>
      <div className="bg-abyss-panel p-4 rounded-lg border border-white/5 font-mono text-sm text-bone/80 whitespace-pre-wrap leading-relaxed">
        {text}
      </div>
    </div>
  );
}

function AssetCard({ title, type, size }: { title: string, type: string, size: string }) {
  return (
    <div className="p-4 border border-white/5 bg-white/5 rounded-lg flex items-center justify-between group hover:bg-white/10 transition-colors cursor-pointer">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-abyss rounded flex items-center justify-center text-bone/50">
             <FileText className="w-5 h-5" />
          </div>
          <div>
             <h4 className="text-sm font-medium text-bone">{title}</h4>
             <p className="text-xs text-bone/40">{type} • {size}</p>
          </div>
       </div>
       <button className="text-bone/30 group-hover:text-gold transition-colors">
          <Download className="w-5 h-5" />
       </button>
    </div>
  );
}

export function Exports() {
  const toneOfVoice = `Tone: calm, precise, selective.
No emojis.
No hype.
Examples:
- "Frequency Session 21. Un nuevo pulso."
- "No es música. Es resonancia."
- "Deep frequencies. Controlled energy."`;

  const bookerStatement = `Astrion es un DJ y live performer especializado en Progressive y Melodic Techno. Su propuesta es un organismo sonoro vivo, diseñado para transportar a la audiencia a través de frecuencias profundas y texturas orgánicas. Lejos del hype comercial, Astrion cultiva el silencio y la precisión.`;

  const riderTech = `1x Allen & Heath Xone:96
2x Pioneer CDJ-3000 (Linked)
1x Eventide H9 Max
1x Roland TR-8S
2x Booth Monitors (High Quality)`;

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] max-w-4xl mx-auto space-y-16">
      <PageHeader 
        title="Exports & Assets" 
        subtitle="Download guidelines and copy-paste resources." 
      />

      <section className="space-y-6">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-2 mb-8">
          01 // Communications
        </h2>
        <div className="grid gap-8">
           <CopyBlock label="Tone of Voice Rules" text={toneOfVoice} />
           <CopyBlock label="Booker Statement (ES)" text={bookerStatement} />
           <CopyBlock label="Technical Rider Summary" text={riderTech} />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-display uppercase tracking-widest text-gold/80 border-b border-gold/20 pb-2 mb-8">
          02 // Downloadable Assets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-6 border border-dashed border-white/10 rounded-lg text-center space-y-2">
              <span className="text-bone/40 text-sm">Brand_Pack_2025.zip</span>
              <button className="bg-bone text-abyss px-4 py-2 rounded font-medium text-sm w-full hover:bg-white transition-colors">
                 Download All (45MB)
              </button>
           </div>
           <div className="space-y-2">
              <AssetCard title="Logo Mark (Vector)" type="SVG" size="12kb" />
              <AssetCard title="Wordmark (Vector)" type="SVG" size="15kb" />
              <AssetCard title="Social Media Kit" type="FIG" size="24MB" />
           </div>
        </div>
      </section>
    </div>
  );
}
