'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dijkstra } from '@/lib/metro/dijkstra';
import { STATIONS } from '@/lib/metro/data';
import QRCode from 'qrcode';

export async function bookTicket(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Please login first' };

  const fromId = parseInt(formData.get('from') as string);
  const toId = parseInt(formData.get('to') as string);
  const journeyDate = formData.get('journeyDate') as string;

  if (isNaN(fromId) || isNaN(toId)) return { error: 'Invalid stations' };
  if (fromId === toId) return { error: 'Source and destination cannot be same' };
  if (!journeyDate) return { error: 'Please select journey date' };

  const route = dijkstra(fromId, toId, 'distance');
  if (!route.found) return { error: 'No route found' };

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      source_station_id: null,
      destination_station_id: null,
      fare: route.totalFare,
      distance: route.totalDistance,
      travel_time: route.totalTime,
      num_stops: route.numStops,
      status: 'confirmed',
      journey_date: journeyDate,
    })
    .select()
    .single();

  if (bookingError) return { error: bookingError.message };

  const ticketNumber =
    'PMP-' +
    Date.now() +
    '-' +
    Math.random().toString(36).substring(2, 6).toUpperCase();

  const qrData = JSON.stringify({
    ticketNumber,
    from: STATIONS[fromId].name,
    to: STATIONS[toId].name,
    fare: route.totalFare,
    date: journeyDate,
    bookingId: booking.id,
  });

  const qrCodeString = await QRCode.toDataURL(qrData);

  const { error: ticketError } = await supabase
    .from('tickets')
    .insert({
      booking_id: booking.id,
      ticket_number: ticketNumber,
      qr_code: qrCodeString,
      is_used: false,
      valid_until: new Date(
        new Date(journeyDate).getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .select()
    .single();

  if (ticketError) return { error: ticketError.message };

  return {
    success: true,
    ticket: {
      ticketNumber,
      qrCode: qrCodeString,
      from: STATIONS[fromId].name,
      to: STATIONS[toId].name,
      fare: route.totalFare,
      distance: route.totalDistance,
      time: route.totalTime,
      stops: route.numStops,
      date: journeyDate,
      bookingId: booking.id,
    },
  };
}