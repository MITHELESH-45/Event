import { Request, Response } from 'express';
import User from '../models/User';
import Event from '../models/Event';
import Registration from '../models/Registration';

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrganizers = await User.countDocuments({ role: 'organizer' });
        const totalEvents = await Event.countDocuments();
        const totalRegistrations = await Registration.countDocuments();
        const certificatesIssued = await Registration.countDocuments({ certificate: true });

        // Pending approvals
        const pendingApprovals = await Event.countDocuments({ status: 'pending' });

        // Monthly Trends (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyEvents = await Event.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const monthlyRegistrations = await Registration.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format monthly data - get last 6 months correctly
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthIndex = d.getMonth(); // 0-11
            const monthName = monthNames[monthIndex];

            // MongoDB aggregation returns month 1-12
            const eventData = monthlyEvents.find(e => e._id === monthIndex + 1);
            const regData = monthlyRegistrations.find(r => r._id === monthIndex + 1);

            last6Months.push({
                month: monthName,
                events: eventData ? eventData.count : 0,
                registrations: regData ? regData.count : 0
            });
        }

        const monthlyData = last6Months;

        // Category Distribution
        const categoryDistribution = await Event.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedCategories = categoryDistribution.map(cat => ({
            category: cat._id || "Uncategorized",
            count: cat.count,
            percentage: totalEvents > 0 ? Math.round((cat.count / totalEvents) * 100) : 0
        }));

        // Top Events
        const topEvents = await Registration.aggregate([
            {
                $group: {
                    _id: "$event",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "events",
                    localField: "_id",
                    foreignField: "_id",
                    as: "eventDetails"
                }
            },
            { $unwind: "$eventDetails" },
            {
                $project: {
                    title: "$eventDetails.title",
                    registrations: "$count",
                    capacity: "$eventDetails.capacity"
                }
            }
        ]);

        res.status(200).json({
            stats: {
                totalUsers,
                totalOrganizers,
                totalEvents,
                totalRegistrations,
                certificatesIssued,
                pendingApprovals,
                activeEvents: await Event.countDocuments({ status: 'approved' })
            },
            monthlyData,
            categoryDistribution: formattedCategories,
            topEvents
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
