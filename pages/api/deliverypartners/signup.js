import dbConnect from "@/middleware/mongoose";
import { deliveryPartnersSchema } from "@/models/DeliveryPartner";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    if (method === 'POST') {
        try {
            const {
                name,
                contact,
                password,
                confirmPassword,
                area,
            } = req.body;

            // Validate required fields
            if (!name || !contact || !password || !area  || !confirmPassword) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Passwords don't match." });
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            // Create a new delivery partner instance
            const newDeliveryPartner = new deliveryPartnersSchema({
                name,
                contact,
                area,
                password: hashedPassword,
                // Add other fields as needed
            });

            // Save to database
            await newDeliveryPartner.save();

            res.status(200).json({ message: 'Signup successful!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error. Please try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}