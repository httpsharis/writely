import mongoose, { Schema, Document, Model } from 'mongoose';
import type { IProject as IProjectBase } from '@/types/project';

// ─── Document Interface (extends Mongoose Document) ─────────────────

export interface IProjectDocument extends IProjectBase, Document {}

// ─── Schema Definition ─────────────────────────────────────────────

const ProjectSchema = new Schema<IProjectDocument>(
    {
        userEmail: {
            type: String,
            required: [true, 'User email is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            default: 'Untitled Novel',
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            default: '',
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: {
                values: ['planning', 'drafting', 'editing', 'completed'],
                message: '{VALUE} is not a valid status',
            },
            default: 'planning',
        },
        stats: {
            currentWordCount: { type: Number, default: 0, min: 0 },
            goalWordCount: { type: Number, default: 0, min: 0 },
        },
        characters: [
            {
                name: {
                    type: String,
                    required: [true, 'Character name is required'],
                    maxlength: [100, 'Character name cannot exceed 100 characters'],
                },
                role: {
                    type: String,
                    enum: {
                        values: ['Protagonist', 'Antagonist', 'Support', 'Minor'],
                        message: '{VALUE} is not a valid role',
                    },
                    default: 'Support',
                },
                description: {
                    type: String,
                    default: '',
                    maxlength: [1000, 'Character description cannot exceed 1000 characters'],
                },
                avatar: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// ─── Model Export (safe for hot reload) ─────────────────────────────

const Project: Model<IProjectDocument> =
    mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);

export default Project;
