import re
from fuzzywuzzy import process
from fuzzywuzzy import fuzz

import Levenshtein as lev

# save slurs in a file

slurs_list_lower = ['#rheachakraborty',
 '#498a',
 '#feministmafia',
 '#carryminatiroast',
 '#justiceforswapnilpandey',
 '#arrestranaayyub',
 '#boycottfabindia',
 '#domesticviolence',
 '#dowry',
 '#falsecases',
 '#feministsaretrash',
 '#genderbiasedlaws',
 '#hiteshachandranee',
 '#love_nahi_jeehad_hai',
 '#justiceforcabdriver',
 '#menscommission',
 '#menslivesmatter',
 '#potentiallegalterrorist',
 '#mentoo',
 '#womenaretrash',
 'presstitutes',
 'liberal',
 '#அத்தை',
 '#speakupmen',
 '#ranaayyub',
 '#sullideals',
 '#pussypower',
 '#reservation_kills_merit',
 '#reservation',
 '#superstraight',
 '#randikutiya',
 '#save_hindu_girls',
 'जिहादी',
 'pseudohindus',
 'chrislamocommies',
 'sanghans',
 'nationalists',
 'whore',
 'faggot',
 'love jihad',
 'रंडी',
 'रण्डी',
 'libtard',
 'रंडीखाना',
 'deshdrohi chinese',
 'रण्डी रोना',
 'लुल्ली',
 'गांड',
 'कुतिया',
 'कुत्ती',
 'कमीनी',
 'அத்தை',
 'டிகி',
 'அரவாணி',
 'அலி',
 'கல்லு',
 'பொன்ஸ்',
 'ஒன்பது',
 'मुजरा',
 'हिजड़ा',
 'बदसूरत',
 'बलात्कार',
 'लिब्राण्डू',
 'नंगी_पुंगी',
 'पागल औरत',
 'rape',
 'r@pe',
 'r@p3',
 'bitch',
 'victim_card',
 'sekoolar',
 'sickular',
 'sc0undrel',
 'r@ndi',
 'feminazi',
 'chinese corona',
 'பொம்பள பொருக்கி',
 'ங்கோத்தா',
 'கோத்தா',
 'தாயோளி',
 'தேவ்டியா பையா',
 'தேவ்டியா',
 'சூத்து',
 'லெஸ்பியன்',
 'ஊம்பு',
 'புண்ட',
 'ஐட்டம்',
 'அயிட்டம்',
 'சாமான்',
 'கூதி',
 'ஆட்டக்காரி',
 'வேசை',
 'வேச',
 'பொதுச் சொத்து',
 'ஊர் மேய்றது',
 'பொட்டை',
 'மாங்கா',
 'கோழி',
 'முலை',
 'பறத்தாயோலி',
 'ஓக்க',
 'தேவடியா_மவன்',
 'தேவடியா பசங்களா',
 'புண்டை',
 'atrocity_act',
 'arrestlucknowgirl',
 'fakecasewalibiwi',
 'gasti',
 '#lovejihad',
 '#misandry',
 '#piddilover',
 '#pseudohindus',
 '#rheality_today',
 '#sanghans',
 '#saveoursons',
 '#scstact',
 '🍑',
 '#जिहादी_मुक्त_नवरात्रि',
 '#ஓத்த',
 'आतंकवादी',
 'कचरा',
 'कंजर',
 'कटा लुंड',
 'कलमुंही',
 'कसाई',
 'काम_वाली_बाई',
 'काला टेंट',
 'काली कलूटी',
 'काले तवे',
 'किन्नर',
 'कुल्टा',
 'ख़ुसरा',
 'गटर पैदाइश',
 'गणिका',
 'गद्दार',
 'गधी',
 'घटिया औरत',
 'चंडाल',
 'चंडाल_चौकड़ी',
 'चमचा',
 'चमार',
 'चरित्रहीन',
 'चाटुकार',
 'चालू औरत',
 'चुदाई',
 'चुसल्मान',
 'चुस्लामि',
 'चुस्लिम',
 'चूची',
 'चूड़ा',
 'चूस',
 'छिनाल',
 'जंगली',
 'जली',
 'जाहिल_औरत',
 'जूता खायेगी',
 'जोरू का गुलाम',
 'झूठी औरत',
 'छुतीये',
 'तवाइफ़',
 'दलाल',
 'देहातन',
 'देहाती औरत',
 'दो कौड़ी की औरत',
 'दोगली',
 'धोबी',
 'नल्ली',
 'नाजायज़',
 'नाल',
 'पनौती',
 'पिछवाड़ा',
 'पेल',
 'पैर की जूती',
 'पॉटी',
 'फेमिनिजम',
 'बत्तमीज़',
 'बहन की लोड़ी',
 'बहन चोद',
 'बहनजी',
 'बाज़ारू औरत',
 'बीबी',
 'बुरखा धत्त',
 'बुरखे वाली',
 'बुल्ली',
 'बेहूदा औरत',
 'बैल बुद्धि',
 'भंगी',
 'भड़वा',
 'भद्दी औरत',
 'भांड',
 'भांड औरत',
 'भाड़े का टट्टू',
 'भारत तेरे टुकड़े गैंग',
 'भूतनी के',
 'भोंकना',
 'भोसड़ीwala',
 'मर क्यों नहीं जाती',
 'महार',
 'मा के भोसड़े',
 'मादरजात',
 'मुलिया',
 'मुँह मैं ले',
 'मूत',
 'मेडम जी',
 'मोटी भैंस',
 'म्लेच्छा',
 'रांड',
 'लानती',
 'लेस्बियन',
 'लोड़ू',
 'लौड़ा',
 'लौड़े',
 'विक्टिम कार्ड',
 'शरिया',
 'साली',
 'सुल्ली',
 'सूअर',
 'सूअर की औलाद',
 'सौ टका टंच माल',
 'स्कर्ट वाली बाई',
 'हगना',
 'हबशी',
 'हरामजादी',
 'हरामी',
 'हलाला',
 'हिजरा',
 'हिज़रापंती',
 'हिलाओगी',
 'मादरचोद',
 'भोस्डीके',
 'टट्टी',
 'जा नाली साफ़ करके आ',
 'आंटी',
 'லூசு கூ',
 'பொட்டை நாய்',
 'லூசு',
 'தேவிடியாளுக்கு பொறந்தவன்',
 'தேவிடியா புண்ட',
 'சூத்தடி',
 'கூfire',
 '#छक्का',
 '#கொம்மா',
 '#ங்கோத்தா',
 '#சாமான்',
 '#பெரியாராவது_மயிராவது',
 '#பொட்டை',
 '#முட்டாஉபி',
 'anti national tukde',
 '498a',
 'bimbo',
 'toxic aunty',
 'toilet saaf',
 'buzlim',
 'characterless woman',
 'chinky',
 'black pepper',
 'dull-it',
 'dynast sycophants',
 'ferrorists',
 'izzlam',
 'katwa',
 'muzlim',
 'naachne waali',
 'ola u uber',
 'pak agents',
 'pheminist',
 'pissfull',
 'rice bags',
 'scumbags',
 'secular',
 'sissy',
 'dented-painted',
 'toilet + saaf',
 'sunflowerண்டை_emoji',
 'sunflowerண்டை',
 'scumreds',
 'samlaingik',
 'ma ki chui',
 'jersey cow',
 'burnol',
 'victim card']

def regex_exact_slurs(tweet,slurs_list_lower):
      
    result = {}
    
    matches = re.findall(r"(?=("+'|'.join(slurs_list_lower)+r"))", tweet.lower())
    
    slurs = []
    tokens = []
    #print(matches)
    
    for match in matches:
    
        print(match)
        
        slurs.append(match)
        
        tokens.append(match)
        
        tweet = tweet.replace(match,'----')
    
        # token,slur key pair
        result.update({match:match})
    
    return tweet,result

def approx_matching_slurs(tweet,slurs_list_lower,threshold_score=70):
    
    print("\nApprox matching")
    check = 0
         
    match_dict = dict(process.extract(tweet,slurs_list_lower,limit = 10,scorer=fuzz.partial_ratio))

    matches = match_dict.keys()
    
    # to compare the distance of top 10 matching slurs to find the right matching
    dis_dict = {}
    token_slur_dict = {}
    
    
    for slur in matches:
        
        for token in tweet.split(' '):
            
            """
            Can add memoization here
            
            -Check if the distance b/w token and match is already calculated
            """
            
            if (token,slur) not in token_slur_dict:
                
                dis = lev.distance(token,slur)
                            
                token_slur_dict[(token,slur)] = dis
            
                if dis in dis_dict:
                    dis_dict[dis].append((token,slur))
            
                else:
                    dis_dict[dis] = [(token,slur)]
            
    
    dist_sort = dict(sorted(dis_dict.items()))
   
    result_dict = {}
    result = {}
    
    for dist,match in dist_sort.items():
        
        #print(dist,match)
        loop_break = 0
        
        for token,slur in match:
            
            #does it work for hin and tamil?
            if token:
                
                #print(slur)
                #print(match_dict[slur])
    
                if (slur[0].lower() == token[0].lower()) and (match_dict[slur] >= threshold_score) and (token.lower() not in ['muslim','muslims']):
                    
                    #print(f'slur,token : {slur} {token}')
                    result_dict[('slur','token')] = (slur,token)
                    
                    #token,slur value pair
                    result.update({token:slur})
                    
                  
                    tweet = tweet.replace(token,'----')
                    
                    # to iterate all the matches in that dict
                    loop_break = 1
                    
        if loop_break:
            break
                
    return tweet,result

def slur_replacement_slurs(tweet,slurs_list_lower=slurs_list_lower,threshold_score=90):
    
    tweet1,exact_result = regex_exact_slurs(tweet,slurs_list_lower)
    print(f'exact : {exact_result}')
    tweet2,approx_result = approx_matching_slurs(tweet1,slurs_list_lower,threshold_score=threshold_score)
    print(f'approx : {approx_result}')
    
    exact_result.update(approx_result)
    print(f'combined : {exact_result}')
    
    print(f'\n original tweet : {tweet}\n')
    print(f'final tweet : {tweet2}')
    
    return tweet2

# if __name__ == "__main__":

#     return slur_replacement_slurs(tweet,)
