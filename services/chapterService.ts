import mongoose from 'mongoose';
import Chapter from '@/models/Chapter';
import Project from '@/models/Project';
import connectDB from '@/lib/db';
import { sanitizeString, isValidLength } from '@/lib/api-helpers';
import { encryptContent, decryptContent, isEncrypted } from '@/lib/encryption';
import { ContentUtils } from '@/lib/contentUtils';

// IMPORT from your new files
import { ServiceError } from '@/lib/error';
import { UpdateChapterParams, AddCommentInput } from '@/types/chapter';

// ─── HELPERS ────────────────────────────────────────────────────────

async function getOwnedChapter(chapterId: string, userEmail: string) {
  await connectDB();
  
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) throw new ServiceError('Chapter not found', 'NOT_FOUND');

  const project = await Project.findById(chapter.projectId).lean<{ userEmail: string }>();
  if (!project) throw new ServiceError('Parent project not found', 'NOT_FOUND');
  
  if (project.userEmail !== userEmail) {
    throw new ServiceError('You do not own this resource', 'FORBIDDEN');
  }

  return { chapter, projectId: chapter.projectId };
}

async function refreshProjectWordCount(projectId: mongoose.Types.ObjectId) {
  const result = await Chapter.aggregate([
    { $match: { projectId } },
    { $group: { _id: null, total: { $sum: '$wordCount' } } },
  ]);
  
  const totalWords = result.length > 0 ? result[0].total : 0;
  
  await Project.findByIdAndUpdate(projectId, {
    $set: { 'stats.currentWordCount': totalWords },
  });
}

// ─── EXPORTED SERVICES ──────────────────────────────────────────────

export async function getChapter(id: string, email: string) {
  const { chapter } = await getOwnedChapter(id, email);

  // Decrypt content before returning to client
  const chapterData = chapter.toObject();
  if (chapterData.content && isEncrypted(chapterData.content)) {
    chapterData.content = decryptContent(chapterData.content as string) as typeof chapterData.content;
  }

  return chapterData;
}

export async function updateChapter(id: string, email: string, data: UpdateChapterParams) {
  const { chapter, projectId } = await getOwnedChapter(id, email);

  // Validation
  if (data.title !== undefined) {
    const title = sanitizeString(data.title);
    if (!isValidLength(title, 1, 200)) {
      throw new ServiceError('Title must be between 1 and 200 characters', 'BAD_REQUEST');
    }
    chapter.title = title;
  }

  if (data.content !== undefined) {
    // Calculate word count from plaintext BEFORE encrypting
    chapter.wordCount = ContentUtils.countWords(
      data.content,
      chapter.contentType || 'tiptap'
    );

    // Encrypt content before saving
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

  // Decrypt content before returning to client
  const chapterData = chapter.toObject();
  if (chapterData.content && isEncrypted(chapterData.content)) {
    chapterData.content = decryptContent(chapterData.content as string) as typeof chapterData.content;
  }

  return chapterData;
}

export async function deleteChapter(id: string, email: string) {
  const { projectId } = await getOwnedChapter(id, email);
  await Chapter.findByIdAndDelete(id);
  await refreshProjectWordCount(projectId as mongoose.Types.ObjectId);
  return true;
}

// ─── COMMENT OPERATIONS ─────────────────────────────────────────────

export async function addComment(id: string, email: string, commentData: AddCommentInput) {
  const { chapter, projectId } = await getOwnedChapter(id, email);

  // Validate comment input
  if (!commentData.text || commentData.text.trim().length === 0) {
    throw new ServiceError('Comment text is required', 'BAD_REQUEST');
  }
  if (!commentData.anchor || commentData.anchor.from === undefined || commentData.anchor.to === undefined) {
    throw new ServiceError('Comment anchor (from, to) is required', 'BAD_REQUEST');
  }

  // Add the comment
  chapter.writerComments.push({
    userId: email,
    userName: email.split('@')[0],
    text: sanitizeString(commentData.text).slice(0, 5000),
    anchor: {
      from: Number(commentData.anchor.from),
      to: Number(commentData.anchor.to),
      quotedText: commentData.anchor.quotedText ? sanitizeString(commentData.anchor.quotedText).slice(0, 500) : '',
    },
    isResolved: false,
  } as unknown as import('@/types/chapter').IWriterComment);

  await chapter.save();
  await refreshProjectWordCount(projectId as mongoose.Types.ObjectId);

  // Decrypt content before returning to client
  const chapterData = chapter.toObject();
  if (chapterData.content && isEncrypted(chapterData.content)) {
    chapterData.content = decryptContent(chapterData.content as string) as typeof chapterData.content;
  }

  return chapterData;
}

export async function removeComment(id: string, email: string, commentId: string) {
  const { chapter, projectId } = await getOwnedChapter(id, email);

  // Remove the comment
  chapter.writerComments = chapter.writerComments.filter(
    (c: { _id?: { toString(): string } }) => c._id?.toString() !== commentId
  );

  await chapter.save();
  await refreshProjectWordCount(projectId as mongoose.Types.ObjectId);

  // Decrypt content before returning to client
  const chapterData = chapter.toObject();
  if (chapterData.content && isEncrypted(chapterData.content)) {
    chapterData.content = decryptContent(chapterData.content as string) as typeof chapterData.content;
  }

  return chapterData;
}

export async function toggleCommentResolved(id: string, email: string, commentId: string) {
  const { chapter, projectId } = await getOwnedChapter(id, email);

  // Find and toggle the comment
  const comment = chapter.writerComments.find(
    (c: { _id?: { toString(): string } }) => c._id?.toString() === commentId
  );

  if (!comment) {
    throw new ServiceError('Comment not found', 'NOT_FOUND');
  }

  comment.isResolved = !comment.isResolved;

  await chapter.save();
  await refreshProjectWordCount(projectId as mongoose.Types.ObjectId);

  // Decrypt content before returning to client
  const chapterData = chapter.toObject();
  if (chapterData.content && isEncrypted(chapterData.content)) {
    chapterData.content = decryptContent(chapterData.content as string) as typeof chapterData.content;
  }

  return chapterData;
}