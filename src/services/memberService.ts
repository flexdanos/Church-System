import { supabase } from '../lib/supabaseClient';

export interface Member {
  id?: number;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  membership_status: string;
  group_affiliation: string;
  roles: string;
  date_of_birth: string;
  date_joined?: string;
  profile_picture?: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    base64?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}

// Get all members
export const getMembers = async (): Promise<{ data: Member[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Error fetching members:', error);
    return { data: null, error };
  }
};

// Add a new member
export const addMember = async (memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Member | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('members')
      .insert([{
        ...memberData,
        date_joined: memberData.date_joined || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error adding member:', error);
    return { data: null, error };
  }
};

// Update a member
export const updateMember = async (id: number, memberData: Partial<Member>): Promise<{ data: Member | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('members')
      .update({
        ...memberData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error updating member:', error);
    return { data: null, error };
  }
};

// Delete a member
export const deleteMember = async (id: number): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    console.error('Error deleting member:', error);
    return { error };
  }
};

// Get a single member by ID
export const getMemberById = async (id: number): Promise<{ data: Member | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error fetching member:', error);
    return { data: null, error };
  }
};
