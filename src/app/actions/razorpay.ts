'use server'

import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

type RazorpayFormData = {
    amount: number;
    email: string;
    name: string;
    phone: string;
};

export async function createRazorpayOrder(formData: RazorpayFormData) {
    try {
        const amount = formData.amount;
        const email = formData.email;
        const name = formData.name;
        const phone = formData.phone;

        if (!amount || !email || !name || !phone) {
            return { 
                success: false, 
                error: 'Missing required fields',
            };
        }

        const order = await razorpay.orders.create({
            amount: amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                email,
                name,
                phone,
            },
        });

        return {
            success: true,
            orderId: order.id,
        };
    } catch (error) {
        console.error('Error creating sortOrder:', error);

        return {
            success: false,
            error: 'Error creating order',
        };
    }
} 