'use client';

import { useState } from 'react';
import { Users, MessageSquare, StickyNote, Plus, Trash2, Check, X, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ICharacter } from '@/types/project';
import type { WriterComment } from '@/types/chapter';
import type { EditorSelection } from './TiptapEditor';
import { EditorNotesTab } from './EditorNotesTab';

export type ToolsTab = 'characters' | 'comments' | 'notes';

interface Props {
  characters: ICharacter[];
  comments: WriterComment[];
  getSelection: () => EditorSelection | null;
  onAddCharacter: (char: { name: string; role: string; description?: string }) => void;
  onRemoveCharacter: (id: string) => void;
  onAddComment: (comment: { text: string; anchor: { from: number; to: number; quotedText: string } }) => void;
  onRemoveComment: (commentId: string) => void;
  onResolveComment: (commentId: string) => void;
  novelId?: string;
  novelTitle?: string;
  activeTab?: ToolsTab;
  onTabChange?: (tab: ToolsTab) => void;
  onClose?: () => void;
}

const ROLES = ['Protagonist', 'Antagonist', 'Support', 'Minor'] as const;

const ROLE_STYLES: Record<string, string> = {
  Protagonist: 'bg-black text-white',
  Antagonist: 'border border-black bg-white text-black',
  Support: 'bg-blue-500 text-white',
  Minor: 'border border-gray-300 bg-gray-100 text-gray-600',
};

// ─── 1. MAIN COMPONENT (The Orchestrator) ───────────────────────────

export default function ToolsPanel({
  characters, comments, getSelection, onAddCharacter, onRemoveCharacter,
  onAddComment, onRemoveComment, onResolveComment, novelId, novelTitle, activeTab, onTabChange, onClose,
}: Props) {
  const [internalTab, setInternalTab] = useState<ToolsTab>('characters');
  const tab = activeTab ?? internalTab;
  const setTab = onTabChange ?? setInternalTab;

  const unresolvedCount = comments.filter((c) => !c.isResolved).length;

  return (
    <aside className="flex h-full flex-col overflow-hidden border-l-[3px] border-black bg-white dark:border-neutral-700 dark:bg-neutral-900">
      
      <TabBar 
        tab={tab} 
        setTab={setTab} 
        charCount={characters.length} 
        unresolvedCount={unresolvedCount} 
        onClose={onClose} 
      />

      <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
        {tab === 'characters' && (
          <CharactersTab 
            characters={characters} 
            onAdd={onAddCharacter} 
            onRemove={onRemoveCharacter} 
          />
        )}
        
        {tab === 'comments' && (
          <CommentsTab 
            comments={comments} 
            getSelection={getSelection} 
            onAdd={onAddComment} 
            onRemove={onRemoveComment} 
            onResolve={onResolveComment} 
          />
        )}

        {tab === 'notes' && novelId && novelTitle && (
          <EditorNotesTab novelId={novelId} novelTitle={novelTitle} />
        )}
      </div>

    </aside>
  );
}

// ─── 2. TAB NAVIGATION ──────────────────────────────────────────────

function TabBar({
  tab, setTab, charCount, unresolvedCount, onClose
}: {
  tab: ToolsTab; setTab: (t: ToolsTab) => void; charCount: number; unresolvedCount: number; onClose?: () => void;
}) {
  return (
    <div className="flex shrink-0 border-b-[3px] border-black dark:border-neutral-700">
      {(['characters', 'comments', 'notes'] as ToolsTab[]).map((t) => (
        <button
          key={t} onClick={() => setTab(t)}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-r border-black px-2 py-3 text-center font-mono text-[10px] font-bold tracking-[0.5px] transition-colors dark:border-neutral-700',
            tab === t ? 'bg-secondary text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
          )}
        >
          {t === 'characters' ? (
            <>
              <Users size={11} /> CHARS
              {charCount > 0 && (
                <span className={cn('ml-0.5 rounded-full px-1.5 py-px text-[8px] font-bold', tab === t ? 'bg-white/30 text-white' : 'bg-gray-300 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300')}>
                  {charCount}
                </span>
              )}
            </>
          ) : t === 'comments' ? (
            <>
              <MessageSquare size={11} /> NOTES
              {unresolvedCount > 0 && (
                <span className={cn('ml-0.5 rounded-full px-1.5 py-px text-[8px] font-bold', tab === t ? 'bg-white/30 text-white' : 'bg-secondary text-white')}>
                  {unresolvedCount}
                </span>
              )}
            </>
          ) : (
            <>
              <StickyNote size={11} /> IDEAS
            </>
          )}
        </button>
      ))}
      {onClose && (
        <button
          onClick={onClose} aria-label="Close tools"
          className="flex cursor-pointer items-center justify-center px-3 bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-black dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white lg:hidden"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ─── 3. CHARACTERS SLICE (State + UI) ───────────────────────────────

function CharactersTab({
  characters, onAdd, onRemove
}: {
  characters: ICharacter[];
  onAdd: (char: { name: string; role: string; description?: string }) => void;
  onRemove: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Support');
  const [desc, setDesc] = useState('');

  function handleSubmit() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), role, description: desc.trim() || undefined });
    setName(''); setRole('Support'); setDesc(''); setShowForm(false);
  }

  return (
    <>
      {characters.length === 0 && !showForm && (
        <div className="flex h-40 flex-col items-center justify-center text-center opacity-50">
          <Users size={24} />
          <p className="mt-2 font-mono text-[11px] leading-relaxed">No characters yet.</p>
        </div>
      )}

      {characters.map((char, i) => (
        <div key={char._id ?? i} className="group mb-2 border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_#eee] dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.3px] dark:text-white">{char.name}</span>
            <div className="flex items-center gap-1.5">
              <span className={cn('px-1.5 py-px font-mono text-[8px] font-bold uppercase tracking-wider', ROLE_STYLES[char.role] || ROLE_STYLES.Minor)}>
                {char.role}
              </span>
              <button
                onClick={() => char._id && onRemove(char._id)} title="Remove character"
                className="cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger max-lg:opacity-100"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
          {char.description && <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-neutral-400">{char.description}</p>}
        </div>
      ))}

      {showForm ? (
        <div className="mt-2 space-y-2 border-2 border-dashed border-gray-400 p-3 dark:border-neutral-600">
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Character name" autoFocus
            className="w-full border-2 border-black px-2 py-1.5 font-mono text-[11px] outline-none placeholder:text-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600"
          />
          <select
            value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full border-2 border-black bg-white px-2 py-1.5 font-mono text-[11px] outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          >
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <textarea
            value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)" rows={2}
            className="w-full resize-none border-2 border-black px-2 py-1.5 font-mono text-[11px] outline-none placeholder:text-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit} disabled={!name.trim()}
              className="flex-1 cursor-pointer border-2 border-black bg-black py-1.5 font-mono text-[10px] font-bold text-white transition-colors hover:bg-white hover:text-black dark:border-neutral-600 dark:bg-white dark:text-black dark:hover:bg-neutral-800 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              ADD
            </button>
            <button
              onClick={() => { setShowForm(false); setName(''); setDesc(''); }}
              className="cursor-pointer border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold transition-colors hover:bg-gray-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 border-2 border-black bg-black px-2 py-2 font-mono text-[10px] font-bold tracking-wider text-white transition-colors hover:bg-white hover:text-black dark:border-neutral-600 dark:bg-white dark:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <Plus size={12} /> ADD CHARACTER
        </button>
      )}
    </>
  );
}

// ─── 4. COMMENTS SLICE (State + UI) ─────────────────────────────────

function CommentsTab({
  comments, getSelection, onAdd, onRemove, onResolve
}: {
  comments: WriterComment[]; getSelection: () => EditorSelection | null;
  onAdd: (comment: { text: string; anchor: { from: number; to: number; quotedText: string } }) => void;
  onRemove: (id: string) => void; onResolve: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [selection, setSelection] = useState<EditorSelection | null>(null);

  function handleSubmit() {
    if (!text.trim()) return;
    onAdd({
      text: text.trim(),
      anchor: selection ? { from: selection.from, to: selection.to, quotedText: selection.quotedText } : { from: 0, to: 0, quotedText: '' },
    });
    setText(''); setSelection(null); setShowForm(false);
  }

  function handleOpenForm() {
    setSelection(getSelection());
    setShowForm(true);
  }

  return (
    <>
      {comments.length === 0 && !showForm && (
        <div className="flex h-40 flex-col items-center justify-center text-center opacity-50">
          <MessageSquare size={24} />
          <p className="mt-2 font-mono text-[11px] leading-relaxed">No notes yet.<br />Add a writing note below.</p>
        </div>
      )}

      {comments.map((c) => (
        <div key={c._id} className={cn('group mb-2 border-2 p-2.5', c.isResolved ? 'border-gray-300 bg-gray-50 opacity-60 dark:border-neutral-700 dark:bg-neutral-900' : 'border-black bg-white shadow-[2px_2px_0px_#eee] dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none')}>
          {c.anchor.quotedText && (
            <div className="mb-1.5 border-l-2 border-secondary pl-2 font-serif text-[11px] italic text-gray-400">
              &ldquo;{c.anchor.quotedText.slice(0, 80)}{c.anchor.quotedText.length > 80 ? '...' : ''}&rdquo;
            </div>
          )}
          <p className="text-[12px] leading-relaxed dark:text-white">{c.text}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-wider opacity-40">{c.userName}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => onResolve(c._id)} title={c.isResolved ? 'Unresolve' : 'Resolve'}
                className={cn('cursor-pointer transition-colors', c.isResolved ? 'text-success hover:text-gray-500' : 'text-gray-300 hover:text-success')}
              >
                <Check size={13} />
              </button>
              <button
                onClick={() => onRemove(c._id)} title="Delete note"
                className="cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger max-lg:opacity-100"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {showForm ? (
        <div className="mt-2 space-y-2 border-2 border-dashed border-gray-400 p-3 dark:border-neutral-600">
          {selection?.quotedText && (
            <div className="flex items-start gap-1.5 border-l-2 border-secondary bg-gray-50 px-2 py-1.5 dark:bg-neutral-800">
              <Type size={10} className="mt-0.5 shrink-0 text-secondary" />
              <span className="font-serif text-[10px] italic text-gray-500 dark:text-neutral-400">
                &ldquo;{selection.quotedText.slice(0, 100)}{selection.quotedText.length > 100 ? '...' : ''}&rdquo;
              </span>
            </div>
          )}
          <textarea
            value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Write a note..." rows={3} autoFocus
            className="w-full resize-none border-2 border-black px-2 py-1.5 font-mono text-[11px] outline-none placeholder:text-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit} disabled={!text.trim()}
              className="flex-1 cursor-pointer border-2 border-black bg-black py-1.5 font-mono text-[10px] font-bold text-white transition-colors hover:bg-white hover:text-black dark:border-neutral-600 dark:bg-white dark:text-black dark:hover:bg-neutral-800 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              ADD NOTE
            </button>
            <button
              onClick={() => { setShowForm(false); setText(''); setSelection(null); }}
              className="cursor-pointer border-2 border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold transition-colors hover:bg-gray-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleOpenForm}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 border-2 border-black bg-black px-2 py-2 font-mono text-[10px] font-bold tracking-wider text-white transition-colors hover:bg-white hover:text-black dark:border-neutral-600 dark:bg-white dark:text-black dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <Plus size={12} /> ADD NOTE
        </button>
      )}
    </>
  );
}