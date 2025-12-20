
import React, { useState, useEffect, useRef } from 'react';
import { CV_DATA as INITIAL_CV_DATA } from './data';
import { getProResponse } from './services/gemini';
import { fetchOrcidData } from './services/orcid';
import { Publication, Skill, Education, Experience, Honor } from './types';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// --- Editable Field Component ---
const EditableField: React.FC<{ 
  value: string; 
  onSave: (val: string) => void; 
  isEditMode: boolean;
  multiline?: boolean;
  className?: string;
}> = ({ value, onSave, isEditMode, multiline, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  if (!isEditMode) return <span className={className}>{value}</span>;

  if (isEditing) {
    return multiline ? (
      <textarea
        autoFocus
        className={`w-full p-2 border-2 border-red-900/30 rounded-lg outline-none bg-red-50/30 font-sans text-sm ${className}`}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(currentValue); }}
      />
    ) : (
      <input
        autoFocus
        className={`w-full p-1 border-b-2 border-red-900/30 outline-none bg-red-50/30 font-sans ${className}`}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={() => { setIsEditing(false); onSave(currentValue); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { setIsEditing(false); onSave(currentValue); } }}
      />
    );
  }

  return (
    <span 
      onClick={() => setIsEditing(true)} 
      className={`cursor-pointer hover:bg-red-50/50 px-1 rounded transition-colors border-b border-dotted border-slate-300 ${className}`}
      title="Click to edit"
    >
      {value || "Click to add text..."}
    </span>
  );
};

// --- Certificate Preview Modal ---
const CertificateModal: React.FC<{ imageUrl: string; onClose: () => void; onDelete: () => void }> = ({ imageUrl, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Document Verification Preview</h3>
          <div className="flex gap-2">
            <button onClick={onDelete} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors uppercase">Delete</button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><i className="fas fa-times"></i></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-slate-200 flex items-center justify-center">
          <img src={imageUrl} alt="Certificate" className="max-w-full shadow-lg rounded-sm" />
        </div>
      </div>
    </div>
  );
};

// --- Traditional Academic CV Component ---
const TraditionalCV: React.FC<{ 
  data: any; 
  onToggleSelect: (idx: number) => void; 
  onSync: () => void;
  onUpdateCertificate: (section: string, index: number, base64: string | null) => void;
  isBuilderMode: boolean;
  onUpdateEntry: (section: string, index: number, field: string, value: any) => void;
  onRemoveEntry: (section: string, index: number) => void;
  onAddEntry: (section: string) => void;
  sectionOrder: string[];
  onMoveSection: (direction: 'up' | 'down', index: number) => void;
}> = ({ data, onToggleSelect, onSync, onUpdateCertificate, isBuilderMode, onUpdateEntry, onRemoveEntry, onAddEntry, sectionOrder, onMoveSection }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<{ section: string; index: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const publications = data.publications || [];
  const articles = publications.filter((p: Publication) => p.type === 'Peer-Reviewed' || p.type === 'Accepted');
  const bookChapters = publications.filter((p: Publication) => p.type === 'Book Chapter');
  const abstracts = publications.filter((p: Publication) => p.type === 'Abstract');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeItem) return;

    try {
      let base64 = '';
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          base64 = canvas.toDataURL('image/png');
        }
      } else {
        base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      
      onUpdateCertificate(activeItem.section, activeItem.index, base64);
      setPreviewImage(base64);
    } catch (err) {
      console.error("Error processing document:", err);
      alert("Failed to process the document. Please ensure it's a valid PDF or Image.");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (section: string, index: number, existing?: string) => {
    setActiveItem({ section, index });
    if (existing) {
      setPreviewImage(existing);
    } else {
      fileInputRef.current?.click();
    }
  };

  const renderCertBtn = (section: string, index: number, existing?: string) => (
    <button 
      onClick={() => triggerUpload(section, index, existing)}
      className={`ml-2 inline-flex items-center justify-center w-6 h-6 rounded-lg transition-all border shrink-0 group/cert ${
        existing 
          ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm ring-4 ring-amber-500/5' 
          : 'bg-slate-50 text-slate-300 border-slate-100 hover:text-slate-500 hover:bg-slate-100'
      } ${!existing && !isBuilderMode ? 'hidden' : ''}`}
      title={existing ? "View Verified Certificate" : "Upload Verification Doc"}
    >
      <i className={`fas ${existing ? 'fa-certificate scale-110' : 'fa-plus'} text-[10px]`}></i>
      {existing && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      )}
    </button>
  );

  const formatAuthors = (pub: Publication, originalIdx: number) => {
    if (isBuilderMode) {
      return (
        <EditableField 
          value={pub.authors} 
          onSave={(v) => onUpdateEntry('publications', originalIdx, 'authors', v)} 
          isEditMode={isBuilderMode} 
          className="font-sans"
        />
      );
    }
    const authorList = pub.authors.split(/, |; /);
    return (
      <>
        {authorList.map((author, idx) => {
          const isRech = author.trim().includes("Rech MM");
          return (
            <React.Fragment key={idx}>
              <span className={`${isRech ? 'font-bold text-slate-900 underline decoration-slate-300 underline-offset-2' : ''}`}>
                {author}
              </span>
              {idx < authorList.length - 1 ? ', ' : ''}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const renderPublication = (pub: Publication, displayIdx?: number) => {
    const originalIdx = data.publications.findIndex((p: Publication) => p.title === pub.title);
    return (
      <div key={`${pub.title}-${originalIdx}`} className={`relative group pl-12 mb-5 pb-4 transition-all ${pub.selected ? 'border-l-4 border-red-900/20 bg-red-50/20 -ml-1 rounded-r-xl' : 'border-l border-slate-100'}`}>
        <div className="absolute left-0 top-0.5 flex items-center gap-1.5 text-slate-300">
          <button 
            onClick={() => onToggleSelect(originalIdx)}
            className={`w-4 h-4 flex items-center justify-center transition-colors ${pub.selected ? 'text-red-800 scale-110' : 'text-slate-200 hover:text-red-400'}`}
            title={pub.selected ? "Featured Highlight" : "Highlight this entry"}
          >
            <i className={`fas fa-star`}></i>
          </button>
          {displayIdx !== undefined && (
            <span className="text-[10px] font-sans font-black tabular-nums min-w-[15px] text-right">
              {displayIdx}.
            </span>
          )}
        </div>
        
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div className="text-slate-700 leading-normal mb-1">
              {formatAuthors(pub, originalIdx)}. 
              <EditableField value={pub.title} onSave={(v) => onUpdateEntry('publications', originalIdx, 'title', v)} isEditMode={isBuilderMode} className="mx-1" />. 
              <em className="mx-1"><EditableField value={pub.journal} onSave={(v) => onUpdateEntry('publications', originalIdx, 'journal', v)} isEditMode={isBuilderMode} /></em>. 
              <EditableField value={String(pub.year)} onSave={(v) => onUpdateEntry('publications', originalIdx, 'year', Number(v))} isEditMode={isBuilderMode} className="mx-1" />. 
              <span className="pub-type-tag">[{pub.type}]</span>
              {pub.selected && (
                <span className="ml-3 px-2 py-0.5 bg-red-800 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-sm inline-block transform -translate-y-0.5">
                  Featured selection
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {renderCertBtn('publications', originalIdx, pub.certificate)}
            {isBuilderMode && (
              <button onClick={() => onRemoveEntry('publications', originalIdx)} className="text-slate-200 hover:text-red-600 transition-colors ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
            )}
          </div>
        </div>
        
        {pub.significance && (
          <p className="text-[11px] text-slate-600 italic font-sans mb-2 pl-3 mt-1">
            Impact: <EditableField value={pub.significance} onSave={(v) => onUpdateEntry('publications', originalIdx, 'significance', v)} isEditMode={isBuilderMode} multiline />
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-[10px] font-sans font-black items-center mt-1">
          {pub.doi && (
            <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-red-900 transition-colors flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-blue-100/50 shadow-sm">
              <i className="fas fa-link"></i> DOI: {pub.doi}
            </a>
          )}
          {isBuilderMode && (
             <div className="flex items-center gap-2 px-2 py-0.5 bg-slate-50 border rounded italic text-[9px] text-slate-400">
                DOI: <EditableField value={pub.doi || ''} onSave={(v) => onUpdateEntry('publications', originalIdx, 'doi', v)} isEditMode={isBuilderMode} />
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderSectionControls = (section: string, idx: number) => {
    if (!isBuilderMode) return null;
    return (
      <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onMoveSection('up', idx)} disabled={idx === 0} className="w-6 h-6 flex items-center justify-center bg-white border rounded shadow-sm text-slate-400 hover:text-red-900 disabled:opacity-30"><i className="fas fa-chevron-up text-[10px]"></i></button>
        <button onClick={() => onMoveSection('down', idx)} disabled={idx === sectionOrder.length - 1} className="w-6 h-6 flex items-center justify-center bg-white border rounded shadow-sm text-slate-400 hover:text-red-900 disabled:opacity-30"><i className="fas fa-chevron-down text-[10px]"></i></button>
      </div>
    );
  };

  const renderSectionHeader = (title: string, sectionKey: string) => (
    <div className="flex justify-between items-center border-b border-slate-900 mb-5 pb-1 relative group">
      <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
      {isBuilderMode && (
        <button 
          onClick={() => onAddEntry(sectionKey)}
          className="text-[10px] font-black text-red-900 uppercase tracking-widest flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-100 hover:bg-red-100 transition-all"
        >
          <i className="fas fa-plus"></i> Add Entry
        </button>
      )}
    </div>
  );

  const sections: Record<string, React.ReactNode> = {
    education: (
      <section key="education" className="relative group">
        <h2 className="text-sm font-bold border-b border-slate-900 mb-4 uppercase tracking-wider pb-1">Education</h2>
        {data.education?.map((edu: any, idx: number) => (
          <div key={idx} className="mb-4 group/entry relative">
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold text-sm flex items-center gap-2">
                <EditableField value={edu.institution} onSave={(v) => onUpdateEntry('education', idx, 'institution', v)} isEditMode={isBuilderMode} />
                {renderCertBtn('education', idx, edu.certificate)}
                {isBuilderMode && (
                  <button onClick={() => onRemoveEntry('education', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                )}
              </span>
              <span className="font-bold whitespace-nowrap"><EditableField value={edu.period} onSave={(v) => onUpdateEntry('education', idx, 'period', v)} isEditMode={isBuilderMode} /></span>
            </div>
            <div className="flex justify-between italic text-slate-700 mb-1">
              <span><EditableField value={edu.degree} onSave={(v) => onUpdateEntry('education', idx, 'degree', v)} isEditMode={isBuilderMode} /></span>
              <span><EditableField value={edu.location} onSave={(v) => onUpdateEntry('education', idx, 'location', v)} isEditMode={isBuilderMode} /></span>
            </div>
            <ul className="list-disc ml-4 space-y-1">
              {edu.details?.map((d: string, i: number) => (
                <li key={i}>
                  <EditableField 
                    value={d} 
                    onSave={(v) => {
                      const newDetails = [...edu.details];
                      newDetails[i] = v;
                      onUpdateEntry('education', idx, 'details', newDetails);
                    }} 
                    isEditMode={isBuilderMode} 
                  />
                </li>
              ))}
              {isBuilderMode && (
                <button onClick={() => onUpdateEntry('education', idx, 'details', [...(edu.details || []), 'New Detail'])} className="text-[9px] text-slate-400 italic">+ Add Detail</button>
              )}
            </ul>
          </div>
        ))}
      </section>
    ),
    publications: (
      <section key="publications" className="relative group">
        <div className="flex justify-between items-center border-b border-slate-900 mb-6 pb-1">
          <h2 className="text-sm font-bold uppercase tracking-wider">Publications & Scholarly Work</h2>
          <div className="flex gap-2">
            {isBuilderMode && (
              <button 
                onClick={() => onAddEntry('publications')}
                className="text-[9px] font-black text-red-900 uppercase tracking-widest flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-100 hover:bg-red-100"
              >
                <i className="fas fa-plus"></i> Add Work
              </button>
            )}
            <button onClick={onSync} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 text-[9px] font-black flex items-center gap-1.5 hover:bg-blue-100 transition-all uppercase tracking-widest shadow-sm">
              <i className="fab fa-orcid"></i> Sync ORCID
            </button>
          </div>
        </div>

        {articles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-slate-200"></span> Peer-Reviewed Articles
            </h3>
            {articles.map((pub: Publication, idx: number) => renderPublication(pub, idx + 1))}
          </div>
        )}
        {bookChapters.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-slate-200"></span> Book Chapters
            </h3>
            {bookChapters.map((pub: Publication, idx: number) => renderPublication(pub, idx + 1))}
          </div>
        )}
        {abstracts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-slate-200"></span> Abstracts
            </h3>
            {abstracts.map((pub: Publication, idx: number) => renderPublication(pub, idx + 1))}
          </div>
        )}
      </section>
    ),
    training: (
      <section key="training" className="relative group">
        {renderSectionHeader("Specialized Training", "training")}
        {data.training?.map((t: any, idx: number) => (
          <div key={`training-${idx}`} className="mb-4 group/entry relative">
            <div className="flex justify-between items-baseline font-bold gap-4">
              <span className="flex-1 flex items-center gap-2">
                <EditableField value={t.institution || t.name} onSave={(v) => onUpdateEntry('training', idx, t.institution ? 'institution' : 'name', v)} isEditMode={isBuilderMode} />
                {renderCertBtn('training', idx, t.certificate)}
                {isBuilderMode && (
                  <button onClick={() => onRemoveEntry('training', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                )}
              </span>
              <span className="whitespace-nowrap"><EditableField value={t.period} onSave={(v) => onUpdateEntry('training', idx, 'period', v)} isEditMode={isBuilderMode} /></span>
            </div>
            <p className="italic text-slate-700"><EditableField value={t.degree || t.name} onSave={(v) => onUpdateEntry('training', idx, t.degree ? 'degree' : 'name', v)} isEditMode={isBuilderMode} /></p>
            <ul className="list-disc ml-4 mt-1 space-y-1 text-slate-600">
              {t.details?.map((d: string, i: number) => (
                <li key={i}>
                  <EditableField 
                    value={d} 
                    onSave={(v) => {
                      const newDetails = [...t.details];
                      newDetails[i] = v;
                      onUpdateEntry('training', idx, 'details', newDetails);
                    }} 
                    isEditMode={isBuilderMode} 
                  />
                </li>
              ))}
              {isBuilderMode && (
                <button onClick={() => onUpdateEntry('training', idx, 'details', [...(t.details || []), 'New Detail'])} className="text-[9px] text-slate-400 italic">+ Add Detail</button>
              )}
            </ul>
          </div>
        ))}
      </section>
    ),
    research: (
      <section key="research" className="relative group">
        {renderSectionHeader("Research Experience", "research")}
        {data.research?.map((exp: any, idx: number) => (
          <div key={idx} className="mb-5 group/entry relative">
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold flex items-center gap-2">
                <EditableField value={exp.organization} onSave={(v) => onUpdateEntry('research', idx, 'organization', v)} isEditMode={isBuilderMode} />
                {renderCertBtn('research', idx, exp.certificate)}
                {isBuilderMode && (
                  <button onClick={() => onRemoveEntry('research', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                )}
              </span>
              <span className="font-bold whitespace-nowrap"><EditableField value={exp.period} onSave={(v) => onUpdateEntry('research', idx, 'period', v)} isEditMode={isBuilderMode} /></span>
            </div>
            <p className="italic font-semibold text-slate-800 mb-1"><EditableField value={exp.role} onSave={(v) => onUpdateEntry('research', idx, 'role', v)} isEditMode={isBuilderMode} /></p>
            <ul className="list-disc ml-4 space-y-1">
              {exp.points.map((p: string, i: number) => (
                <li key={i}>
                  <EditableField 
                    value={p} 
                    onSave={(v) => {
                      const newPoints = [...exp.points];
                      newPoints[i] = v;
                      onUpdateEntry('research', idx, 'points', newPoints);
                    }} 
                    isEditMode={isBuilderMode} 
                    multiline
                  />
                </li>
              ))}
              {isBuilderMode && (
                <button onClick={() => onUpdateEntry('research', idx, 'points', [...(exp.points || []), 'New Achievement'])} className="text-[9px] text-slate-400 italic">+ Add Point</button>
              )}
            </ul>
          </div>
        ))}
      </section>
    ),
    clinicalExperience: (
      <section key="clinicalExperience" className="relative group">
        {renderSectionHeader("Clinical Experience", "clinicalExperience")}
        {data.clinicalExperience?.map((exp: any, idx: number) => (
          <div key={idx} className="mb-5 group/entry relative">
            <div className="flex justify-between items-baseline font-bold gap-4">
              <span className="flex items-center gap-2">
                <EditableField value={exp.organization} onSave={(v) => onUpdateEntry('clinicalExperience', idx, 'organization', v)} isEditMode={isBuilderMode} />
                {renderCertBtn('clinicalExperience', idx, exp.certificate)}
                {isBuilderMode && (
                  <button onClick={() => onRemoveEntry('clinicalExperience', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                )}
              </span>
              <span className="whitespace-nowrap"><EditableField value={exp.period} onSave={(v) => onUpdateEntry('clinicalExperience', idx, 'period', v)} isEditMode={isBuilderMode} /></span>
            </div>
            <p className="italic font-semibold text-slate-700"><EditableField value={`${exp.role} - ${exp.location}`} onSave={(v) => {
              const parts = v.split(' - ');
              onUpdateEntry('clinicalExperience', idx, 'role', parts[0]);
              if (parts[1]) onUpdateEntry('clinicalExperience', idx, 'location', parts[1]);
            }} isEditMode={isBuilderMode} /></p>
            <ul className="list-disc ml-4 mt-1 space-y-1 text-slate-600">
              {exp.points?.map((p: string, i: number) => (
                <li key={i}>
                  <EditableField value={p} onSave={(v) => {
                    const newPoints = [...exp.points];
                    newPoints[i] = v;
                    onUpdateEntry('clinicalExperience', idx, 'points', newPoints);
                  }} isEditMode={isBuilderMode} />
                </li>
              ))}
              {isBuilderMode && (
                <button onClick={() => onUpdateEntry('clinicalExperience', idx, 'points', [...(exp.points || []), 'New Point'])} className="text-[9px] text-slate-400 italic">+ Add Point</button>
              )}
            </ul>
          </div>
        ))}
      </section>
    ),
    teaching: (
      <section key="teaching" className="relative group">
        {renderSectionHeader("Teaching Experience", "teaching")}
        {data.teaching?.map((t: any, idx: number) => (
          <div key={idx} className="mb-4 group/entry relative">
            <div className="flex justify-between font-bold gap-4">
              <span className="flex items-center gap-2">
                <EditableField value={`${t.role}, ${t.organization}`} onSave={(v) => {
                   const parts = v.split(', ');
                   onUpdateEntry('teaching', idx, 'role', parts[0]);
                   if (parts[1]) onUpdateEntry('teaching', idx, 'organization', parts[1]);
                }} isEditMode={isBuilderMode} />
                {renderCertBtn('teaching', idx, t.certificate)}
                {isBuilderMode && (
                  <button onClick={() => onRemoveEntry('teaching', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                )}
              </span>
              <span className="whitespace-nowrap"><EditableField value={t.period} onSave={(v) => onUpdateEntry('teaching', idx, 'period', v)} isEditMode={isBuilderMode} /></span>
            </div>
            <ul className="list-disc ml-4 mt-1 space-y-0.5">
              {t.points?.map((p: string, i: number) => (
                <li key={i}>
                  <EditableField value={p} onSave={(v) => {
                    const newPoints = [...t.points];
                    newPoints[i] = v;
                    onUpdateEntry('teaching', idx, 'points', newPoints);
                  }} isEditMode={isBuilderMode} />
                </li>
              ))}
              {isBuilderMode && (
                <button onClick={() => onUpdateEntry('teaching', idx, 'points', [...(t.points || []), 'New Activity'])} className="text-[9px] text-slate-400 italic">+ Add Item</button>
              )}
            </ul>
          </div>
        ))}
      </section>
    ),
    voluntaryWork: (
      <section key="voluntaryWork" className="relative group">
        {renderSectionHeader("Voluntary Work", "voluntaryWork")}
        {data.voluntaryWork?.map((exp: any, idx: number) => (
          <div key={idx} className="mb-5 group/entry relative">
            <div className="flex justify-between items-baseline font-bold gap-4">
              <span className="flex items-center gap-2">
                <EditableField value={exp.organization} onSave={(v) => onUpdateEntry('voluntaryWork', idx, 'organization', v)} isEditMode={isBuilderMode} />
                {renderCertBtn('voluntaryWork', idx, exp.certificate)}
                {isBuilderMode && (
                  <button onClick={() => onRemoveEntry('voluntaryWork', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                )}
              </span>
              <span className="whitespace-nowrap"><EditableField value={exp.period} onSave={(v) => onUpdateEntry('voluntaryWork', idx, 'period', v)} isEditMode={isBuilderMode} /></span>
            </div>
            <p className="italic font-semibold text-slate-700"><EditableField value={`${exp.role} - ${exp.location}`} onSave={(v) => {
               const parts = v.split(' - ');
               onUpdateEntry('voluntaryWork', idx, 'role', parts[0]);
               if (parts[1]) onUpdateEntry('voluntaryWork', idx, 'location', parts[1]);
            }} isEditMode={isBuilderMode} /></p>
            <ul className="list-disc ml-4 mt-1 space-y-1 text-slate-600">
              {exp.points?.map((p: string, i: number) => (
                <li key={i}>
                  <EditableField value={p} onSave={(v) => {
                    const newPoints = [...exp.points];
                    newPoints[i] = v;
                    onUpdateEntry('voluntaryWork', idx, 'points', newPoints);
                  }} isEditMode={isBuilderMode} />
                </li>
              ))}
              {isBuilderMode && (
                <button onClick={() => onUpdateEntry('voluntaryWork', idx, 'points', [...(exp.points || []), 'New Point'])} className="text-[9px] text-slate-400 italic">+ Add Point</button>
              )}
            </ul>
          </div>
        ))}
      </section>
    ),
    leadership: (
      <section key="leadership" className="relative group">
        {renderSectionHeader("Leadership & Service", "leadership")}
        {data.leadership?.map((l: any, idx: number) => (
          <div key={idx} className="mb-5 group/entry relative">
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold flex items-center gap-2">
                <EditableField value={l.organization} onSave={(v) => onUpdateEntry('leadership', idx, 'organization', v)} isEditMode={isBuilderMode} />
                {renderCertBtn('leadership', idx, l.certificate)}
                {isBuilderMode && (
                  <button onClick={() => onRemoveEntry('leadership', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                )}
              </span>
              <span className="font-bold whitespace-nowrap"><EditableField value={l.period} onSave={(v) => onUpdateEntry('leadership', idx, 'period', v)} isEditMode={isBuilderMode} /></span>
            </div>
            <p className="italic text-xs font-semibold mb-1"><EditableField value={l.role} onSave={(v) => onUpdateEntry('leadership', idx, 'role', v)} isEditMode={isBuilderMode} /></p>
            <ul className="list-disc ml-4 space-y-1">
              {l.points?.map((p: string, i: number) => (
                <li key={i}>
                  <EditableField value={p} onSave={(v) => {
                    const newPoints = [...l.points];
                    newPoints[i] = v;
                    onUpdateEntry('leadership', idx, 'points', newPoints);
                  }} isEditMode={isBuilderMode} />
                </li>
              ))}
              {isBuilderMode && (
                <button onClick={() => onUpdateEntry('leadership', idx, 'points', [...(l.points || []), 'New Impact Item'])} className="text-[9px] text-slate-400 italic">+ Add Point</button>
              )}
            </ul>
          </div>
        ))}
      </section>
    ),
    committeeService: (
      <section key="committeeService" className="relative group">
        {renderSectionHeader("Committee Service", "committeeService")}
        <div className="space-y-4">
          {data.committeeService?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-start gap-4 group/entry relative">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-2 shrink-0"></div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold flex items-center gap-2">
                    <EditableField value={item.role} onSave={(v) => onUpdateEntry('committeeService', idx, 'role', v)} isEditMode={isBuilderMode} />
                    {renderCertBtn('committeeService', idx, item.certificate)}
                    {isBuilderMode && (
                      <button onClick={() => onRemoveEntry('committeeService', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                    )}
                  </span>
                  <span className="text-slate-600 italic leading-snug"><EditableField value={item.organization} onSave={(v) => onUpdateEntry('committeeService', idx, 'organization', v)} isEditMode={isBuilderMode} /></span>
                </div>
              </div>
              <span className="font-bold whitespace-nowrap tabular-nums text-right text-slate-500"><EditableField value={item.period} onSave={(v) => onUpdateEntry('committeeService', idx, 'period', v)} isEditMode={isBuilderMode} /></span>
            </div>
          ))}
        </div>
      </section>
    ),
    honors: (
      <section key="honors" className="relative group">
        {renderSectionHeader("Honors and Academic Awards", "honors")}
        <div className="space-y-4">
          {data.honors?.map((h: any, idx: number) => (
            <div key={idx} className="flex justify-between items-start gap-4 group/entry relative">
              <div className="flex items-start gap-3 flex-1">
                <i className="fas fa-award text-amber-500/60 mt-1 shrink-0 text-xs"></i>
                <div className="flex flex-col flex-1">
                  <span className="font-bold flex items-center gap-2">
                    <EditableField value={h.title} onSave={(v) => onUpdateEntry('honors', idx, 'title', v)} isEditMode={isBuilderMode} />
                    {renderCertBtn('honors', idx, h.certificate)}
                    {isBuilderMode && (
                      <button onClick={() => onRemoveEntry('honors', idx)} className="text-slate-200 hover:text-red-600 ml-2"><i className="fas fa-trash-alt text-[10px]"></i></button>
                    )}
                  </span>
                  <span className="text-slate-600 italic leading-snug"><EditableField value={h.organization} onSave={(v) => onUpdateEntry('honors', idx, 'organization', v)} isEditMode={isBuilderMode} /></span>
                </div>
              </div>
              <span className="font-bold whitespace-nowrap tabular-nums text-right text-slate-500"><EditableField value={String(h.year)} onSave={(v) => onUpdateEntry('honors', idx, 'year', Number(v))} isEditMode={isBuilderMode} /></span>
            </div>
          ))}
        </div>
      </section>
    ),
    skills: (
      <section key="skills" className="relative group">
        <h2 className="text-sm font-bold border-b border-slate-900 mb-2 uppercase tracking-wider pb-1">Languages</h2>
        <div className="flex gap-4 font-sans text-xs flex-wrap">
          {data.skills?.find((s: Skill) => s.category === "Languages")?.items.map((lang: string, idx: number) => (
            <span key={idx} className="px-3 py-1 bg-slate-100 rounded-full font-bold flex items-center gap-2">
              <EditableField 
                value={lang} 
                onSave={(v) => {
                  const sIdx = data.skills.findIndex((s: Skill) => s.category === "Languages");
                  const newItems = [...data.skills[sIdx].items];
                  newItems[idx] = v;
                  onUpdateEntry('skills', sIdx, 'items', newItems);
                }} 
                isEditMode={isBuilderMode} 
              />
              {isBuilderMode && (
                <button onClick={() => {
                  const sIdx = data.skills.findIndex((s: Skill) => s.category === "Languages");
                  const newItems = data.skills[sIdx].items.filter((_: any, i: number) => i !== idx);
                  onUpdateEntry('skills', sIdx, 'items', newItems);
                }} className="text-slate-400 hover:text-red-600"><i className="fas fa-times"></i></button>
              )}
            </span>
          ))}
          {isBuilderMode && (
            <button onClick={() => {
              const sIdx = data.skills.findIndex((s: Skill) => s.category === "Languages");
              const newItems = [...data.skills[sIdx].items, "New Language"];
              onUpdateEntry('skills', sIdx, 'items', newItems);
            }} className="text-[10px] font-black uppercase text-slate-400 hover:text-red-900 border-2 border-dotted border-slate-200 px-3 rounded-full transition-all">+ Add Language</button>
          )}
        </div>
      </section>
    )
  };

  return (
    <div className={`bg-white p-8 md:p-14 shadow-2xl max-w-[850px] mx-auto text-[#1a1a1a] font-serif border border-slate-100 min-h-[1100px] leading-tight relative overflow-hidden transition-all ${isBuilderMode ? 'ring-8 ring-red-900/5 ring-inset' : ''}`}>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
      
      {previewImage && activeItem && (
        <CertificateModal 
          imageUrl={previewImage} 
          onClose={() => { setPreviewImage(null); setActiveItem(null); }} 
          onDelete={() => {
            onUpdateCertificate(activeItem.section, activeItem.index, null);
            setPreviewImage(null);
            setActiveItem(null);
          }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-10 border-b pb-8 border-slate-200 relative group">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          <EditableField value={data.name.toUpperCase()} onSave={(v) => onUpdateEntry('name', -1, '', v)} isEditMode={isBuilderMode} />
        </h1>
        <p className="text-[13px] font-sans text-slate-500 uppercase tracking-widest mb-1">
          <EditableField value={data.location} onSave={(v) => onUpdateEntry('location', -1, '', v)} isEditMode={isBuilderMode} />
        </p>
        {data.contact.license && (
          <p className="text-[11px] font-sans text-slate-400 uppercase tracking-[0.2em] font-black mb-2">
            Medical License: <EditableField value={data.contact.license} onSave={(v) => onUpdateEntry('contact', -1, 'license', v)} isEditMode={isBuilderMode} />
          </p>
        )}
        <div className="flex justify-center gap-4 text-xs mt-2 font-medium font-sans">
          <span><EditableField value={data.contact.phone} onSave={(v) => onUpdateEntry('contact', -1, 'phone', v)} isEditMode={isBuilderMode} /></span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-semibold"><EditableField value={data.contact.email} onSave={(v) => onUpdateEntry('contact', -1, 'email', v)} isEditMode={isBuilderMode} /></span>
        </div>
        <div className="flex justify-center gap-3 text-[10px] mt-2 text-slate-400 font-sans font-bold uppercase tracking-tighter">
          <span>ORCID: <EditableField value={data.contact.orcid} onSave={(v) => onUpdateEntry('contact', -1, 'orcid', v)} isEditMode={isBuilderMode} /></span>
          <span>•</span>
          <span>LinkedIn: <EditableField value={data.contact.linkedin} onSave={(v) => onUpdateEntry('contact', -1, 'linkedin', v)} isEditMode={isBuilderMode} /></span>
        </div>
      </div>

      <div className="space-y-9 text-[13px]">
        {sectionOrder.map((sectionKey, idx) => (
          <div key={sectionKey} className="relative group">
            {renderSectionControls(sectionKey, idx)}
            {sections[sectionKey]}
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-slate-100 text-[10px] text-slate-400 text-center font-sans font-black uppercase tracking-[0.3em] select-none">
        Academic Dossier • <EditableField value={data.name} onSave={(v) => onUpdateEntry('name', -1, '', v)} isEditMode={isBuilderMode} /> • Harvard Chan Candidate 2025
      </div>
    </div>
  );
};

// --- AI Chat Assistant ---
const ChatAssistant: React.FC<{ currentCv: any; onUpdate: (section: string, newContent: string) => void; syncTrigger: number }> = ({ currentCv, onUpdate, syncTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: any; type?: 'text' | 'audit' }[]>([
    { role: 'ai', content: "Dr. Rech, I'm ready to manage your bibliography. I can sync with your ORCID profile (0000-0002-2961-9443) and append new works to your CV while maintaining Harvard Chan standards. How can I assist you today?", type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (syncTrigger > 0) {
      setIsOpen(true);
      handleOrcidSync();
    }
  }, [syncTrigger]);

  const handleOrcidSync = async () => {
    setLoading(true);
    setMessages(prev => [...prev, { role: 'ai', content: "Connecting to ORCID Public API for 0000-0002-2961-9443...", type: 'text' }]);
    
    try {
      const orcidWorks = await fetchOrcidData("0000-0002-2961-9443");
      if (orcidWorks && orcidWorks.length > 0) {
        setMessages(prev => [...prev, { role: 'ai', content: `Found ${orcidWorks.length} potential works. Processing impact analysis and AMA formatting...`, type: 'text' }]);
        
        const followUp = await getProResponse(
          `I have just fetched the following raw data from Dr. Rech's ORCID profile. Please compare this with the current CV publications, identify NEW entries, generate public-health significance statements for them, and provide an updated, combined publications list. DO NOT omit existing entries. Data: ${JSON.stringify(orcidWorks)}`, 
          currentCv
        );

        if (followUp.functionCalls && followUp.functionCalls.length > 0) {
          for (const ffc of followUp.functionCalls) {
            if (ffc.name === "updateCvPart") {
              onUpdate((ffc.args as any).section, (ffc.args as any).content);
              setMessages(prev => [...prev, { role: 'ai', content: `**Sync Completed.** New works have been appended and formatted in AMA style. Significance statements have been generated for the latest entries.`, type: 'text' }]);
            }
          }
        } else if (followUp.text) {
          setMessages(prev => [...prev, { role: 'ai', content: followUp.text, type: 'text' }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "No works found on ORCID for this ID or access was denied.", type: 'text' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error during ORCID synchronization. Please verify the ID or try again later.", type: 'text' }]);
    }
    setLoading(false);
  };

  const handleSend = async (imageFile?: File, directQuery?: string) => {
    const userMsg = directQuery || input;
    if (!userMsg.trim() && !imageFile) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg || "[Doc Uploaded]", type: 'text' }]);
    setLoading(true);

    try {
      let result;
      if (imageFile) {
        const base64 = await (new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
        }));
        result = await getProResponse(userMsg || "Extract and update based on Harvard standards.", currentCv, { data: base64, mimeType: imageFile.type });
      } else {
        result = await getProResponse(userMsg, currentCv);
      }

      if (result.functionCalls && result.functionCalls.length > 0) {
        for (const fc of result.functionCalls) {
          if (fc.name === "updateCvPart") {
            const { section, content, reasoning } = fc.args as any;
            onUpdate(section, content);
            setMessages(prev => [...prev, { role: 'ai', content: `**Strategic Update:**\n\n${reasoning}`, type: 'text' }]);
          } else if (fc.name === "provideCvAudit") {
            setMessages(prev => [...prev, { role: 'ai', content: fc.args, type: 'audit' }]);
          } else if (fc.name === "fetchOrcidPublications") {
            await handleOrcidSync();
          }
        }
      }
      if (result.text) setMessages(prev => [...prev, { role: 'ai', content: result.text, type: 'text' }]);
    } catch (e) { 
      setMessages(prev => [...prev, { role: 'ai', content: "Architect disconnected. Please retry.", type: 'text' }]); 
    }
    setLoading(false);
  };

  const AuditReport = ({ audit }: { audit: any }) => (
    <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-900 text-white rounded-xl flex items-center justify-center"><i className="fas fa-clipboard-check"></i></div>
        <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-400">Harvard Admissions Strategy Audit</h4>
      </div>
      
      <div className="space-y-6 text-[13px]">
        <div>
          <h5 className="font-bold text-green-700 mb-2 flex items-center gap-2"><i className="fas fa-shield-heart"></i> Key Strengths</h5>
          <ul className="list-disc ml-4 space-y-1 text-slate-700">
            {audit.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-red-700 mb-2 flex items-center gap-2"><i className="fas fa-triangle-exclamation"></i> Critical Gaps</h5>
          <ul className="list-disc ml-4 space-y-1 text-slate-700">
            {audit.gaps?.map((g: string, i: number) => <li key={i}>{g}</li>)}
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><i className="fas fa-lightbulb"></i> Recommendations</h5>
          <div className="space-y-3">
            {audit.recommendations?.map((r: any, i: number) => (
              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="font-bold text-[11px] uppercase text-slate-500 mb-1">{r.section}</p>
                <p className="font-medium mb-1">{r.suggestion}</p>
                <p className="text-[11px] italic text-slate-500">{r.harvardLogic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="chat-assistant">
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-[#1a1a1a] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-900 transition-all transform hover:scale-110">
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-feather-pointed'} text-2xl`}></i>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-[500px] h-[700px] bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border flex flex-col z-50 overflow-hidden animate-in zoom-in-95">
          <div className="p-7 bg-[#1a1a1a] text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Harvard Career Architect</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">Audit & Feedback Mode Active</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => handleSend(undefined, "Perform a comprehensive admissions audit of my CV.")} className="px-4 py-2 bg-red-900 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-800 transition-colors" title="Trigger Audit">Audit CV</button>
               <i className="fas fa-gavel text-red-600 text-xl animate-pulse"></i>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 space-y-6 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.type === 'audit' ? (
                  <AuditReport audit={m.content} />
                ) : (
                  <div className={`max-w-[85%] p-5 rounded-3xl text-[13px] shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-[#1a1a1a] text-white' : 'bg-white border text-slate-800'}`}>
                    {m.content}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Consulting Master Architect...</div>}
          </div>
          <div className="p-7 border-t bg-white flex flex-col gap-4">
             <div className="flex gap-3">
               <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500"><i className="fas fa-paperclip"></i></button>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSend(e.target.files[0])} />
               <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask for feedback or fetch ORCID..." className="flex-1 px-6 py-4 bg-slate-100 rounded-2xl text-[13px] outline-none focus:ring-2 focus:ring-red-900 transition-all" />
               <button onClick={() => handleSend()} className="w-12 h-12 bg-red-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><i className="fas fa-paper-plane"></i></button>
             </div>
             <p className="text-[10px] text-center text-slate-400 font-medium">Focused on <b>Harvard T.H. Chan School of Public Health</b> standards.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_ORDER = [
  'education', 
  'training', 
  'publications', 
  'research', 
  'clinicalExperience', 
  'voluntaryWork', 
  'teaching', 
  'leadership', 
  'committeeService', 
  'honors', 
  'skills'
];

export default function App() {
  const [cv, setCv] = useState(() => {
    const saved = localStorage.getItem('rech-cv-data');
    return saved ? JSON.parse(saved) : INITIAL_CV_DATA;
  });
  const [sectionOrder, setSectionOrder] = useState(() => {
    const saved = localStorage.getItem('rech-cv-order');
    return saved ? JSON.parse(saved) : DEFAULT_ORDER;
  });
  const [syncTrigger, setSyncTrigger] = useState(0);
  const [isBuilderMode, setIsBuilderMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('rech-cv-data', JSON.stringify(cv));
  }, [cv]);

  useEffect(() => {
    localStorage.setItem('rech-cv-order', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const handleUpdateCv = (section: string, newContent: string) => {
    try {
      const parsed = typeof newContent === 'string' ? JSON.parse(newContent) : newContent;
      setCv(prev => ({ ...prev, [section]: parsed }));
    } catch (e) { 
      console.error("Update error", e); 
    }
  };

  const handleUpdateCertificate = (section: string, index: number, base64: string | null) => {
    setCv(prev => {
      const target = (prev as any)[section];
      if (!target) return prev;
      const updatedSection = [...target];
      if (updatedSection[index]) {
        updatedSection[index] = { ...updatedSection[index], certificate: base64 };
      }
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleToggleSelectPub = (idx: number) => {
    setCv(prev => {
      if (!prev.publications) return prev;
      const updatedPubs = [...prev.publications];
      if (!updatedPubs[idx]) return prev;
      updatedPubs[idx] = { ...updatedPubs[idx], selected: !updatedPubs[idx].selected };
      return { ...prev, publications: updatedPubs };
    });
  };

  const handleUpdateEntry = (section: string, index: number, field: string, value: any) => {
    setCv(prev => {
      if (index === -1) {
        if (field) return { ...prev, [section]: { ...(prev as any)[section], [field]: value } };
        return { ...prev, [section]: value };
      }
      const target = (prev as any)[section];
      if (!target) return prev;
      const updated = [...target];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [section]: updated };
    });
  };

  const handleRemoveEntry = (section: string, index: number) => {
    if (!confirm("Are you sure you want to remove this entry?")) return;
    setCv(prev => {
      const target = (prev as any)[section];
      if (!target) return prev;
      const updated = target.filter((_: any, i: number) => i !== index);
      return { ...prev, [section]: updated };
    });
  };

  const handleAddEntry = (section: string) => {
    setCv(prev => {
      const target = (prev as any)[section] || [];
      const newEntry: any = { 
        title: "New Entry", 
        period: "2024", 
        organization: "Organization", 
        role: "Role",
        location: "Location",
        details: ["New detail point"], 
        points: ["Key achievement point"] 
      };
      
      if (section === 'publications') {
        newEntry.authors = "Rech MM";
        newEntry.journal = "Target Journal";
        newEntry.type = "Peer-Reviewed";
        newEntry.year = 2025;
      }
      
      if (section === 'skills') {
        // Special case for skills as they have a different structure
        return prev;
      }
      
      return { ...prev, [section]: [newEntry, ...target] };
    });
  };

  const handleMoveSection = (direction: 'up' | 'down', index: number) => {
    setSectionOrder(prev => {
      const newOrder = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const [moved] = newOrder.splice(index, 1);
      newOrder.splice(targetIndex, 0, moved);
      return newOrder;
    });
  };

  const resetDossier = () => {
    if (confirm("This will revert all manual edits and reordering. Proceed?")) {
      setCv(INITIAL_CV_DATA);
      setSectionOrder(DEFAULT_ORDER);
      localStorage.removeItem('rech-cv-data');
      localStorage.removeItem('rech-cv-order');
    }
  };

  const triggerSync = () => setSyncTrigger(prev => prev + 1);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 h-20 flex items-center px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-900/20"><i className="fas fa-university"></i></div>
            <div className="sm:block">
              <h1 className="text-xl font-black uppercase leading-none tracking-tight">Matheus Rech, M.D.</h1>
              <p className="text-[9px] font-black text-red-900 tracking-[0.3em] mt-1">HARVARD CHAN MPH CANDIDATE 2025</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${isBuilderMode ? 'bg-red-50 border-red-200 shadow-inner' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isBuilderMode ? 'text-red-900' : 'text-slate-400'}`}>
                {isBuilderMode ? 'Architect Mode' : 'Dossier View'}
              </span>
              <button 
                onClick={() => setIsBuilderMode(!isBuilderMode)}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isBuilderMode ? 'bg-red-900' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isBuilderMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <button onClick={() => {
              // Get CV content
              const cvContainer = document.querySelector('.cv-container');
              if (!cvContainer) return;

              // Clone and clean the content
              const clone = cvContainer.cloneNode(true) as HTMLElement;

              // Remove elements we don't want in export
              clone.querySelectorAll('button, input, .pub-type-tag, [class*="animate-"]').forEach(el => el.remove());
              clone.querySelectorAll('p[class*="italic"][class*="text-slate"]').forEach(el => el.remove());
              clone.querySelectorAll('span[class*="bg-red"]').forEach(el => el.remove());

              // Generate clean HTML with improved formatting
              const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - Matheus Machado Rech, M.D.</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 10.5pt;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
      padding: 0.75in 1in;
      max-width: 8.5in;
      margin: 0 auto;
    }

    /* Header section */
    .cv-header {
      text-align: center;
      margin-bottom: 1.5em;
      padding-bottom: 1em;
      border-bottom: 2px solid #1a1a1a;
    }

    h1 {
      font-size: 18pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 0.3em;
      color: #1a1a1a;
    }

    /* Section headers */
    h2 {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-bottom: 1px solid #333;
      margin: 1.5em 0 0.75em;
      padding-bottom: 0.3em;
      color: #1a1a1a;
    }

    /* Subsection headers */
    h3 {
      font-size: 10.5pt;
      font-weight: bold;
      margin: 1em 0 0.3em;
      color: #1a1a1a;
    }

    /* Entry blocks (education, experience, etc.) */
    .entry {
      margin-bottom: 1em;
      padding-left: 0;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.2em;
    }

    .entry-title {
      font-weight: bold;
    }

    .entry-date {
      font-style: italic;
      color: #333;
    }

    .entry-subtitle {
      font-style: italic;
      color: #444;
      margin-bottom: 0.3em;
    }

    /* Publications */
    .publication {
      margin-bottom: 0.8em;
      text-align: justify;
      text-indent: -1.5em;
      padding-left: 1.5em;
    }

    .pub-number {
      font-weight: bold;
    }

    /* Links */
    a {
      color: #1a1a1a;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    a[href*="doi.org"] {
      color: #2563eb;
      font-size: 9pt;
    }

    /* Contact info */
    .contact-info {
      font-size: 10pt;
      color: #333;
      margin-top: 0.3em;
    }

    .contact-info a {
      color: #333;
    }

    /* Lists */
    ul {
      margin: 0.5em 0 0.5em 1.5em;
    }

    li {
      margin-bottom: 0.3em;
    }

    /* Emphasis */
    em { font-style: italic; }
    strong, b { font-weight: bold; }

    /* Override Tailwind classes */
    .text-center { text-align: center; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .gap-2 { gap: 0.5em; }
    .mb-1 { margin-bottom: 0.25em; }
    .mb-2 { margin-bottom: 0.5em; }
    .mb-4 { margin-bottom: 1em; }
    .mt-2 { margin-top: 0.5em; }
    .text-sm { font-size: 9.5pt; }
    .text-xs { font-size: 9pt; }
    .font-bold { font-weight: bold; }
    .italic { font-style: italic; }

    /* Clean up backgrounds and decorations */
    [class*="rounded"] { border-radius: 0 !important; }
    [class*="shadow"] { box-shadow: none !important; }
    [class*="bg-white"], [class*="bg-slate"], [class*="bg-gray"] { background: transparent !important; }
    [class*="bg-red"], [class*="bg-blue"], [class*="bg-green"] { background: transparent !important; }
    [class*="text-red"], [class*="text-blue"], [class*="text-green"] { color: #1a1a1a !important; }
    [class*="text-slate"] { color: #333 !important; }
    [class*="border-l-4"], [class*="border-l-2"] { border-left: none !important; padding-left: 0 !important; }

    /* Print styles */
    @media print {
      body {
        padding: 0.5in 0.75in;
        font-size: 10pt;
      }
      @page {
        margin: 0.5in;
        size: letter;
      }
      a[href*="doi.org"] { color: #000 !important; }
      h2 { page-break-after: avoid; }
      .entry, .publication { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  ${clone.innerHTML}
</body>
</html>`;

              // Open in new tab
              const blob = new Blob([html], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
            }} className="px-5 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-red-900 transition-all shadow-lg shadow-black/10 flex items-center gap-2">
              <i className="fas fa-file-pdf"></i> Export Dossier
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 md:p-14">
        <div className="flex flex-col xl:flex-row gap-14 items-start">
          <div className="xl:w-80 space-y-7 lg:sticky lg:top-36 w-full sidebar-panel">
            <div className="bg-white p-9 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-5 tracking-[0.2em]">Career Intelligence</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-600 font-bold text-xs"><i className="fas fa-check-circle"></i> Verification Docs Synced</div>
                <div className="flex items-center gap-3 text-green-600 font-bold text-xs"><i className="fas fa-check-circle"></i> Cloud Storage Ready</div>
                <hr className="my-5 border-slate-100" />
                <button 
                  onClick={triggerSync}
                  className="w-full flex items-center justify-between px-5 py-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-colors font-bold text-xs group"
                >
                  <span>SYNC ORCID ID</span>
                  <i className="fab fa-orcid text-lg group-hover:rotate-12 transition-transform"></i>
                </button>
                {isBuilderMode && (
                   <button 
                    onClick={resetDossier}
                    className="w-full flex items-center justify-between px-5 py-3 bg-red-50 text-red-700 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors font-bold text-xs group mt-2"
                  >
                    <span>REVERT ALL EDITS</span>
                    <i className="fas fa-rotate-left group-hover:-rotate-45 transition-transform"></i>
                  </button>
                )}
              </div>
            </div>
            
            {isBuilderMode && (
              <div className="p-6 bg-red-900 text-white rounded-[2rem] shadow-2xl shadow-red-900/20 animate-in slide-in-from-left-5">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2">Architect Controls</h4>
                <p className="text-[10px] leading-relaxed opacity-80">Click text to edit. Drag headers to reorder. Use icons to add/remove achievements. Changes save to your browser instantly.</p>
              </div>
            )}
          </div>
          <div className="flex-1 w-full animate-in slide-in-from-bottom-5 duration-700 cv-container">
            <TraditionalCV 
              data={cv} 
              onToggleSelect={handleToggleSelectPub} 
              onSync={triggerSync} 
              onUpdateCertificate={handleUpdateCertificate}
              isBuilderMode={isBuilderMode}
              onUpdateEntry={handleUpdateEntry}
              onRemoveEntry={handleRemoveEntry}
              onAddEntry={handleAddEntry}
              sectionOrder={sectionOrder}
              onMoveSection={handleMoveSection}
            />
          </div>
        </div>
      </main>

      <ChatAssistant currentCv={cv} onUpdate={handleUpdateCv} syncTrigger={syncTrigger} />
    </div>
  );
}
