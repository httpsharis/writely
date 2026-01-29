import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
    userId: string;
    title: string;
    description?: string;
    status: 'planning' | 'drafting' | 'editing' | 'completed';
    stats: {
        currentWordCount: number;
        goalWordCount: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },

        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },

        status: {
            type: String,
            enum: ['planning', 'drafting', 'editing', 'completed'],
            default: 'planning',
        },

        stats: {
            currentWordCount: {
                type: Number,
                default: 0,
                min: [0, 'Word count cannot be negative'],
            },
            goalWordCount: {
                type: Number,
                default: 50000,
                min: [0, 'Goal cannot be negative'],
            },
        },
    },
    {
        timestamps: true,
    }
);

// Check if model exists (prevents error during hot reload in dev)
const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
