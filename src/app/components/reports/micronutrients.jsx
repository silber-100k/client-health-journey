import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Apple, Beef, Carrot, Lightbulb, Target, Clock, Heart, Brain, Zap } from 'lucide-react';


const getNutrientIcon = (nutrientName) => {
  const name = nutrientName.toLowerCase();
  if (name.includes('vitamin c') || name.includes('folate')) return <Apple className="w-4 h-4" />;
  if (name.includes('iron') || name.includes('protein')) return <Beef className="w-4 h-4" />;
  if (name.includes('vitamin a') || name.includes('beta')) return <Carrot className="w-4 h-4" />;
  return <CheckCircle className="w-4 h-4" />;
};

const getDetailedRecommendations = (nutrientName, percentOfTarget) => {
  const name = nutrientName.toLowerCase();
  const deficit = Math.max(0, 100 - percentOfTarget);
  
  const recommendations = {
    foods: [],
    tips: [],
    timing: '',
    combinations: [],
    // Enhanced health information
    bodyFunction: '',
    healthBenefits: [],
    deficiencySymptoms: [],
    riskFactors: [],
    icon: <CheckCircle className="w-4 h-4" />,
    systemsAffected: []
  };

  if (name.includes('vitamin c')) {
    recommendations.foods = ['Citrus fruits (oranges, lemons)', 'Bell peppers (red, yellow)', 'Strawberries', 'Kiwi fruit', 'Broccoli'];
    recommendations.tips = ['Cook vegetables lightly to preserve vitamin C', 'Eat vitamin C foods with iron-rich foods for better absorption'];
    recommendations.timing = 'Best absorbed when spread throughout the day';
    recommendations.combinations = ['Pair with iron-rich foods like spinach', 'Combine with vitamin E for enhanced antioxidant effect'];
    recommendations.bodyFunction = 'Essential for collagen synthesis, immune function, and iron absorption. Acts as a powerful antioxidant protecting cells from damage.';
    recommendations.healthBenefits = ['Boosts immune system', 'Promotes wound healing', 'Enhances iron absorption', 'Protects against oxidative stress'];
    recommendations.deficiencySymptoms = ['Frequent colds and infections', 'Slow wound healing', 'Fatigue and weakness', 'Joint and muscle aches', 'Easy bruising', 'Dry, splitting hair'];
    recommendations.riskFactors = ['Smokers need 35mg more daily', 'Stress increases vitamin C needs', 'Limited fresh produce intake'];
    recommendations.icon = <Apple className="w-4 h-4 text-orange-500" />;
    recommendations.systemsAffected = ['Immune system', 'Connective tissue', 'Cardiovascular system'];
  } else if (name.includes('vitamin a')) {
    recommendations.foods = ['Sweet potatoes', 'Carrots', 'Dark leafy greens', 'Liver', 'Eggs'];
    recommendations.tips = ['Cook with a small amount of fat for better absorption', 'Beta-carotene converts to vitamin A in your body'];
    recommendations.timing = 'Fat-soluble vitamin - take with meals containing fat';
    recommendations.combinations = ['Pair with healthy fats like avocado or olive oil', 'Combine with zinc for optimal absorption'];
    recommendations.bodyFunction = 'Critical for vision, immune function, cell growth, and reproduction. Maintains healthy skin and mucous membranes.';
    recommendations.healthBenefits = ['Supports night vision', 'Maintains healthy skin', 'Boosts immune function', 'Promotes cell growth and development'];
    recommendations.deficiencySymptoms = ['Night blindness or poor vision in dim light', 'Dry, rough skin', 'Frequent infections', 'Delayed wound healing', 'Dry eyes'];
    recommendations.riskFactors = ['Low fat diet reduces absorption', 'Digestive disorders', 'Alcohol abuse'];
    recommendations.icon = <Carrot className="w-4 h-4 text-orange-500" />;
    recommendations.systemsAffected = ['Visual system', 'Immune system', 'Skin and mucous membranes'];
  } else if (name.includes('vitamin d')) {
    recommendations.foods = ['Fatty fish (salmon, mackerel)', 'Fortified dairy products', 'Egg yolks', 'Mushrooms (UV-exposed)'];
    recommendations.tips = ['Get 10-15 minutes of sunlight daily', 'Consider supplementation if deficient'];
    recommendations.timing = 'Take with the largest meal of the day for best absorption';
    recommendations.combinations = ['Take with calcium and magnesium', 'Pair with vitamin K2 for bone health'];
    recommendations.bodyFunction = 'Regulates calcium and phosphorus absorption, supports immune function, and maintains bone health. Acts as a hormone in the body.';
    recommendations.healthBenefits = ['Strengthens bones and teeth', 'Supports immune function', 'Regulates mood', 'Reduces inflammation'];
    recommendations.deficiencySymptoms = ['Bone pain and tenderness', 'Muscle weakness and aches', 'Fatigue and depression', 'Frequent illness', 'Hair loss'];
    recommendations.riskFactors = ['Limited sun exposure', 'Dark skin in northern climates', 'Older adults', 'Indoor lifestyle'];
    recommendations.icon = <Heart className="w-4 h-4 text-yellow-500" />;
    recommendations.systemsAffected = ['Skeletal system', 'Immune system', 'Muscular system'];
  } else if (name.includes('iron')) {
    recommendations.foods = ['Red meat', 'Spinach and dark leafy greens', 'Lentils and beans', 'Tofu', 'Pumpkin seeds'];
    recommendations.tips = ['Avoid tea/coffee with iron-rich meals', 'Cast iron cooking can increase iron content'];
    recommendations.timing = 'Best absorbed on empty stomach, but take with food if it causes stomach upset';
    recommendations.combinations = ['Pair with vitamin C foods for 3x better absorption', 'Avoid with calcium supplements'];
    recommendations.bodyFunction = 'Essential component of hemoglobin for oxygen transport. Critical for energy production and immune function.';
    recommendations.healthBenefits = ['Prevents anemia', 'Boosts energy levels', 'Supports cognitive function', 'Strengthens immune system'];
    recommendations.deficiencySymptoms = ['Fatigue and weakness', 'Pale skin, nails, or inner eyelids', 'Shortness of breath', 'Cold hands and feet', 'Restless leg syndrome', 'Cravings for ice or starch'];
    recommendations.riskFactors = ['Heavy menstrual periods', 'Vegetarian/vegan diet', 'Frequent blood donation', 'Digestive disorders'];
    recommendations.icon = <Beef className="w-4 h-4 text-red-500" />;
    recommendations.systemsAffected = ['Circulatory system', 'Energy metabolism', 'Cognitive function'];
  } else if (name.includes('calcium')) {
    recommendations.foods = ['Dairy products', 'Fortified plant milks', 'Sardines with bones', 'Tahini', 'Kale'];
    recommendations.tips = ['Spread intake throughout the day (max 500mg at once)', 'Weight-bearing exercise helps absorption'];
    recommendations.timing = 'Take smaller doses throughout the day for optimal absorption';
    recommendations.combinations = ['Take with vitamin D and magnesium', 'Separate from iron supplements by 2 hours'];
    recommendations.bodyFunction = 'Primary mineral for bone and teeth structure. Essential for muscle contractions, nerve signaling, and blood clotting.';
    recommendations.healthBenefits = ['Builds strong bones and teeth', 'Supports muscle function', 'Enables proper nerve transmission', 'Aids blood clotting'];
    recommendations.deficiencySymptoms = ['Muscle cramps and spasms', 'Numbness and tingling in fingers', 'Brittle or weak nails', 'Dental problems', 'Bone pain'];
    recommendations.riskFactors = ['Lactose intolerance', 'Post-menopause', 'Limited dairy intake', 'Vitamin D deficiency'];
    recommendations.icon = <Heart className="w-4 h-4 text-blue-500" />;
    recommendations.systemsAffected = ['Skeletal system', 'Muscular system', 'Nervous system'];
  } else if (name.includes('magnesium')) {
    recommendations.foods = ['Nuts and seeds', 'Whole grains', 'Dark chocolate', 'Avocados', 'Spinach'];
    recommendations.tips = ['Stress and alcohol can deplete magnesium', 'Epsom salt baths can provide topical magnesium'];
    recommendations.timing = 'Take with dinner or before bed for relaxation benefits';
    recommendations.combinations = ['Works synergistically with calcium and vitamin D', 'Take with B vitamins for energy metabolism'];
    recommendations.bodyFunction = 'Cofactor in over 300 enzymatic reactions. Critical for energy production, protein synthesis, and muscle/nerve function.';
    recommendations.healthBenefits = ['Supports muscle and nerve function', 'Regulates blood sugar', 'Promotes better sleep', 'Reduces stress and anxiety'];
    recommendations.deficiencySymptoms = ['Muscle cramps and twitches', 'Fatigue and weakness', 'Anxiety and irritability', 'Irregular heartbeat', 'Difficulty sleeping', 'Headaches'];
    recommendations.riskFactors = ['High stress levels', 'Excessive alcohol consumption', 'Diabetes', 'Digestive disorders'];
    recommendations.icon = <Zap className="w-4 h-4 text-green-500" />;
    recommendations.systemsAffected = ['Muscular system', 'Nervous system', 'Energy metabolism'];
  } else if (name.includes('potassium')) {
    recommendations.foods = ['Bananas', 'Potatoes with skin', 'White beans', 'Spinach', 'Coconut water'];
    recommendations.tips = ['Cook vegetables in minimal water to preserve potassium', 'Most people need more potassium than sodium'];
    recommendations.timing = 'Spread throughout the day to support steady blood pressure';
    recommendations.combinations = ['Balance with sodium intake', 'Works with magnesium for heart health'];
    recommendations.bodyFunction = 'Essential electrolyte for fluid balance, muscle contractions, and nerve signals. Critical for heart rhythm and blood pressure regulation.';
    recommendations.healthBenefits = ['Regulates blood pressure', 'Supports heart function', 'Prevents muscle cramps', 'Maintains fluid balance'];
    recommendations.deficiencySymptoms = ['Muscle weakness and cramps', 'Fatigue and lethargy', 'Irregular heartbeat', 'High blood pressure', 'Constipation'];
    recommendations.riskFactors = ['High sodium diet', 'Excessive sweating', 'Certain medications', 'Kidney disease'];
    recommendations.icon = <Heart className="w-4 h-4 text-purple-500" />;
    recommendations.systemsAffected = ['Cardiovascular system', 'Muscular system', 'Fluid balance'];
  } else if (name.includes('zinc')) {
    recommendations.foods = ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas', 'Cashews'];
    recommendations.tips = ['Zinc absorption is reduced by fiber and calcium', 'Needed for immune function and wound healing'];
    recommendations.timing = 'Take on empty stomach if tolerated, otherwise with food';
    recommendations.combinations = ['Avoid taking with iron or calcium', 'Pair with vitamin A for immune support'];
    recommendations.bodyFunction = 'Essential for immune function, wound healing, DNA synthesis, and proper growth during development. Critical for taste and smell.';
    recommendations.healthBenefits = ['Boosts immune system', 'Accelerates wound healing', 'Supports growth and development', 'Maintains sense of taste and smell'];
    recommendations.deficiencySymptoms = ['Frequent infections and slow healing', 'Loss of appetite', 'Hair loss', 'Diarrhea', 'Loss of taste or smell', 'White spots on nails'];
    recommendations.riskFactors = ['Vegetarian diet', 'Digestive disorders', 'Chronic kidney disease', 'Alcohol abuse'];
    recommendations.icon = <CheckCircle className="w-4 h-4 text-teal-500" />;
    recommendations.systemsAffected = ['Immune system', 'Sensory function', 'Cellular repair'];
  } else if (name.includes('fiber')) {
    recommendations.foods = ['Whole grains', 'Beans and legumes', 'Fruits with skin', 'Vegetables', 'Chia seeds'];
    recommendations.tips = ['Increase gradually to avoid digestive discomfort', 'Drink plenty of water with fiber'];
    recommendations.timing = 'Spread throughout the day with each meal';
    recommendations.combinations = ['Pair with probiotics for gut health', 'Include both soluble and insoluble fiber'];
    recommendations.bodyFunction = 'Promotes digestive health, regulates blood sugar and cholesterol levels, and supports beneficial gut bacteria.';
    recommendations.healthBenefits = ['Improves digestive health', 'Lowers cholesterol', 'Regulates blood sugar', 'Supports weight management'];
    recommendations.deficiencySymptoms = ['Constipation', 'Irregular bowel movements', 'High cholesterol', 'Blood sugar spikes', 'Increased hunger'];
    recommendations.riskFactors = ['Processed food diet', 'Low vegetable intake', 'Refined grain consumption'];
    recommendations.icon = <Apple className="w-4 h-4 text-green-500" />;
    recommendations.systemsAffected = ['Digestive system', 'Metabolic health', 'Cardiovascular system'];
  } else {
    recommendations.foods = ['Variety of whole foods', 'Balanced nutrient-dense meals'];
    recommendations.tips = ['Focus on whole food sources when possible'];
    recommendations.timing = 'Consistent daily intake is key';
    recommendations.combinations = ['Eat a rainbow of colors for diverse nutrients'];
    recommendations.bodyFunction = 'Supports overall health and wellbeing through various metabolic processes.';
    recommendations.healthBenefits = ['Supports general health'];
    recommendations.deficiencySymptoms = ['May vary depending on specific nutrient'];
    recommendations.riskFactors = ['Poor dietary variety'];
    recommendations.icon = <CheckCircle className="w-4 h-4" />;
    recommendations.systemsAffected = ['Overall health'];
  }

  return recommendations;
};

const getStatusInfo = (percentOfTarget) => {
  if (percentOfTarget >= 100) {
    return {
      status: 'excellent',
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    };
  }
  if (percentOfTarget >= 75) {
    return {
      status: 'good',
      icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    };
  }
  if (percentOfTarget >= 50) {
    return {
      status: 'moderate',
      icon: <TrendingDown className="w-4 h-4 text-yellow-600" />,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    };
  }
  return {
    status: 'low',
    icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
    bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200'
  };
};

const getPriorityRecommendations = (data) => {
  const deficient = data.filter(n => n.percentOfTarget < 70).sort((a, b) => a.percentOfTarget - b.percentOfTarget);
  
  if (deficient.length === 0) return null;
  
  const top3 = deficient.slice(0, 3);
  
  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Target className="w-5 h-5" />
          Priority Focus Areas
        </CardTitle>
        <p className="text-sm text-orange-600">
          Focus on these nutrients first for the biggest health impact
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {top3.map((nutrient, index) => {
            const recommendations = getDetailedRecommendations(nutrient.name, nutrient.percentOfTarget);
            return (
              <div key={nutrient.name} className="p-5 bg-white rounded-lg border border-orange-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-orange-500 text-white">#{index + 1}</Badge>
                  <div className="flex items-center gap-2">
                    {recommendations.icon}
                    <span className="font-semibold text-lg">{nutrient.name}</span>
                  </div>
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    {Math.round(nutrient.percentOfTarget)}% of goal
                  </Badge>
                </div>

                {/* Body Function & Health Benefits */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">What it does in your body:</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">{recommendations.bodyFunction}</p>
                  <div className="text-sm text-blue-600">
                    <strong>Key benefits:</strong> {recommendations.healthBenefits.join(', ')}
                  </div>
                </div>

                {/* Deficiency Symptoms Warning */}
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">Signs you may be deficient:</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-red-700">
                    {recommendations.deficiencySymptoms.map((symptom, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="text-red-500">•</span>
                        <span>{symptom}</span>
                      </div>
                    ))}
                  </div>
                  {recommendations.systemsAffected.length > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      <strong>Systems affected:</strong> {recommendations.systemsAffected.join(', ')}
                    </div>
                  )}
                </div>

                {/* Quick Action Items */}
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-orange-800">🥗 Quick wins:</span>
                    <span className="ml-2 text-orange-700">{recommendations.foods.slice(0, 2).join(', ')}</span>
                  </div>
                  
                  {recommendations.timing && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-700"><strong>Best timing:</strong> {recommendations.timing}</span>
                    </div>
                  )}

                  {recommendations.tips.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-amber-700"><strong>Pro tip:</strong> {recommendations.tips[0]}</span>
                    </div>
                  )}

                  {recommendations.riskFactors.length > 0 && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Risk factors for deficiency:</strong> {recommendations.riskFactors.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const EnhancedMicronutrientReport = ({ data }) => {
  console.log('🧪 ENHANCED MICRONUTRIENT REPORT: Component mounted with data:', data);
  
  // Always render the enhanced UI, even with no data
  if (!data || data.length === 0) {
    console.log('🧪 ENHANCED MICRONUTRIENT REPORT: No data provided, showing empty state');
    return (
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Apple className="w-5 h-5" />
            Enhanced Micronutrient Analysis
          </CardTitle>
          <p className="text-sm text-orange-600">
            Your comprehensive vitamin and mineral dashboard with personalized recommendations
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Apple className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-orange-800">No micronutrient data available</h3>
            <p className="text-sm text-orange-600 mb-4">
              Start logging meals with detailed nutrition information to see your comprehensive vitamin and mineral analysis with personalized recommendations.
            </p>
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              Enhanced reporting ready
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('🧪 ENHANCED MICRONUTRIENT REPORT: Rendering with data count:', data.length);

  // Categorize nutrients by status
  const deficientNutrients = data.filter(n => n.percentOfTarget < 70);
  const excellentNutrients = data.filter(n => n.percentOfTarget >= 100);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Apple className="w-5 h-5" />
            Enhanced Micronutrient Dashboard
          </CardTitle>
          <p className="text-sm text-blue-600">
            Your vitamin and mineral intake with AI-powered personalized recommendations
          </p>
        </CardHeader>
        <CardContent>
          {/* Enhanced Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">{excellentNutrients.length}</div>
              <div className="text-sm text-green-700 font-medium">Meeting Goals</div>
              <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {data.filter(n => n.percentOfTarget >= 70 && n.percentOfTarget < 100).length}
              </div>
              <div className="text-sm text-yellow-700 font-medium">Close to Goals</div>
              <TrendingUp className="w-5 h-5 text-yellow-500 mx-auto mt-2" />
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-1">{deficientNutrients.length}</div>
              <div className="text-sm text-red-700 font-medium">Need Attention</div>
              <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mt-2" />
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-1">{data.length}</div>
              <div className="text-sm text-blue-700 font-medium">Total Tracked</div>
              <Target className="w-5 h-5 text-blue-500 mx-auto mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Recommendations with Enhanced Health Information */}
      {getPriorityRecommendations(data)}

      {/* Deficiency Alerts */}
      {deficientNutrients.length > 0 && (
        <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Nutritional Focus Needed:</strong> You're below target for {deficientNutrients.length} essential nutrients. 
            Check the detailed recommendations below to optimize your intake with specific food combinations and timing.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Nutrient Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map((nutrient) => {
          const statusInfo = getStatusInfo(nutrient.percentOfTarget);
          const recommendations = getDetailedRecommendations(nutrient.name, nutrient.percentOfTarget);
          
          return (
            <Card 
              key={nutrient.name} 
              className={`border-2 ${statusInfo.borderColor} ${statusInfo.bgColor} hover:shadow-lg transition-shadow`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getNutrientIcon(nutrient.name)}
                    <span className="font-semibold text-base">{nutrient.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusInfo.icon}
                    <Badge 
                      variant={nutrient.percentOfTarget >= 100 ? "default" : "secondary"}
                      className="text-sm font-medium"
                    >
                      {Math.round(nutrient.percentOfTarget)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="font-medium">{nutrient.value.toFixed(1)}{nutrient.unit}</span>
                    <span>Goal: {nutrient.target}{nutrient.unit}</span>
                  </div>
                  
                  <Progress 
                    value={Math.min(nutrient.percentOfTarget, 100)} 
                    className="h-3"
                  />
                </div>
                
                {nutrient.percentOfTarget < 100 && (
                  <div className="space-y-3">
                    {/* Top Food Sources */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Apple className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Best Sources:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recommendations.foods.slice(0, 4).map((food, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Timing Advice */}
                    {recommendations.timing && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-blue-700">{recommendations.timing}</span>
                      </div>
                    )}

                    {/* Pro Tip */}
                    {recommendations.tips.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-amber-700 font-medium">Pro tip: {recommendations.tips[0]}</span>
                      </div>
                    )}

                    {/* Food Combinations */}
                    {recommendations.combinations.length > 0 && (
                      <div className="bg-white/50 p-2 rounded border">
                        <span className="text-xs font-medium text-gray-600">Combine with: </span>
                        <span className="text-xs text-gray-600">{recommendations.combinations[0]}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
