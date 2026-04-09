import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, AlertCircle, Zap, Brain } from 'lucide-react';
import { HealthRiskProfile } from '@/lib/ml/riskAssessment';
import { PlanRecommendation } from '@/lib/ml/recommendations';

const insightTranslations = {
  'en-US': {
    healthRiskAssessment: 'Health Risk Assessment',
    mlPoweredAnalysis: 'ML-powered health analysis',
    riskScore: 'Risk Score',
    estimatedCostMultiplier: 'Estimated Cost Multiplier',
    basedOnHealthProfile: 'Based on health profile',
    riskFactors: 'Risk Factors',
    recommendations: 'Recommendations',
    aiPoweredPlanRecommendations: 'AI-Powered Plan Recommendations',
    personalizedBasedOnProfile: 'Personalized based on your profile',
    plan: 'Plan',
    mlScore: 'ML Score',
    premium: 'Premium',
    coverage: 'Coverage',
    deductible: 'Deductible',
    whyThisPlan: 'Why this plan?',
    unusualPatternDetected: 'Unusual Pattern Detected',
    mlModelDetectedAnomaly: 'Our ML model detected an anomaly in your estimate. Review the following:',
    anomalyScore: 'Anomaly Score',
    riskTrendAnalysis: 'Risk Trend Analysis',
    basedOnEstimateHistory: 'Based on your estimate history',
    trend: 'Trend',
    increasingTrend: 'Health costs are trending upward',
    decreasingTrend: 'Health costs are improving',
    stableTrend: 'Health costs remain stable',
    commonRiskFactors: 'Common Risk Factors',
    score: 'Score',
    risk: 'Risk',
  },
  'en-GB': {
    healthRiskAssessment: 'Health Risk Assessment',
    mlPoweredAnalysis: 'ML-powered health analysis',
    riskScore: 'Risk Score',
    estimatedCostMultiplier: 'Estimated Cost Multiplier',
    basedOnHealthProfile: 'Based on health profile',
    riskFactors: 'Risk Factors',
    recommendations: 'Recommendations',
    aiPoweredPlanRecommendations: 'AI-Powered Plan Recommendations',
    personalizedBasedOnProfile: 'Personalised based on your profile',
    plan: 'Plan',
    mlScore: 'ML Score',
    premium: 'Premium',
    coverage: 'Coverage',
    deductible: 'Deductible',
    whyThisPlan: 'Why this plan?',
    unusualPatternDetected: 'Unusual Pattern Detected',
    mlModelDetectedAnomaly: 'Our ML model detected an anomaly in your estimate. Review the following:',
    anomalyScore: 'Anomaly Score',
    riskTrendAnalysis: 'Risk Trend Analysis',
    basedOnEstimateHistory: 'Based on your estimate history',
    trend: 'Trend',
    increasingTrend: 'Health costs are trending upward',
    decreasingTrend: 'Health costs are improving',
    stableTrend: 'Health costs remain stable',
    commonRiskFactors: 'Common Risk Factors',
    score: 'Score',
    risk: 'Risk',
  },
  'hi-IN': {
    healthRiskAssessment: 'स्वास्थ्य जोखिम मूल्यांकन',
    mlPoweredAnalysis: 'एमएल-संचालित स्वास्थ्य विश्लेषण',
    riskScore: 'जोखिम स्कोर',
    estimatedCostMultiplier: 'अनुमानित लागत गुणक',
    basedOnHealthProfile: 'स्वास्थ्य प्रोफाइल के आधार पर',
    riskFactors: 'जोखिम कारक',
    recommendations: 'सिफारिशें',
    aiPoweredPlanRecommendations: 'एआई-संचालित योजना सिफारिशें',
    personalizedBasedOnProfile: 'आपकी प्रोफाइल के आधार पर व्यक्तिगत',
    plan: 'योजना',
    mlScore: 'एमएल स्कोर',
    premium: 'प्रीमियम',
    coverage: 'कवरेज',
    deductible: 'कटौती योग्य',
    whyThisPlan: 'यह योजना क्यों?',
    unusualPatternDetected: 'असामान्य पैटर्न पाया गया',
    mlModelDetectedAnomaly: 'हमारे एमएल मॉडल ने आपके अनुमान में एक विसंगति का पता लगाया। निम्नलिखित की समीक्षा करें:',
    anomalyScore: 'विसंगति स्कोर',
    riskTrendAnalysis: 'जोखिम प्रवृत्ति विश्लेषण',
    basedOnEstimateHistory: 'आपके अनुमान इतिहास के आधार पर',
    trend: 'प्रवृत्ति',
    increasingTrend: 'स्वास्थ्य लागत ऊपर की ओर बढ़ रही है',
    decreasingTrend: 'स्वास्थ्य लागत में सुधार हो रहा है',
    stableTrend: 'स्वास्थ्य लागत स्थिर रहती है',
    commonRiskFactors: 'सामान्य जोखिम कारक',
    score: 'स्कोर',
    risk: 'जोखिम',
  },
  'bn-IN': {
    healthRiskAssessment: 'স্বাস্থ্য ঝুঁকি মূল্যায়ন',
    mlPoweredAnalysis: 'এমএল-চালিত স্বাস্থ্য বিশ্লেষণ',
    riskScore: 'ঝুঁকি স্কোর',
    estimatedCostMultiplier: 'আনুমানিক খরচ গুণক',
    basedOnHealthProfile: 'স্বাস্থ্য প্রোফাইলের উপর ভিত্তি করে',
    riskFactors: 'ঝুঁকি কারণ',
    recommendations: 'সুপারিশ',
    aiPoweredPlanRecommendations: 'এআই-চালিত পরিকল্পনার সুপারিশ',
    personalizedBasedOnProfile: 'আপনার প্রোফাইলের উপর ভিত্তি করে ব্যক্তিগতকৃত',
    plan: 'পরিকল্পনা',
    mlScore: 'এমএল স্কোর',
    premium: 'প্রিমিয়াম',
    coverage: 'কভারেজ',
    deductible: 'ছাড়যোগ্য',
    whyThisPlan: 'এই পরিকল্পনা কেন?',
    unusualPatternDetected: 'অস্বাভাবিক প্যাটার্ন সনাক্ত করা হয়েছে',
    mlModelDetectedAnomaly: 'আমাদের এমএল মডেল আপনার অনুমানে একটি অসামান্যতা সনাক্ত করেছে। নিম্নলিখিত পর্যালোচনা করুন:',
    anomalyScore: 'অসামান্যতা স্কোর',
    riskTrendAnalysis: 'ঝুঁকি প্রবণতা বিশ্লেষণ',
    basedOnEstimateHistory: 'আপনার অনুমান ইতিহাসের উপর ভিত্তি করে',
    trend: 'প্রবণতা',
    increasingTrend: 'স্বাস্থ্য খরচ ঊর্ধ্বমুখী হচ্ছে',
    decreasingTrend: 'স্বাস্থ্য খরচ উন্নতি করছে',
    stableTrend: 'স্বাস্থ্য খরচ স্থিতিশীল রয়েছে',
    commonRiskFactors: 'সাধারণ ঝুঁকি কারণ',
    score: 'স্কোর',
    risk: 'ঝুঁকি',
  },
  'te-IN': {
    healthRiskAssessment: 'ఆరోగ్య ఝుఁకి మూల్యాంకనం',
    mlPoweredAnalysis: 'ML-ఆధారిత ఆరోగ్య విశ్లేషణ',
    riskScore: 'ఝుఁకి స్కోర్',
    estimatedCostMultiplier: 'అంచనా వేసిన ఖర్చు గుణకం',
    basedOnHealthProfile: 'ఆరోగ్య ప్రొఫైల్ ఆధారంగా',
    riskFactors: 'ఝుఁకి కారకాలు',
    recommendations: 'సిఫారసులు',
    aiPoweredPlanRecommendations: 'AI-ఆధారిత ప్లాన్ సిఫారసులు',
    personalizedBasedOnProfile: 'మీ ప్రొఫైల్ ఆధారంగా వ్యక్తిగతকృతం',
    plan: 'ప్లాన్',
    mlScore: 'ML స్కోర్',
    premium: 'ప్రీమియం',
    coverage: 'కవరేజ్',
    deductible: 'తగ్గింపు',
    whyThisPlan: 'ఈ ప్లాన్ ఎందుకు?',
    unusualPatternDetected: 'అసాధారణ నమూనా గుర్తించబడింది',
    mlModelDetectedAnomaly: 'మా ML మోడల్ మీ అంచనాలో క్రమరాహిత్యం గుర్తించింది. ఈ క్రింది వాటిని సమీక్షించండి:',
    anomalyScore: 'క్రమరాహిత్య స్కోర్',
    riskTrendAnalysis: 'ఝుఁకి ట్రెండ్ విశ్లేషణ',
    basedOnEstimateHistory: 'మీ అంచన చరిత్ర ఆధారంగా',
    trend: 'ట్రెండ్',
    increasingTrend: 'ఆరోగ్య ఖర్చులు ఎక్కువ ట్రెండ్‌లో ఉన్నాయి',
    decreasingTrend: 'ఆరోగ్య ఖర్చులు మెరుగుపడుతున్నాయి',
    stableTrend: 'ఆరోగ్య ఖర్చులు స్థిరంగా ఉన్నాయి',
    commonRiskFactors: 'సాధారణ ఝుఁకి కారకాలు',
    score: 'స్కోర్',
    risk: 'ఝుఁకి',
  },
  'mr-IN': {
    healthRiskAssessment: 'आरोग्य जोखीम मूल्यांकन',
    mlPoweredAnalysis: 'ML-चालित आरोग्य विश्लेषण',
    riskScore: 'जोखीम स्कोर',
    estimatedCostMultiplier: 'अनुमानित खर्च गुणक',
    basedOnHealthProfile: 'आरोग्य प्रोफाइलच्या आधारे',
    riskFactors: 'जोखीम घटक',
    recommendations: 'शिफारसी',
    aiPoweredPlanRecommendations: 'AI-चालित योजना शिफारसी',
    personalizedBasedOnProfile: 'आपल्या प्रोफाइलच्या आधारे वैयक्तिकृत',
    plan: 'योजना',
    mlScore: 'ML स्कोर',
    premium: 'प्रिमियम',
    coverage: 'कव्हरेज',
    deductible: 'कपात',
    whyThisPlan: 'ही योजना का?',
    unusualPatternDetected: 'असामान्य नमुना सापडला',
    mlModelDetectedAnomaly: 'आमच्या ML मॉडेलने आपल्या अनुमानात विसंगती सापडली. खालील पुनरावलोकन करा:',
    anomalyScore: 'विसंगती स्कोर',
    riskTrendAnalysis: 'जोखीम प्रवृत्ति विश्लेषण',
    basedOnEstimateHistory: 'आपल्या अनुमान इतिहासच्या आधारे',
    trend: 'प्रवृत्ति',
    increasingTrend: 'आरोग्य खर्च वाढत आहेत',
    decreasingTrend: 'आरोग्य खर्च सुधारत आहेत',
    stableTrend: 'आरोग्य खर्च स्थिर आहेत',
    commonRiskFactors: 'सामान्य जोखीम घटक',
    score: 'स्कोर',
    risk: 'जोखीम',
  },
  'ta-IN': {
    healthRiskAssessment: 'ஆரோக்கிய ஆபத்து மূல்யாய்ப்பு',
    mlPoweredAnalysis: 'ML-இயங்கும் ஆரோக்கிய பகுப்பாய்வு',
    riskScore: 'ஆபத்து மதிப்பெண்',
    estimatedCostMultiplier: 'மதிப்பிடப்பட்ட செலவு பெருக்கி',
    basedOnHealthProfile: 'ஆரோக்கிய சுயவிவரத்தின் அடிப்படையில்',
    riskFactors: 'ஆபத்து காரணிகள்',
    recommendations: 'பரிந்துரைகள்',
    aiPoweredPlanRecommendations: 'AI-இயங்கும் திட்ட பரிந்துரைகள்',
    personalizedBasedOnProfile: 'உங்கள் சுயவிவரத்தின் அடிப்படையில் தனிப்பட்ட',
    plan: 'திட்டம்',
    mlScore: 'ML மதிப்பெண்',
    premium: 'பிரீமியம்',
    coverage: 'பாதுகாப்பு',
    deductible: 'விலக்கு',
    whyThisPlan: 'ஏன் இந்த திட்டம்?',
    unusualPatternDetected: 'அசாதாரண முறை கண்டறியப்பட்டது',
    mlModelDetectedAnomaly: 'எங்கள் ML மாதிரி உங்கள் மதிப்பீட்டில் ஒரு ஆபத்தை கண்டறிந்துள்ளது. பின்வருவனவற்றை மறுபரிசீலனை செய்யவும்:',
    anomalyScore: 'ஆபத்து மதிப்பெண்',
    riskTrendAnalysis: 'ஆபத்து போக்கு பகுப்பாய்வு',
    basedOnEstimateHistory: 'உங்கள் மதிப்பீட்டு வரலாற்றின் அடிப்படையில்',
    trend: 'போக்கு',
    increasingTrend: 'ஆரோக்கிய செலவுகள் ஏறுவரண்டை பொறுப்பில் உள்ளன',
    decreasingTrend: 'ஆரோக்கிய செலவுகள் மேம்பட்டு வருகின்றன',
    stableTrend: 'ஆரோக்கிய செலவுகள் நிலையான நிலையில் உள்ளன',
    commonRiskFactors: 'பொதுவான ஆபத்து காரணிகள்',
    score: 'மதிப்பெண்',
    risk: 'ஆபத்து',
  },
  'gu-IN': {
    healthRiskAssessment: 'આરોગ્ય જોખીમ આકલન',
    mlPoweredAnalysis: 'ML-સંચાલિત આરોગ્ય વિશ્લેષણ',
    riskScore: 'જોખીમ સ્કોર',
    estimatedCostMultiplier: 'અનુમાનિત ખર્ચ ગુણક',
    basedOnHealthProfile: 'આરોગ્ય પ્રોફાઇલ પર આધારિત',
    riskFactors: 'જોખીમ પરિબળો',
    recommendations: 'ભલામણો',
    aiPoweredPlanRecommendations: 'AI-સંચાલિત યોજના ભલામણો',
    personalizedBasedOnProfile: 'તમારી પ્રોફાઇલ પર આધારિત વ્યક્તિગતકૃત',
    plan: 'યોજના',
    mlScore: 'ML સ્કોર',
    premium: 'પ્રીમિયમ',
    coverage: 'કવરેજ',
    deductible: 'કપાત',
    whyThisPlan: 'આ યોજના શા માટે?',
    unusualPatternDetected: 'અસામાન્ય પેટર્ન શોધાયો',
    mlModelDetectedAnomaly: 'આমાં ML મોડેલ આपણਾ અનુમાનમાં એક વિસંગતિ શોધી હતી. નીચે આપેલ આપણો કર:',
    anomalyScore: 'વિસંગતિ સ્કોર',
    riskTrendAnalysis: 'જોખીમ ટ્રેન્ડ વિશ્લેષણ',
    basedOnEstimateHistory: 'તમારી અનુમાન ઇતિહાસ પર આધારિત',
    trend: 'ટ્રેન્ડ',
    increasingTrend: 'આરોગ્ય ખર્ચ વધી રહ્યો છે',
    decreasingTrend: 'આરોગ્ય ખર્ચ સુધરી રહ્યો છે',
    stableTrend: 'આરોગ્ય ખર્ચ સ્થિર છે',
    commonRiskFactors: 'સામાન્ય જોખીમ પરિબળો',
    score: 'સ્કોર',
    risk: 'જોખીમ',
  },
  'ur-IN': {
    healthRiskAssessment: 'صحت کے خطرے کی تشخیص',
    mlPoweredAnalysis: 'ML سے چلنے والا صحت کا تجزیہ',
    riskScore: 'خطرے کا سکور',
    estimatedCostMultiplier: 'تخمینہ شدہ لاگت کا ضارب',
    basedOnHealthProfile: 'صحت کی شناخت کی بنیاد پر',
    riskFactors: 'خطرے کے عوامل',
    recommendations: 'سفارشات',
    aiPoweredPlanRecommendations: 'AI سے چلنے والی منصوبہ کی سفارشات',
    personalizedBasedOnProfile: 'آپ کی شناخت کی بنیاد پر ذاتی نوعیت',
    plan: 'منصوبہ',
    mlScore: 'ML سکور',
    premium: 'پریمیم',
    coverage: 'کوریج',
    deductible: 'کاٹا',
    whyThisPlan: 'یہ منصوبہ کیوں؟',
    unusualPatternDetected: 'غیر معمولی نمونہ دریافت کیا گیا',
    mlModelDetectedAnomaly: 'ہمارے ML ماڈل نے آپ کے تخمینے میں بے ضابطگی کا پتہ لگایا ہے۔ مندرجہ ذیل کا جائزہ لیں:',
    anomalyScore: 'بے ضابطگی کا سکور',
    riskTrendAnalysis: 'خطرے کے رجحان کا تجزیہ',
    basedOnEstimateHistory: 'آپ کی تخمینے کی تاریخ کی بنیاد پر',
    trend: 'رجحان',
    increasingTrend: 'صحت کی لاگتیں بڑھ رہی ہیں',
    decreasingTrend: 'صحت کی لاگتیں بہتر ہو رہی ہیں',
    stableTrend: 'صحت کی لاگتیں مستحکم ہیں',
    commonRiskFactors: 'عام خطرے کے عوامل',
    score: 'سکور',
    risk: 'خطرہ',
  },
  'kn-IN': {
    healthRiskAssessment: 'ಆರೋಗ್ಯ ಝೂಂಕಿ ಮೌಲ್ಯಮಾಪನ',
    mlPoweredAnalysis: 'ML-ಸಂಚಾಲಿತ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ',
    riskScore: 'ಝೂಂಕಿ ಸ್ಕೋರ್',
    estimatedCostMultiplier: 'ಅಂದಾಜು ಮಾಡಿದ ವೆಚ್ಚ ಗುಣಾಂಕ',
    basedOnHealthProfile: 'ಆರೋಗ್ಯ ಪ್ರೊಫೈಲ್ ಆಧಾರದ ಮೇಲೆ',
    riskFactors: 'ಝೂಂಕಿ ಅಂಶಗಳು',
    recommendations: 'ಶಿಫಾರಸುಗಳು',
    aiPoweredPlanRecommendations: 'AI-ಸಂಚಾಲಿತ ಯೋಜನೆಯ ಶಿಫಾರಸುಗಳು',
    personalizedBasedOnProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಧಾರದ ಮೇಲೆ ವ್ಯಕ್ತಿಗತಗಳು',
    plan: 'ಯೋಜನೆ',
    mlScore: 'ML ಸ್ಕೋರ್',
    premium: 'ಪ್ರೀಮಿಯಂ',
    coverage: 'ಕವರೇಜ್',
    deductible: 'ಕಡಿತ',
    whyThisPlan: 'ಈ ಯೋಜನೆ ಏಕೆ?',
    unusualPatternDetected: 'ಅಸಾಮಾನ್ಯ ಪ್ರತಿರೂಪ ಕಂಡುಹಿಡಿಯಲಾಯಿತು',
    mlModelDetectedAnomaly: 'ನಮ್ಮ ML ಮಾದರಿ ನಿಮ್ಮ ಅಂದಾಜಿನಲ್ಲಿ ಒಂದು ವಿಪರ್ಯಯವನ್ನು ಪತ್ತೆ ಮಾಡಿದೆ. ಕೆಳಗಿನವುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ:',
    anomalyScore: 'ವಿಪರ್ಯಯ ಸ್ಕೋರ್',
    riskTrendAnalysis: 'ಝೂಂಕಿ ಪ್ರವೃತ್ತಿ ವಿಶ್ಲೇಷಣೆ',
    basedOnEstimateHistory: 'ನಿಮ್ಮ ಅಂದಾಜು ಇತಿಹಾಸ ಆಧಾರದ ಮೇಲೆ',
    trend: 'ಪ್ರವೃತ್ತಿ',
    increasingTrend: 'ಆರೋಗ್ಯ ವೆಚ್ಚಗಳು ಏರುತ್ತಿವೆ',
    decreasingTrend: 'ಆರೋಗ್ಯ ವೆಚ್ಚಗಳು ಸುಧಾರಿಸುತ್ತಿವೆ',
    stableTrend: 'ಆರೋಗ್ಯ ವೆಚ್ಚಗಳು ಸ್ಥಿರವಾಗಿವೆ',
    commonRiskFactors: 'ಸಾಮಾನ್ಯ ಝೂಂಕಿ ಅಂಶಗಳು',
    score: 'ಸ್ಕೋರ್',
    risk: 'ಝೂಂಕಿ',
  },
  'or-IN': {
    healthRiskAssessment: 'ସ୍ବାସ୍ଥ୍ୟ ଝୁଁକି ମୂଲ୍ୟାୟନ',
    mlPoweredAnalysis: 'ML-ଚାଳିତ ସ୍ୱାସ୍ଥ୍ୟ ବିଶ୍ଳେଷଣ',
    riskScore: 'ଝୁଁକି ସ୍କୋର',
    estimatedCostMultiplier: 'ଅନୁମାନିତ ଖର୍ଚ୍ଚ ଗୁଣାଙ୍କ',
    basedOnHealthProfile: 'ସ୍ବାସ୍ଥ୍ୟ ପ୍ରୋଫାଇଲ ଆଧାରିତ',
    riskFactors: 'ଝୁଁକି ଫ୍ୟାକ୍ଟର',
    recommendations: 'ସୁପାରିଶ',
    aiPoweredPlanRecommendations: 'AI-ଚାଳିତ ଯୋଜନା ସୁପାରିଶ',
    personalizedBasedOnProfile: 'ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ ଆଧାରିତ ବ୍ୟକ୍ତିଗତ',
    plan: 'ଯୋଜନା',
    mlScore: 'ML ସ୍କୋର',
    premium: 'ପ୍ରିମିୟମ',
    coverage: 'କଭରେଜ',
    deductible: 'କ୍ଷତିପୂରଣ',
    whyThisPlan: 'ଏହି ଯୋଜନା କାହିଁକି?',
    unusualPatternDetected: 'ଅସାଧାରଣ ପ୍ୟାଟର୍ନ ଚିହ୍ନଟ ହୋଇଛି',
    mlModelDetectedAnomaly: 'ଆମର ML ମଡେଲ ଆପଣଙ୍କ ଅନୁମାନରେ ଏକ ବିଙ୍ଗଳ ଖୋଜିଛି। ନିମ୍ନଲିଖିତ ସମୀକ୍ଷା କରନ୍ତୁ:',
    anomalyScore: 'ବିଙ୍ଗଳ ସ୍କୋର',
    riskTrendAnalysis: 'ଝୁଁକି ଟ୍ରେଣ୍ଡ ବିଶ୍ଳେଷଣ',
    basedOnEstimateHistory: 'ଆପଣଙ୍କ ଅନୁମାନ ଇତିହାସ ଆଧାରିତ',
    trend: 'ଟ୍ରେଣ୍ଡ',
    increasingTrend: 'ସ୍ବାସ୍ଥ୍ୟ ଖର୍ଚ୍ଚ ବୃଦ୍ଧି ପାଉଛି',
    decreasingTrend: 'ସ୍ବାସ୍ଥ୍ୟ ଖର୍ଚ୍ଚ ଉନ୍ନତି ହୋଇଛି',
    stableTrend: 'ସ୍ବାସ୍ଥ୍ୟ ଖର୍ଚ୍ଚ ସ୍ଥିର ରହିଛି',
    commonRiskFactors: 'ସାଧାରଣ ଝୁଁକି ଫ୍ୟାକ୍ଟର',
    score: 'ସ୍କୋର',
    risk: 'ଝୁଁକି',
  },
  'ml-IN': {
    healthRiskAssessment: 'ആരോഗ്യ ഝൂँകി സമ്മതി',
    mlPoweredAnalysis: 'ML-സഞ്ചാലിത ആരോഗ്യ വിശകലനം',
    riskScore: 'ഝൂँകി സ്കോർ',
    estimatedCostMultiplier: 'അനുമാനം വിചാരിച്ച ഖർച്ച ഗുണകം',
    basedOnHealthProfile: 'ആരോഗ്യ പ്രൊഫൈൽ അടിസ്ഥാനമാക്കി',
    riskFactors: 'ഝൂँകി ഘടകങ്ങൾ',
    recommendations: 'ശുപാരിശങ്ങൾ',
    aiPoweredPlanRecommendations: 'AI-സഞ്ചാലിത പദ്ധതി ശുപാരിശങ്ങൾ',
    personalizedBasedOnProfile: 'നിങ്ങളുടെ പ്രൊഫൈൽ അടിസ്ഥാനമാക്കി വ്യക്തിഗതം',
    plan: 'പദ്ധതി',
    mlScore: 'ML സ്കോർ',
    premium: 'പ്രീമിയം',
    coverage: 'കവറേജ്',
    deductible: 'കുറവ്',
    whyThisPlan: 'എന്തിന് ഈ പദ്ധതി?',
    unusualPatternDetected: 'അസാധാരണമായ പാറ്റേൺ കണ്ടെത്തി',
    mlModelDetectedAnomaly: 'ഞങ്ങളുടെ ML മോഡൽ നിങ്ങളുടെ അനുമാനത്തിൽ ഒരു വൈകല്യം കണ്ടെത്തി. ഇനിപ്പറയുന്നവ പരിശോധിക്കുക:',
    anomalyScore: 'വൈകല്യ സ്കോർ',
    riskTrendAnalysis: 'ഝൂँകി ട്രെൻഡ് വിശകലനം',
    basedOnEstimateHistory: 'നിങ്ങളുടെ അനുമാന ചരിത്രം അടിസ്ഥാനമാക്കി',
    trend: 'ട്രെൻഡ്',
    increasingTrend: 'ആരോഗ്യ ചെലവുകൾ കൂടിവരുന്നു',
    decreasingTrend: 'ആരോഗ്യ ചെലവുകൾ മെച്ചപ്പെടുന്നു',
    stableTrend: 'ആരോഗ്യ ചെലവുകൾ സ്ഥിരമായിരിക്കുന്നു',
    commonRiskFactors: 'പൊതുവായ ഝൂँകി ഘടകങ്ങൾ',
    score: 'സ്കോർ',
    risk: 'ഝൂँകി',
  },
  'pa-IN': {
    healthRiskAssessment: 'ਸਿਹਤ ਦਾ ਖਤਰਾ ਮੁਲਾਂਕਣ',
    mlPoweredAnalysis: 'ML-ਚਲਿਤ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ',
    riskScore: 'ਖਤਰੇ ਦਾ ਸਕੋਰ',
    estimatedCostMultiplier: 'ਅਨੁਮਾਨਿਤ ਖਰਚ ਗੁਣਾਂਕ',
    basedOnHealthProfile: 'ਸਿਹਤ ਪ੍ਰੋਫਾਈਲ ਦੇ ਆਧਾਰ ਤੇ',
    riskFactors: 'ਖਤਰੇ ਦੇ ਕਾਰਕ',
    recommendations: 'ਸਿਫਾਰਸ਼ਾਂ',
    aiPoweredPlanRecommendations: 'AI-ਚਲਿਤ ਯੋਜਨਾ ਸਿਫਾਰਸ਼ਾਂ',
    personalizedBasedOnProfile: 'ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਦੇ ਆਧਾਰ ਤੇ ਨਿੱਜੀ',
    plan: 'ਯੋਜਨਾ',
    mlScore: 'ML ਸਕੋਰ',
    premium: 'ਪ੍ਰੀਮੀਅਮ',
    coverage: 'ਕਵਰੇਜ',
    deductible: 'ਕਟੌਤੀ',
    whyThisPlan: 'ਇਹ ਯੋਜਨਾ ਕਿਉਂ?',
    unusualPatternDetected: 'ਅਸਧਾਰਨ ਨਮੂਨਾ ਲੱਭਿਆ ਗਿਆ',
    mlModelDetectedAnomaly: 'ਸਾਡੇ ML ਮਾਡਲ ਨੇ ਤੁਹਾਡੇ ਅਨੁਮਾਨ ਵਿੱਚ ਇੱਕ ਵਿਅੰਗ ਲੱਭਿਆ ਹੈ। ਹੇਠ ਲਿਖਿਆ ਜਾਂਚ ਕਰੋ:',
    anomalyScore: 'ਵਿਅੰਗ ਸਕੋਰ',
    riskTrendAnalysis: 'ਖਤਰੇ ਦੀ ਪ੍ਰਵਿਰਤੀ ਵਿਸ਼ਲੇਸ਼ਣ',
    basedOnEstimateHistory: 'ਤੁਹਾਡੇ ਅਨੁਮਾਨ ਇਤਿਹਾਸ ਦੇ ਆਧਾਰ ਤੇ',
    trend: 'ਪ੍ਰਵਿਰਤੀ',
    increasingTrend: 'ਸਿਹਤ ਦੀ ਲਾਗਤ ਵਧ ਰਹੀ ਹੈ',
    decreasingTrend: 'ਸਿਹਤ ਦੀ ਲਾਗਤ ਵਿੱਚ ਸੁਧਾਰ ਹੋ ਰਿਹਾ ਹੈ',
    stableTrend: 'ਸਿਹਤ ਦੀ ਲਾਗਤ ਸਥਿਰ ਰਹਿ ਰਹੀ ਹੈ',
    commonRiskFactors: 'ਆਮ ਖਤਰੇ ਦੇ ਕਾਰਕ',
    score: 'ਸਕੋਰ',
    risk: 'ਖਤਰਾ',
  },
  'as-IN': {
    healthRiskAssessment: 'স্বাস্থ্য ঝুঁকি মূল্যায়ন',
    mlPoweredAnalysis: 'ML-চালিত স্বাস্থ্য বিশ্লেষণ',
    riskScore: 'ঝুঁকি স্কোর',
    estimatedCostMultiplier: 'আনুমানিক খরচ গুণক',
    basedOnHealthProfile: 'স্বাস্থ্য প্রোফাইলের উপর ভিত্তি করে',
    riskFactors: 'ঝুঁকির কারণসমূহ',
    recommendations: 'সুপারিশসমূহ',
    aiPoweredPlanRecommendations: 'AI-চালিত পরিকল্পনা সুপারিশ',
    personalizedBasedOnProfile: 'আপনার প্রোফাইলের উপর ভিত্তি করে ব্যক্তিগতকৃত',
    plan: 'পরিকল্পনা',
    mlScore: 'ML স্কোর',
    premium: 'প্রিমিয়াম',
    coverage: 'কভারেজ',
    deductible: 'ছাড়যোগ্য',
    whyThisPlan: 'এই পরিকল্পনা কেন?',
    unusualPatternDetected: 'অস্বাভাবিক প্যাটার্ন সনাক্ত হয়েছে',
    mlModelDetectedAnomaly: 'আমাদের ML মডেল আপনার অনুমানে একটি অসামান্যতা সনাক্ত করেছে। নিম্নলিখিত পর্যালোচনা করুন:',
    anomalyScore: 'অসামান্যতা স্কোর',
    riskTrendAnalysis: 'ঝুঁকি প্রবণতা বিশ্লেষণ',
    basedOnEstimateHistory: 'আপনার অনুমান ইতিহাসের উপর ভিত্তি করে',
    trend: 'প্রবণতা',
    increasingTrend: 'স্বাস্থ্য খরচ বৃদ্ধি পাচ্ছে',
    decreasingTrend: 'স্বাস্থ্য খরচ উন্নত হচ্ছে',
    stableTrend: 'স্বাস্থ্য খরচ স্থিতিশীল রয়েছে',
    commonRiskFactors: 'সাধারণ ঝুঁকির কারণসমূহ',
    score: 'স্কোর',
    risk: 'ঝুঁকি',
  }
};

interface RiskAssessmentCardProps {
  riskProfile: HealthRiskProfile;
  language?: string;
}

export function RiskAssessmentCard({ riskProfile, language = 'en-US' }: RiskAssessmentCardProps) {
  const t = insightTranslations[language as keyof typeof insightTranslations] || insightTranslations['en-US'];
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'moderate':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <div>
              <CardTitle>{t.healthRiskAssessment}</CardTitle>
              <CardDescription>{t.mlPoweredAnalysis}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Level Badge */}
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-3 ${getRiskColor(riskProfile.riskLevel)}`}>
            <div className="flex items-center gap-2">
              {getRiskIcon(riskProfile.riskLevel)}
              <div>
                <p className="font-semibold capitalize">{riskProfile.riskLevel} {t.risk}</p>
                <p className="text-sm">{t.score}: {riskProfile.riskScore}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Score Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{t.riskScore}</span>
            <span className="text-sm font-bold">{riskProfile.riskScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                riskProfile.riskScore > 75
                  ? 'bg-red-500'
                  : riskProfile.riskScore > 50
                  ? 'bg-orange-500'
                  : riskProfile.riskScore > 25
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${riskProfile.riskScore}%` }}
            />
          </div>
        </div>

        {/* Cost Multiplier */}
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">{t.estimatedCostMultiplier}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {riskProfile.estimatedCostMultiplier}x
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t.basedOnHealthProfile}
          </p>
        </div>

        {/* Risk Factors */}
        {riskProfile.riskFactors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{t.riskFactors}</h4>
            <div className="flex flex-wrap gap-2">
              {riskProfile.riskFactors.map((factor, idx) => (
                <Badge key={idx} variant="secondary">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {riskProfile.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{t.recommendations}</h4>
            <ul className="space-y-2">
              {riskProfile.recommendations.slice(0, 3).map((rec, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PlanRecommendationsProps {
  recommendations: PlanRecommendation[];
  language?: string;
}

export function PlanRecommendationsCard({ recommendations, language = 'en-US' }: PlanRecommendationsProps) {
  const t = insightTranslations[language as keyof typeof insightTranslations] || insightTranslations['en-US'];
  
  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <div>
            <CardTitle>{t.aiPoweredPlanRecommendations}</CardTitle>
            <CardDescription>{t.personalizedBasedOnProfile}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-2 transition-all ${
              idx === 0
                ? 'border-green-500 bg-green-50 dark:bg-green-950'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">{rec.plan.name} {t.plan}</h4>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">{t.mlScore}</div>
                <Badge variant={idx === 0 ? 'default' : 'secondary'}>
                  {rec.recommendationScore.toFixed(0)}%
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
              <div className="bg-white dark:bg-slate-950 p-2 rounded">
                <p className="text-xs text-muted-foreground">{t.premium}</p>
                <p className="font-semibold">₹{rec.plan.annualPremium.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-2 rounded">
                <p className="text-xs text-muted-foreground">{t.coverage}</p>
                <p className="font-semibold">₹{(rec.plan.expectedPayout / 100000).toFixed(1)}L</p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-2 rounded">
                <p className="text-xs text-muted-foreground">{t.deductible}</p>
                <p className="font-semibold">₹{(rec.plan.deductible / 1000).toFixed(0)}K</p>
              </div>
            </div>

            {rec.reasoning.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">{t.whyThisPlan}</p>
                <ul className="text-xs space-y-1">
                  {rec.reasoning.slice(0, 2).map((reason, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface AnomalyDetectionProps {
  anomaly: { isAnomaly: boolean; anomalyScore: number; reasons: string[] };
  language?: string;
}

export function AnomalyDetectionCard({ anomaly, language = 'en-US' }: AnomalyDetectionProps) {
  const t = insightTranslations[language as keyof typeof insightTranslations] || insightTranslations['en-US'];
  
  if (!anomaly.isAnomaly) return null;

  return (
    <Alert className="border-orange-300 bg-orange-50 dark:bg-orange-950">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle>{t.unusualPatternDetected}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{t.mlModelDetectedAnomaly}</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {anomaly.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-2">
          {t.anomalyScore}: {anomaly.anomalyScore.toFixed(1)}/100
        </p>
      </AlertDescription>
    </Alert>
  );
}

interface TrendAnalysisProps {
  trend: 'increasing' | 'decreasing' | 'stable';
  frequentFactors: string[];
  language?: string;
}

export function TrendAnalysisCard({ trend, frequentFactors, language = 'en-US' }: TrendAnalysisProps) {
  const t = insightTranslations[language as keyof typeof insightTranslations] || insightTranslations['en-US'];
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'decreasing':
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      default:
        return <Zap className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <div>
            <CardTitle>{t.riskTrendAnalysis}</CardTitle>
            <CardDescription>{t.basedOnEstimateHistory}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg ${
          trend === 'increasing'
            ? 'bg-orange-100 dark:bg-orange-950'
            : trend === 'decreasing'
            ? 'bg-green-100 dark:bg-green-950'
            : 'bg-blue-100 dark:bg-blue-950'
        }`}>
          <p className="text-sm font-semibold capitalize">{trend} {t.trend}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {trend === 'increasing' && t.increasingTrend}
            {trend === 'decreasing' && t.decreasingTrend}
            {trend === 'stable' && t.stableTrend}
          </p>
        </div>

        {frequentFactors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{t.commonRiskFactors}</h4>
            <div className="space-y-1">
              {frequentFactors.map((factor, idx) => (
                <p key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {factor}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
