import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

// Type for the route params
type RouteParams = {
    params: Promise<{ id: string }>;
};

// ============================================
// GET: Fetch a single project by ID
// ============================================
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        await connectDB();

        const project = await Project.findById(id).lean();

        // Check if project exists
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // 🔒 SECURITY: Check if user owns this project
        if (project.userId !== session.user.email) {
            return NextResponse.json(
                { error: "Forbidden - You don't own this project" },
                { status: 403 }
            );
        }

        return NextResponse.json(project);

    } catch (error) {
        console.error('[API] GET /api/novels/[id] error:', error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

// ============================================
// PATCH: Update a project (title, description, status, stats)
// ============================================
export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        await connectDB();

        // First, check if project exists and user owns it
        const existingProject = await Project.findById(id);

        if (!existingProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // 🔒 SECURITY: Ownership check
        if (existingProject.userId !== session.user.email) {
            return NextResponse.json(
                { error: "Forbidden - You don't own this project" },
                { status: 403 }
            );
        }

        // Get update data from request body
        const body = await req.json();

        // Only allow updating specific fields (whitelist approach)
        const allowedUpdates: Record<string, unknown> = {};

        if (body.title !== undefined) allowedUpdates.title = body.title;
        if (body.description !== undefined) allowedUpdates.description = body.description;
        if (body.status !== undefined) allowedUpdates.status = body.status;
        if (body.stats !== undefined) allowedUpdates.stats = body.stats;

        // Update the project
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: allowedUpdates },
            { new: true, runValidators: true }  // Return updated doc, run schema validation
        );

        return NextResponse.json(updatedProject);

    } catch (error) {
        console.error('[API] PATCH /api/novels/[id] error:', error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

// ============================================
// DELETE: Delete a project
// ============================================
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        await connectDB();

        // First, check if project exists and user owns it
        const existingProject = await Project.findById(id);

        if (!existingProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // 🔒 SECURITY: Ownership check
        if (existingProject.userId !== session.user.email) {
            return NextResponse.json(
                { error: "Forbidden - You don't own this project" },
                { status: 403 }
            );
        }

        // Delete the project
        await Project.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error('[API] DELETE /api/novels/[id] error:', error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
