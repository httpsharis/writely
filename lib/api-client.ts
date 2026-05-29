import { store } from '@/store/store';
import { chaptersApi } from '@/store/api/chaptersApi';
import { projectsApi } from '@/store/api/projectsApi';
import type { IChapter, UpdateChapterInput, AddCommentInput } from '@/types/chapter';
import type { IProject, CreateProjectInput, UpdateProjectInput } from '@/types/project';

// Basic Types to satisfy existing imports
export type ChapterSummary = IChapter;
export type ChapterFull = IChapter;
export type NovelData = IProject;
export type EditorInitData = { novel: IProject, chapters: IChapter[], firstChapter?: IChapter | null };

// Projects
export async function fetchProjects() {
  const result = await store.dispatch(projectsApi.endpoints.getProjects.initiate());
  return result.data ?? [];
}
export async function fetchProject(id: string) {
  const result = await store.dispatch(projectsApi.endpoints.getProjectById.initiate(id));
  return result.data;
}
export async function createProject(data: CreateProjectInput) {
  const result = await store.dispatch(projectsApi.endpoints.createProject.initiate(data));
  return result.data as IProject;
}
export async function updateProject(id: string, data: UpdateProjectInput) {
  const result = await store.dispatch(projectsApi.endpoints.updateProject.initiate({ id, data }));
  return result.data as IProject;
}
export async function deleteProject(id: string) {
  await store.dispatch(projectsApi.endpoints.deleteProject.initiate(id));
}
export function invalidateProjectsCache() {
  store.dispatch(projectsApi.util.invalidateTags(['Project']));
}
export async function togglePublish(id: string, isPublished: boolean) {
  return updateProject(id, { isPublished });
}
export async function addAuthorNote(id: string, text: string) {
  return updateProject(id, { addAuthorNote: text });
}
export async function removeAuthorNote(id: string, noteId: string) {
  return updateProject(id, { removeAuthorNoteId: noteId });
}
export async function addCharacter(id: string, char: any) {
  return updateProject(id, { addCharacter: char });
}
export async function removeCharacter(id: string, charId: string) {
  return updateProject(id, { removeCharacterId: charId });
}
export async function fetchEditorData(id: string): Promise<EditorInitData> {
  const project = await fetchProject(id);
  const chapters = await fetchChapters(id);
  
  let firstChapter: IChapter | null = null;
  if (chapters && chapters.length > 0) {
    firstChapter = await fetchChapter(id, chapters[0]._id!);
  }

  return { 
    novel: project as IProject, 
    chapters: chapters as IChapter[],
    firstChapter 
  };
}

// Chapters
export async function fetchChapters(projectId: string) {
  const result = await store.dispatch(chaptersApi.endpoints.getChapters.initiate(projectId));
  return result.data ?? [];
}
export async function fetchChapter(projectId: string, id: string) {
  const result = await store.dispatch(chaptersApi.endpoints.getChapterById.initiate(id));
  return result.data as IChapter;
}
export async function createChapter(projectId: string) {
  const result = await store.dispatch(chaptersApi.endpoints.createChapter.initiate({ projectId }));
  return result.data as IChapter;
}
export async function saveChapter(projectId: string, id: string, data: UpdateChapterInput) {
  const result = await store.dispatch(chaptersApi.endpoints.updateChapter.initiate({ id, data }));
  return result.data as IChapter;
}
export async function deleteChapter(projectId: string, id: string) {
  await store.dispatch(chaptersApi.endpoints.deleteChapter.initiate({ id, projectId }));
}
export async function toggleChapterStatus(projectId: string, id: string, status: 'draft' | 'published') {
  return saveChapter(projectId, id, { status });
}
export async function addComment(projectId: string, id: string, comment: AddCommentInput) {
  const result = await store.dispatch(chaptersApi.endpoints.addComment.initiate({ id, data: comment }));
  return result.data as IChapter;
}
export async function removeComment(projectId: string, id: string, commentId: string) {
  // Requires external backend to support removal via PATCH or custom endpoint
  return saveChapter(projectId, id, { /* logic to remove comment */ } as any);
}
export async function resolveComment(projectId: string, id: string, commentId: string) {
  return saveChapter(projectId, id, { /* logic to resolve comment */ } as any);
}
