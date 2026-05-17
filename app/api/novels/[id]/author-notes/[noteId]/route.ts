import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import {
    getAuthenticatedEmail,
    unauthorizedResponse,
    serverErrorResponse,
} from '@/lib/api-helpers';

export async function DELETE(req: Request, { params }: { params: { id: string, noteId: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();

        const project = await Project.findOneAndUpdate(
            { _id: params.id, userEmail: email },
            { $pull: { authorNotes: { _id: params.noteId } } },
            { new: true }
        ).lean();

        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return serverErrorResponse('Failed to delete author note');
    }
}
