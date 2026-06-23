/**
 * services/flightProvider.js
 * Abstraction layer for Flight Data Providers (FlightAware AeroAPI vs Aviation Edge).
 * Supports rate limit retry logic, exponential backoff, and mock data for testing.
 */

const axios = require('axios');

// Exponential backoff helper
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    // Check if error is rate limiting (429) or temporary server error (5xx)
    const status = error.response ? error.response.status : null;
    if (status === 429 || (status >= 500 && status < 600)) {
      console.warn(`API rate limit or server error encountered (${status}). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Standardizes FlightAware AeroAPI v4 flights response
 */
function parseFlightAware(data) {
  if (!data || !data.flights || data.flights.length === 0) {
    throw new Error('No flight data returned from FlightAware');
  }
  const f = data.flights[0];
  
  // Parse status
  let status = 'Scheduled';
  if (f.cancelled) status = 'Cancelled';
  else if (f.actual_in) status = 'Arrived';
  else if (f.actual_out) status = 'En Route';
  else if (f.departure_delay > 0 || f.arrival_delay > 0) status = 'Delayed';

  return {
    status,
    departureDelayMinutes: Math.round((f.departure_delay || 0) / 60),
    arrivalDelayMinutes: Math.round((f.arrival_delay || 0) / 60),
    gateChanges: {
      departureGate: f.gate_origin || null,
      arrivalGate: f.gate_destination || null
    },
    scheduledDepartureTime: f.scheduled_out || null,
    scheduledArrivalTime: f.scheduled_in || null,
    estimatedDepartureTime: f.estimated_out || f.scheduled_out || null,
    estimatedArrivalTime: f.estimated_in || f.scheduled_in || null,
    actualDepartureTime: f.actual_out || null,
    actualArrivalTime: f.actual_in || null
  };
}

/**
 * Standardizes Aviation Edge timetable response
 */
function parseAviationEdge(data, flightNum) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('No flight data returned from Aviation Edge');
  }
  // Filter for matching flight number if array has multiple
  const f = data.find(item => item.flight?.number === flightNum || item.flight?.iataNumber === flightNum) || data[0];
  
  let status = 'Scheduled';
  const apiStatus = (f.status || '').toLowerCase();
  if (apiStatus === 'cancelled') status = 'Cancelled';
  else if (apiStatus === 'landed') status = 'Arrived';
  else if (apiStatus === 'active') status = 'En Route';

  // Calculate delays from API fields (Aviation Edge returns delay in minutes directly)
  const depDelay = f.departure?.delay || 0;
  const arrDelay = f.arrival?.delay || 0;
  if (apiStatus !== 'cancelled' && (depDelay > 0 || arrDelay > 0)) {
    status = 'Delayed';
  }

  return {
    status,
    departureDelayMinutes: depDelay,
    arrivalDelayMinutes: arrDelay,
    gateChanges: {
      departureGate: f.departure?.gate || null,
      arrivalGate: f.arrival?.gate || null
    },
    scheduledDepartureTime: f.departure?.scheduledTime || null,
    scheduledArrivalTime: f.arrival?.scheduledTime || null,
    estimatedDepartureTime: f.departure?.estimatedTime || f.departure?.scheduledTime || null,
    estimatedArrivalTime: f.arrival?.estimatedTime || f.arrival?.scheduledTime || null,
    actualDepartureTime: f.departure?.actualTime || null,
    actualArrivalTime: f.arrival?.actualTime || null
  };
}

/**
 * Returns mock flight data for unit testing scenarios
 */
function getMockFlightData(flightNumber) {
  const now = new Date();
  
  if (flightNumber.endsWith('_FAIL')) {
    throw new Error('Mock API Failure triggered');
  }

  // Base schedule dates
  const scheduledDeparture = new Date(now.getTime() + 4 * 60 * 60 * 1000); // dep in 4 hours
  const scheduledArrival = new Date(now.getTime() - 2 * 60 * 60 * 1000); // landed 2 hours ago (layover started)

  if (flightNumber.endsWith('_ONTIME')) {
    return {
      status: 'Scheduled',
      departureDelayMinutes: 0,
      arrivalDelayMinutes: 0,
      gateChanges: { departureGate: 'Gate 15', arrivalGate: 'Gate 22' },
      scheduledDepartureTime: scheduledDeparture.toISOString(),
      scheduledArrivalTime: scheduledArrival.toISOString(),
      estimatedDepartureTime: scheduledDeparture.toISOString(),
      estimatedArrivalTime: scheduledArrival.toISOString(),
      actualDepartureTime: null,
      actualArrivalTime: scheduledArrival.toISOString()
    };
  }

  if (flightNumber.endsWith('_DELAY30')) {
    const estDeparture = new Date(scheduledDeparture.getTime() + 30 * 60 * 1000); // 30 min delay
    return {
      status: 'Delayed',
      departureDelayMinutes: 30,
      arrivalDelayMinutes: 0,
      gateChanges: { departureGate: 'Gate 15', arrivalGate: 'Gate 22' },
      scheduledDepartureTime: scheduledDeparture.toISOString(),
      scheduledArrivalTime: scheduledArrival.toISOString(),
      estimatedDepartureTime: estDeparture.toISOString(),
      estimatedArrivalTime: scheduledArrival.toISOString(),
      actualDepartureTime: null,
      actualArrivalTime: scheduledArrival.toISOString()
    };
  }

  if (flightNumber.endsWith('_DELAY120')) {
    const estDeparture = new Date(scheduledDeparture.getTime() + 120 * 60 * 1000); // 2 hours delay
    return {
      status: 'Delayed',
      departureDelayMinutes: 120,
      arrivalDelayMinutes: 0,
      gateChanges: { departureGate: 'Gate 15', arrivalGate: 'Gate 22' },
      scheduledDepartureTime: scheduledDeparture.toISOString(),
      scheduledArrivalTime: scheduledArrival.toISOString(),
      estimatedDepartureTime: estDeparture.toISOString(),
      estimatedArrivalTime: scheduledArrival.toISOString(),
      actualDepartureTime: null,
      actualArrivalTime: scheduledArrival.toISOString()
    };
  }

  if (flightNumber.endsWith('_CANCEL')) {
    return {
      status: 'Cancelled',
      departureDelayMinutes: 0,
      arrivalDelayMinutes: 0,
      gateChanges: { departureGate: null, arrivalGate: null },
      scheduledDepartureTime: scheduledDeparture.toISOString(),
      scheduledArrivalTime: scheduledArrival.toISOString(),
      estimatedDepartureTime: null,
      estimatedArrivalTime: null,
      actualDepartureTime: null,
      actualArrivalTime: null
    };
  }

  if (flightNumber.endsWith('_GATE')) {
    return {
      status: 'Scheduled',
      departureDelayMinutes: 0,
      arrivalDelayMinutes: 0,
      gateChanges: { departureGate: 'Gate 99', arrivalGate: 'Gate 22' }, // departure gate change
      scheduledDepartureTime: scheduledDeparture.toISOString(),
      scheduledArrivalTime: scheduledArrival.toISOString(),
      estimatedDepartureTime: scheduledDeparture.toISOString(),
      estimatedArrivalTime: scheduledArrival.toISOString(),
      actualDepartureTime: null,
      actualArrivalTime: scheduledArrival.toISOString()
    };
  }

  // General default fallback mock
  return {
    status: 'Scheduled',
    departureDelayMinutes: 0,
    arrivalDelayMinutes: 0,
    gateChanges: { departureGate: 'Gate A1', arrivalGate: 'Gate B2' },
    scheduledDepartureTime: scheduledDeparture.toISOString(),
    scheduledArrivalTime: scheduledArrival.toISOString(),
    estimatedDepartureTime: scheduledDeparture.toISOString(),
    estimatedArrivalTime: scheduledArrival.toISOString(),
    actualDepartureTime: null,
    actualArrivalTime: null
  };
}

/**
 * Main function to fetch flight status from configured providers
 */
async function fetchFlightStatus(flightNumber) {
  // Check if test suffix matches mock scenarios
  if (
    flightNumber.endsWith('_ONTIME') ||
    flightNumber.endsWith('_DELAY30') ||
    flightNumber.endsWith('_DELAY120') ||
    flightNumber.endsWith('_CANCEL') ||
    flightNumber.endsWith('_GATE') ||
    flightNumber.endsWith('_FAIL')
  ) {
    return getMockFlightData(flightNumber);
  }

  const flightawareKey = process.env.FLIGHTAWARE_API_KEY;
  const aviationedgeKey = process.env.AVIATIONEDGE_API_KEY;

  // 1. Prioritize FlightAware AeroAPI v4
  if (flightawareKey && flightawareKey !== 'YOUR_FLIGHTAWARE_KEY') {
    return retryWithBackoff(async () => {
      const response = await axios.get(`https://aeroapi.flightaware.com/aeroapi/flights/${flightNumber}`, {
        headers: { 'x-apikey': flightawareKey }
      });
      return parseFlightAware(response.data);
    });
  }

  // 2. Fallback to Aviation Edge API
  if (aviationedgeKey && aviationedgeKey !== 'YOUR_AVIATIONEDGE_KEY') {
    return retryWithBackoff(async () => {
      const response = await axios.get('https://aviation-edge.com/v2/public/timetable', {
        params: {
          key: aviationedgeKey,
          flight_num: flightNumber.replace(/[^0-9]/g, ''),
          airline_iata: flightNumber.replace(/[0-9]/g, ''),
          type: 'departure'
        }
      });
      return parseAviationEdge(response.data, flightNumber);
    });
  }

  // 3. Environment Fallback
  console.log(`No production flight provider key found. Returning default mock status for ${flightNumber}.`);
  return getMockFlightData(flightNumber);
}

module.exports = {
  fetchFlightStatus
};
