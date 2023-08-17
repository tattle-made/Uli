from indic_transliteration import sanscript
import jellyfish
import json

slurs_devanagari = 'जिहादी|छक्का|छिनाल|रंडी|रण्डी|रांड|रंडीखाना|रण्डी ' \
                   'रोना|लुल्ली|गांड|गा#|कुतिया|कुत्ती|बत्तमीज़|कुल्टा|हरामजादी|साली|चो#|चुदाई|मा के ' \
                   'भोसड़े|भोस्डीके|भोछडी वाला|लोड़ू|बहन ' \
                   'चोद|मादरचोद|लानती|छुतीये|चूतिये|चूत|लौड़ा|लौड़े|चरित्रहीन|लिब्राण्डू|नंगी पुंगी|पागल औरत|बाज़ारू ' \
                   'औरत|बलात्कार|बदसूरत|मुजरा|जाहिल औरत|औरत-ए-जाहिल|भोसड़ीwala|चंडाल चौकड़ी|म्लेच्छा|सूअर|सूअर की ' \
                   'औलाद|दोगली|🏹पनौती|हरामी|गधी|बुरखा धत्त|बुल्ली|कलमुंही|पिछवाड़ा|काम वाली बाई|पैर की जूती|नाल|गंदी ' \
                   'नाली|हगना|सुल्ली|हिज़रापंती|तवाइफ़|सौ टका टंच ' \
                   'माल|किन्नर|गद्दार|चमचा|चमची|आतंकवादी|मुलिया|चाटुकार|बहन की ' \
                   'लोड़ी|चुस्लिम|चुस्लामि|चुसल्मान|चूस|भीमटा|भीमटी|बैल बुद्धि|हलाला|भद्दी औरत|भांड औरत|भाड़े का ' \
                   'टट्टू|दो कौड़ी की औरत|घटिया औरत|बेहूदा औरत|चालू औरत|झूठी औरत|मर क्यों नहीं जाती|नल्ली|भूतनी के|चूत ' \
                   'के बाल|मादरजात|भड़वा|चूची|टट्टी|गटर पैदाइश|मुँह मैं ले|मूत|नाजायज़|कटा लुंड|काला टेंट|जूता ' \
                   'खायेगी|बुरखे वाली|काली कलूटी|काले तवे|मोटी भैंस|देहातन|देहाती औरत|गणिका|हबशी|ओला हु ' \
                   'उबर|रनडwa|नाचने वाली|हलाला'
slurs_roman = 'ma ki chui|naachne waali|Katwa|ABLANARI|AblaNari|ablanari|chakka|jihidis|jihadis|jihadi|Jihidis' \
              '|Jihadis|jihadi|zehadi|jehadan|jihadinon|Chakko|chakki|chaka|Chinal|Randi|ramdi|Randie|randya' \
              '|randikhana|r&d-khana|randi ke beej|Lulli|Gasti|Meetha|Halwa|Gud|Gaandu|Gaand|Gandiaal|Dheela ' \
              'Lun@|lodu|kutiya|kutti|Chudail|Badchalan|Battameez|kulta|haramjadi|dyan|saali|sali|chod|chodu ' \
              'bhagat|chudai|chooda|chuda|Bhdsk|2BHK|Bhosi ke|bsdk|bhonsdi ke|bhosad|bhosdiwale|maa ka ' \
              'bhosra|Lodu|bhenchod|Madarchod|Maderchod|mcp|mc|Lanti|choo$iya|chutiye|chutiya|Chut|hutiye|chutie' \
              '|chutia|chut ke dhakkan|chut marli|chutan|<3da|Lavde|Gandu|Rakhail|librandu|chal phut|nangi ' \
              'poongi|pagal aurat|bazaru|bazari aurat|ola hi uber hai|balatkar|Ugly|Mujra|mujra|jaahil ' \
              'aurat|Mulli|hilana|hilaogi|Mlechcha|Suar|suar ki ' \
              'aulad|doghli|Panauti|panooti|harami|gadhi|🅱️ulli|kalmuhi|pichwada|jhadu|bai|kaam wali bai|pair ki ' \
              'jutti|naali|hagna|tukde tukde gang|Sulli|Tawaif|sau taka tunch maal|Skirt waali bai|Dhimmi ' \
              'hood|Dhimmihood|izzlam|gaddar|chamcha|chamchi|aatankwadi|Mulliya|Uncut|chatukar|Bahan Ke ' \
              'loudi|Kachra|Chuslim|chuslami|Chusalmans|chus|Bhimta|bheem-meem walas|bail budhi|Budhdhi|bhadi ' \
              'aurat|bhanndh aurat|bhadi ka tattu|2 Kaudi ki aurat|Gatiya|Ghatiya aurat|behuda aurat|chalu ' \
              'aurat|jhuti aurat|Kaali aurat|Kaali bhaand|marr kyun nahi jaati|nalli|dimaag se paidal|bhootni|bhootni ' \
              'ke|choot ke baal|madarjaat|bhadva|bhadvi|bhandve|chuchi|tatti|maa ka boba chusu|mooh|munh mein ' \
              'le|mutth|najayaz paidaish|najayaz aulaad|Gutter ki paidaish|kata Lund|kala tent|joota khayegi|burkhe ' \
              'waali|ladki kahin ka|victim card|Aurat card|kali kalutti|Kale tawe|naali saaf kar|moti bhains|sukkhi ' \
              'haddi|Pataka|choodiyan pehen lo|abba ka naam|Ganika|gaand ' \
              'phadna|chewtypa|atrocuty_act|RandiKutiya|sulli|Rice bags|ola u uber|lovejihad|dull-it|toxic ' \
              'aunty|Presstitutes|libtard|bimbo|slims|Black ' \
              'Pepper|faggot|Sissy|whore|chrislamocommies|piddilover|Dynast Sycophants|Deshdrohi Chinese|Pak ' \
              'agents|Chinese Corona|Chinks|chinky|Feminazi|Mulli|R@ndi|halala|Half M|Scumreds|scumbags|burnol|anti ' \
              'national tukde|pheminist|dented-painted|Muzlim|Buzlim|Izzlam|pissfull|Simp|Bitch|Ms|sekoolar|sickular' \
              '|sc0undrel|R@pe|R@p3|Characterless woman|Drama ' \
              'Queen|Ferrorists|Cunt|Slut|pussy|ugly|stupid|promiscuous|crazy|fat|fag|homo|hoe|motherfucker' \
              '|sisterfucker|bastard|b@st@rd|bint|dyke|gash|muslimette|muttah|scag|gender ' \
              'nigger|assfucker|boobs|boobies|Melons|lesbain|moslem|nasty|redlight|nymph|piss|pimp|poop|pube|puke' \
              '|retarded|slave|sissy|ola uh uber|pu55i|pu55y|mothafuck|mothafucka|mothafuckaz|mothafucked|mothafucker' \
              '|mothafuckin|mothafucking|mothafuckings|motherfuck|motherfucked|motherfucker|motherfuckin' \
              '|motherfucking|motherfuckings|lesbain|lesbayn|lesbian|lesbin|lesbo|nastyslut|nastywhore|nastybitch' \
              '|nastyho|December 23, 2021|#OSISORU|#thevdiyaa|#thevdiya|#gommala|#Pundamavane|#pundai|#otha|Koodhi' \
              '|pottai|Potta Alith|Aththai|athai|loosu|fuck|cunt'
slurs_tamil = '#முட்டாஉபி|#பெரியாராவது_மயிராவது|#பாலியல்_ஜல்சா_கட்சி|பொம்பள ' \
              'பொருக்கி|#ங்கோத்தா|கோத்தா|#கோத்தா|#கொம்மா|தாயோளி|தேவ்டியா ' \
              'பையா|தேவ்டியா|#பொட்டை|#சாமான்|சூத்து|லெஸ்பியன்|ஊம்பு|புண்ட|#திருட்டு_' \
              'பள்ளன்|ஐட்டம்|அயிட்டம்|சாமான்|கூதி|ஆட்டக்காரி|வேசை|வேச|பொதுச் சொத்து|ஊர் மேய்றது|நடத்தை ' \
              'கெட்டது|பொட்டை|க்ரோஸ்ஸி|தாயோளி|குஜ்ஜிலீஸ்|மாங்கா|கோழி|முலை|பறத்தாயோலி|ஓக்க|தேவடியா மவன்|தேவடியா ' \
              'பசங்களா|புண்டை|புண்ட|பொட்டை நாய்|வாயில பூல விடுவேன்|தேவிடியா புண்`ட|புண்டை சைடு|உங்கம்மாவை ' \
              'ஓக்க|தேவிடியாளுக்கு பொறந்தவன்|சூத்தடி|ஒன்பது|பொன்ஸ்|ஆப்ப மாமி|கம்பு துண்டு|கல்லு|ஆம்புள ' \
              'கள்ளன்|அலி|அரவாணி|பின்துவாரி|பொடியன் மாஸ்டர்|டிகி|குரும்ப|அத்தை|லூசு|கூFire|#ஓத்த|Sunflowerண்டை|லூசு கூ'

# split into lists
slurs_devanagari = slurs_devanagari.split('|')
slurs_roman = slurs_roman.split('|')
slurs_tamil = slurs_tamil.split('|')


def get_devanagari_roman_transliteration(phrase):
    return sanscript.transliterate(phrase, sanscript.DEVANAGARI, sanscript.ITRANS)

def get_roman_devanagari_transliteration(phrase):
    return sanscript.transliterate(phrase, sanscript.ITRANS, sanscript.DEVANAGARI)

def get_tamil_roman_transliteration(phrase):
    return sanscript.transliterate(phrase, sanscript.TAMIL, sanscript.ITRANS)

def get_roman_tamil_transliteration(phrase):
    return sanscript.transliterate(phrase, sanscript.ITRANS, sanscript.TAMIL)


def get_transliterations():
    slurs_devanagari_transliterated = []
    for phrase in slurs_devanagari:
        slurs_devanagari_transliterated.append(get_devanagari_roman_transliteration(phrase))

    slurs_tamil_transliterated = []
    for phrase in slurs_tamil:
        slurs_tamil_transliterated.append(get_tamil_roman_transliteration(phrase))

    return slurs_devanagari_transliterated, slurs_tamil_transliterated


# do NOT parallelize replacement when using this dict as longer terms need to be checked first in order
devanagari_itrans_expansion_dict = {'A': 'aa', 'I': 'ee', 'MD': 'nd', 'ND': 'nd', '.D': 'd', 'U': 'oo', 'Mg': 'ng',
                                    'Mh': 'h', 'Mt': 'nt', 'Ch': 'ch', 'T': 't', '.N': 'n', 'M': 'n'}

# TODO: tamil_expansion_dict


# Misspellings - Rules:
# 1. Only create misspellings of phrases in 'slurs_roman' and transliterated slurs
# 2. Do not modify first letter as it will change the meaning.
# 3. Do not modify first character if it is a '#' symbol. Consider the slur a hashtag
# 4. Create slur - Replace '$' signs with 's'
# 5. Create slur - Replace 's' with '$'
# 6. Devanagari: Do not replace any capitalized letter/sequences that exists in 'devanagari_itrans_expansion_dict'.
#    These are special phonetic cases that have to be explicitly handled.
# 7. '#' symbols used at end of words are used as masking symbols in slurs. Do not replace them.
# Modified Source: https://norvig.com/spell-correct.html
def edits1(word, script):
    # "All edits that are one edit away from `word`."

    # Rule 6
    if script == "devanagari":
        for key in devanagari_itrans_expansion_dict:
            if key in word:
                word = word.replace(key, devanagari_itrans_expansion_dict[key])
    # TODO: tamil Rule 6

    letters = 'abcdefghijklmnopqrstuvwxyz'
    splits = [(word[:i], word[i:]) for i in range(len(word) + 1)]

    # ignore first pair as we need to preserve first letter (Rule 2)
    # and first 2 pairs if the first letter is a '#' (Rule 3)
    ignore_len = 1
    if word[0] == '#':
        ignore_len = 2
    splits = splits[ignore_len:]

    # ignore last pair if it ends with '#' (Rule 7)
    splits = splits[:-1]

    # Rule 4
    replace_dollar_char = ''
    if '$' in word:
        replace_dollar_char = word.replace('$', 's')

    # Rule 5
    replace_s_char = ''
    if 's' in word:
        replace_s_char = word.replace('s', '$')

    deletes = [L + R[1:] for L, R in splits if R]
    transposes = [L + R[1] + R[0] + R[2:] for L, R in splits if len(R) > 1]
    replaces = [L + c + R[1:] for L, R in splits if R for c in letters]
    inserts = [L + c + R for L, R in splits for c in letters]

    return set(deletes + transposes + replaces + inserts + list(replace_dollar_char) + list(replace_s_char))


def refine_slur_list_phonetic(slur_dict):
    slur_dict_refined = {}
    for key in slur_dict:
        key_phonetic = jellyfish.soundex(key)
        refined_slur_list = []
        for edit_slur in slur_dict[key]:
            # 1. This does not work successfully - attempt reverse transliterate and save only if it matches key
            #   reverse_transliteration_devanagari = get_roman_devanagari_transliteration(edit_slur)
            #   no transliteration matches - need phonetic algo here
            # 2. The libindic-soundex library has errors
            # 3. The following algorithms in jellyfish package do not match any slur: metaphone, nysiis
            #   The jellyfish.match_rating_codex algorithm crashes
            slur_phonetic = jellyfish.soundex(edit_slur)
            if slur_phonetic == key_phonetic:
                print("phonetic match")
                refined_slur_list.append(edit_slur)
        slur_dict_refined[key] = refined_slur_list
    return slur_dict_refined


if __name__ == '__main__':
    # get transliterations
    slurs_devanagari_transliterations, slurs_tamil_transliterations = get_transliterations()
    # print(slurs_devanagari_transliterations)
    # print(slurs_tamil_transliterations)

    # create list of slurs 1-edit distance apart - Damerau–Levenshtein distance
    slurs_devanagari_transliterations_edit1 = {}
    for slur in slurs_devanagari_transliterations:
        slurs_devanagari_transliterations_edit1_list = [item for item in edits1(slur, "devanagari")]
        slurs_devanagari_transliterations_edit1[slur] = slurs_devanagari_transliterations_edit1_list
    # print(slurs_devanagari_transliterations_edit1)
    # get refined list with phonetic algorithm matching
    slurs_devanagari_transliterations_edit1_refined = refine_slur_list_phonetic(slurs_devanagari_transliterations_edit1)
    with open('../output/slurs_devanagiri_transliteration.json', 'w', encoding='utf-8') as f:
        json.dump(slurs_devanagari_transliterations_edit1_refined, f, ensure_ascii=False, indent=4)

    # create list of slurs 1-edit distance apart - Damerau–Levenshtein distance
    slurs_tamil_transliterations_edit1 = {}
    for slur in slurs_tamil_transliterations:
        slurs_tamil_transliterations_edit1_list = [item for item in edits1(slur, "tamil")]
        slurs_tamil_transliterations_edit1[slur] = slurs_tamil_transliterations_edit1_list
    # print(slurs_tamil_transliterations_edit1)
    # get refined list with phonetic algorithm matching
    slurs_tamil_transliterations_edit1_refined = refine_slur_list_phonetic(slurs_tamil_transliterations_edit1)
    with open('../output/slurs_tamil_transliteration.json', 'w', encoding='utf-8') as f:
        json.dump(slurs_tamil_transliterations_edit1_refined, f, ensure_ascii=False, indent=4)

    slurs_roman_transliterations_edit1 = {}
    for slur in slurs_roman:
        slurs_roman_transliterations_edit1_list = [item for item in edits1(slur, "roman")]
        slurs_roman_transliterations_edit1[slur] = slurs_roman_transliterations_edit1_list
    # print(slurs_roman_transliterations_edit1)
    # get refined list with phonetic algorithm matching
    slurs_roman_transliterations_edit1_refined = refine_slur_list_phonetic(slurs_roman_transliterations_edit1)
    with open('../output/slurs_roman_transliteration.json', 'w', encoding='utf-8') as f:
        json.dump(slurs_roman_transliterations_edit1_refined, f, ensure_ascii=False, indent=4)
