import repository from './repository';
const { getPreferenceData } = repository;

const PUNCTUATIONS = [' ', '.', ',', ';', '#', '"'];

function generateMask(word, offset, string) {
    const preceding_word = string[offset - 1];
    const next_word = string[offset + word.length];

    if (
        (preceding_word == undefined ||
            PUNCTUATIONS.includes(preceding_word)) &&
        (next_word == undefined || PUNCTUATIONS.includes(next_word))
    ) {
        return '▓'.repeat(word.length);
    } else {
        return word;
    }
}

var slurList =
    'जिहादी|छक्का|छिनाल|रंडी|रण्डी|रांड|रंडीखाना|रण्डी रोना|लुल्ली|गांड|गा#|कुतिया|कुत्ती|बत्तमीज़|कुल्टा|हरामजादी|साली|चो#|चुदाई|ma ki chui|मा के भोसड़े|भोस्डीके|भोछडी वाला |लोड़ू|बहन चोद|मादरचोद|लानती|छुतीये|चूतिये |चूत|लौड़ा|लौड़े|चरित्रहीन |लिब्राण्डू|नंगी पुंगी|पागल औरत |बाज़ारू औरत|बलात्कार|बदसूरत|मुजरा|जाहिल औरत|औरत-ए-जाहिल|भोसड़ीwala|चंडाल चौकड़ी|म्लेच्छा|सूअर|सूअर की औलाद|दोगली|🏹🏹|पनौती|हरामी|गधी|बुरखा धत्त|बुल्ली |कलमुंही |पिछवाड़ा|काम वाली बाई|पैर की जूती|नाल|गंदी नाली|हगना|सुल्ली|हिज़रापंती|naachne waali|तवाइफ़|सौ टका टंच माल|किन्नर|गद्दार|चमचा|चमची|आतंकवादी|मुलिया|Katwa|चाटुकार|बहन की लोड़ी|चुस्लिम|चुस्लामि|चुसल्मान|चूस|भीमटा|भीमटी|बैल बुद्धि|हलाला|भद्दी औरत|भांड औरत|भाड़े का टट्टू|दो कौड़ी की औरत|घटिया औरत|बेहूदा औरत|चालू औरत|झूठी औरत|मर क्यों नहीं जाती|नल्ली|भूतनी के|चूत के बाल|मादरजात|भड़वा|चूची|टट्टी|गटर पैदाइश|मुँह मैं ले|मूत|नाजायज़|कटा लुंड|काला टेंट|जूता खायेगी|बुरखे वाली|काली कलूटी|काले तवे|मोटी भैंस|देहातन|देहाती औरत|गणिका|हबशी|ओला हु उबर|ABLANARI|AblaNari|ablanari|chakka|jihidis|jihadis|jihadi|Jihidis|Jihadis|jihadi|zehadi|jehadan|jihadinon|Chakko|chakki|chaka|Chinal|Randi|ramdi|Randie|randya|randikhana|r&d-khana|randi ke beej|Lulli|Gasti|Meetha|Halwa|Gud|Gaandu|Gaand|Gandiaal|Dheela Lun@|lodu|kutiya|kutti|Chudail|Badchalan|Battameez|kulta|haramjadi|dyan|saali|sali|chod|chodu bhagat|chudai|chooda|chuda|Bhdsk|2BHK|Bhosi ke|bsdk|bhonsdi ke|bhosad|bhosdiwale|maa ka bhosra|Lodu|bhenchod|Madarchod|Maderchod|mcp|mc|Lanti|choo$iya|chutiye|chutiya|Chut|hutiye|chutie|chutia|chut ke dhakkan|chut marli|chutan|<3da|Lavde|Gandu|Rakhail|librandu|chal phut|nangi poongi|pagal aurat|bazaru|bazari aurat|ola hi uber hai|balatkar|Ugly|Mujra|mujra|jaahil aurat|Mulli|hilana|hilaogi|Mlechcha|Suar|suar ki aulad|doghli|Panauti|panooti|harami|gadhi|रनडwa|🅱️ulli|kalmuhi|pichwada|jhadu|bai|kaam wali bai|pair ki jutti|naali|hagna|tukde tukde gang|Sulli|नाचने वाली|Tawaif|sau taka tunch maal|Skirt waali bai|Dhimmi hood|Dhimmihood|izzlam|gaddar|chamcha|chamchi|aatankwadi|Mulliya|Uncut|chatukar|Bahan Ke loudi|Kachra|Chuslim|chuslami|Chusalmans|chus|Bhimta|bheem-meem walas|bail budhi|Budhdhi|हलाला|bhadi aurat|bhanndh aurat|bhadi ka tattu|2 Kaudi ki aurat|Gatiya|Ghatiya aurat|behuda aurat|chalu aurat|jhuti aurat|Kaali aurat|Kaali bhaand|marr kyun nahi jaati|nalli|dimaag se paidal|bhootni|bhootni ke|choot ke baal|madarjaat|bhadva|bhadvi|bhandve|chuchi|tatti|maa ka boba chusu|mooh|munh mein le|mutth|najayaz paidaish|najayaz aulaad|Gutter ki paidaish|kata Lund|kala tent|joota khayegi|burkhe waali|ladki kahin ka|victim card|Aurat card|kali kalutti|Kale tawe|naali saaf kar|moti bhains|sukkhi haddi|Pataka|choodiyan pehen lo|abba ka naam|Ganika|gaand phadna|chewtypa|atrocuty_act|RandiKutiya|sulli|Rice bags|ola u uber|lovejihad|dull-it|toxic aunty|Presstitutes|libtard|bimbo|slims|Black Pepper|faggot|Sissy|whore|chrislamocommies|piddilover|Dynast Sycophants|Deshdrohi Chinese|Pak agents|Chinese Corona|Chinks|chinky|Feminazi|Mulli|R@ndi|halala|Half M|Scumreds|scumbags|burnol|anti national tukde|pheminist|dented-painted|Muzlim|Buzlim|Izzlam|pissfull|Simp|Bitch| Ms |sekoolar|sickular|sc0undrel|R@pe|R@p3|Characterless woman|Drama Queen|Ferrorists|Cunt|Slut|pussy|ugly|stupid|promiscuous|crazy|fat|fag|homo|hoe|motherfucker|sisterfucker|bastard|b@st@rd|bint|dyke|gash|muslimette|muttah|scag|gender nigger|assfucker|boobs|boobies|Melons|lesbain|moslem|nasty|redlight|nymph|piss|pimp|poop|pube|puke|retarded|slave|sissy|ola uh uber|pu55i|pu55y|mothafuck|mothafucka|mothafuckaz|mothafucked|mothafucker|mothafuckin|mothafucking |mothafuckings|motherfuck|motherfucked|motherfucker|motherfuckin|motherfucking|motherfuckings|lesbain|lesbayn|lesbian|lesbin|lesbo|nastyslut|nastywhore|nastybitch|nastyho|#முட்டாஉபி|#பெரியாராவது_மயிராவது|#பாலியல்_ஜல்சா_கட்சி|பொம்பள பொருக்கி|#ங்கோத்தா|கோத்தா|#கோத்தா|#கொம்மா|தாயோளி|தேவ்டியா பையா|தேவ்டியா|#பொட்டை|#சாமான்|சூத்து|லெஸ்பியன்|ஊம்பு|புண்ட|#திருட்டு_பள்ளன்|ஐட்டம்|அயிட்டம்|சாமான்|கூதி|ஆட்டக்காரி|வேசை|வேச|பொதுச் சொத்து|ஊர் மேய்றது|நடத்தை கெட்டது|பொட்டை|க்ரோஸ்ஸி|தாயோளி|குஜ்ஜிலீஸ்|மாங்கா|கோழி|முலை|பறத்தாயோலி|ஓக்க|தேவடியா மவன்|தேவடியா பசங்களா|புண்டை|புண்ட|பொட்டை நாய்|வாயில பூல விடுவேன்|தேவிடியா புண்`ட|புண்டை சைடு|உங்கம்மாவை ஓக்க|தேவிடியாளுக்கு பொறந்தவன்|சூத்தடி|ஒன்பது|பொன்ஸ்|ஆப்ப மாமி|கம்பு துண்டு|கல்லு|ஆம்புள கள்ளன்|அலி|அரவாணி|பின்துவாரி|பொடியன் மாஸ்டர்|டிகி|குரும்ப|அத்தை|December 23, 2021|லூசு|கூFire |கூFire |#ஓத்த|Sunflowerண்டை|Sunflowerண்டை|லூசு கூ|#OSISORU|#thevdiyaa|#thevdiya|#gommala|#Pundamavane|#pundai|#otha|Koodhi|pottai|Potta Alith|Aththai|athai|loosu|fuck|cunt';

slurList = slurList.split('|');
slurList = slurList.sort((a,b) => b.length - a.length);
slurList = slurList.join('|');
let expression = new RegExp(`(?:${slurList})`, 'gi');

(async () => {
    const preference = await getPreferenceData();
    console.log(preference);
    if (preference.slurList != undefined) {
        updateSlurList(preference.slurList);
    }
})();

export function replaceSlur(sentence) {
    // console.log({ slurList });
    return sentence.replace(expression, generateMask);
}

export function updateSlurList(newSlurs) {
    const list = newSlurs.split(',').join('|');
    slurList = slurList + '|' + list;
    slurList = slurList.split('|');
    slurList = slurList.sort((a,b) => b.length - a.length);
    slurList = slurList.join('|');
    expression = new RegExp(`(?:${slurList})`, 'gi');
    }
