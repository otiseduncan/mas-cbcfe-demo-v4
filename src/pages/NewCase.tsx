import React, { useState } from "react";
import { CLASSES } from "../theme";
import { createCase } from "../store/caseStore";
import type { Attachment } from "../store/caseStore";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { readAndCompressImage } from "../utils/image";

type Pending = { id: string; preview: string; file: File };

const NewCase: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ro, setRO] = useState("");
  const [vin, setVIN] = useState("");
  const [shop, setShop] = useState("");
  const [issueType, setIssueType] = useState("Bumper install");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending[]>([]);

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: Pending[] = [];
    for (const f of Array.from(files)) {
      const id = Math.random().toString(36).slice(2, 10);
      const url = URL.createObjectURL(f);
      next.push({ id, preview: url, file: f });
    }
    setPending(p => [...p, ...next]);
  };
  const removePending = (id: string) => { setPending(p => p.filter(x => x.id !== id)); };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!ro || !vin || !shop || !issueType) { setError("All fields except notes are required"); return; }
    if (!user) { setError("You must be logged in"); return; }
    let attachments: Attachment[] = [];
    if (pending.length) {
      const compressed = await Promise.all(pending.map(p => readAndCompressImage(p.file)));
      attachments = compressed.map(c => ({ id: Math.random().toString(36).slice(2, 10), name: c.name, type: c.type, dataUrl: c.dataUrl, createdAt: Date.now(), by: user.username }));
    }
    const created = createCase({ ro, vin, shop, issueType, notes, attachments }, user);
    navigate(`/case/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl text-white font-semibold mb-4">New Case</h1>
        <form onSubmit={onSubmit} className={`${CLASSES.card} p-6`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-neutral-300 text-sm mb-1">RO #</label><input className={CLASSES.input} value={ro} onChange={e => setRO(e.target.value)} /></div>
            <div><label className="block text-neutral-300 text-sm mb-1">VIN</label><input className={CLASSES.input} value={vin} onChange={e => setVIN(e.target.value)} /></div>
            <div><label className="block text-neutral-300 text-sm mb-1">Shop</label><input className={CLASSES.input} value={shop} onChange={e => setShop(e.target.value)} /></div>
            <div>
              <label className="block text-neutral-300 text-sm mb-1">Issue Type</label>
              <select className={CLASSES.input} value={issueType} onChange={e => setIssueType(e.target.value)}>
                <option>Bumper install</option>
                <option>Bumper removal</option>
                <option>Waiting parts</option>
                <option>Alignment hold</option>
                <option>Not ready</option>
                <option>No space</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-neutral-300 text-sm mb-1">Notes</label>
            <textarea className={CLASSES.input} rows={6} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="mt-6">
            <div className="text-white font-medium mb-2">Photos (optional)</div>
            <div className="flex items-center gap-3 flex-wrap">
              <label className={`${CLASSES.btnPrimary} cursor-pointer`}>
                Snap Photo / Upload
                <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={e => onFiles(e.target.files)} />
              </label>
            </div>
            {pending.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {pending.map(p => (
                  <div key={p.id} className="relative">
                    <img src={p.preview} className="w-full h-24 object-cover rounded border border-neutral-700" />
                    <button type="button" className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded" onClick={() => removePending(p.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-neutral-500 mt-2">On mobile this opens the camera; on desktop it opens a file chooser.</div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className={CLASSES.btnPrimary} type="submit">Create Case</button>
            <Link to="/" className={CLASSES.btn}>Cancel</Link>
          </div>
  </form>
  {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
};
export default NewCase;
