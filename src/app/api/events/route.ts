import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const mode = searchParams.get('mode');
    const organizerId = searchParams.get('organizerId');

    const query: any = {};
    if (type && type !== 'all') query.type = type;
    if (mode && mode !== 'all') query.mode = mode;
    if (organizerId) query.organizer = organizerId;
    
    // By default only show published events unless fetching for specific organizer
    if (!organizerId) {
        query.status = 'published';
    }

    const events = await Event.find(query).sort({ startDate: 1 });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Basic validation
    if (!body.title || !body.organizer) {
       return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await Event.create(body);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
