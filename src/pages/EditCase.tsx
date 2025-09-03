import React, { useEffect, useState } from "react";
import { getCase, updateCase } from "../store/caseStore";
import type { CaseItem } from "../store/caseStore";
import { CLASSES } from "../theme";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const EditCase: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<CaseItem | undefined>();
  const [shop, setShop] = useState("");
  const [issueType, setIssueType] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    const found = getCase(id);
    setItem(found);
    if (found) { setShop(found.shop); setIssueType(found.issueType); setNotes(found.notes); }
  }, [id]);

  if (!item) return <div className="min-h-screen bg-neutral-950 text-neutral-400 p-6">Case not found.</div>;
  if (user?.role !== "MGR") return <div className="min-h-screen bg-neutral-950 text-neutral-400 p-6">Only managers can edit cases.</div>;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    updateCase(id, { shop, issueType, notes });
    navigate(`/case/${id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl text-white font-semibold mb-4">Edit Case {item.ro}</h1>
        <form onSubmit={onSubmit} className={`${CLASSES.card} p-6`}>
          <div className="grid sm:grid-cols-2 gap-4">
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
          <div className="mt-6 flex items-center gap-2">
            <button className={CLASSES.btnPrimary} type="submit">Save</button>
            <button className={CLASSES.btn} type="button" onClick={() => history.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditCase;
