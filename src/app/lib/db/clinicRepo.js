import db from "./index";
import mongoose, { Schema } from "mongoose";
export const clinicRepo = {
  createClinic,
  getClinicById,
  deleteClinic,
  getnumcoachesbyId,
  getNumWactiveCount,
  getRecentactivity,
  getCheckInsbyId,
  fetchRevenueData,
  fetchsubscriptionData,
  fetchTotalRevenue,
  getCheckIns
};

async function createClinic(email, name, phoneNumber, primaryContact, streetAddress, city, state, zipCode, plan, addOns, hipaaAcknowledgment, legalAcknowledgment, options = {}) {
  const newClinic = await db.Clinic.create([{
    email,
    name,
    phoneNumber,
    primaryContact,
    streetAddress,
    city,
    state,
    zipCode,
    plan,
    addOns,
    hipaaAcknowledgment,
    legalAcknowledgment,
  }], options);
  return newClinic[0];
}

async function getCheckIns() {
  const checkIns = await db.CheckIn.find();
  return checkIns;
}

async function getClinicById(id) {
  const clinic = await db.Clinic.findById(id);
  return clinic;
}
async function getCheckInsbyId(id) {
  const checkIns = await db.CheckIn.find({ clinic: id });
  return checkIns;
}
async function deleteClinic(id) {
  await db.Clinic.findByIdAndDelete(id);
}

async function getnumcoachesbyId(coachId) {
    const clients = await db.Client.find({ coachId: coachId });
    return clients;
}

async function getNumWactiveCount(clinicId) {
  try {
    // Calculate the date for 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const result = await db.Activity.aggregate([
      // Match activities for this clinic within the past week
      {
        $match: {
          clinicId: new mongoose.Types.ObjectId(clinicId),
          timeStamp: { $gte: oneWeekAgo }
        }
      },
      // Count the activities
      {
        $count: "pastWeekCount"
      }
    ]);
    console.log("result",result);
    // Return the count or 0 if no results
    return result.length > 0 ? result[0].pastWeekCount : 0;
  } catch (error) {
    console.error('[ActivityStats] Error fetching past week activity count:', error);
    return 0;
  }
}

async function getRecentactivity(clinicId) {
  const recentActivity = await db.Activity.find({ clinicId: clinicId });
  return recentActivity;
}

async function fetchRevenueData(clinicId) {
  try {

    // Calculate date ranges for the last 6 months
    const months = [];
    const revenueData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthName = date.toLocaleString('default', { month: 'short' });
      months.push(monthName);
      
      // Calculate start and end dates for the month
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      // Build the query
      const query = {
        selectedDate: {
          $gte: startDate,
          $lte: endDate
        }
      };
      
      // Add clinic filter if provided
      if (clinicId) {
        query.clinic = new mongoose.Types.ObjectId(clinicId);
      }
      
      // Execute aggregation to get check-in count and unique clients
      const result = await db.CheckIn.aggregate([
        // Match check-ins for the current month
        { $match: query },
        
        // Group by month to calculate metrics
        {
          $group: {
            _id: null,
            checkInCount: { $sum: 1 },
            uniqueClients: { $addToSet: "$email" }
          }
        },
        
        // Project the final format
        {
          $project: {
            _id: 0,
            checkInCount: 1,
            uniqueClientCount: { $size: "$uniqueClients" }
          }
        }
      ]);
      
      // Calculate revenue (assuming $100 per check-in)
      const monthData = result.length > 0 ? result[0] : { checkInCount: 0, uniqueClientCount: 0 };
      const revenue = monthData.checkInCount * 100;
      
      revenueData.push({
        month: monthName,
        revenue: revenue,
        clients: monthData.uniqueClientCount
      });
    }
    
    return revenueData;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
}


async function fetchsubscriptionData(clinicId) {
  try {
    // Build the query for clinics
    const clinicQuery = {};
    if (clinicId) {
      clinicQuery._id = new mongoose.Types.ObjectId(clinicId);
    }
    
    // Fetch clinics
    const clinics = await db.Clinic.find(clinicQuery).lean();
    
    // Map subscription tier to price
    const priceMap = {
      'basic': '$149/month',
      'professional': '$249/month',
      'enterprise': '$399/month'
    };
    
    // Process each clinic to get subscription data
    const subscriptionData = [];
    
    for (const clinic of clinics) {
      // Count unique clients for this clinic
      const clientCount = await db.CheckIn.distinct('email', {
        clinic: new mongoose.Types.ObjectId(clinic._id)
      }).then(emails => emails.length);
      
      // Format the date
      const startDate = clinic.createdAt 
        ? new Date(clinic.createdAt).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          })
        : new Date().toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          });
      
      // Add to subscription data array
      subscriptionData.push({
        id: clinic._id.toString(),
        name: clinic.name,
        plan: clinic.plan || 'basic',
        price: priceMap[clinic.plan || 'basic'] || '$149/month',
        startDate: startDate,
        clients: clientCount
      });
    }
    
    return subscriptionData;
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    throw error;
  }
}

async function fetchTotalRevenue(clinicId) {
  try {
    // Build the query
    const query = {};
    
    // Add clinic filter if provided
    if (clinicId) {
      query.clinic = new mongoose.Types.ObjectId(clinicId);
    }
    
    // Count check-ins
    const count = await db.CheckIn.countDocuments(query);
    
    // Calculate revenue (assuming $100 per check-in)
    return count * 100;
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    throw error;
  }
}