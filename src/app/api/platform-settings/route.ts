import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// NOTE: The Prisma client hasn't been regenerated with new models (CommissionTier, CommissionLog, PlatformSettings, Conversation, ChatMessage).
// Since we can't run `prisma generate` in this environment, we use (db as any) for type safety workarounds.

export const runtime = 'nodejs';

/**
 * Default platform settings to be seeded
 */
const DEFAULT_SETTINGS = {
  defaultCommissionRate: '6',
  minCommissionRate: '2',
  maxCommissionRate: '25',
  payoutFrequency: 'weekly',
  payoutMinimum: '50',
  platformName: 'NexoMarket',
};

/**
 * GET /api/platform-settings
 * List all platform settings
 */
export async function GET(request: NextRequest) {
  try {
    let settings = await (db as any).platformSettings.findMany({
      orderBy: { key: 'asc' },
    });

    // If no settings exist, seed with defaults
    if (settings.length === 0) {
      settings = await seedDefaultSettings();
    }

    // Format settings into an object for easier consumption
    const formattedSettings: Record<string, any> = {};
    settings.forEach((setting: any) => {
      formattedSettings[setting.key] = {
        id: setting.id,
        value: isNumericString(setting.value) ? parseFloat(setting.value) : setting.value,
        description: setting.description,
        updatedAt: setting.updatedAt,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: formattedSettings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/platform-settings]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch platform settings',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/platform-settings
 * Update a setting (admin only)
 * Body: { key: string, value: string }
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000000';

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Admin access required.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { key, value, description } = body;

    // Validate input
    if (!key || value === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: key, value',
        },
        { status: 400 }
      );
    }

    // Additional validation for specific settings
    if (key === 'defaultCommissionRate' || key === 'minCommissionRate' || key === 'maxCommissionRate') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        return NextResponse.json(
          {
            success: false,
            error: 'Commission rates must be numbers between 0 and 100',
          },
          { status: 400 }
        );
      }
    }

    if (key === 'payoutMinimum') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payout minimum must be a non-negative number',
          },
          { status: 400 }
        );
      }
    }

    if (key === 'payoutFrequency') {
      const validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly'];
      if (!validFrequencies.includes(value.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid payout frequency. Must be: daily, weekly, biweekly, or monthly',
          },
          { status: 400 }
        );
      }
    }

    // Upsert the setting
    const setting = await (db as any).platformSettings.upsert({
      where: { key },
      update: {
        value: String(value),
        description: description || null,
        updatedBy: userId,
      },
      create: {
        key,
        value: String(value),
        description: description || null,
        updatedBy: userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          key: setting.key,
          value: isNumericString(setting.value) ? parseFloat(setting.value) : setting.value,
          description: setting.description,
          updatedAt: setting.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[PATCH /api/platform-settings]', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update platform settings',
      },
      { status: 500 }
    );
  }
}

/**
 * Seed default platform settings
 */
async function seedDefaultSettings() {
  const existingSettings = await (db as any).platformSettings.count();

  // Only seed if no settings exist
  if (existingSettings > 0) {
    return await (db as any).platformSettings.findMany({
      orderBy: { key: 'asc' },
    });
  }

  const settings = await Promise.all(
    Object.entries(DEFAULT_SETTINGS).map(([key, value]) =>
      (db as any).platformSettings.create({
        data: {
          key,
          value,
          description: getSettingDescription(key),
        },
      })
    )
  );

  return settings;
}

/**
 * Get description for a setting key
 */
function getSettingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    defaultCommissionRate: 'Default commission rate applied to all sellers (percentage)',
    minCommissionRate: 'Minimum allowed commission rate (percentage)',
    maxCommissionRate: 'Maximum allowed commission rate (percentage)',
    payoutFrequency: 'Frequency of seller payouts: daily, weekly, biweekly, or monthly',
    payoutMinimum: 'Minimum amount required before payout is processed',
    platformName: 'Official name of the marketplace platform',
  };

  return descriptions[key] || '';
}

/**
 * Helper function to check if a string is numeric
 */
function isNumericString(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
}
