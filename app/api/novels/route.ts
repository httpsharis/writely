import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

// ============================================
// GET: Fetch all novels for the logged-in user
// ============================================
export async function GET() {
    try {
        // 1. Check if user is logged in
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized - Please log in" },
                { status: 401 }
            );
        }

        // 2. Connect to database
        await connectDB();

        // 3. Find all projects owned by this user
        const projects = await Project.find({ userId: session.user.email })
            .sort({ updatedAt: -1 })  // Newest first
            .lean();  // Returns plain JS objects (faster)

        return NextResponse.json(projects);

    } catch (error) {
        console.error('[API] GET /api/novels error:', error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

// ============================================
// POST: Create a new novel
// ============================================
export async function POST(req: Request) {
    try {
        // 1. Check authentication
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized - Please log in" },
                { status: 401 }
            );
        }

        // 2. Connect to database
        await connectDB();

        // 3. Get data from request body (optional - for custom title)
        let title = "Untitled Novel";
        try {
            const body = await req.json();
            if (body.title) {
                title = body.title;
            }
        } catch {
            // No body sent, use default title
        }

        // 4. Create the project
        const newProject = await Project.create({
            userId: session.user.email,  // ✅ Using email as userId
            title: title,
            // status will default to "planning"
            // stats will default to { currentWordCount: 0, goalWordCount: 50000 }
        });

        return NextResponse.json(newProject, { status: 201 });

    } catch (error) {
        console.error('[API] POST /api/novels error:', error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}