import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Registration from '@/models/Registration';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    
    // If marking as attended, set attendedAt
    if (body.status === 'attended' && !body.attendedAt) {
        body.attendedAt = new Date();
    }

    const registration = await Registration.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
