/**
 * chapterService.ts — Business logic for chapter CRUD and comments.
 *
 * All content is stored encrypted (AES-256-GCM). This service handles
 * encryption on write and decryption on read so callers never deal with it.
 */

import mongoose from 'mongoose';
import Chapter from '@/models/Chapter';
import Project from '@/models/Project';
import connectDB from '@/lib/db';
import { sanitizeString, isValidLength } from '@/lib/api-helpers';
import { encryptContent, decryptContent, isEncrypted } from '@/lib/encryption';
import { ContentUtils } from '@/lib/contentUtils';
import { ServiceError } from '@/lib/error';
import type { UpdateChapterParams, AddCommentInput, IWriterComment } from '@/types/chapter';

// ─── Internal Helpers ───────────────────────────────────────────────

/** Converts a Mongoose chapter doc → plain object with decrypted content. */
function toDecryptedObject(chapter: InstanceType<typeof Chapter>) {
    const data = chapter.toObject();
    if (data.content && isEncrypted(data.content)) {
        data.content = decryptContent(data.content as string) as typeof data.content;
    }
    return data;
}

/** Finds a chapter by ID and verifies the caller owns it. */
async function getOwnedChapter(chapterId: string, userEmail: string) {
    await connectDB();

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) throw new ServiceError('Chapter not found', 'NOT_FOUND');

    const project = await Project.findById(chapter.projectId).lean<{ userEmail: string }>();
    if (!project) throw new ServiceError('Parent project not found', 'NOT_FOUND');
    if (project.userEmail !== userEmail) throw new ServiceError('You do not own this resource', 'FORBIDDEN');

    return { chapter, projectId: chapter.projectId };
}

/** Recalculates total word count across all chapters in a project. */
async function refreshProjectWordCount(projectId: mongoose.Types.ObjectId) {
    const result = await Chapter.aggregate([
        { $match: { projectId } },
        { $group: { _id: null, total: { $sum: '$wordCount' } } },
    ]);

    await Project.findByIdAndUpdate(projectId, {
        $set: { 'stats.currentWordCount': result[0]?.total ?? 0 },
    });
}

// ─── Chapter CRUD ───────────────────────────────────────────────────

export async function getChapter(id: string, email: string) {
    const { chapter } = await getOwnedChapter(id, email);
    return toDecryptedObject(chapter);
}

/**
 * Validates, encrypts, and saves chapter updates.
 * Recalculates project word count if content changed.
 */
export async function updateChapter(id: string, email: string, data: UpdateChapterParams) {
    const { chapter, projectId } = await getOwnedChapter(id, email);

    if (data.title !== undefined) {
        const title = sanitizeString(data.title);
        if (!isValidLength(title, 1, 200)) {
            throw new ServiceError('Title must be between 1 and 200 characters', 'BAD_REQUEST');
        }
        chapter.title = title;
    }

    if (data.content !== undefined) {
        // Count words from plaintext BEFORE encrypting
        chapter.wordCount = ContentUtils.countWords(data.content, chapter.contentType || 'tiptap');
        chapter.content = encryptContent(data.content);
    }

    if (data.status !== undefined) {
        if (!['draft', 'published'].includes(data.status)) {
            throw new ServiceError('Status must be "draft" or "published"', 'BAD_REQUEST');
        }
        chapter.status = data.status;
    }

    if (data.order !== undefined) {
        const order = Number(data.order);
        if (isNaN(order) || order < 0) {
            throw new ServiceError('Order must be a positive number', 'BAD_REQUEST');
        }
        chapter.order = order;
    }

    await chapter.save();
    await refreshProjectWordCount(projectId as mongoose.Types.ObjectId);
    return toDecryptedObject(chapter);
}

/** Deletes a chapter and recalculates the project word count. */
export async function deleteChapter(id: string, email: string) {
    const { projectId } = await getOwnedChapter(id, email);
    await Chapter.findByIdAndDelete(id);
    await refreshProjectWordCount(projectId as mongoose.Types.ObjectId);
    return true;
}

// ─── Comment Operations ─────────────────────────────────────────────
// Comments don't change word count — only updateChapter/deleteChapter do.

export async function addComment(id: string, email: string, input: AddCommentInput) {
    const { chapter } = await getOwnedChapter(id, email);

    if (!input.text?.trim()) {
        throw new ServiceError('Comment text is required', 'BAD_REQUEST');
    }
    if (!input.anchor || input.anchor.from === undefined || input.anchor.to === undefined) {
        throw new ServiceError('Comment anchor (from, to) is required', 'BAD_REQUEST');
    }

    chapter.writerComments.push({
        userId: email,
        userName: email.split('@')[0],
        text: sanitizeString(input.text).slice(0, 5000),
        anchor: {
            from: Number(input.anchor.from),
            to: Number(input.anchor.to),
            quotedText: input.anchor.quotedText
                ? sanitizeString(input.anchor.quotedText).slice(0, 500)
                : '',
        },
        isResolved: false,
    } as unknown as IWriterComment);

    await chapter.save();
    return toDecryptedObject(chapter);
}

export async function removeComment(id: string, email: string, commentId: string) {
    const { chapter } = await getOwnedChapter(id, email);

    chapter.writerComments = chapter.writerComments.filter(
        (c: { _id?: { toString(): string } }) => c._id?.toString() !== commentId,
    );

    await chapter.save();
    return toDecryptedObject(chapter);
}

export async function toggleCommentResolved(id: string, email: string, commentId: string) {
    const { chapter } = await getOwnedChapter(id, email);

    const comment = chapter.writerComments.find(
        (c: { _id?: { toString(): string } }) => c._id?.toString() === commentId,
    );
    if (!comment) throw new ServiceError('Comment not found', 'NOT_FOUND');

    comment.isResolved = !comment.isResolved;
    await chapter.save();
    return toDecryptedObject(chapter);
}