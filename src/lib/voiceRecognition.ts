import { EstimateInputs } from '@/types/insurance';

export class VoiceRecognition {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private onTranscript: (text: string, isFinal: boolean) => void;
  private onStatusChange: (status: string) => void;
  private language: string;

  constructor(
    onTranscript: (text: string, isFinal: boolean) => void,
    onStatusChange: (status: string) => void,
    language: string = 'en-US'
  ) {
    this.onTranscript = onTranscript;
    this.onStatusChange = onStatusChange;
    this.language = language;
    this.synthesis = window.speechSynthesis;

    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.language;

      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(' ');
        const isFinal = event.results[event.results.length - 1].isFinal;
        this.onTranscript(transcript, isFinal);
      };

      this.recognition.onend = () => {
        this.onStatusChange('Stopped');
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.onStatusChange('Error: ' + event.error);
      };
    }
  }
  
  isSupported(): boolean {
    return !!this.recognition;
  }
  
  start(): void {
    if (this.recognition) {
      this.recognition.start();
      this.onStatusChange('Listening');
    }
  }
  
  stop(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.onStatusChange('Stopped');
    }
  }
  
  parseCommands(transcript: string, currentInputs: EstimateInputs): Partial<EstimateInputs> | null {
    const lower = transcript.toLowerCase();
    const updates: Partial<EstimateInputs> = {};

    // Age - English and Telugu patterns
    const agePatterns = [
      /age.*?(\d+)/i,
      /i am (\d+)/i,
      /(\d+) years old/i,
      /set age to (\d+)/i,
      /వయస్సు.*?(\d+)/i,
      /నేను (\d+)/i,
      /(\d+) సంవత్సరాలు/i
    ];
    for (const pattern of agePatterns) {
      const match = transcript.match(pattern);
      if (match) {
        updates.age = parseInt(match[1]);
        break;
      }
    }

    // BMI - Multi-language patterns
    const bmiPatterns = [
      // English
      /bmi.*?(\d+\.?\d*)/i,
      /body mass index.*?(\d+\.?\d*)/i,
      /set bmi to (\d+\.?\d*)/i,
      // Hindi
      /बीएमआई.*?(\d+\.?\d*)/i,
      /बॉडी मास इंडेक्स.*?(\d+\.?\d*)/i,
      // Bengali
      /বিএমআই.*?(\d+\.?\d*)/i,
      /শরীরের ওজন সূচক.*?(\d+\.?\d*)/i,
      // Telugu
      /బీఎంఐ.*?(\d+\.?\d*)/i,
      /శరీర బరువు సూచిక.*?(\d+\.?\d*)/i,
      // Marathi
      /बीएमआय.*?(\d+\.?\d*)/i,
      /शरीराचा वजन निर्देशांक.*?(\d+\.?\d*)/i,
      // Tamil
      /பிஎம்ஐ.*?(\d+\.?\d*)/i,
      /உடல் எடை குறியீடு.*?(\d+\.?\d*)/i,
      // Gujarati
      /બીએમઆઈ.*?(\d+\.?\d*)/i,
      /શરીરનો વજન સૂચકાંક.*?(\d+\.?\d*)/i,
      // Urdu
      /بی ایم آئی.*?(\d+\.?\d*)/i,
      /جسم کا وزن اشاریہ.*?(\d+\.?\d*)/i,
      // Kannada
      /ಬಿಎಂಐ.*?(\d+\.?\d*)/i,
      /ದೇಹದ ತೂಕದ ಸೂಚ್ಯಂಕ.*?(\d+\.?\d*)/i,
      // Odia
      /ବିଏମ୍ଆଇ.*?(\d+\.?\d*)/i,
      /ଶରୀରର ଓଜନ ସୂଚକ.*?(\d+\.?\d*)/i,
      // Malayalam
      /ബിഎംഐ.*?(\d+\.?\d*)/i,
      /ശരീരഭാര സൂചിക.*?(\d+\.?\d*)/i,
      // Punjabi
      /ਬੀਐਮਆਈ.*?(\d+\.?\d*)/i,
      /ਸਰੀਰ ਦਾ ਵਜ਼ਨ ਸੂਚਕ.*?(\d+\.?\d*)/i,
      // Assamese
      /বিএমআই.*?(\d+\.?\d*)/i,
      /দেহৰ ওজন সূচক.*?(\d+\.?\d*)/i
    ];
    for (const pattern of bmiPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        updates.bmi = parseFloat(match[1]);
        break;
      }
    }

    // Children - English and Telugu patterns
    const childrenPatterns = [
      /(\d+)\s*child/i,
      /children.*?(\d+)/i,
      /i have (\d+) child/i,
      /set children to (\d+)/i,
      /(\d+)\s*పిల్లలు/i,
      /పిల్లలు.*?(\d+)/i,
      /నాకు (\d+) పిల్లలు/i
    ];
    for (const pattern of childrenPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        updates.children = parseInt(match[1]);
        break;
      }
    }

    // Hospitalization - Multi-language patterns
    const hospPatterns = [
      // English
      /hospitalization.*?(\d+)/i,
      /hospital.*?(\d+)\s*days?/i,
      /admitted for (\d+)\s*days?/i,
      /set hospitalization to (\d+)/i,
      // Hindi
      /अस्पताल.*?(\d+)/i,
      /दाखिला.*?(\d+)\s*दिन/i,
      /भर्ती.*?(\d+)\s*दिन/i,
      // Bengali
      /হাসপাতাল.*?(\d+)/i,
      /ভর্তি.*?(\d+)\s*দিন/i,
      /দিনের জন্য ভর্তি.*?(\d+)/i,
      // Telugu
      /ఆస్పత్రి.*?(\d+)/i,
      /రోజులు.*?(\d+)/i,
      /చేర్చబడ్డారు.*?(\d+)/i,
      // Marathi
      /रुग्णालय.*?(\d+)/i,
      /दाखल.*?(\d+)\s*दिवस/i,
      /दिवसांसाठी दाखल.*?(\d+)/i,
      // Tamil
      /மருத்துவமனை.*?(\d+)/i,
      /அனுமதி.*?(\d+)\s*நாட்கள்/i,
      /நாட்களுக்கு அனுமதி.*?(\d+)/i,
      // Gujarati
      /હોસ્પિટલ.*?(\d+)/i,
      /દાખલ.*?(\d+)\s*દિવસ/i,
      /દિવસ માટે દાખલ.*?(\d+)/i,
      // Urdu
      /ہسپتال.*?(\d+)/i,
      /داخلہ.*?(\d+)\s*دن/i,
      /دنوں کے لیے داخلہ.*?(\d+)/i,
      // Kannada
      /ಆಸ್ಪತ್ರೆ.*?(\d+)/i,
      /ದಾಖಲಾತಿ.*?(\d+)\s*ದಿನಗಳು/i,
      /ದಿನಗಳಿಗೆ ದಾಖಲಾತಿ.*?(\d+)/i,
      // Odia
      /ହସ୍ପିଟାଲ.*?(\d+)/i,
      /ଭର୍ତ୍ତି.*?(\d+)\s*ଦିନ/i,
      /ଦିନ ପାଇଁ ଭର୍ତ୍ତି.*?(\d+)/i,
      // Malayalam
      /ആശുപത്രി.*?(\d+)/i,
      /പ്രവേശനം.*?(\d+)\s*ദിവസം/i,
      /ദിവസത്തേക്ക് പ്രവേശനം.*?(\d+)/i,
      // Punjabi
      /ਹਸਪਤਾਲ.*?(\d+)/i,
      /ਦਾਖਲਾ.*?(\d+)\s*ਦਿਨ/i,
      /ਦਿਨਾਂ ਲਈ ਦਾਖਲਾ.*?(\d+)/i,
      // Assamese
      /চিকিৎসালয়.*?(\d+)/i,
      /ভৰ্তি.*?(\d+)\s*দিন/i,
      /দিনৰ বাবে ভৰ্তি.*?(\d+)/i
    ];
    for (const pattern of hospPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        updates.hospitalizationDays = parseInt(match[1]);
        break;
      }
    }

    // Smoker - English and Telugu patterns
    if (lower.includes('smoker') || lower.includes('smoke') || lower.includes('ధూమపాని')) {
      if (lower.includes('i am a smoker') || lower.includes('i smoke') ||
          lower.includes('yes smoker') || lower.includes('smoker yes') ||
          lower.includes('నేను ధూమపాని') || lower.includes('ధూమపాని చేస్తాను')) {
        updates.smoker = true;
      }
      if (lower.includes('non smoker') || lower.includes('not a smoker') ||
          lower.includes('no smoker') || lower.includes('don\'t smoke') ||
          lower.includes('ధూమపాని కాదు') || lower.includes('ధూమపాని చేయను')) {
        updates.smoker = false;
      }
    }

    // Accident severity - Multi-language patterns
    if (lower.includes('accident') || lower.includes('accident severity') ||
        lower.includes('दुर्घटना') || lower.includes('हादसा') ||
        lower.includes('দুর্ঘটনা') ||
        lower.includes('ప్రమాదం') ||
        lower.includes('अपघात') ||
        lower.includes('விபத்து') ||
        lower.includes('અકસ્માત') ||
        lower.includes('حادثہ') ||
        lower.includes('ಅಪಘಾತ') ||
        lower.includes('ଦୁର୍ଘଟଣା') ||
        lower.includes('അപകടം') ||
        lower.includes('ਹਾਦਸਾ') ||
        lower.includes('দুৰ্ঘটনা')) {
      if (lower.includes('severe') || lower.includes('गंभीर') || lower.includes('तीव्र') ||
          lower.includes('গুরুতর') || lower.includes('তীব্র') ||
          lower.includes('తీవ్ర') ||
          lower.includes('गंभीर') ||
          lower.includes('கடுமையான') ||
          lower.includes('ગંભીર') ||
          lower.includes('شدید') ||
          lower.includes('ತೀವ್ರ') ||
          lower.includes('ଗୁରୁତର') ||
          lower.includes('ഗുരുതരമായ') ||
          lower.includes('ਗੰਭੀਰ') ||
          lower.includes('গুৰুতৰ')) updates.accidentSeverity = 'severe';
      else if (lower.includes('moderate') || lower.includes('मध्यम') ||
          lower.includes('মাঝারি') ||
          lower.includes('మధ్యస్థ') ||
          lower.includes('मध्यम') ||
          lower.includes('நடுத்தரம்') ||
          lower.includes('મધ્યમ') ||
          lower.includes('درمیانہ') ||
          lower.includes('ಮಧ್ಯಮ') ||
          lower.includes('ମଧ୍ୟମ') ||
          lower.includes('ഇടത്തരം') ||
          lower.includes('ਦਰਮਿਆਨਾ') ||
          lower.includes('মধ্যম')) updates.accidentSeverity = 'moderate';
      else if (lower.includes('minor') || lower.includes('छोटा') || lower.includes('सामान्य') ||
          lower.includes('ছোট') || lower.includes('সাধারণ') ||
          lower.includes('చిన్న') ||
          lower.includes('लहान') ||
          lower.includes('சிறிய') ||
          lower.includes('નાનું') ||
          lower.includes('معمولی') ||
          lower.includes('ಸಣ್ಣ') ||
          lower.includes('ଛୋଟ') ||
          lower.includes('ചെറിയ') ||
          lower.includes('ਛੋਟਾ') ||
          lower.includes('সৰু')) updates.accidentSeverity = 'minor';
      else if (lower.includes('none') || lower.includes('no accident') ||
          lower.includes('कोई नहीं') || lower.includes('नहीं') ||
          lower.includes('কোনো না') || lower.includes('না') ||
          lower.includes('ప్రమాదం లేదు') ||
          lower.includes('नाही') ||
          lower.includes('இல்லை') ||
          lower.includes('નહીં') ||
          lower.includes('کوئی نہیں') ||
          lower.includes('ಇಲ್ಲ') ||
          lower.includes('କୌଣସି ନୁହେଁ') ||
          lower.includes('ഇല്ല') ||
          lower.includes('ਕੋਈ ਨਹੀਂ') ||
          lower.includes('কোনো নহয়')) updates.accidentSeverity = 'none';
    }

    // Treatment type - English and Telugu patterns
    if (lower.includes('treatment') || lower.includes('treatment type') || lower.includes('చికిత్స')) {
      if (lower.includes('icu')) updates.treatmentType = 'icu';
      else if (lower.includes('surgery') || lower.includes('operation') || lower.includes('శస్త్రచికిత్స')) updates.treatmentType = 'surgery';
      else if (lower.includes('outpatient') || lower.includes('out patient') || lower.includes('అవుట్‌పేషెంట్')) updates.treatmentType = 'outpatient';
    }

    // Location - Multi-language patterns
    if (lower.includes('location') || lower.includes('area') ||
        lower.includes('स्थान') || lower.includes('क्षेत्र') ||
        lower.includes('অবস্থান') || lower.includes('এলাকা') ||
        lower.includes('స్థానం') || lower.includes('ప్రాంతం') ||
        lower.includes('स्थान') || lower.includes('क्षेत्र') ||
        lower.includes('இடம்') || lower.includes('பகுதி') ||
        lower.includes('સ્થાન') || lower.includes('વિસ્તાર') ||
        lower.includes('مقام') || lower.includes('علاقہ') ||
        lower.includes('ಸ್ಥಳ') || lower.includes('ಪ್ರದೇಶ') ||
        lower.includes('ସ୍ଥାନ') || lower.includes('କ୍ଷେତ୍ର') ||
        lower.includes('സ്ഥലം') || lower.includes('ഏരിയ') ||
        lower.includes('ਸਥਾਨ') || lower.includes('ਖੇਤਰ') ||
        lower.includes('অৱস্থান') || lower.includes('এলাকা')) {
      if (lower.includes('metro') || lower.includes('metropolitan') ||
          lower.includes('मेट्रो') ||
          lower.includes('মেট্রো') ||
          lower.includes('మెట్రో') ||
          lower.includes('मेट्रो') ||
          lower.includes('மெட்ரோ') ||
          lower.includes('મેટ્રો') ||
          lower.includes('میٹرو') ||
          lower.includes('ಮೆಟ್ರೋ') ||
          lower.includes('ମେଟ୍ରୋ') ||
          lower.includes('മെട്രോ') ||
          lower.includes('ਮੈਟਰੋ') ||
          lower.includes('মেট্ৰো')) updates.location = 'metro';
      else if (lower.includes('urban') || lower.includes('city') ||
          lower.includes('शहरी') || lower.includes('नगर') ||
          lower.includes('শহর') || lower.includes('নগর') ||
          lower.includes('పట్టణం') || lower.includes('నగరం') ||
          lower.includes('शहरी') || lower.includes('नगर') ||
          lower.includes('நகர்ப்புறம்') || lower.includes('நகரம்') ||
          lower.includes('શહેરી') || lower.includes('નગર') ||
          lower.includes('شہری') || lower.includes('شہر') ||
          lower.includes('ನಗರ') ||
          lower.includes('ନଗର') ||
          lower.includes('നഗരം') ||
          lower.includes('ਸ਼ਹਿਰੀ') || lower.includes('ਨਗਰ') ||
          lower.includes('নগৰ')) updates.location = 'urban';
      else if (lower.includes('rural') || lower.includes('village') ||
          lower.includes('ग्रामीण') || lower.includes('गाँव') ||
          lower.includes('গ্রামীণ') || lower.includes('গ্রাম') ||
          lower.includes('గ్రామీణం') || lower.includes('గ్రామం') ||
          lower.includes('ग्रामीण') || lower.includes('गाव') ||
          lower.includes('கிராமப்புறம்') || lower.includes('கிராமம்') ||
          lower.includes('ગ્રામ્ય') || lower.includes('ગામ') ||
          lower.includes('دیہی') || lower.includes('گاؤں') ||
          lower.includes('ಗ್ರಾಮೀಣ') || lower.includes('ಗ್ರಾಮ') ||
          lower.includes('ଗ୍ରାମୀଣ') || lower.includes('ଗ୍ରାମ') ||
          lower.includes('ഗ്രാമീണം') || lower.includes('ഗ്രാമം') ||
          lower.includes('ਗ੍ਰਾਮੀਣ') || lower.includes('ਗਾਂਵ') ||
          lower.includes('গ্ৰাম্য') || lower.includes('গাঁও')) updates.location = 'rural';
    }

    // Sex - English and Telugu patterns
    if (lower.includes('gender') || lower.includes('sex') || lower.includes('i am') || lower.includes('లింగం')) {
      if ((lower.includes('male') || lower.includes('పురుషుడు')) && !(lower.includes('female') || lower.includes('స్త్రీ'))) updates.sex = 'male';
      if (lower.includes('female') || lower.includes('స్త్రీ')) updates.sex = 'female';
    }

    return Object.keys(updates).length > 0 ? updates : null;
  }
  
  setLanguage(language: string): void {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = this.language;
    }
  }

  speak(text: string): void {
    this.synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.language;
    utterance.rate = 0.9;
    this.synthesis.speak(utterance);
  }
}
