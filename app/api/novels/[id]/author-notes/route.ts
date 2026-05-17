import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import {
    getAuthenticatedEmail,
    unauthorizedResponse,
    serverErrorResponse,
    badRequestResponse,
    sanitizeString,
    isValidLength,
} from '@/lib/api-helpers';
import mongoose from 'mongoose';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();
        const input = await req.json();

        const text = sanitizeString(input.text || '');
        if (!isValidLength(text, 1, 2000)) return badRequestResponse('Note text must be 1-2000 chars');

        const newNote = {
            _id: new mongoose.Types.ObjectId(),
            text,
            createdAt: new Date()
        };

        const project = await Project.findOneAndUpdate(
            { _id: params.id, userEmail: email },
            { $push: { authorNotes: newNote } },
            { new: true }
        ).lean();

        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        return serverErrorResponse('Failed to add author note');
    }
}
