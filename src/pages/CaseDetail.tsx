import React, { useEffect, useRef, useState } from "react";
import { addAttachments, claimCase, getCase, releaseCase, setStatus } from "../store/caseStore";
import type { Attachment, CaseItem } from "../store/caseStore";
import { CLASSES } from "../theme";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { readAndCompressImage } from "../utils/image";

const CaseDetail: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const { user } = useAuth();
  const [item, setItem] = useState<CaseItem | undefined>();
  const claimedOnce = useRef(false);

  useEffect(() => { if (id) setItem(getCase(id)); }, [id]);

  // Auto-claim for managers
  useEffect(() => {
    if (!item || !user || user.role !== "MGR" || claimedOnce.current) return;
    if (!item.claimedBy || item.claimedBy === user.username) {
      const updated = claimCase(item.id, user);
      claimedOnce.current = true;
      setItem(updated);
    }
  }, [item, user]);

  if (!item) return <div className="min-h-screen bg-neutral-950 text-neutral-400 p-6">Case not found.</div>;

  const canManage = user?.role === "MGR";
  const canAddPhotos = !!user && (user.role === "MGR" || (user.role === "TECH" && user.username === item.createdBy && item.status === "Open"));

  const resolveCase = () => { if (!id || !user) return; if (item.status === "Open") { const updated = setStatus(id, "Closed", user); setItem(updated); } };
  const reopenCase = () => { if (!id || !user) return; const updated = setStatus(id, "Open", user); setItem(updated); };
  const onAddPhotos = async (files: FileList | null) => {
    if (!files || !user) return;
    const processed: Attachment[] = [];
    for (const f of Array.from(files)) {
      const c = await readAndCompressImage(f);
      processed.push({ id: Math.random().toString(36).slice(2, 10), name: c.name, type: c.type, dataUrl: c.dataUrl, createdAt: Date.now(), by: user.username });
    }
    const updated = addAttachments(item.id, processed, user); setItem(updated);
  };
  const onRelease = () => { if (!user) return; const updated = releaseCase(item.id, user); setItem(updated); };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-white font-semibold">Case {item.ro}</h1>
          <div className="flex items-center gap-2">
            <Link to="/" className={CLASSES.btnPrimary}>Back</Link>
            {canManage && item.claimedBy === user?.username && <button className={CLASSES.btn} onClick={onRelease}>Release</button>}
            {item.status === "Open" && <button onClick={resolveCase} className={CLASSES.btnPrimary}>Resolve</button>}
            {item.status === "Closed" && canManage && <button onClick={reopenCase} className={CLASSES.btn}>Reopen</button>}
          </div>
        </div>

        {item.claimedBy && (
          <div className="mt-3 p-3 border border-red-700/50 bg-red-900/20 text-red-200 rounded">
            This case is being worked by <span className="font-medium">{item.claimedByName || item.claimedBy}</span> since {item.claimedAt ? new Date(item.claimedAt).toLocaleString() : "now"}.
          </div>
        )}

        <div className={`${CLASSES.card} p-6 mt-4`}>
          <div className="grid sm:grid-cols-2 gap-4 text-neutral-300">
            <div><span className="text-neutral-400">Status:</span> {item.status === "Open" ? <span className={CLASSES.badgeOpen}>Open</span> : <span className={CLASSES.badgeClosed}>Closed</span>}</div>
            <div><span className="text-neutral-400">Updated:</span> {new Date(item.updatedAt).toLocaleString()}</div>
            <div><span className="text-neutral-400">Shop:</span> {item.shop}</div>
            <div><span className="text-neutral-400">VIN:</span> {item.vin}</div>
            <div><span className="text-neutral-400">Issue Type:</span> {item.issueType}</div>
            <div><span className="text-neutral-400">Created by:</span> {item.createdBy}</div>
          </div>
          <div className="mt-4">
            <div className="text-neutral-400 text-sm">Notes</div>
            <div className="text-neutral-200 whitespace-pre-wrap">{item.notes || "—"}</div>
          </div>
        </div>

        <div className={`${CLASSES.card} p-6 mt-4`}>
          <div className="flex items-center justify-between">
            <div className="text-white font-medium">Photos</div>
            {canAddPhotos && (
              <label className={`${CLASSES.btnPrimary} cursor-pointer`}>
                Add Photos
                <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={e => onAddPhotos(e.target.files)} />
              </label>
            )}
          </div>
          {(!item.attachments || item.attachments.length === 0) && (<div className="text-neutral-400 text-sm mt-2">No photos yet.</div>)}
          {item.attachments && item.attachments.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
              {item.attachments.map(att => (
                <a key={att.id} href={att.dataUrl} target="_blank" className="block group relative">
                  <img src={att.dataUrl} className="w-full h-24 object-cover rounded border border-neutral-700 group-hover:border-neutral-500" />
                  <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">{new Date(att.createdAt).toLocaleDateString()}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CaseDetail;
