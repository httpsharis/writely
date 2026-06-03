import { store } from '@/redux/store';
import { documentApi } from '@/redux/features/documents/documentApi';


// Basic Types to satisfy existing imports
export type ChapterSummary = IChapter;
export type ChapterFull = IChapter;
export type NovelData = IProject;
export type EditorInitData = { novel: IProject, chapters: IChapter[], firstChapter?: IChapter | null };

// Projects
export async function fetchProjects() {
  const result = await store.dispatch(documentApi.endpoints.getProjects.initiate());
  return result.data ?? [];
}
export async function fetchProject(id: string) {
  const result = await store.dispatch(documentApi.endpoints.getProjectById.initiate(id));
  return result.data;
}
export async function createProject(data: CreateProjectInput) {
  const result = await store.dispatch(documentApi.endpoints.createProject.initiate(data));
  return result.data as IProject;
}
export async function updateProject(id: string, data: UpdateProjectInput) {
  const result = await store.dispatch(documentApi.endpoints.updateProject.initiate({ id, data }));
  return result.data as IProject;
}
export async function deleteProject(id: string) {
  await store.dispatch(documentApi.endpoints.deleteProject.initiate(id));
}
export function invalidateProjectsCache() {
  store.dispatch(documentApi.util.invalidateTags(['Project']));
}
