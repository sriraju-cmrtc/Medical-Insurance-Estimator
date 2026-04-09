import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Play, Volume2, RotateCcw, Download, Zap } from 'lucide-react';
import { EstimateInputs, EstimateResult } from '@/types/insurance';
import { VoiceRecognition } from '@/lib/voiceRecognition';
import { calculateInsuranceCost, formatINR } from '@/lib/estimator';
import { getHistory, exportToCSV } from '@/lib/storage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useMLInsights } from '@/hooks/use-ml-insights';
import { RiskAssessmentCard, PlanRecommendationsCard, AnomalyDetectionCard, TrendAnalysisCard } from '@/components/MLInsightCards';

const resultTranslations = {
  'en-US': {
    eventCost: 'Your estimated event cost is',
    basicPlan: 'Basic plan has an annual premium of',
    standardPlan: 'Standard plan has an annual premium of',
    premiumPlan: 'Premium plan has an annual premium of'
  },
  'en-GB': {
    eventCost: 'Your estimated event cost is',
    basicPlan: 'Basic plan has an annual premium of',
    standardPlan: 'Standard plan has an annual premium of',
    premiumPlan: 'Premium plan has an annual premium of'
  },
  'hi-IN': {
    eventCost: 'आपकी अनुमानित घटना लागत है',
    basicPlan: 'बेसिक प्लान की वार्षिक प्रीमियम है',
    standardPlan: 'स्टैंडर्ड प्लान की वार्षिक प्रीमियम है',
    premiumPlan: 'प्रीमियम प्लान की वार्षिक प्रीमियम है'
  },
  'bn-IN': {
    eventCost: 'আপনার অনুমানিত ঘটনা খরচ হল',
    basicPlan: 'বেসিক প্ল্যানের বার্ষিক প্রিমিয়াম হল',
    standardPlan: 'স্ট্যান্ডার্ড প্ল্যানের বার্ষিক প্রিমিয়াম হল',
    premiumPlan: 'প্রিমিয়াম প্ল্যানের বার্ষিক প্রিমিয়াম হল'
  },
  'te-IN': {
    eventCost: 'మీ అంచనా వస్తు వ్యయం',
    basicPlan: 'ప్రాథమిక ప్రణాళిక వార్షిక ప్రీమియం',
    standardPlan: 'ప్రామాణిక ప్రణాళిక వార్షిక ప్రీమియం',
    premiumPlan: 'ప్రీమియం ప్రణాళిక వార్షిక ప్రీమియం'
  },
  'mr-IN': {
    eventCost: 'तुमचा अंदाजे घटना खर्च आहे',
    basicPlan: 'बेसिक प्लॅनची वार्षिक प्रीमियम आहे',
    standardPlan: 'स्टँडर्ड प्लॅनची वार्षिक प्रीमियम आहे',
    premiumPlan: 'प्रीमियम प्लॅनची वार्षिक प्रीमियम आहे'
  },
  'ta-IN': {
    eventCost: 'உங்கள் மதிப்பிடப்பட்ட நிகழ்வு செலவு',
    basicPlan: 'அடிப்படை திட்டத்தின் ஆண்டு பிரீமியம்',
    standardPlan: 'நிலையான திட்டத்தின் ஆண்டு பிரீமியம்',
    premiumPlan: 'பிரீமியம் திட்டத்தின் ஆண்டு பிரீமியம்'
  },
  'gu-IN': {
    eventCost: 'તમારી અંદાજિત ઘટના ખર્ચ છે',
    basicPlan: 'બેઝિક પ્લાનની વાર્ષિક પ્રીમિયમ છે',
    standardPlan: 'સ્ટાન્ડર્ડ પ્લાનની વાર્ષિક પ્રીમિયમ છે',
    premiumPlan: 'પ્રીમિયમ પ્લાનની વાર્ષિક પ્રીમિયમ છે'
  },
  'ur-IN': {
    eventCost: 'آپ کی تخمینہ شدہ ایونٹ لاگت ہے',
    basicPlan: 'بیسک پلان کی سالانہ پریمیم ہے',
    standardPlan: 'سٹینڈرڈ پلان کی سالانہ پریمیم ہے',
    premiumPlan: 'پریمیم پلان کی سالانہ پریمیم ہے'
  },
  'kn-IN': {
    eventCost: 'ನಿಮ್ಮ ಅಂದಾಜು ಘಟನೆ ವೆಚ್ಚವು',
    basicPlan: 'ಬೇಸಿಕ್ ಪ್ಲಾನ್ ವಾರ್ಷಿಕ ಪ್ರೀಮಿಯಂ',
    standardPlan: 'ಸ್ಟ್ಯಾಂಡರ್ಡ್ ಪ್ಲಾನ್ ವಾರ್ಷಿಕ ಪ್ರೀಮಿಯಂ',
    premiumPlan: 'ಪ್ರೀಮಿಯಂ ಪ್ಲಾನ್ ವಾರ್ಷಿಕ ಪ್ರೀಮಿಯಂ'
  },
  'or-IN': {
    eventCost: 'ଆପଣଙ୍କର ଅନୁମାନିତ ଘଟଣା ମୂଲ୍ୟ',
    basicPlan: 'ବେସିକ୍ ପ୍ଲାନର ବାର୍ଷିକ ପ୍ରିମିୟମ୍',
    standardPlan: 'ଷ୍ଟାଣ୍ଡାର୍ଡ୍ ପ୍ଲାନର ବାର୍ଷିକ ପ୍ରିମିୟମ୍',
    premiumPlan: 'ପ୍ରିମିୟମ୍ ପ୍ଲାନର ବାର୍ଷିକ ପ୍ରିମିୟମ୍'
  },
  'ml-IN': {
    eventCost: 'നിങ്ങളുടെ അനുമാനം ചെയ്ത ഇവന്റ് ചിലവ്',
    basicPlan: 'ബേസിക് പ്ലാന്റെ വാർഷിക പ്രീമിയം',
    standardPlan: 'സ്റ്റാൻഡേർഡ് പ്ലാന്റെ വാർഷിക പ്രീമിയം',
    premiumPlan: 'പ്രീമിയം പ്ലാന്റെ വാർഷിക പ്രീമിയം'
  },
  'pa-IN': {
    eventCost: 'ਤੁਹਾਡੀ ਅਨੁਮਾਨਿਤ ਘਟਨਾ ਲਾਗਤ ਹੈ',
    basicPlan: 'ਬੇਸਿਕ ਪਲਾਨ ਦੀ ਸਾਲਾਨਾ ਪ੍ਰੀਮੀਅਮ ਹੈ',
    standardPlan: 'ਸਟੈਂਡਰਡ ਪਲਾਨ ਦੀ ਸਾਲਾਨਾ ਪ੍ਰੀਮੀਅਮ ਹੈ',
    premiumPlan: 'ਪ੍ਰੀਮੀਅਮ ਪਲਾਨ ਦੀ ਸਾਲਾਨਾ ਪ੍ਰੀਮੀਅਮ ਹੈ'
  },
  'as-IN': {
    eventCost: 'আপোনাৰ অনুমান কৰা ঘটনা খৰচ হৈছে',
    basicPlan: 'বেছিক প্লেনৰ বাৰ্ষিক প্ৰিমিয়াম হৈছে',
    standardPlan: 'ষ্টেন্ডাৰ্ড প্লেনৰ বাৰ্ষিক প্ৰিমিয়াম হৈছে',
    premiumPlan: 'প্ৰিমিয়াম প্লেনৰ বাৰ্ষিক প্ৰিমিয়াম হৈছে'
  }
};

const commandsData = {
    'en-US': {
      age: '• "Set age to 45" or "Age 45" or "I am 45 years old"',
      bmi: '• "BMI 24" or "Set BMI to 24" or "Body mass index 24"',
      smoker: '• "I am a smoker" or "Non smoker"',
      accident: '• "Accident moderate" or "Severe accident" or "No accident"',
      hospitalization: '• "Hospitalization 5 days" or "Admitted for 5 days"',
      treatment: '• "Treatment ICU" or "Surgery" or "Outpatient"',
      location: '• "Location metro" or "Urban" or "Rural"',
      children: '• "2 children" or "I have 2 children"',
      estimate: '• "Estimate now" - Run calculation',
      read: '• "Read result" - Hear the results',
      clear: '• "Clear parameters" or "Reset all" - Clear all inputs',
      export: '• "Export CSV" or "Download CSV" - Download data as CSV'
    },
    'en-GB': {
      age: '• "Set age to 45" or "Age 45" or "I am 45 years old"',
      bmi: '• "BMI 24" or "Set BMI to 24" or "Body mass index 24"',
      smoker: '• "I am a smoker" or "Non smoker"',
      accident: '• "Accident moderate" or "Severe accident" or "No accident"',
      hospitalization: '• "Hospitalisation 5 days" or "Admitted for 5 days"',
      treatment: '• "Treatment ICU" or "Surgery" or "Outpatient"',
      location: '• "Location metro" or "Urban" or "Rural"',
      children: '• "2 children" or "I have 2 children"',
      estimate: '• "Estimate now" - Run calculation',
      read: '• "Read result" - Hear the results'
    },
    'hi-IN': {
      age: '• "उम्र 45" या "मैं 45 साल का हूँ" या "उम्र 45 सेट करें"',
      bmi: '• "BMI 24" या "BMI को 24 पर सेट करें" या "बॉडी मास इंडेक्स 24"',
      smoker: '• "मैं धूम्रपान करता हूँ" या "मैं धूम्रपान नहीं करता"',
      accident: '• "दुर्घटना मध्यम" या "गंभीर दुर्घटना" या "कोई दुर्घटना नहीं"',
      hospitalization: '• "अस्पताल में 5 दिन" या "5 दिनों के लिए भर्ती"',
      treatment: '• "इलाज ICU" या "सर्जरी" या "आउट पेशेंट"',
      location: '• "स्थान मेट्रो" या "शहरी" या "ग्रामीण"',
      children: '• "2 बच्चे" या "मेरे 2 बच्चे हैं"',
      estimate: '• "अभी अनुमान लगाएँ" - गणना चलाएँ',
      read: '• "परिणाम पढ़ें" - परिणाम सुनें',
      clear: '• "पैरामीटर साफ करें" या "सब रीसेट करें" - सभी इनपुट साफ करें',
      export: '• "सीएसवी निर्यात करें" या "सीएसवी डाउनलोड करें" - डेटा सीएसवी के रूप में डाउनलोड करें'
    },
    'bn-IN': {
      age: '• "বয়স 45" বা "আমি 45 বছর বয়সী" বা "বয়স 45 সেট করুন"',
      bmi: '• "BMI 24" বা "BMI কে 24 তে সেট করুন" বা "শরীরের ওজন সূচক 24"',
      smoker: '• "আমি ধূমপান করি" বা "আমি ধূমপান করি না"',
      accident: '• "দুর্ঘটনা মাঝারি" বা "গুরুতর দুর্ঘটনা" বা "কোনো দুর্ঘটনা নেই"',
      hospitalization: '• "হাসপাতালে 5 দিন" বা "5 দিনের জন্য ভর্তি"',
      treatment: '• "চিকিৎসা ICU" বা "অস্ত্রোপচার" বা "আউট পেশেন্ট"',
      location: '• "অবস্থান মেট্রো" বা "শহর" বা "গ্রামীণ"',
      children: '• "2 সন্তান" বা "আমার 2 সন্তান আছে"',
      estimate: '• "এখন অনুমান করুন" - গণনা চালান',
      read: '• "ফলাফল পড়ুন" - ফলাফল শুনুন'
    },
    'te-IN': {
      age: '• "వయస్సు 45" లేదా "నేను 45 సంవత్సరాల వయస్సు" లేదా "వయస్సు 45 సెట్ చేయండి"',
      bmi: '• "BMI 24" లేదా "BMI ను 24 కు సెట్ చేయండి" లేదా "శరీర బరువు సూచిక 24"',
      smoker: '• "నేను ధూమపాని" లేదా "ధూమపాని కాదు"',
      accident: '• "ప్రమాదం మధ్యస్థం" లేదా "తీవ్ర ప్రమాదం" లేదా "ప్రమాదం లేదు"',
      hospitalization: '• "ఆస్పత్రిలో 5 రోజులు" లేదా "5 రోజుల పాటు చేర్చబడ్డారు"',
      treatment: '• "చికిత్స ICU" లేదా "శస్త్రచికిత్స" లేదా "అవుట్‌పేషెంట్"',
      location: '• "స్థానం మెట్రో" లేదా "పట్టణం" లేదా "గ్రామీణం"',
      children: '• "2 పిల్లలు" లేదా "నాకు 2 పిల్లలు ఉన్నారు"',
      estimate: '• "ఇప్పుడు అంచనా" - లెక్కింపు నడపండి',
      read: '• "ఫలితాన్ని చదవండి" - ఫలితాలను వినండి'
    },
    'mr-IN': {
      age: '• "वय 45" किंवा "मी 45 वर्षांचा आहे" किंवा "वय 45 सेट करा"',
      bmi: '• "BMI 24" किंवा "BMI ला 24 वर सेट करा" किंवा "शरीराचा वजन निर्देशांक 24"',
      smoker: '• "मी धूम्रपान करतो" किंवा "मी धूम्रपान करत नाही"',
      accident: '• "अपघात मध्यम" किंवा "गंभीर अपघात" किंवा "कोणताही अपघात नाही"',
      hospitalization: '• "रुग्णालयात 5 दिवस" किंवा "5 दिवसांसाठी दाखल"',
      treatment: '• "उपचार ICU" किंवा "शस्त्रक्रिया" किंवा "आउट पेशंट"',
      location: '• "स्थान मेट्रो" किंवा "शहरी" किंवा "ग्रामीण"',
      children: '• "2 मुलं" किंवा "माझी 2 मुलं आहेत"',
      estimate: '• "आता अंदाज लावा" - गणना चालवा',
      read: '• "परिणाम वाचा" - परिणाम ऐका'
    },
    'ta-IN': {
      age: '• "வயது 45" அல்லது "நான் 45 வயதாக இருக்கிறேன்" அல்லது "வயதை 45 ஆக அமைக்கவும்"',
      bmi: '• "BMI 24" அல்லது "BMI ஐ 24 ஆக அமைக்கவும்" அல்லது "உடல் எடை குறியீடு 24"',
      smoker: '• "நான் புகைபிடிப்பவன்" அல்லது "நான் புகைபிடிப்பவன் இல்லை"',
      accident: '• "விபத்து நடுத்தரம்" அல்லது "கடுமையான விபத்து" அல்லது "விபத்து இல்லை"',
      hospitalization: '• "மருத்துவமனையில் 5 நாட்கள்" அல்லது "5 நாட்களுக்கு அனுமதி"',
      treatment: '• "சிகிச்சை ICU" அல்லது "அறுவை சிகிச்சை" அல்லது "அவுட் பேஷன்ட்"',
      location: '• "இடம் மெட்ரோ" அல்லது "நகர்ப்புறம்" அல்லது "கிராமப்புறம்"',
      children: '• "2 குழந்தைகள்" அல்லது "எனக்கு 2 குழந்தைகள் இருக்கிறார்கள்"',
      estimate: '• "இப்போது மதிப்பிடு" - கணக்கீட்டை இயக்கு',
      read: '• "முடிவைப் படி" - முடிவுகளைக் கேள்'
    },
    'gu-IN': {
      age: '• "ઉંમર 45" અથવા "હું 45 વર્ષનો છું" અથવા "ઉંમર 45 સેટ કરો"',
      bmi: '• "BMI 24" અથવા "BMI ને 24 પર સેટ કરો" અથવા "શરીરનો વજન સૂચકાંક 24"',
      smoker: '• "હું ધૂમ્રપાન કરું છું" અથવા "હું ધૂમ્રપાન કરતો નથી"',
      accident: '• "અકસ્માત મધ્યમ" અથવા "ગંભીર અકસ્માત" અથવા "કોઈ અકસ્માત નથી"',
      hospitalization: '• "હોસ્પિટલમાં 5 દિવસ" અથવા "5 દિવસ માટે દાખલ"',
      treatment: '• "સારવાર ICU" અથવા "શસ્ત્રક્રિયા" અથવા "આઉટ પેશન્ટ"',
      location: '• "સ્થાન મેટ્રો" અથવા "શહેરી" અથવા "ગ્રામ્ય"',
      children: '• "2 બાળકો" અથવા "મારા 2 બાળકો છે"',
      estimate: '• "હવે અંદાજ લગાવો" - ગણતરી ચલાવો',
      read: '• "પરિણામ વાંચો" - પરિણામ સાંભળો'
    },
    'ur-IN': {
      age: '• "عمر 45" یا "میں 45 سال کا ہوں" یا "عمر 45 سیٹ کریں"',
      bmi: '• "BMI 24" یا "BMI کو 24 پر سیٹ کریں" یا "جسم کا وزن اشاریہ 24"',
      smoker: '• "میں تمباکو نوشی کرتا ہوں" یا "میں تمباکو نوشی نہیں کرتا"',
      accident: '• "حادثہ درمیانہ" یا "شدید حادثہ" یا "کوئی حادثہ نہیں"',
      hospitalization: '• "ہسپتال میں 5 دن" یا "5 دنوں کے لیے داخلہ"',
      treatment: '• "علاج ICU" یا "سرجری" یا "آؤٹ پेशنٹ"',
      location: '• "مقام میٹرو" یا "شہری" یا "دیہی"',
      children: '• "2 بچے" یا "میرے 2 بچے ہیں"',
      estimate: '• "اب اندازہ لگائیں" - حساب چلائیں',
      read: '• "نتیجہ پڑھیں" - نتائج سنیں'
    },
    'kn-IN': {
      age: '• "ವಯಸ್ಸು 45" ಅಥವಾ "ನಾನು 45 ವರ್ಷದವನು" ಅಥವಾ "ವಯಸ್ಸು 45 ಹೊಂದಿಸಿ"',
      bmi: '• "BMI 24" ಅಥವಾ "BMI ಯನ್ನು 24 ಕ್ಕೆ ಹೊಂದಿಸಿ" ಅಥವಾ "ದೇಹದ ತೂಕದ ಸೂಚ್ಯಂಕ 24"',
      smoker: '• "ನಾನು ಧೂಮಪಾನ ಮಾಡುತ್ತೇನೆ" ಅಥವಾ "ನಾನು ಧೂಮಪಾನ ಮಾಡುವುದಿಲ್ಲ"',
      accident: '• "ಅಪಘಾತ ಮಧ್ಯಮ" ಅಥವಾ "ತೀವ್ರ ಅಪಘಾತ" ಅಥವಾ "ಯಾವುದೇ ಅಪಘಾತವಿಲ್ಲ"',
      hospitalization: '• "ಆಸ್ಪತ್ರೆಯಲ್ಲಿ 5 ದಿನಗಳು" ಅಥವಾ "5 ದಿನಗಳಿಗೆ ದಾಖಲಾತಿ"',
      treatment: '• "ಚಿಕಿತ್ಸೆ ICU" ಅಥವಾ "ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ" ಅಥವಾ "ಆಉಟ್ ಪೇಷೆಂಟ್"',
      location: '• "ಸ್ಥಳ ಮೆಟ್ರೋ" ಅಥವಾ "ನಗರ" ಅಥವಾ "ಗ್ರಾಮೀಣ"',
      children: '• "2 ಮಕ್ಕಳು" ಅಥವಾ "ನನಗೆ 2 ಮಕ್ಕಳಿದ್ದಾರೆ"',
      estimate: '• "ಈಗ ಅಂದಾಜಿಸಿ" - ಲೆಕ್ಕಾಚಾರ ನಡೆಸಿ',
      read: '• "ಫಲಿತಾಂಶವನ್ನು ಓದಿ" - ಫಲಿತಾಂಶಗಳನ್ನು ಕೇಳಿ'
    },
    'or-IN': {
      age: '• "ବୟସ 45" କିମ୍ବା "ମୁଁ 45 ବର୍ଷର ଅଛି" କିମ୍ବା "ବୟସ 45 ସେଟ୍ କରନ୍ତୁ"',
      bmi: '• "BMI 24" କିମ୍ବା "BMI କୁ 24 ରେ ସେଟ୍ କରନ୍ତୁ" କିମ୍ବା "ଶରୀରର ଓଜନ ସୂଚକ 24"',
      smoker: '• "ମୁଁ ଧୂମପାନ କରେ" କିମ୍ବା "ମୁଁ ଧୂମପାନ କରେନି"',
      accident: '• "ଦୁର୍ଘଟଣା ମଧ୍ୟମ" କିମ୍ବା "ଗୁରୁତର ଦୁର୍ଘଟଣା" କିମ୍ବା "କୌଣସି ଦୁର୍ଘଟଣା ନାହିଁ"',
      hospitalization: '• "ହସ୍ପିଟାଲରେ 5 ଦିନ" କିମ୍ବା "5 ଦିନ ପାଇଁ ଭର୍ତ୍ତି"',
      treatment: '• "ଚିକିତ୍ସା ICU" କିମ୍ବା "ଶଲ୍ୟଚିକିତ୍ସା" କିମ୍ବା "ଆଉଟ୍ ପେସେଣ୍ଟ"',
      location: '• "ସ୍ଥାନ ମେଟ୍ରୋ" କିମ୍ବା "ନଗର" କିମ୍ବା "ଗ୍ରାମୀଣ"',
      children: '• "2 ପିଲା" କିମ୍ବା "ମୋର 2 ପିଲା ଅଛି"',
      estimate: '• "ଏବେ ଅନୁମାନ କରନ୍ତୁ" - ଗଣନା ଚଲାନ୍ତୁ',
      read: '• "ଫଳାଫଳ ପଢନ୍ତୁ" - ଫଳାଫଳ ଶୁଣନ୍ତୁ'
    },
    'ml-IN': {
      age: '• "വയസ്സ് 45" അല്ലെങ്കിൽ "ഞാൻ 45 വയസ്സുള്ളവൻ" അല്ലെങ്കിൽ "വയസ്സ് 45 സെറ്റ് ചെയ്യുക"',
      bmi: '• "BMI 24" അല്ലെങ്കിൽ "BMI 24 ആയി സെറ്റ് ചെയ്യുക" അല്ലെങ്കിൽ "ശരീരഭാര സൂചിക 24"',
      smoker: '• "ഞാൻ പുകവലി ചെയ്യുന്നു" അല്ലെങ്കിൽ "ഞാൻ പുകവലി ചെയ്യുന്നില്ല"',
      accident: '• "അപകടം ഇടത്തരം" അല്ലെങ്കിൽ "ഗുരുതരമായ അപകടം" അല്ലെങ്കിൽ "അപകടം ഇല്ല"',
      hospitalization: '• "ആശുപത്രിയിൽ 5 ദിവസം" അല്ലെങ്കിൽ "5 ദിവസത്തേക്ക് പ്രവേശനം"',
      treatment: '• "ചികിത്സ ICU" അല്ലെങ്കിൽ "ശസ്ത്രക്രിയ" അല്ലെങ്കിൽ "ഔട്ട് പേഷ്യന്റ്"',
      location: '• "സ്ഥലം മെട്രോ" അല്ലെങ്കിൽ "നഗരം" അല്ലെങ്കിൽ "ഗ്രാമീണം"',
      children: '• "2 കുട്ടികൾ" അല്ലെങ്കിൽ "എനിക്ക് 2 കുട്ടികൾ ഉണ്ട്"',
      estimate: '• "ഇപ്പോൾ എസ്റ്റിമേറ്റ് ചെയ്യുക" - കണക്കുകൂട്ടൽ നടത്തുക',
      read: '• "ഫലം വായിക്കുക" - ഫലങ്ങൾ കേൾക്കുക'
    },
    'pa-IN': {
      age: '• "ਉਮਰ 45" ਜਾਂ "ਮੈਂ 45 ਸਾਲ ਦਾ ਹਾਂ" ਜਾਂ "ਉਮਰ 45 ਸੈੱਟ ਕਰੋ"',
      bmi: '• "BMI 24" ਜਾਂ "BMI ਨੂੰ 24 ਤੇ ਸੈੱਟ ਕਰੋ" ਜਾਂ "ਸਰੀਰ ਦਾ ਵਜ਼ਨ ਸੂਚਕ 24"',
      smoker: '• "ਮੈਂ ਧੂਮਰਪਾਨ ਕਰਦਾ ਹਾਂ" ਜਾਂ "ਮੈਂ ਧੂਮਰਪਾਨ ਨਹੀਂ ਕਰਦਾ"',
      accident: '• "ਹਾਦਸਾ ਦਰਮਿਆਨਾ" ਜਾਂ "ਗੰਭੀਰ ਹਾਦਸਾ" ਜਾਂ "ਕੋਈ ਹਾਦਸਾ ਨਹੀਂ"',
      hospitalization: '• "ਹਸਪਤਾਲ ਵਿੱਚ 5 ਦਿਨ" ਜਾਂ "5 ਦਿਨਾਂ ਲਈ ਦਾਖਲਾ"',
      treatment: '• "ਇਲਾਜ ICU" ਜਾਂ "ਸਰਜਰੀ" ਜਾਂ "ਆਊਟ ਪੇਸ਼ਨਟ"',
      location: '• "ਸਥਾਨ ਮੈਟਰੋ" ਜਾਂ "ਸ਼ਹਿਰੀ" ਜਾਂ "ਗ੍ਰਾਮੀਣ"',
      children: '• "2 ਬੱਚੇ" ਜਾਂ "ਮੇਰੇ 2 ਬੱਚੇ ਹਨ"',
      estimate: '• "ਹੁਣ ਅੰਦਾਜ਼ਾ ਲਗਾਓ" - ਗਣਨਾ ਚਲਾਓ',
      read: '• "ਨਤੀਜਾ ਪੜ੍ਹੋ" - ਨਤੀਜੇ ਸੁਣੋ'
    },
    'as-IN': {
      age: '• "বয়স 45" নাইবা "মই 45 বছৰীয়া" নাইবা "বয়স 45 ছেট কৰক"',
      bmi: '• "BMI 24" নাইবা "BMI ক 24 ত ছেট কৰক" নাইবা "দেহৰ ওজন সূচক 24"',
      smoker: '• "মই ধূমপান কৰোঁ" নাইবা "মই ধূমপান নকৰোঁ"',
      accident: '• "দুৰ্ঘটনা মধ্যম" নাইবা "গুৰুতৰ দুৰ্ঘটনা" নাইবা "কোনো দুৰ্ঘটনা নাই"',
      hospitalization: '• "চিকিৎসালয়ত 5 দিন" নাইবা "5 দিনৰ বাবে ভৰ্তি"',
      treatment: '• "চিকিৎসা ICU" নাইবা "অস্ত্ৰোপচাৰ" নাইবা "আউট পেচেন্ট"',
      location: '• "অৱস্থান মেট্ৰো" নাইবা "নগৰ" নাইবা "গ্ৰাম্য"',
      children: '• "2 ল\'ৰা" নাইবা "মোৰ 2 ল\'ৰা আছে"',
      estimate: '• "এতিয়া অনুমান কৰক" - গণনা চলাওক',
      read: '• "ফলাফল পঢ়ক" - ফলাফল শুনক'
    }
  };

const VoiceAssistant = () => {
  const { toast } = useToast();
  const { insights, generateInsights, retrainModel } = useMLInsights();
  const [status, setStatus] = useState('Ready');
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [language, setLanguage] = useState('en-US');
  const voiceRef = useRef<VoiceRecognition | null>(null);

  const [inputs, setInputs] = useState<EstimateInputs>({
    age: 30,
    sex: 'male',
    bmi: 22,
    children: 0,
    smoker: false,
    medicalConditions: [],
    accidentSeverity: 'none',
    hospitalizationDays: 0,
    treatmentType: 'outpatient',
    location: 'urban'
  });

  useEffect(() => {
    const handleTranscript = (text: string, isFinal: boolean) => {
      setTranscript(text);

      // Only parse commands on final results to avoid premature updates
      if (isFinal) {
        // Check for estimate command
        if (text.toLowerCase().includes('estimate now') || text.toLowerCase().includes('calculate now') ||
            text.toLowerCase().includes('अभी अनुमान लगाएँ') || text.toLowerCase().includes('अनुमान लगाएँ') ||
            text.toLowerCase().includes('ఇప్పుడు అంచనా') || text.toLowerCase().includes('అంచనా') ||
            text.toLowerCase().includes('இப்போது மதிப்பிடு') || text.toLowerCase().includes('மதிப்பிடு') ||
            text.toLowerCase().includes('तुमचा अंदाज लावा') || text.toLowerCase().includes('अंदाज लावा') ||
            text.toLowerCase().includes('এখন অনুমান করুন') || text.toLowerCase().includes('অনুমান করুন') ||
            text.toLowerCase().includes('હવે અંદાજ લગાવો') || text.toLowerCase().includes('અંદાજ લગાવો') ||
            text.toLowerCase().includes('اب اندازہ لگائیں') || text.toLowerCase().includes('اندازہ لگائیں') ||
            text.toLowerCase().includes('ಈಗ ಅಂದಾಜಿಸಿ') || text.toLowerCase().includes('ಅಂದಾಜಿಸಿ') ||
            text.toLowerCase().includes('ଏବେ ଅନୁମାନ କରନ୍ତୁ') || text.toLowerCase().includes('ଅନୁମାନ କରନ୍ତୁ') ||
            text.toLowerCase().includes('ഇപ്പോൾ എസ്റ്റിമേറ്റ് ചെയ്യുക') || text.toLowerCase().includes('എസ്റ്റിമേറ്റ് ചെയ്യുക') ||
            text.toLowerCase().includes('ਹੁਣ ਅੰਦਾਜ਼ਾ ਲਗਾਓ') || text.toLowerCase().includes('ਅੰਦਾਜ਼ਾ ਲਗਾਓ') ||
            text.toLowerCase().includes('এতিয়া অনুমান কৰক') || text.toLowerCase().includes('অনুমান কৰক')) {
          handleEstimate();
        }

        // Check for read result command
        if (text.toLowerCase().includes('read result') || text.toLowerCase().includes('read results') ||
            text.toLowerCase().includes('परिणाम पढ़ें') || text.toLowerCase().includes('पढ़ें') ||
            text.toLowerCase().includes('ఫలితాన్ని చదవండి') || text.toLowerCase().includes('చదవండి') ||
            text.toLowerCase().includes('முடிவைப் படி') || text.toLowerCase().includes('படி') ||
            text.toLowerCase().includes('परिणाम वाचा') || text.toLowerCase().includes('वाचा') ||
            text.toLowerCase().includes('ফলাফল পড়ুন') || text.toLowerCase().includes('পড়ুন') ||
            text.toLowerCase().includes('પરિણામ વાંચો') || text.toLowerCase().includes('વાંચો') ||
            text.toLowerCase().includes('نتیجہ پڑھیں') || text.toLowerCase().includes('پڑھیں') ||
            text.toLowerCase().includes('ಫಲಿತಾಂಶವನ್ನು ಓದಿ') || text.toLowerCase().includes('ಓದಿ') ||
            text.toLowerCase().includes('ଫଳାଫଳ ପଢନ୍ତୁ') || text.toLowerCase().includes('ପଢନ୍ତୁ') ||
            text.toLowerCase().includes('ഫലം വായിക്കുക') || text.toLowerCase().includes('വായിക്കുക') ||
            text.toLowerCase().includes('ਨਤੀਜਾ ਪੜ੍ਹੋ') || text.toLowerCase().includes('ਪੜ੍ਹੋ') ||
            text.toLowerCase().includes('ফলাফল পঢ়ক') || text.toLowerCase().includes('পঢ়ক')) {
          handleReadResult();
        }

        // Check for clear parameters command
        if (text.toLowerCase().includes('clear parameters') || text.toLowerCase().includes('clear all') ||
            text.toLowerCase().includes('reset parameters') || text.toLowerCase().includes('reset all') ||
            text.toLowerCase().includes('पैरामीटर साफ करें') || text.toLowerCase().includes('सब साफ करें') ||
            text.toLowerCase().includes('रीसेट करें') || text.toLowerCase().includes('सब रीसेट करें') ||
            text.toLowerCase().includes('పారామితులను క్లియర్ చేయండి') || text.toLowerCase().includes('అన్నింటినీ క్లియర్ చేయండి') ||
            text.toLowerCase().includes('రీసెట్ చేయండి') || text.toLowerCase().includes('అన్నింటినీ రీసెట్ చేయండి') ||
            text.toLowerCase().includes('அளவுருக்களை அழிக்கவும்') || text.toLowerCase().includes('அனைத்தையும் அழிக்கவும்') ||
            text.toLowerCase().includes('மீட்டமைக்கவும்') || text.toLowerCase().includes('அனைத்தையும் மீட்டமைக்கவும்') ||
            text.toLowerCase().includes('पैरामीटर्स साफ करा') || text.toLowerCase().includes('सर्व साफ करा') ||
            text.toLowerCase().includes('रीसेट करा') || text.toLowerCase().includes('सर्व रीसेट करा') ||
            text.toLowerCase().includes('প্যারামিটারগুলি সাফ করুন') || text.toLowerCase().includes('সব সাফ করুন') ||
            text.toLowerCase().includes('রিসেট করুন') || text.toLowerCase().includes('সব রিসেট করুন') ||
            text.toLowerCase().includes('પેરામીટર્સ સાફ કરો') || text.toLowerCase().includes('બધું સાફ કરો') ||
            text.toLowerCase().includes('રીસેટ કરો') || text.toLowerCase().includes('બધું રીસેટ કરો') ||
            text.toLowerCase().includes('پیرامیٹرز صاف کریں') || text.toLowerCase().includes('سب صاف کریں') ||
            text.toLowerCase().includes('ری سیٹ کریں') || text.toLowerCase().includes('سب ری سیٹ کریں') ||
            text.toLowerCase().includes('ಪ್ಯಾರಾಮೀಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ') || text.toLowerCase().includes('ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ') ||
            text.toLowerCase().includes('ಮರುಹೊಂದಿಸಿ') || text.toLowerCase().includes('ಎಲ್ಲವನ್ನೂ ಮರುಹೊಂದಿಸಿ') ||
            text.toLowerCase().includes('ପାରାମିଟର୍‌ଗୁଡ଼ିକୁ ସଫା କରନ୍ତୁ') || text.toLowerCase().includes('ସବୁ ସଫା କରନ୍ତୁ') ||
            text.toLowerCase().includes('ରିସେଟ୍ କରନ୍ତୁ') || text.toLowerCase().includes('ସବୁ ରିସେଟ୍ କରନ୍ତୁ') ||
            text.toLowerCase().includes('പാരാമീറ്ററുകൾ മായ്ക്കുക') || text.toLowerCase().includes('എല്ലാം മായ്ക്കുക') ||
            text.toLowerCase().includes('റീസെറ്റ് ചെയ്യുക') || text.toLowerCase().includes('എല്ലാം റീസെറ്റ് ചെയ്യുക') ||
            text.toLowerCase().includes('ਪੈਰਾਮੀਟਰ ਸਾਫ਼ ਕਰੋ') || text.toLowerCase().includes('ਸਭ ਸਾਫ਼ ਕਰੋ') ||
            text.toLowerCase().includes('ਰੀਸੈਟ ਕਰੋ') || text.toLowerCase().includes('ਸਭ ਰੀਸੈਟ ਕਰੋ') ||
            text.toLowerCase().includes('পেৰামিটাৰবোৰ পৰিষ্কাৰ কৰক') || text.toLowerCase().includes('সকলোবোৰ পৰিষ্কাৰ কৰক') ||
            text.toLowerCase().includes('ৰিচেট কৰক') || text.toLowerCase().includes('সকলোবোৰ ৰিচেট কৰক')) {
          handleClearParameters();
        }

        // Check for export CSV command
        if (text.toLowerCase().includes('export csv') || text.toLowerCase().includes('export to csv') ||
            text.toLowerCase().includes('download csv') || text.toLowerCase().includes('save csv') ||
            text.toLowerCase().includes('सीएसवी निर्यात करें') || text.toLowerCase().includes('सीएसवी डाउनलोड करें') ||
            text.toLowerCase().includes('सीएसवी सहेजें') || text.toLowerCase().includes('सीएसवी निर्यात') ||
            text.toLowerCase().includes('సిఎస్వీ నిర్యాతం చేయండి') || text.toLowerCase().includes('సిఎస్వీ డౌన్‌లోడ్ చేయండి') ||
            text.toLowerCase().includes('సిఎస్వీ సేవ్ చేయండి') || text.toLowerCase().includes('సిఎస్వీ నిర్యాతం') ||
            text.toLowerCase().includes('சிஎஸ்வி ஏற்றுமதி செய்யவும்') || text.toLowerCase().includes('சிஎஸ்வி பதிவிறக்கவும்') ||
            text.toLowerCase().includes('சிஎஸ்வி சேமிக்கவும்') || text.toLowerCase().includes('சிஎஸ்வி ஏற்றுமதி') ||
            text.toLowerCase().includes('सीएसव्ही निर्यात करा') || text.toLowerCase().includes('सीएसव्ही डाउनलोड करा') ||
            text.toLowerCase().includes('सीएसव्ही सेव करा') || text.toLowerCase().includes('सीएसव्ही निर्यात') ||
            text.toLowerCase().includes('সিএসভি রপ্তানি করুন') || text.toLowerCase().includes('সিএসভি ডাউনলোড করুন') ||
            text.toLowerCase().includes('সিএসভি সংরক্ষণ করুন') || text.toLowerCase().includes('সিএসভি রপ্তানি') ||
            text.toLowerCase().includes('સીએસવી નિર્યાત કરો') || text.toLowerCase().includes('સીએસવી ડાઉનલોડ કરો') ||
            text.toLowerCase().includes('સીએસવી સેવ કરો') || text.toLowerCase().includes('સીએસવી નિર્યાત') ||
            text.toLowerCase().includes('سی ایس وی برآمد کریں') || text.toLowerCase().includes('سی ایس وی ڈاؤن لوڈ کریں') ||
            text.toLowerCase().includes('سی ایس وی محفوظ کریں') || text.toLowerCase().includes('سی ایس وی برآمد') ||
            text.toLowerCase().includes('ಸಿಎಸ್ವಿಯನ್ನು ರಫ್ತು ಮಾಡಿ') || text.toLowerCase().includes('ಸಿಎಸ್ವಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ') ||
            text.toLowerCase().includes('ಸಿಎಸ್ವಿಯನ್ನು ಉಳಿಸಿ') || text.toLowerCase().includes('ಸಿಎಸ್ವಿ ರಫ್ತು') ||
            text.toLowerCase().includes('ସିଏସ୍‌ଭି ରପ୍ତାନି କରନ୍ତୁ') || text.toLowerCase().includes('ସିଏସ୍‌ଭି ଡାଉନଲୋଡ୍ କରନ୍ତୁ') ||
            text.toLowerCase().includes('ସିଏସ୍‌ଭି ସେଭ୍ କରନ୍ତୁ') || text.toLowerCase().includes('ସିଏସ୍‌ଭି ରପ୍ତାନି') ||
            text.toLowerCase().includes('സിഎസ്വി എക്സ്പോർട്ട് ചെയ്യുക') || text.toLowerCase().includes('സിഎസ്വി ഡൗൺലോഡ് ചെയ്യുക') ||
            text.toLowerCase().includes('സിഎസ്വി സേവ് ചെയ്യുക') || text.toLowerCase().includes('സിഎസ്വി എക്സ്പോർട്ട്') ||
            text.toLowerCase().includes('ਸੀਐਸਵੀ ਨਿਰਯਾਤ ਕਰੋ') || text.toLowerCase().includes('ਸੀਐਸਵੀ ਡਾਊਨਲੋਡ ਕਰੋ') ||
            text.toLowerCase().includes('ਸੀਐਸਵੀ ਸੇਵ ਕਰੋ') || text.toLowerCase().includes('ਸੀਐਸਵੀ ਨਿਰਯਾਤ') ||
            text.toLowerCase().includes('চিএচভি ৰপ্তানি কৰক') || text.toLowerCase().includes('চিএচভি ডাউনলোড কৰক') ||
            text.toLowerCase().includes('চিএচভি ছেভ কৰক') || text.toLowerCase().includes('চিএচভি ৰপ্তানি')) {
          handleExportCSV();
        }

        // Parse commands
        const updates = voiceRef.current?.parseCommands(text, inputs);
        if (updates) {
          setInputs(prev => ({ ...prev, ...updates }));
          toast({
            title: "Voice Command Recognized",
            description: `Updated: ${Object.keys(updates).join(', ')}`
          });
        }
      }
    };

    voiceRef.current = new VoiceRecognition(
      handleTranscript,
      (status: string) => {
        setStatus(status);
        if (status === 'Stopped' || status.startsWith('Error')) {
          setIsListening(false);
        }
      },
      language
    );

    if (!voiceRef.current.isSupported()) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Please use Chrome browser for voice features",
        variant: "destructive"
      });
    }

    return () => {
      voiceRef.current?.stop();
    };
  }, [language]);

  const handleStart = () => {
    voiceRef.current?.start();
    setIsListening(true);
  };

  const handleStop = () => {
    voiceRef.current?.stop();
    setIsListening(false);
  };

  const handleEstimate = () => {
    const calculatedResult = calculateInsuranceCost(inputs);
    setResult(calculatedResult);
    
    // Generate ML insights
    generateInsights(calculatedResult);
    
    // Retrain model with new data
    retrainModel();
    
    toast({
      title: "Estimate Calculated",
      description: `Event cost: ${formatINR(calculatedResult.eventCost)}`
    });
  };

  const handleReadResult = () => {
    if (!result) {
      toast({
        title: "No Result Available",
        description: "Please calculate an estimate first"
      });
      return;
    }

    const translations = resultTranslations[language as keyof typeof resultTranslations] || resultTranslations['en-US'];

    const text = `${translations.eventCost} ${formatINR(result.eventCost)}.
      ${translations.basicPlan} ${formatINR(result.plans[0].annualPremium)}.
      ${translations.standardPlan} ${formatINR(result.plans[1].annualPremium)}.
      ${translations.premiumPlan} ${formatINR(result.plans[2].annualPremium)}.`;

    voiceRef.current?.speak(text);
    toast({
      title: "Reading Result",
      description: "Listen to your estimate"
    });
  };

  const handleClearParameters = () => {
    setInputs({
      age: 30,
      sex: 'male',
      bmi: 22,
      children: 0,
      smoker: false,
      medicalConditions: [],
      accidentSeverity: 'none',
      hospitalizationDays: 0,
      treatmentType: 'outpatient',
      location: 'urban'
    });
    setResult(null);
    toast({
      title: "Parameters Cleared",
      description: "All input fields reset to default values"
    });
  };

  const handleExportCSV = () => {
    const history = getHistory();
    exportToCSV(history);
    toast({
      title: "Export Complete",
      description: "CSV file downloaded"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Voice Assistant</CardTitle>
          <CardDescription>Use voice commands to input data and get estimates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <span className="font-medium">Status:</span>
            <Badge variant={status === 'Listening' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="font-medium">Language:</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                voiceRef.current?.setLanguage(e.target.value);
              }}
              className="w-full p-2 bg-secondary/20 rounded-lg border border-border"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
              <option value="bn-IN">Bengali (বাংলা)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
              <option value="mr-IN">Marathi (मराठी)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="gu-IN">Gujarati (ગુજરાતી)</option>
              <option value="ur-IN">Urdu (اردو)</option>
              <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
              <option value="or-IN">Odia (ଓଡ଼ିଆ)</option>
              <option value="ml-IN">Malayalam (മലയാളം)</option>
              <option value="pa-IN">Punjabi (ਪੰਜਾਬੀ)</option>
              <option value="as-IN">Assamese (অসমীয়া)</option>
            </select>
          </div>

          {/* Controls */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={isListening ? handleStop : handleStart}
              variant={isListening ? 'destructive' : 'default'}
              size="lg"
            >
              {isListening ? (
                <>
                  <Square className="mr-2 h-5 w-5" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Start Listening
                </>
              )}
            </Button>
            
            <Button onClick={handleEstimate} variant="outline" size="lg">
              <Play className="mr-2 h-5 w-5" />
              Predict from Speech
            </Button>
            
            <Button onClick={handleReadResult} variant="outline" size="lg" disabled={!result}>
              <Volume2 className="mr-2 h-5 w-5" />
              Read Result
            </Button>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleClearParameters} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Clear Parameters
            </Button>
            <Button onClick={handleExportCSV} variant="outline" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Export CSV
            </Button>
          </div>

          {/* Transcript */}
          <div className="space-y-2">
            <label className="font-medium">Live Transcript:</label>
            <div className="min-h-[120px] p-4 bg-secondary/30 rounded-lg border border-border">
              <p className="text-sm whitespace-pre-wrap">
                {transcript || 'Start speaking to see transcript...'}
              </p>
            </div>
          </div>

          {/* Current Inputs Display */}
          <div className="space-y-2">
            <label className="font-medium">Current Input Values:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="font-medium">{inputs.age}</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">BMI</p>
                <p className="font-medium">{inputs.bmi}</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">Smoker</p>
                <p className="font-medium">{inputs.smoker ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">Accident</p>
                <p className="font-medium capitalize">{inputs.accidentSeverity}</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">Hosp. Days</p>
                <p className="font-medium">{inputs.hospitalizationDays}</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">Treatment</p>
                <p className="font-medium capitalize">{inputs.treatmentType}</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium capitalize">{inputs.location}</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded">
                <p className="text-xs text-muted-foreground">Children</p>
                <p className="font-medium">{inputs.children}</p>
              </div>
            </div>
          </div>

          {/* Voice Commands Help */}
          <div className="space-y-2">
            <label className="font-medium">Supported Commands:</label>
            <div className="p-4 bg-secondary/20 rounded-lg text-sm space-y-1">
              {Object.values(commandsData[language as keyof typeof commandsData]).map((command, index) => (
                <p key={index}>{command}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Voice Estimate Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Estimated Event Cost</p>
                <p className="text-4xl font-bold text-primary">{formatINR(result.eventCost)}</p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Annual Premium</TableHead>
                    <TableHead>Expected Payout</TableHead>
                    <TableHead>Deductible</TableHead>
                    <TableHead>Coverage Cap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.plans.map((plan) => (
                    <TableRow key={plan.name}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{formatINR(plan.annualPremium)}</TableCell>
                      <TableCell>{formatINR(plan.expectedPayout)}</TableCell>
                      <TableCell>{formatINR(plan.deductible)}</TableCell>
                      <TableCell>{formatINR(plan.coverageCap)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ML Insights Section */}
          {insights.riskProfile && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-blue-500" />
                <h2 className="text-3xl font-bold">ML-Powered Insights</h2>
              </div>

              {/* Risk Assessment */}
              <RiskAssessmentCard riskProfile={insights.riskProfile} language={language} />

              {/* Plan Recommendations */}
              {insights.recommendations.length > 0 && (
                <PlanRecommendationsCard recommendations={insights.recommendations} language={language} />
              )}

              {/* Anomaly Detection */}
              <AnomalyDetectionCard anomaly={insights.anomalyDetection} language={language} />

              {/* Trend Analysis */}
              {insights.temporalAnalysis && (
                <TrendAnalysisCard
                  trend={insights.temporalAnalysis.trend}
                  frequentFactors={insights.patterns?.commonPatterns.slice(0, 3).map((p: any) => p.pattern) || []}
                  language={language}
                />
              )}

              {/* Model Status */}
              {insights.modelTrained && insights.modelMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Machine Learning Model Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Model Accuracy (MAPE)</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {insights.modelMetrics.mape.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Root Mean Squared Error (RMSE)</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ₹{(insights.modelMetrics.rmse / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ✓ Model trained on {getHistory().length} historical estimates. Predictions improve with more data.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VoiceAssistant;
