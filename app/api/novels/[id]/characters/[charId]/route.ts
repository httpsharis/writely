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

export async function PUT(req: Request, { params }: { params: { id: string, charId: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();
        const input = await req.json();

        // Prepare updates
        const updateFields: any = {};
        
        if (input.name !== undefined) {
            const name = sanitizeString(input.name);
            if (!isValidLength(name, 1, 100)) return badRequestResponse('Name invalid');
            updateFields['characters.$.name'] = name;
        }
        
        if (input.role !== undefined) {
            if (!['Protagonist', 'Antagonist', 'Support', 'Minor'].includes(input.role)) {
                return badRequestResponse('Invalid role');
            }
            updateFields['characters.$.role'] = input.role;
        }

        if (input.description !== undefined) {
            const description = sanitizeString(input.description);
            if (!isValidLength(description, 0, 1000)) return badRequestResponse('Description invalid');
            updateFields['characters.$.description'] = description;
        }

        if (input.avatar !== undefined) {
            updateFields['characters.$.avatar'] = input.avatar;
        }

        if (Object.keys(updateFields).length === 0) {
            return badRequestResponse('No valid fields to update');
        }

        const project = await Project.findOneAndUpdate(
            { _id: params.id, userEmail: email, 'characters._id': params.charId },
            { $set: updateFields },
            { new: true }
        ).lean();

        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        
        const updatedChar = project.characters.find((c: any) => c._id.toString() === params.charId);
        return NextResponse.json(updatedChar);
    } catch (error) {
        return serverErrorResponse('Failed to update character');
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string, charId: string } }) {
    try {
        const email = await getAuthenticatedEmail();
        if (!email) return unauthorizedResponse();

        await connectDB();

        const project = await Project.findOneAndUpdate(
            { _id: params.id, userEmail: email },
            { $pull: { characters: { _id: params.charId } } },
            { new: true }
        ).lean();

        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return serverErrorResponse('Failed to delete character');
    }
}
