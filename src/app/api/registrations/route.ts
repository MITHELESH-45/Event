import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Registration from '@/models/Registration';
import Event from '@/models/Event';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');

    const query: any = {};
    if (userId) query.user = userId;
    if (eventId) query.event = eventId;

    const registrations = await Registration.find(query)
      .populate('event')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, eventId } = await req.json();

    if (!userId || !eventId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check capacity
    const event = await Event.findById(eventId);
    if (!event) {
        return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const currentRegistrations = await Registration.countDocuments({ event: eventId, status: 'registered' });
    if (currentRegistrations >= event.capacity) {
        return NextResponse.json({ message: 'Event is full' }, { status: 400 });
    }

    const registration = await Registration.create({
      user: userId,
      event: eventId,
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
        return NextResponse.json({ message: 'Already registered for this event' }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
