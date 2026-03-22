const SHIPPO_BASE = 'https://api.goshippo.com';

const headers = {
  'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
  'Content-Type': 'application/json',
};

// Types
export interface ShippoAddress {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface ShippoParcel {
  length: string;
  width: string;
  height: string;
  distance_unit: 'cm';
  weight: string;
  mass_unit: 'kg';
}

export interface ShippingRate {
  object_id: string;
  provider: string;
  servicelevel: {
    name: string;
    token: string;
  };
  amount: string;
  currency: string;
  estimated_days: number | null;
  duration_terms: string;
}

export interface ShippingLabel {
  object_id: string;
  label_url: string;
  tracking_number: string;
  tracking_url_provider: string;
  carrier_account: string;
  rate: string;
  test_mode?: boolean;
}

export interface TrackingInfo {
  tracking_number: string;
  carrier: string;
  status: string;
  status_detail: string;
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
  estimated_delivery_date: string | null;
  eta: string | null;
}

// Get shipping rates
export async function getShippingRates(
  addressFrom: ShippoAddress,
  addressTo: ShippoAddress,
  parcel: ShippoParcel
): Promise<ShippingRate[]> {
  try {
    const res = await fetch(`${SHIPPO_BASE}/shipments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        address_from: addressFrom,
        address_to: addressTo,
        parcels: [parcel],
        async: false,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`Shippo API error: ${error.detail || error.message}`);
    }

    const data = await res.json();
    return data.rates || [];
  } catch (error) {
    console.error('Error getting shipping rates:', error);
    throw error;
  }
}

// Create shipping label
export async function createShippingLabel(rateId: string): Promise<ShippingLabel> {
  try {
    const res = await fetch(`${SHIPPO_BASE}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        rate: rateId,
        label_file_type: 'PDF',
        async: false,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`Shippo API error: ${error.detail || error.message}`);
    }

    const data = await res.json();

    // Check if the transaction was successful
    if (data.status === 'ERROR' || data.object_state === 'ERROR') {
      const messages = data.messages?.map((m: { text: string }) => m.text).join(', ') || 'Unknown error';

      // In test mode, some carriers don't support label creation
      // Return a simulated label so the flow can be tested end-to-end
      const isTestMode = process.env.SHIPPO_API_KEY?.startsWith('shippo_test_');
      if (isTestMode) {
        console.warn('Shippo test mode: carrier rejected label creation, returning simulated label');
        return {
          object_id: `test_txn_${Date.now()}`,
          label_url: 'https://shippo-delivery-east.s3.amazonaws.com/test-label.pdf',
          tracking_number: `TEST${Date.now().toString().slice(-10)}`,
          tracking_url_provider: '',
          carrier_account: 'test_carrier',
          rate: rateId,
          test_mode: true,
        } as ShippingLabel;
      }

      throw new Error(`Shippo transaction error: ${messages}`);
    }

    return {
      object_id: data.object_id,
      label_url: data.label_url || data.label_download?.href || '',
      tracking_number: data.tracking_number || '',
      tracking_url_provider: data.tracking_url_provider || '',
      carrier_account: data.carrier_account || '',
      rate: data.rate || rateId,
    };
  } catch (error) {
    console.error('Error creating shipping label:', error);
    throw error;
  }
}

// Track shipment
export async function trackShipment(
  carrier: string,
  trackingNumber: string
): Promise<TrackingInfo> {
  try {
    const res = await fetch(
      `${SHIPPO_BASE}/tracks/${carrier}/${trackingNumber}`,
      { headers }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`Shippo API error: ${error.detail || error.message}`);
    }

    const data = await res.json();
    return {
      tracking_number: data.tracking_number,
      carrier: data.carrier,
      status: data.tracking_status?.status || 'unknown',
      status_detail:
        data.tracking_status?.status_details || 'No details available',
      location: {
        city: data.tracking_status?.location?.city,
        state: data.tracking_status?.location?.state,
        country: data.tracking_status?.location?.country,
      },
      estimated_delivery_date:
        data.tracking_status?.estimated_delivery_date || null,
      eta: data.tracking_status?.eta || null,
    };
  } catch (error) {
    console.error('Error tracking shipment:', error);
    throw error;
  }
}
