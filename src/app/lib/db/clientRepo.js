import db from "./index";
import mongoose, { Schema } from "mongoose";

async function getClients() {
  const clients = await db.Client.find();
  return clients;
}
async function getclientsbyclinicId(clinicId) {
  const clients = await db.Client.find({ clinic: clinicId });
  return clients;
}

async function getnumclientsbyId(coachId) {
  const getNum = await db.Client.find({ coachId: coachId });
  return getNum.length;
}

async function getnumclientsbyClinicId(clinicId) {
  const getNum = await db.Client.find({ clinic: clinicId });
  return getNum.length;
}

async function getnumprojectsbyId(coachId) {
  const result = await db.Client.aggregate([
    {
      $match: { coachId: new mongoose.Types.ObjectId(coachId) }
    },
    {
      $group: {
        _id: "$programId"
      }
    },
    {
      $count: "uniquePrograms"
    }
  ]);

  return result.length > 0 ? result[0].uniquePrograms : 0;
}

async function createClient(name, email, phone, programId, programCategory, startDate, notes, coachId, clinic, weightDate, initialWeight, goals) {
  const existingClient = await db.Client.findOne({ email });
  if (existingClient) {
    return existingClient;
  }

  const client = await db.Client.create([{
    name,
    email,
    phone,
    programId,
    programCategory,
    startDate,
    notes,
    coachId,
    clinic,
    weightDate,
    initialWeight,
    goals
  }]);

  return client[0];
}

async function getProgressdata(email) {

  const process = await db.CheckIn.find(
    { email: email }, // filter by email
    {
      selectedDate: 1,
      weight: 1,
      waist: 1,
      energyLevel: 1,
      moodLevel: 1,
      sleepHours: 1,
      _id: 0 // exclude _id if you want
    }
  )
  return process;
}

async function createCheckIn(
  name,
  email,
  coachId,
  clinic,
  selectedDate,
  weight,
  waist,
  waterIntake,
  energyLevel,
  moodLevel,
  exerciseType,
  exercise,
  exerciseTime,
  sleepHours,
  breakfastProtein,
  breakfastProteinPortion,
  breakfastFruit,
  breakfastFruitPortion,
  breakfastVegetable,
  breakfastVegetablePortion,
  lunchProtein,
  lunchProteinPortion,
  lunchFruit,
  lunchFruitPortion,
  lunchVegetable,
  lunchVegetablePortion,
  dinnerProtein,
  dinnerProteinPortion,
  dinnerFruit,
  dinnerFruitPortion,
  dinnerVegetable,
  dinnerVegetablePortion,
  snacks,
  snackPortion,
  supplements,
  notes
) {
  console.log("oaky", weight)
  const checkin = await db.CheckIn.create([{
    name,
    email,
    coachId,
    clinic,
    selectedDate,
    weight,
    waist,
    waterIntake,
    energyLevel,
    moodLevel,
    exerciseType,
    exercise,
    exerciseTime,
    sleepHours,
    breakfastProtein,
    breakfastProteinPortion,
    breakfastFruit,
    breakfastFruitPortion,
    breakfastVegetable,
    breakfastVegetablePortion,
    lunchProtein,
    lunchProteinPortion,
    lunchFruit,
    lunchFruitPortion,
    lunchVegetable,
    lunchVegetablePortion,
    dinnerProtein,
    dinnerProteinPortion,
    dinnerFruit,
    dinnerFruitPortion,
    dinnerVegetable,
    dinnerVegetablePortion,
    snacks,
    snackPortion,
    supplements,
    notes
  }]);
  return checkin[0];
}

async function getCheckInsbyId(id) {
  const chechIns = await db.CheckIn.find({ coachId: id });
  return chechIns;
}

async function getnumCheckInbyId(id) {
  const checkIns = await db.CheckIn.find({ coachId: id });
  return checkIns.length;
}

async function getActiveClients(id) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await db.CheckIn.aggregate([
    {
      $match: {
        "coachId": new mongoose.Types.ObjectId(id),
        "selectedDate": { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: "$email" // Group by email to get unique clients
      }
    },
    {
      $count: "activeClients" // Count the unique emails
    }
  ]);
  console.log("result", result);
  return result.length > 0 ? result[0].activeClients : 0;
}

async function getCheckIns(id) {
  const checkIns = await db.CheckIn.find({ coachId: id });
  console.log("checkIns", checkIns.length);
  return checkIns.length;
}

async function gethistoricalData(id) {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const clients = await db.Client.find(
      { coachId: id },
      { email: 1, _id: 0 }
    );

    // Extract just the email addresses
    const emails = clients.map(client => client.email);

    // Use aggregation pipeline to process data on the server
    // Remove the .toArray() call since Mongoose aggregate() already returns an array
    const result = await db.CheckIn.aggregate([
      // Match check-ins for this coach's clients in the last 6 months
      {
        $match: {
          email: { $in: emails },
          selectedDate: { $gte: sixMonthsAgo }
        }
      },
      // Add month fields for grouping and sorting
      {
        $addFields: {
          month: { $dateToString: { format: "%b", date: "$selectedDate" } },
          monthNum: { $month: "$selectedDate" }
        }
      },
      // Group by month
      {
        $group: {
          _id: {
            month: "$month",
            monthNum: "$monthNum"
          },
          checkIns: { $sum: 1 },
          totalWeight: {
            $sum: {
              $cond: [{ $ne: ["$weight", null] }, "$weight", 0]
            }
          },
          weightCount: {
            $sum: {
              $cond: [{ $ne: ["$weight", null] }, 1, 0]
            }
          }
        }
      },
      // Calculate average weight
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          monthNum: "$_id.monthNum",
          checkIns: 1,
          avgWeight: {
            $cond: [
              { $gt: ["$weightCount", 0] },
              { $round: [{ $divide: ["$totalWeight", "$weightCount"] }] },
              0
            ]
          }
        }
      },
      // Sort by month number for chronological order
      { $sort: { monthNum: 1 } },
      // Remove the monthNum field from final results
      {
        $project: {
          month: 1,
          checkIns: 1,
          avgWeight: 1
        }
      }
    ]);
    console.log("result", result);
    return result;
  } catch (error) {
    console.error('[CoachDashboard] Error fetching historical data:', error);
    return [];
  }
}

async function getPendingCheckIns(id) {
  try {
    // Calculate date from 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Find clients with no check-ins or last check-in older than 7 days
    const pendingCheckIns = await db.CheckIn.aggregate([
      // Match check-ins for the specific coach
      { $match: { coachId: new mongoose.Types.ObjectId(id) } },
      // Group by client (email used as identifier)
      {
        $group: {
          _id: "$email",
          lastCheckIn: { $max: "$selectedDate" },
          clientName: { $first: "$name" }
        }
      },
      // Filter for clients with no check-ins or old check-ins
      {
        $match: {
          $or: [
            { lastCheckIn: { $lt: oneWeekAgo } },
            { lastCheckIn: { $exists: false } }
          ]
        }
      },
      // Project the fields we want to return
      {
        $project: {
          _id: 0,
          email: "$_id",
          name: "$clientName",
          lastCheckIn: 1
        }
      }
    ]);
    console.log("pendingCheckIns", pendingCheckIns);
    return pendingCheckIns;
  } catch (error) {
    console.error("Error fetching pending check-ins:", error);
    throw error;
  }
}

async function getCompletedProgramsCount(id) {
  try {
    const currentDate = new Date();

    const result = await db.Client.aggregate([
      // Match clients for this coach
      {
        $match: {
          coachId: new mongoose.Types.ObjectId(id),
          startDate: { $ne: null }, // Ensure startDate exists
          programId: { $ne: null }  // Ensure programId exists
        }
      },
      // Lookup program details
      {
        $lookup: {
          from: "programs", // Collection name (usually lowercase plural of model name)
          localField: "programId",
          foreignField: "_id",
          as: "program"
        }
      },
      // Unwind the program array (converts it to an object)
      {
        $unwind: "$program"
      },
      // Add calculated fields
      {
        $addFields: {
          // Extract the duration unit (weeks, days, months)
          durationUnit: {
            $cond: [
              { $regexMatch: { input: "$program.duration", regex: /weeks$/ } },
              "weeks",
              {
                $cond: [
                  { $regexMatch: { input: "$program.duration", regex: /days$/ } },
                  "days",
                  {
                    $cond: [
                      { $regexMatch: { input: "$program.duration", regex: /months$/ } },
                      "months",
                      "unknown"
                    ]
                  }
                ]
              }
            ]
          },
          // Extract the numeric part of the duration using regex
          durationValueRegex: {
            $regexFind: {
              input: "$program.duration",
              regex: /^\d+/
            }
          }
        }
      },
      // Extract the actual matched string from the regex result
      {
        $addFields: {
          durationValue: {
            $toInt: {
              $cond: [
                { $ifNull: ["$durationValueRegex", false] },
                "$durationValueRegex.match",
                "0"
              ]
            }
          }
        }
      },
      // Calculate duration in days and end date
      {
        $addFields: {
          // Convert duration to days based on unit
          durationInDays: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$durationUnit", "weeks"] },
                  then: { $multiply: ["$durationValue", 7] }
                },
                {
                  case: { $eq: ["$durationUnit", "days"] },
                  then: "$durationValue"
                },
                {
                  case: { $eq: ["$durationUnit", "months"] },
                  then: { $multiply: ["$durationValue", 30] }
                }
              ],
              default: 0
            }
          }
        }
      },
      // Calculate end date
      {
        $addFields: {
          endDate: {
            $dateAdd: {
              startDate: "$startDate",
              unit: "day",
              amount: "$durationInDays"
            }
          }
        }
      },
      // Filter for completed programs (end date is in the past)
      {
        $match: {
          endDate: { $lt: currentDate }
        }
      },
      // Count the completed programs
      {
        $count: "completedPrograms"
      }
    ]);
    console.log("completed program", result);
    return result.length > 0 ? result[0].completedPrograms : 0;
  } catch (error) {
    console.error('[CompletedPrograms] Error counting completed programs:', error);
    return 0;
  }
}

async function getCoachRecentActivities(id, limit = 5) {
  try {
    // Create an array to store activities from multiple sources
    const activities = [];


    // First get unique clients for this coach
    const clientsData = await db.CheckIn.aggregate([
      { $match: { coachId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: "$email",
          name: { $first: "$name" },
          id: { $first: "$_id" }
        }
      }
    ]);

    if (!clientsData || clientsData.length === 0) {
      return [];
    }

    // Get client emails for querying check-ins
    const clientEmails = clientsData.map(client => client._id); // _id contains email from the aggregation

    // Create a map of client emails to names for lookup
    const clientNameMap = Object.fromEntries(
      clientsData.map(client => [client._id, client.name])
    );

    // Get recent check-ins for coach's clients
    const checkInsData = await db.CheckIn.find({
      email: { $in: clientEmails },
      coachId: new mongoose.Types.ObjectId(id)
    })
      .select('_id selectedDate email')
      .sort({ selectedDate: -1 }) // descending order (newest first)
      .limit(limit)
      .lean();

    // Process check-ins into activity items
    for (const checkIn of checkInsData) {
      activities.push({
        id: checkIn._id.toString(),
        type: 'check_in',
        description: `${clientNameMap[checkIn.email] || 'A client'} submitted a check-in`,
        timestamp: new Date(checkIn.selectedDate).toISOString(),
        email: checkIn.email // Using email as clientId since that's our unique identifier
      });
    }

    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    // Return activities (limited to requested amount)

    console.log('Activitiellllllllllls:', clientNameMap);
    return activities.slice(0, limit);

  } catch (error) {
    console.error('[CoachDashboard] Error fetching recent activities:', error);
    throw error;
  }
}

async function getClinics() {
  const clinics = await db.Clinic.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "clinic",
        as: "coaches",
        pipeline: [
          {
            $match: {
              role: "coach"
            }
          },
          {
            $count: "count"
          }
        ]
      }
    },
    {
      $lookup: {
        from: "clients",
        localField: "_id",
        foreignField: "clinic",
        as: "clients",
        pipeline: [
          {
            $count: "count"
          }
        ]
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "clinic",
        as: "clinicAdmin",
        pipeline: [
          {
            $match: {
              role: "clinic_admin"
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1
            }
          }
        ]
      }
    }
  ]);
  return clinics;
}

async function getclientNum() {
  const num = await db.Client.find();
  return num.length;
}

async function getClinentNum(id) {
  const num = await db.Client.find({ clinic: id });
  return num;
}

async function updateClientNum(id) {
  const num = await db.Clinic.findByIdAndUpdate(id, { $inc: { clients: 1 } });
  return num;
}

async function getclientsbycoachId(coachId) {
  const clients = await db.Client.find({ coachId: coachId });
  return clients;
}

export const
  clientRepo = {
    getclientsbycoachId,
    getClients,
    createClient,
    getclientsbyclinicId,
    getnumclientsbyClinicId,
    createCheckIn,
    getProgressdata,
    getCheckInsbyId,
    getActiveClients,
    getCheckIns,
    getnumclientsbyId,
    getnumprojectsbyId,
    getnumCheckInbyId,
    gethistoricalData,
    getPendingCheckIns,
    getCompletedProgramsCount,
    getCoachRecentActivities,
    getClinics,
    getClinentNum,
    updateClientNum,
    getclientNum

  }