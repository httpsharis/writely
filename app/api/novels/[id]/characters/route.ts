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

        const name = sanitizeString(input.name || '');
        if (!isValidLength(name, 1, 100)) return badRequestResponse('Name must be 1-100 chars');

        const role = ['Protagonist', 'Antagonist', 'Support', 'Minor'].includes(input.role) 
            ? input.role 
            : 'Support';

        const description = sanitizeString(input.description || '');
        if (description && !isValidLength(description, 0, 1000)) {
            return badRequestResponse('Description cannot exceed 1000 chars');
        }

        const newCharacter = {
            _id: new mongoose.Types.ObjectId(),
            name,
            role,
            description,
            avatar: input.avatar || '',
        };

        const project = await Project.findOneAndUpdate(
            { _id: params.id, userEmail: email },
            { $push: { characters: newCharacter } },
            { new: true }
        ).lean();

        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(newCharacter, { status: 201 });
    } catch (error) {
        return serverErrorResponse('Failed to create character');
    }
}
