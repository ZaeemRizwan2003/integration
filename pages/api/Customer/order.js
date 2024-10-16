import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
    await dbConnect();

    // Handle GET request to fetch an order by ID
    if (req.method === "GET") {
        const { id } = req.query; // Get the order ID from the query
        try {
            const order = await Order.findById(id); // Fetch the order by ID
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching order", error });
        }
    } 
    // Handle POST request to create a new order
    else if (req.method === "POST") {
        const { userId, items, totalAmount, address } = req.body;

        // Validate required fields
        if (!userId || !items || !totalAmount || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            address,
        });

        try {
            const savedOrder = await newOrder.save(); // Save the new order
            res.status(201).json(savedOrder); // Return the saved order
        } catch (error) {
            return res.status(500).json({ message: "Error creating order", error });
        }
    } 
    // Handle DELETE request to delete an order by ID
    else if (req.method === "DELETE") {
        const { id } = req.query; // Get the order ID from the query
        try {
            const deletedOrder = await Order.findByIdAndDelete(id); // Delete the order by ID
            if (!deletedOrder) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json({ message: "Order deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting order", error });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
