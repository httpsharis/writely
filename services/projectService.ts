/**
 * projectService.ts — Business logic for novel (project) update & delete.
 *
 * Routes handle HTTP concerns (auth, parsing, responses).
 * This service handles validation + database operations.
 * Throws ServiceError on failure → the route maps it to an HTTP status.
 */

import mongoose from 'mongoose';
import Project from '@/models/Project';
import Chapter from '@/models/Chapter';
import connectDB from '@/lib/db';
import { sanitizeString, isValidLength } from '@/lib/api-helpers';
import { ServiceError } from '@/lib/error';
import type { UpdateProjectInput, ProjectStatus, ICharacter } from '@/types/project';

const VALID_STATUSES: ProjectStatus[] = ['planning', 'drafting', 'editing', 'completed'];
const VALID_ROLES = ['Protagonist', 'Antagonist', 'Support', 'Minor'] as const;

// ─── Update Project ─────────────────────────────────────────────────

/**
 * Validates and applies a partial update to a project.
 *
 * Steps:
 *  1. Validate each field from the body (title, description, status, etc.)
 *  2. Build MongoDB $set for scalar fields, $push/$pull for arrays
 *  3. Apply all changes in a single findByIdAndUpdate call
 *
 * @param projectId - Mongo _id (already ownership-verified by the route)
 * @param body      - Partial update payload from the client
 */
export async function updateProject(projectId: string, body: UpdateProjectInput) {
    await connectDB();

    // Scalar field updates → stored in $set
    const setFields: Record<string, unknown> = {};

    if (body.title !== undefined) {
        const title = sanitizeString(body.title);
        if (!isValidLength(title, 1, 200)) {
            throw new ServiceError('Title must be between 1 and 200 characters', 'BAD_REQUEST');
        }
        setFields.title = title;
    }

    if (body.description !== undefined) {
        const description = sanitizeString(body.description);
        if (!isValidLength(description, 0, 2000)) {
            throw new ServiceError('Description cannot exceed 2000 characters', 'BAD_REQUEST');
        }
        setFields.description = description;
    }

    if (body.status !== undefined) {
        if (!VALID_STATUSES.includes(body.status)) {
            throw new ServiceError(`Invalid status. Must be: ${VALID_STATUSES.join(', ')}`, 'BAD_REQUEST');
        }
        setFields.status = body.status;
    }

    if (body.isPublished !== undefined) {
        setFields.isPublished = Boolean(body.isPublished);
    }

    // Dot notation prevents overwriting sibling fields
    if (body.stats?.currentWordCount !== undefined) {
        const wc = Number(body.stats.currentWordCount);
        if (isNaN(wc) || wc < 0) throw new ServiceError('currentWordCount must be non-negative', 'BAD_REQUEST');
        setFields['stats.currentWordCount'] = wc;
    }
    if (body.stats?.goalWordCount !== undefined) {
        const gw = Number(body.stats.goalWordCount);
        if (isNaN(gw) || gw < 0) throw new ServiceError('goalWordCount must be non-negative', 'BAD_REQUEST');
        setFields['stats.goalWordCount'] = gw;
    }

    // Check if there's anything to do
    const hasScalarUpdates = Object.keys(setFields).length > 0;
    const hasArrayOps =
        !!body.addCharacter ||
        body.removeCharacterId !== undefined ||
        !!body.addAuthorNote ||
        body.removeAuthorNoteId !== undefined;

    if (!hasScalarUpdates && !hasArrayOps) {
        throw new ServiceError('No valid fields provided for update', 'BAD_REQUEST');
    }

    // Build the final MongoDB update object
    const ops: Record<string, unknown> = {};
    if (hasScalarUpdates) ops.$set = setFields;

    // Add character → $push into characters array
    if (body.addCharacter) {
        const { name, role, description } = body.addCharacter;
        if (!name?.trim()) throw new ServiceError('Character name is required', 'BAD_REQUEST');
        const char: Partial<ICharacter> = {
            name: sanitizeString(name).slice(0, 100),
            role: (VALID_ROLES.includes(role as typeof VALID_ROLES[number]) ? role : 'Support') as ICharacter['role'],
            description: description ? sanitizeString(description).slice(0, 1000) : '',
        };
        ops.$push = { characters: char };
    }

    // Remove character by _id → $pull (safe regardless of array order)
    if (body.removeCharacterId !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(body.removeCharacterId)) {
            throw new ServiceError('removeCharacterId must be a valid ObjectId', 'BAD_REQUEST');
        }
        ops.$pull = { ...(ops.$pull as Record<string, unknown> || {}), characters: { _id: body.removeCharacterId } };
    }

    // Add author note
    if (body.addAuthorNote) {
        const noteText = sanitizeString(body.addAuthorNote);
        if (!isValidLength(noteText, 1, 2000)) {
            throw new ServiceError('Note must be between 1 and 2000 characters', 'BAD_REQUEST');
        }
        if (!ops.$push) ops.$push = {};
        (ops.$push as Record<string, unknown>).authorNotes = { text: noteText, createdAt: new Date() };
    }

    // Remove author note by _id
    if (body.removeAuthorNoteId !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(body.removeAuthorNoteId)) {
            throw new ServiceError('removeAuthorNoteId must be a valid ObjectId', 'BAD_REQUEST');
        }
        if (!ops.$pull) ops.$pull = {};
        (ops.$pull as Record<string, unknown>).authorNotes = { _id: body.removeAuthorNoteId };
    }

    const updated = await Project.findByIdAndUpdate(projectId, ops, { new: true, runValidators: true });
    if (!updated) throw new ServiceError('Project not found after update', 'NOT_FOUND');

    return updated;
}

// ─── Delete Project ─────────────────────────────────────────────────

/** Deletes a project and all its chapters (cascade delete). */
export async function deleteProject(projectId: string) {
    await connectDB();

    // Delete chapters first to avoid orphaned documents
    const { deletedCount } = await Chapter.deleteMany({ projectId });
    console.log(`[API] Deleted ${deletedCount} chapters for project ${projectId}`);

    await Project.findByIdAndDelete(projectId);
    return { message: 'Project and all chapters deleted successfully' };
}
