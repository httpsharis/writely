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

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();
        const project = await Project.findOne({ _id: params.id, userEmail: email }).lean();
        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(project);
    } catch (error) {
        return serverErrorResponse('Failed to fetch project');
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();
        const input = await req.json();

        const updates: any = {};
        if (input.title !== undefined) {
            const title = sanitizeString(input.title);
            if (!isValidLength(title, 1, 200)) return badRequestResponse('Title invalid length');
            updates.title = title;
        }
        if (input.description !== undefined) {
            const desc = sanitizeString(input.description);
            if (!isValidLength(desc, 0, 2000)) return badRequestResponse('Description invalid length');
            updates.description = desc;
        }
        if (input.status !== undefined) {
            updates.status = input.status;
        }

        const project = await Project.findOneAndUpdate(
            { _id: params.id, userEmail: email },
            { $set: updates },
            { new: true }
        ).lean();

        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(project);
    } catch (error) {
        return serverErrorResponse('Failed to update project');
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();
        const project = await Project.findOneAndDelete({ _id: params.id, userEmail: email });
        
        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // TODO: Clean up associated chapters and notes here if needed.
        return NextResponse.json({ success: true });
    } catch (error) {
        return serverErrorResponse('Failed to delete project');
    }
}
