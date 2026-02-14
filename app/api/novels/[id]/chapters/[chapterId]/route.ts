import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import Chapter from '@/models/Chapter';
import mongoose from 'mongoose';
import {
  getAuthenticatedEmail,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  badRequestResponse,
  sanitizeString,
  isValidLength,
  noCacheJson,
} from '@/lib/api-helpers';
import { encryptContent, decryptContent, isEncrypted } from '@/lib/encryption';
import { ContentUtils } from '@/lib/contentUtils';
import type { NestedRouteParams } from '@/types/api';
import type { UpdateChapterInput } from '@/types/chapter';

// ─── Helper: Verify the full ownership chain ───────────────────────
//
// Security check order (3 locks, not just 1):
//
//   Lock 1: Does the novel exist?
//   Lock 2: Does the logged-in user own that novel?
//   Lock 3: Does the chapter belong to THAT novel?
//
// Why Lock 3 matters:
//   Without it, a hacker who owns Novel A could pass Novel A's ID
//   in the URL but use a chapterId from Novel B (someone else's).
//   Lock 3 catches this: "This chapter's projectId doesn't match
//   the novel ID in your URL — rejected."
//
// .select('userEmail') on Project → only fetches what we need.
// We don't call .lean() on Chapter because PATCH needs .save().

async function verifyChapterAccess(
  novelId: string,
  chapterId: string,
  email: string
) {
  // Lock 1 & 2: Novel exists + user owns it
  const project = await Project.findById(novelId).select('userEmail').lean();
  if (!project) return { error: notFoundResponse('Novel') };
  if (project.userEmail !== email) return { error: forbiddenResponse() };

  // Lock 3: Chapter exists + belongs to this novel
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return { error: notFoundResponse('Chapter') };

  if (chapter.projectId.toString() !== novelId) {
    return { error: forbiddenResponse() };
  }

  return { chapter, projectId: chapter.projectId };
}

// ─── Helper: Recalculate project word count ─────────────────────────
//
// When a chapter is saved or deleted, the novel's total word count
// might change. This aggregates all chapter word counts into one sum
// and updates the project's stats.
//
// .aggregate() is a MongoDB pipeline:
//   Step 1 ($match): filter chapters belonging to this project
//   Step 2 ($group): sum up all wordCount fields

async function updateProjectWordCount(projectId: mongoose.Types.ObjectId) {
  const result = await Chapter.aggregate([
    { $match: { projectId } },
    { $group: { _id: null, total: { $sum: '$wordCount' } } },
  ]);

  const totalWords = result.length > 0 ? result[0].total : 0;

  await Project.findByIdAndUpdate(projectId, {
    $set: { 'stats.currentWordCount': totalWords },
  });

  return totalWords;
}

// ============================================
// GET  /api/novels/[id]/chapters/[chapterId]
// ============================================
// Purpose: Load the FULL chapter content when the user clicks
//          a chapter in the sidebar to open it in the editor.
//
// The content is stored encrypted in MongoDB. This endpoint
// decrypts it before sending to the browser. The response
// includes no-cache headers so the browser doesn't store
// the decrypted content on disk.

export async function GET(_req: Request, { params }: NestedRouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id: novelId, chapterId } = await params;
    await connectDB();

    const result = await verifyChapterAccess(novelId, chapterId, email);
    if ('error' in result) return result.error;

    // Decrypt content before sending to the client
    const chapterData = result.chapter.toObject();
    if (chapterData.content && isEncrypted(chapterData.content)) {
      chapterData.content = decryptContent(chapterData.content as string) as
        typeof chapterData.content;
    }

    // noCacheJson → tells browser: do NOT cache this response
    return noCacheJson(chapterData);
  } catch (error) {
    console.error('[API] GET /api/novels/[id]/chapters/[chapterId] error:', error);
    return serverErrorResponse('Failed to fetch chapter');
  }
}

// ============================================
// PATCH  /api/novels/[id]/chapters/[chapterId]
// ============================================
// Purpose: Auto-save the user's writing.
//
// The frontend editor will call this periodically (e.g. every few
// seconds or on blur) with the current content. Only fields present
// in the request body get updated — everything else stays the same.
//
// Whitelist approach:
//   We only allow updating title, content, and order.
//   Even if someone sends { userEmail: "hacker@evil.com" }, we ignore it.
//
// After saving, the pre-save hook on the Chapter model automatically
// recalculates wordCount. Then we update the project's total too.

export async function PATCH(req: Request, { params }: NestedRouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id: novelId, chapterId } = await params;
    await connectDB();

    const result = await verifyChapterAccess(novelId, chapterId, email);
    if ('error' in result) return result.error;

    // Parse request body
    let body: UpdateChapterInput;
    try {
      body = await req.json();
    } catch {
      return badRequestResponse('Invalid JSON body');
    }

    const { chapter } = result;

    // Apply only allowed fields (whitelist)
    if (body.title !== undefined) {
      const title = sanitizeString(body.title);
      if (!isValidLength(title, 1, 200)) {
        return badRequestResponse('Title must be between 1 and 200 characters');
      }
      chapter.title = title;
    }

    if (body.content !== undefined) {
      // Calculate word count from plaintext BEFORE encrypting
      chapter.wordCount = ContentUtils.countWords(
        body.content as string,
        chapter.contentType || 'tiptap'
      );

      // Encrypt content before saving — stored as "iv:authTag:ciphertext"
      chapter.content = encryptContent(body.content);
    }

    if (body.order !== undefined) {
      const order = Number(body.order);
      if (isNaN(order) || order < 0) {
        return badRequestResponse('Order must be a non-negative number');
      }
      chapter.order = order;
    }

    // .save() triggers the pre-save hook → recalculates wordCount
    await chapter.save();

    // Keep project-level stats in sync
    await updateProjectWordCount(result.projectId);

    // Decrypt content before returning so the client gets readable data
    const chapterData = chapter.toObject();
    if (chapterData.content && isEncrypted(chapterData.content)) {
      chapterData.content = decryptContent(chapterData.content as string) as
        typeof chapterData.content;
    }

    return noCacheJson(chapterData);
  } catch (error) {
    console.error('[API] PATCH /api/novels/[id]/chapters/[chapterId] error:', error);
    return serverErrorResponse('Failed to update chapter');
  }
}

// ============================================
// DELETE  /api/novels/[id]/chapters/[chapterId]
// ============================================
// Purpose: Remove a chapter permanently.
//
// After deletion, we recalculate the project's total word count
// because the deleted chapter's words no longer count.

export async function DELETE(_req: Request, { params }: NestedRouteParams) {
  try {
    const email = await getAuthenticatedEmail();
    if (!email) return unauthorizedResponse();

    const { id: novelId, chapterId } = await params;
    await connectDB();

    const result = await verifyChapterAccess(novelId, chapterId, email);
    if ('error' in result) return result.error;

    await Chapter.findByIdAndDelete(chapterId);

    // Recalculate project word count after removal
    await updateProjectWordCount(result.projectId);

    return NextResponse.json(
      { message: 'Chapter deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] DELETE /api/novels/[id]/chapters/[chapterId] error:', error);
    return serverErrorResponse('Failed to delete chapter');
  }
}
