import { supabase } from '../lib/supabaseClient';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description?: string;
  expectedAttendees: number;
  attendeeCount: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateEventInput {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description?: string;
  expectedAttendees: number;
}

export interface UpdateEventInput {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  description?: string;
  expectedAttendees?: number;
}

// Create a new event
export const createEvent = async (eventData: CreateEventInput): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: eventData.title,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          category: eventData.category,
          description: eventData.description,
          expected_attendees: eventData.expectedAttendees,
          attendee_count: 0,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend
    return {
      ...data,
      expectedAttendees: data.expected_attendees,
      attendeeCount: data.attendee_count
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend
    return (data || []).map(item => ({
      ...item,
      expectedAttendees: item.expected_attendees,
      attendeeCount: item.attendee_count,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      createdBy: item.created_by
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get event by ID
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }
    
    // Transform snake_case to camelCase for frontend
    return {
      ...data,
      expectedAttendees: data.expected_attendees,
      attendeeCount: data.attendee_count
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Update event
export const updateEvent = async (id: string, eventData: UpdateEventInput): Promise<Event> => {
  try {
    // Transform camelCase to snake_case for database
    const updateData: any = {};
    if (eventData.title !== undefined) updateData.title = eventData.title;
    if (eventData.date !== undefined) updateData.date = eventData.date;
    if (eventData.time !== undefined) updateData.time = eventData.time;
    if (eventData.location !== undefined) updateData.location = eventData.location;
    if (eventData.category !== undefined) updateData.category = eventData.category;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.expectedAttendees !== undefined) updateData.expected_attendees = eventData.expectedAttendees;

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select('id, title, date, time, location, category, description, expected_attendees, attendee_count, created_at, updated_at, created_by')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    // Transform snake_case to camelCase for frontend
    return {
      ...data,
      expectedAttendees: data.expected_attendees,
      attendeeCount: data.attendee_count
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Update attendee count
export const updateAttendeeCount = async (id: string, count: number): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        attendee_count: count
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend
    return {
      ...data,
      expectedAttendees: data.expected_attendees,
      attendeeCount: data.attendee_count
    };
  } catch (error) {
    console.error('Error updating attendee count:', error);
    throw error;
  }
};

// Get events by category
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: true });

    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend
    return (data || []).map(item => ({
      ...item,
      expectedAttendees: item.expected_attendees,
      attendeeCount: item.attendee_count,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      createdBy: item.created_by
    }));
  } catch (error) {
    console.error('Error fetching events by category:', error);
    throw error;
  }
};

// Get upcoming events
export const getUpcomingEvents = async (): Promise<Event[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true });

    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend
    return (data || []).map(item => ({
      ...item,
      expectedAttendees: item.expected_attendees,
      attendeeCount: item.attendee_count,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      createdBy: item.created_by
    }));
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};
