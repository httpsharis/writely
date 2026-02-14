'use client';

import { useState } from 'react';
import { Users, MessageSquare, Plus, Trash2, Check, X, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICharacter } from '@/types/project';
import type { WriterComment } from '@/types/chapter';
import type { EditorSelection } from './TiptapEditor';

interface Props {
  characters: ICharacter[];
  comments: WriterComment[];
  getSelection: () => EditorSelection | null;
  onAddCharacter: (char: { name: string; role: string; description?: string }) => void;
  onRemoveCharacter: (index: number) => void;
  onAddComment: (comment: { text: string; anchor: { from: number; to: number; quotedText: string } }) => void;
  onRemoveComment: (commentId: string) => void;
  onResolveComment: (commentId: string) => void;
}

type Tab = 'characters' | 'comments';

const ROLES = ['Protagonist', 'Antagonist', 'Support', 'Minor'] as const;

const ROLE_STYLES: Record<string, string> = {
  Protagonist: 'bg-black text-white',
  Antagonist: 'border border-black bg-white text-black',
  Support: 'bg-blue-500 text-white',
  Minor: 'border border-gray-300 bg-gray-100 text-gray-600',
};

export default function ToolsPanel({
  characters,
  comments,
  getSelection,
  onAddCharacter,
  onRemoveCharacter,
  onAddComment,
  onRemoveComment,
  onResolveComment,
}: Props) {
  const [tab, setTab] = useState<Tab>('characters');

  // Character form
  const [showCharForm, setShowCharForm] = useState(false);
  const [charName, setCharName] = useState('');
  const [charRole, setCharRole] = useState<string>('Support');
  const [charDesc, setCharDesc] = useState('');

  // Comment form
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [capturedSelection, setCapturedSelection] = useState<EditorSelection | null>(null);

  const unresolvedCount = comments.filter((c) => !c.isResolved).length;

  function handleAddCharacter() {
    if (!charName.trim()) return;
    onAddCharacter({ name: charName.trim(), role: charRole, description: charDesc.trim() || undefined });
    setCharName('');
    setCharRole('Support');
    setCharDesc('');
    setShowCharForm(false);
  }

  function handleAddComment() {
    if (!commentText.trim()) return;
    onAddComment({
      text: commentText.trim(),
      anchor: capturedSelection
        ? { from: capturedSelection.from, to: capturedSelection.to, quotedText: capturedSelection.quotedText }
        : { from: 0, to: 0, quotedText: '' },
    });
    setCommentText('');
    setCapturedSelection(null);
    setShowCommentForm(false);
  }

  function openCommentForm() {
    const sel = getSelection();
    setCapturedSelection(sel);
    setShowCommentForm(true);
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden border-l-[3px] border-black bg-white">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b-[3px] border-black">
        {(['characters', 'comments'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-r border-black px-2 py-3 text-center font-mono text-[10px] font-bold tracking-[0.5px] transition-colors last:border-r-0',
              tab === t ? 'bg-secondary text-white' : 'bg-gray-100 hover:bg-gray-200',
            )}
          >
            {t === 'characters' ? (
              <>
                <Users size={11} />
                CHARS
                {characters.length > 0 && (
                  <span className={cn(
                    'ml-0.5 rounded-full px-1.5 py-px text-[8px] font-bold',
                    tab === t ? 'bg-white/30 text-white' : 'bg-gray-300 text-gray-600',
                  )}>
                    {characters.length}
                  </span>
                )}
              </>
            ) : (
              <>
                <MessageSquare size={11} />
                NOTES
                {unresolvedCount > 0 && (
                  <span className={cn(
                    'ml-0.5 rounded-full px-1.5 py-px text-[8px] font-bold',
                    tab === t ? 'bg-white/30 text-white' : 'bg-secondary text-white',
                  )}>
                    {unresolvedCount}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
        {/* ── Characters Tab ── */}
        {tab === 'characters' && (
          <>
            {characters.length === 0 && !showCharForm && (
              <div className="flex h-40 flex-col items-center justify-center text-center opacity-50">
                <Users size={24} />
                <p className="mt-2 font-mono text-[11px] leading-relaxed">
                  No characters yet.
                </p>
              </div>
            )}

            {characters.map((char, i) => (
              <div key={i} className="group mb-2 border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_#eee]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.3px]">
                    {char.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      'px-1.5 py-px font-mono text-[8px] font-bold uppercase tracking-wider',
                      ROLE_STYLES[char.role] || ROLE_STYLES.Minor,
                    )}>
                      {char.role}
                    </span>
                    <button
                      onClick={() => onRemoveCharacter(i)}
                      title="Remove character"
                      className="cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger max-lg:opacity-100"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
                {char.description && (
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{char.description}</p>
                )}
              </div>
            ))}

            {/* Add character form */}
            {showCharForm ? (
              <div className="mt-2 space-y-2 border-2 border-dashed border-gray-400 p-3">
                <input
                  type="text"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  placeholder="Character name"
                  className="w-full border-2 border-black px-2 py-1.5 font-mono text-[11px] outline-none placeholder:text-gray-400"
                  autoFocus
                />
                <select
                  value={charRole}
                  onChange={(e) => setCharRole(e.target.value)}
                  className="w-full border-2 border-black bg-white px-2 py-1.5 font-mono text-[11px] outline-none"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <textarea
                  value={charDesc}
                  onChange={(e) => setCharDesc(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full resize-none border-2 border-black px-2 py-1.5 font-mono text-[11px] outline-none placeholder:text-gray-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCharacter}
                    disabled={!charName.trim()}
                    className="flex-1 cursor-pointer border-2 border-black bg-black py-1.5 font-mono text-[10px] font-bold text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ADD
                  </button>
                  <button
                    onClick={() => { setShowCharForm(false); setCharName(''); setCharDesc(''); }}
                    className="cursor-pointer border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold transition-colors hover:bg-gray-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCharForm(true)}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 border-2 border-black bg-black px-2 py-2 font-mono text-[10px] font-bold tracking-wider text-white transition-colors hover:bg-white hover:text-black"
              >
                <Plus size={12} />
                ADD CHARACTER
              </button>
            )}
          </>
        )}

        {/* ── Comments Tab ── */}
        {tab === 'comments' && (
          <>
            {comments.length === 0 && !showCommentForm && (
              <div className="flex h-40 flex-col items-center justify-center text-center opacity-50">
                <MessageSquare size={24} />
                <p className="mt-2 font-mono text-[11px] leading-relaxed">
                  No notes yet.<br />Add a writing note below.
                </p>
              </div>
            )}

            {comments.map((c) => (
              <div
                key={c._id}
                className={cn(
                  'group mb-2 border-2 border-black p-2.5',
                  c.isResolved ? 'border-gray-300 bg-gray-50 opacity-60' : 'bg-white shadow-[2px_2px_0px_#eee]',
                )}
              >
                {c.anchor.quotedText && (
                  <div className="mb-1.5 border-l-2 border-secondary pl-2 font-serif text-[11px] italic text-gray-400">
                    &ldquo;{c.anchor.quotedText.slice(0, 80)}{c.anchor.quotedText.length > 80 ? '...' : ''}&rdquo;
                  </div>
                )}
                <p className="text-[12px] leading-relaxed">{c.text}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-wider opacity-40">
                    {c.userName}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onResolveComment(c._id)}
                      title={c.isResolved ? 'Unresolve' : 'Resolve'}
                      className={cn(
                        'cursor-pointer transition-colors',
                        c.isResolved ? 'text-success hover:text-gray-500' : 'text-gray-300 hover:text-success',
                      )}
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={() => onRemoveComment(c._id)}
                      title="Delete note"
                      className="cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger max-lg:opacity-100"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add comment form */}
            {showCommentForm ? (
              <div className="mt-2 space-y-2 border-2 border-dashed border-gray-400 p-3">
                {capturedSelection && capturedSelection.quotedText && (
                  <div className="flex items-start gap-1.5 border-l-2 border-secondary bg-gray-50 px-2 py-1.5">
                    <Type size={10} className="mt-0.5 shrink-0 text-secondary" />
                    <span className="font-serif text-[10px] italic text-gray-500">
                      &ldquo;{capturedSelection.quotedText.slice(0, 100)}{capturedSelection.quotedText.length > 100 ? '...' : ''}&rdquo;
                    </span>
                  </div>
                )}
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a note..."
                  rows={3}
                  className="w-full resize-none border-2 border-black px-2 py-1.5 font-mono text-[11px] outline-none placeholder:text-gray-400"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="flex-1 cursor-pointer border-2 border-black bg-black py-1.5 font-mono text-[10px] font-bold text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ADD NOTE
                  </button>
                  <button
                    onClick={() => { setShowCommentForm(false); setCommentText(''); setCapturedSelection(null); }}
                    className="cursor-pointer border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold transition-colors hover:bg-gray-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openCommentForm}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 border-2 border-black bg-black px-2 py-2 font-mono text-[10px] font-bold tracking-wider text-white transition-colors hover:bg-white hover:text-black"
              >
                <Plus size={12} />
                ADD NOTE
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
