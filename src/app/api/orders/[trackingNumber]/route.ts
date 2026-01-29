import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'orders';

export async function GET(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const trackingNumber = url.pathname.split('/').pop();

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

        const order = await db
        .collection(COLLECTION)
        .findOne({ trackingNumber: trackingNumber });
        
        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
        { status: 404 }
            );
        }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const trackingNumber = url.pathname.split('/').pop();
    const updates = await request.json();

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION).updateOne(
      { trackingNumber: trackingNumber },
      { 
        $set: { 
          ...updates,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// PATCH for partial updates (e.g., payment status, order status)
export async function PATCH(
  request: Request,
) {
  try {
    const url = new URL(request.url);
    const trackingNumber = url.pathname.split('/').pop();
    const updates = await request.json();

    console.log('=== PATCH Request Debug ===');
    console.log('Tracking Number:', trackingNumber);
    console.log('Request Body:', JSON.stringify(updates, null, 2));

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // First, check if order exists
    const existingOrder = await db.collection(COLLECTION).findOne({ trackingNumber: trackingNumber });
    
    if (!existingOrder) {
      console.log('Order not found with tracking number:', trackingNumber);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Existing order payment status:', existingOrder.payment?.status);

    // Build the update object based on what's being updated
    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    // Payment status values
    const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    // Order status values
    const orderStatuses = ['processing', 'shipped', 'delivered', 'cancelled', 'out-for-delivery'];

    // Handle payment object updates (complete payment object)
    if (updates.payment) {
      // If updating the entire payment object
      if (updates.payment.status) {
        updateFields['payment.status'] = updates.payment.status;
      }
      if (updates.payment.method) {
        updateFields['payment.method'] = updates.payment.method;
      }
    }

    // Handle payment status updates (direct paymentStatus field)
    if (updates.paymentStatus) {
      updateFields['payment.status'] = updates.paymentStatus;
    }

    // Handle status field - automatically detect if it's payment or order status
    if (updates.status) {
      if (paymentStatuses.includes(updates.status)) {
        // It's a payment status
        console.log('Detected payment status:', updates.status);
        updateFields['payment.status'] = updates.status;
      } else if (orderStatuses.includes(updates.status)) {
        // It's an order status
        console.log('Detected order status:', updates.status);
        updateFields.status = updates.status;
      } else {
        // Unknown status - default to order status
        console.log('Unknown status, defaulting to order status:', updates.status);
        updateFields.status = updates.status;
      }
    }

    // Handle shipping updates
    if (updates.shipping) {
      Object.keys(updates.shipping).forEach(key => {
        updateFields[`shipping.${key}`] = updates.shipping[key];
      });
    }

    // Handle other direct field updates
    Object.keys(updates).forEach(key => {
      if (key !== 'paymentStatus' && key !== 'status' && key !== 'payment' && key !== 'shipping') {
        updateFields[key] = updates[key];
      }
    });

    console.log('Update Fields to be applied:', JSON.stringify(updateFields, null, 2));

    const result = await db.collection(COLLECTION).updateOne(
      { trackingNumber: trackingNumber },
      {
        $set: updateFields,
      }
    );

    console.log('MongoDB Update Result:');
    console.log('- Matched Count:', result.matchedCount);
    console.log('- Modified Count:', result.modifiedCount);
    console.log('- Acknowledged:', result.acknowledged);

    // Verify the update
    const updatedOrder = await db.collection(COLLECTION).findOne({ trackingNumber: trackingNumber });
    console.log('Updated order payment status:', updatedOrder?.payment?.status);
    console.log('Updated order status:', updatedOrder?.status);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
    );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order updated successfully',
      modifiedCount: result.modifiedCount,
      debug: {
        trackingNumber,
        updateFields,
        beforeUpdate: {
          paymentStatus: existingOrder.payment?.status,
          orderStatus: existingOrder.status
        },
        afterUpdate: {
          paymentStatus: updatedOrder?.payment?.status,
          orderStatus: updatedOrder?.status
        }
      }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
