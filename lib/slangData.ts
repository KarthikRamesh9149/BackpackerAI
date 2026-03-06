export interface SlangTerm {
  term: string;
  meaning: string;
  example: string;
  category: string;
}

export const SLANG_CATEGORIES = ['Greetings', 'Food & Drink', 'Places', 'People', 'General', 'Outdoors'];

export const SLANG_TERMS: SlangTerm[] = [
  // Greetings
  { term: "G'day", meaning: 'Hello / Good day', example: "G'day mate, how ya going?", category: 'Greetings' },
  { term: 'How ya going?', meaning: "How are you?", example: "Hey! How ya going?", category: 'Greetings' },
  { term: 'No worries', meaning: "You're welcome / It's okay", example: "Thanks for the help! — No worries, mate.", category: 'Greetings' },
  { term: 'Cheers', meaning: 'Thanks / Goodbye', example: "Cheers for the coffee!", category: 'Greetings' },
  { term: 'Ta', meaning: 'Thank you (casual)', example: "Ta, that's really kind.", category: 'Greetings' },
  { term: "Catch ya later", meaning: 'See you later', example: "I'm heading off — catch ya later!", category: 'Greetings' },
  { term: 'Hooroo', meaning: 'Goodbye', example: "Hooroo, see ya tomorrow!", category: 'Greetings' },

  // Food & Drink
  { term: 'Brekkie', meaning: 'Breakfast', example: "Let's grab brekkie at the cafe.", category: 'Food & Drink' },
  { term: 'Arvo', meaning: 'Afternoon', example: "Wanna meet up this arvo?", category: 'Food & Drink' },
  { term: 'Barbie', meaning: 'BBQ / Barbecue', example: "Chuck some snags on the barbie.", category: 'Food & Drink' },
  { term: 'Snag', meaning: 'Sausage', example: "I'll have a snag with onions.", category: 'Food & Drink' },
  { term: 'Tinny', meaning: 'Can of beer', example: "Grab a tinny from the esky.", category: 'Food & Drink' },
  { term: 'Esky', meaning: 'Cooler / Ice box', example: "The drinks are in the esky.", category: 'Food & Drink' },
  { term: 'Chook', meaning: 'Chicken', example: "We're having roast chook tonight.", category: 'Food & Drink' },
  { term: 'Sanga', meaning: 'Sandwich', example: "I made a sanga for lunch.", category: 'Food & Drink' },
  { term: 'Avo', meaning: 'Avocado', example: "Avo on toast is the classic brekkie.", category: 'Food & Drink' },
  { term: 'Flat white', meaning: 'Espresso with steamed milk (Aussie coffee)', example: "I'll have a flat white, thanks.", category: 'Food & Drink' },
  { term: 'Long black', meaning: 'Espresso with hot water (like americano)', example: "A long black, no sugar.", category: 'Food & Drink' },
  { term: 'Byo', meaning: 'Bring Your Own (alcohol to a restaurant)', example: "The Thai place is BYO.", category: 'Food & Drink' },
  { term: 'Macca\'s', meaning: 'McDonald\'s', example: "Let's just go to Macca's.", category: 'Food & Drink' },
  { term: 'Servo', meaning: 'Service station / Gas station', example: "Stop at the servo for fuel.", category: 'Food & Drink' },

  // Places
  { term: 'Bottlo', meaning: 'Liquor store / Bottle shop', example: "Grab some wine from the bottlo.", category: 'Places' },
  { term: 'Arvo', meaning: 'Afternoon', example: "See you this arvo.", category: 'Places' },
  { term: 'The bush', meaning: 'Countryside / Rural area', example: "We went camping in the bush.", category: 'Places' },
  { term: 'Outback', meaning: 'Remote, dry interior of Australia', example: "The outback is beautiful but harsh.", category: 'Places' },
  { term: 'Woop Woop', meaning: 'Middle of nowhere', example: "They live out in Woop Woop.", category: 'Places' },
  { term: 'CBD', meaning: 'Central Business District (city center)', example: "Meet me in the CBD.", category: 'Places' },
  { term: 'Uni', meaning: 'University', example: "She's studying at uni.", category: 'Places' },
  { term: 'Maccas', meaning: "McDonald's", example: "There's a Maccas on every corner.", category: 'Places' },
  { term: 'Woolies', meaning: 'Woolworths (supermarket)', example: "Need to do a shop at Woolies.", category: 'Places' },

  // People
  { term: 'Mate', meaning: 'Friend / Buddy', example: "Thanks, mate!", category: 'People' },
  { term: 'Bloke', meaning: 'Man / Guy', example: "He's a good bloke.", category: 'People' },
  { term: 'Sheila', meaning: 'Woman (old-fashioned)', example: "She's a top sheila.", category: 'People' },
  { term: 'Legend', meaning: 'Great person / hero', example: "You're a legend!", category: 'People' },
  { term: 'Bogan', meaning: 'Uncouth person (like redneck)', example: "He's a bit of a bogan.", category: 'People' },
  { term: 'Drongo', meaning: 'Idiot / Stupid person', example: "Don't be a drongo.", category: 'People' },
  { term: 'Larrikin', meaning: 'Mischievous but loveable person', example: "He's a real larrikin.", category: 'People' },
  { term: 'Ankle biter', meaning: 'Small child', example: "She's got three ankle biters.", category: 'People' },

  // General
  { term: 'Heaps', meaning: 'A lot / Very', example: "That's heaps good!", category: 'General' },
  { term: 'Reckon', meaning: 'Think / Believe', example: "I reckon we should go.", category: 'General' },
  { term: 'Stoked', meaning: 'Very happy / Excited', example: "I'm stoked about the trip!", category: 'General' },
  { term: 'Keen', meaning: 'Enthusiastic / Interested', example: "You keen for a swim?", category: 'General' },
  { term: 'Dodgy', meaning: 'Suspicious / Unreliable', example: "That place looks dodgy.", category: 'General' },
  { term: 'Brekkie', meaning: 'Breakfast', example: "Let's grab brekkie.", category: 'General' },
  { term: 'Sunnies', meaning: 'Sunglasses', example: "Don't forget your sunnies.", category: 'General' },
  { term: 'Thongs', meaning: 'Flip-flops (NOT underwear!)', example: "Wear thongs to the beach.", category: 'General' },
  { term: 'Arvo', meaning: 'Afternoon', example: "See you this arvo.", category: 'General' },
  { term: 'Chunder', meaning: 'Vomit', example: "Had too many tinnies, nearly chundered.", category: 'General' },
  { term: 'Knackered', meaning: 'Exhausted', example: "I'm absolutely knackered.", category: 'General' },
  { term: 'Sweet as', meaning: 'Great / Perfect', example: "That's sweet as!", category: 'General' },
  { term: 'Too easy', meaning: 'No problem / Easily done', example: "Can you do that? — Too easy.", category: 'General' },
  { term: 'Fair dinkum', meaning: 'Genuine / Really', example: "Fair dinkum? That's amazing!", category: 'General' },
  { term: 'She\'ll be right', meaning: "It'll be fine / Don't worry", example: "Flat tire? She'll be right.", category: 'General' },
  { term: 'Good on ya', meaning: 'Well done / Good for you', example: "You passed? Good on ya!", category: 'General' },
  { term: 'Stuffed', meaning: 'Very tired / Broken', example: "I'm absolutely stuffed.", category: 'General' },
  { term: 'Sickie', meaning: 'Day off work (pretending to be sick)', example: "He chucked a sickie.", category: 'General' },
  { term: 'Yeah nah', meaning: 'No (polite)', example: "You coming? Yeah nah, I'm good.", category: 'General' },
  { term: 'Nah yeah', meaning: 'Yes (after thinking)', example: "Want some? Nah yeah, go on then.", category: 'General' },
  { term: 'Ute', meaning: 'Pickup truck', example: "He drives a ute.", category: 'General' },

  // Outdoors
  { term: 'Bushwalk', meaning: 'Hiking / Trail walking', example: "We went on a bushwalk in the Blue Mountains.", category: 'Outdoors' },
  { term: 'Billabong', meaning: 'A small lake or pond (from a river)', example: "We camped by the billabong.", category: 'Outdoors' },
  { term: 'Creek', meaning: 'Small stream (pronounced "creek")', example: "The campsite is by the creek.", category: 'Outdoors' },
  { term: 'Mozzie', meaning: 'Mosquito', example: "The mozzies are terrible tonight.", category: 'Outdoors' },
  { term: 'Roo', meaning: 'Kangaroo', example: "Watch out for roos on the road.", category: 'Outdoors' },
  { term: 'Bathers/Togs/Cossie', meaning: 'Swimming costume / Swimsuit', example: "Don't forget your bathers.", category: 'Outdoors' },
  { term: 'Slip slop slap', meaning: 'Slip on shirt, slop on sunscreen, slap on hat', example: "Remember — slip, slop, slap!", category: 'Outdoors' },
];

export const CULTURE_TIPS = [
  { title: 'Tipping', tip: 'Tipping is NOT expected or required in Australia. Wages are high. You can tip for exceptional service but nobody expects it.' },
  { title: 'Drive on the Left', tip: 'Australians drive on the LEFT side of the road. Look RIGHT first when crossing the street.' },
  { title: 'Tap Water', tip: 'Tap water is safe to drink everywhere in Australia. No need to buy bottled water.' },
  { title: 'Sunscreen', tip: 'Australia has the highest UV levels in the world. Wear SPF 50+ even on cloudy days. Reapply every 2 hours.' },
  { title: 'Swim Between the Flags', tip: 'Always swim between the red and yellow flags at the beach. This is where lifeguards patrol.' },
  { title: 'Drop Bears', tip: 'If an Aussie warns you about "drop bears" — they\'re joking. It\'s a prank on tourists. (Koalas are real though!)' },
  { title: 'Shoes Optional', tip: 'Many Australians walk barefoot in casual settings. Don\'t be surprised to see people barefoot in shops.' },
  { title: 'Voting Sausage', tip: 'On election day, polling stations sell sausages in bread — the "democracy sausage." It\'s a tradition.' },
  { title: 'Vegemite', tip: 'Spread Vegemite VERY thinly on buttered toast. Tourists always use too much. A tiny scrape is plenty.' },
  { title: 'Public Holidays', tip: 'Most shops close or have reduced hours on public holidays, especially Christmas and Good Friday.' },
  { title: 'Wi-Fi', tip: 'Free Wi-Fi is available at most cafes, libraries, and shopping centres. Ask for the password.' },
  { title: 'Power Outlets', tip: 'Australia uses Type I plugs (angled pins). You\'ll need an adapter. Voltage is 230V.' },
];
