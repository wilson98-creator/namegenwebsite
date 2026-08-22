/* build-handle.js
   Build:
   - handle-generator.html (realistic-name handle generator)
   - best-gaming-names.html (SEO content page)
   - instagram-username-ideas.html (SEO content page)
   - Update index.html (add new tiles to homepage grid)
   - Update sitemap.xml (add new URLs)
*/
const fs = require('fs');
const path = require('path');

// =============================================================
// DATA: Realistic syllable banks
//   Every bank is curated to look like names real people actually
//   use on Instagram, TikTok, YouTube, X, Twitch, Discord, GitHub.
//   No fantasy combat adjectives. No "voidslayer". Just first names,
//   activity verbs, real niche nouns, and aesthetic objects.
// =============================================================

// Realistic short first names (3-6 letters, easy to type)
const NAMES_F = ['maya','nora','lena','aria','sofia','mia','ella','ivy','sage','luna','ruby','iris','sienna','olive','wren','june','rosie','gem','faye','lou','rae','ada','chloe','amy','jade','opal','hazel','lila','mila','noa','eve','finn','tess','jess','hannah','anna','mara','lila','mira','cleo','nova','zoe','kai','liv','ada'];
const NAMES_M = ['max','kai','jay','lev','zane','rio','ash','sam','jett','jax','ty','noah','axel','ezra','theo','remy','nico','ari','sage','finn','dan','ben','tom','rob','leo','cy','drew','matt','chris','eli','lou','jude','rhys','rowan','kit','reid','dean','milo','theo','oliver','liam','luke','owen','cole','reed','dane','seth','cam'];
const NAMES_N = ['max','kai','jay','lev','zane','rio','ash','sam','jett','jax','ty','noah','axel','ezra','theo','remy','nico','ari','sage','finn','maya','nora','lena','aria','sofia','mia','ella','luna','ruby','iris','olive','lou','rae','chloe','tess','jess','hannah','cleo','nova','liv'];

// Realistic small numbers that don't look like a default password
const SMALL_NUMS = ['04','05','07','09','10','11','12','22','23','24','95','96','97','98','99','00','01','02','03'];

// Cross-niche mood adjectives (used in mood.object patterns)
const MOODS = ['soft','quiet','calm','slow','raw','wild','dark','deep','low','dim','faded','pale','bold','loud','pure','true','lone','lost','cold','cool','warm','hot','bright','clear','fresh','tiny','mini','little','wee','mid','open','free','still','smooth','mellow','dusty','foggy','cloudy','hazy','sunny','crimson','scarlet','indigo','violet','velvet','silken','linen','cotton','paper','stone','wooden','iron','golden','silver','bronze','copper'];

// Cross-niche aesthetic objects
const OBJECTS = ['moon','sun','star','sky','cloud','sea','ocean','wave','dune','mist','haze','dust','bloom','petal','rose','lily','sage','fern','moss','vine','leaf','wood','ivory','blush','peach','coral','jade','ink','paper','notes','diary','frame','frame','silk','linen','dusk','dawn','horizon','echo','flame','fire','spark','beam','glow','ghost','fox','fawn','dove','swan','cat','bear','wolf','bee','owl','moth','wave','tide','reef','stone','pebble','pearl','opal','ruby','diamond','amber','marble','porcelain','glass','crystal','plush','velvet','satin','lace','ribbon','thread','needle','pin','key','door','window','mirror','shadow','light','sunset','sunrise','midnight','noon','winter','spring','summer','autumn','rain','snow','frost','dew','hum','hum','hum'];

const niches = {
  fashion: {
    label: 'Fashion',
    names: NAMES_F,
    activities: ['wears','styles','pairs','drapes','tailors','curates','layers','threads','sews','stitches','dresses','pairs'],
    adjectives: ['soft','wild','quiet','raw','clean','minimal','classic','vintage','modern','sleek','sharp','polished','refined','understated','tailored','fitted','oversized','cropped','denim','silken','linen','cotton','knit','leather','camel','monochrome','earthy','muted','pastel','bright','bold'],
    objects: ['silk','linen','denim','leather','cotton','wool','cashmere','velvet','satin','lace','pleat','seam','hem','collar','button','pocket','suit','blazer','coat','dress','skirt','top','shirt','pants','jeans','tee','cardigan','sweater','boot','heel','sneaker','loafer','bag','tote','belt','scarf','hat','cap','glove','ring','necklace','earring','watch','bag','clutch','crossbody','mini','midi','maxi','crop','oversized','tailored','fitted','pleated','cuffed','slouchy','drape','gown','suit','sundress','wrap','kimono','robe','pajama'],
    nicheWords: ['style','looks','drobe','fits','outfits','fashion','wear','closet','wardrobe','attire','ensemble','aesthetic','vibe','mood','edit','drop','collection','line','pieces']
  },
  beauty: {
    label: 'Beauty',
    names: NAMES_F,
    activities: ['glows','shines','shimmers','blushes','moisturizes','applies','curates','routines','layers','blends','swatches','reviews','tests','tries'],
    adjectives: ['soft','dewy','matte','glossy','natural','clean','gentle','calm','fresh','bright','luminous','flawless','radiant','effortless','glassy','satin','sleek','bold','subtle','neutral','rosy','bronzed','sun-kissed','clean','clinical','gentle'],
    objects: ['skin','face','eyes','lips','brows','lashes','cheeks','pores','glow','sheen','dew','flush','shimmer','gloss','balm','serum','toner','essence','cream','gel','wash','scrub','mask','peel','oil','mist','spray','sunscreen','spf','retinol','vitamin','acid','peptide','niacinamide','hyaluronic'],
    nicheWords: ['beauty','skin','glow','routine','ritual','edit','shelfie','vanity','tips','hacks','review','first impression','favorites','empties','fails','wins']
  },
  fitness: {
    label: 'Fitness',
    names: NAMES_M,
    activities: ['lifts','runs','trains','sweats','grinds','climbs','stretches','builds','coaches','pushes','pulls','rows','boxes','jumps','spins','mobility','breathes','flows','recover'],
    adjectives: ['strong','lean','fit','ripped','shredded','tough','raw','dedicated','consistent','disciplined','focused','gritty','relentless','driven','unbothered','resting','lifting','running','climbing','rowing','hiking','bouldering'],
    objects: ['gym','weights','barbell','dumbbell','kettlebell','band','treadmill','track','mile','rep','set','lift','squat','bench','deadlift','muscle','gains','sweat','breath','heart','rate','calorie','protein','carb','meal','prep','rest','day','recovery','ice','bath','sauna','stretch','mobility','yoga','pilates','spin','climb','hike','run','race','finish','line'],
    nicheWords: ['fitness','fit','gym','training','coach','trainer','athlete','sport','reps','sets','cardio','strength','endurance','recovery','wellness','health','life','lifestyle','journey','progress','check-in','shred','bulk','cut','maintain']
  },
  food: {
    label: 'Food',
    names: NAMES_N,
    activities: ['cooks','bakes','eats','grills','roasts','plates','sips','pours','mixes','chops','simmers','sautees','whisks','kneads','ferments','picks','harvests','serves','shares','tries','reviews','rates','noms','devours'],
    adjectives: ['homemade','fresh','crispy','creamy','spicy','sweet','savory','tangy','smoky','rich','buttery','tender','crunchy','golden','slow','quick','easy','everyday','weekend','midnight','rainy','sunday','summer','winter','fall','spring','cozy','simple'],
    objects: ['kitchen','plate','bowl','pot','pan','oven','stove','knife','board','spoon','fork','whisk','spatula','recipe','ingredient','spice','herb','flour','sugar','salt','butter','oil','vinegar','honey','lemon','garlic','onion','tomato','cheese','cream','milk','yogurt','egg','chicken','beef','pork','fish','tofu','rice','pasta','noodle','bread','cake','cookie','pie','tart','brownie','latte','coffee','matcha','tea','wine','cocktail','mocktail','lemonade','smoothie','juice','water'],
    nicheWords: ['food','kitchen','cook','bake','eat','recipe','meal','dish','dinner','lunch','breakfast','snack','dessert','feast','bite','sips','serves','cookbook','cuisine','flavor','taste','homemade','fresh','whole','plantbased','vegan','vegetarian','keto','glutenfree','dairyfree','sugarfree','lowcarb','highprotein','spicy','sweet','savory','comfort','healthy','junk','street','home','weeknight']
  },
  travel: {
    label: 'Travel',
    names: NAMES_N,
    activities: ['travels','roams','wanders','explores','discovers','journeys','backpacks','treks','hikes','drives','flies','sails','navigates','passports','visas','commutes','moves','visits','stays','lives'],
    adjectives: ['slow','solo','digital','remote','budget','luxury','epic','endless','wild','free','nomad','minimal','curious','adventurous','local','hidden','offbeat','popular','crowded','empty','sunny','rainy','misty','snowy','windy','warm','cold','cool','hot','humid','dry'],
    objects: ['globe','map','compass','passport','ticket','suitcase','backpack','plane','train','bus','car','van','road','trail','path','horizon','sunset','sunrise','view','scenery','landscape','city','town','village','beach','mountain','island','forest','desert','ocean','reef','lake','river','waterfall','cave','temple','church','mosque','cathedral','castle','palace','museum','market','bazaar','cafe','restaurant','bar','hostel','hotel','airbnb','home','couch'],
    nicheWords: ['travel','trip','journey','adventure','wanderlust','explore','discover','roam','nomad','passport','visa','flight','tour','guide','itinerary','route','destination','city','country','state','local','hidden','offbeat','budget','backpack','solo','remote','digital','workation']
  },
  art: {
    label: 'Art',
    names: NAMES_N,
    activities: ['draws','paints','sketches','creates','illustrates','designs','crafts','carves','prints','inks','colors','textures','patterns','messes','plays','imagines','draws','paints','sculpts','weaves','stitches','embroiders','photographs'],
    adjectives: ['soft','raw','wild','quiet','bold','delicate','textured','layered','minimal','abstract','surreal','dreamy','vintage','modern','editorial','fine','folk','naive','playful','serious','moody','bright','pale','dark','earthy','saturated','washed','monochrome','multicolor'],
    objects: ['studio','gallery','canvas','paper','sketchbook','journal','brush','pen','pencil','palette','easel','frame','print','zine','mural','painting','drawing','sketch','sculpture','ceramic','clay','wood','metal','glass','textile','yarn','thread','fabric','paper','collage','print','monotype','litho','screenprint','engraving','etching','watercolor','gouache','acrylic','oil','pastel','charcoal','graphite','ink','marker','highlighter','color','hue','shade','tone','tint','wash','glaze','texture','pattern','line','curve','shape','form','figure','portrait','landscape','still','life','abstract','realism','surrealism','minimalism','maximalism','expressionism','impressionism','art','design','illustration','animation','comic','manga','graphic','poster','logo','type','lettering','typography'],
    nicheWords: ['art','draw','paint','sketch','create','make','craft','design','illustrate','studio','gallery','museum','exhibition','show','opening','collection','series','work','piece','daily','practice','study','pleinair','figure','portrait','landscape','abstract','realism','concept','commission','piece','drop','print','original','limited','edition','open','edition']
  },
  music: {
    label: 'Music',
    names: NAMES_N,
    activities: ['plays','sings','mixes','produces','records','samples','loops','jams','covers','remixes','composes','writes','performs','streams','releases','drops','spins','decks','cuts','scratches'],
    adjectives: ['loud','soft','raw','smooth','mellow','dark','bright','warm','cold','clean','heavy','dreamy','noisy','quiet','chill','hypnotic','catchy','gritty','distorted','reverbed','lofi','hifi','analog','digital','live','studio','acoustic','electric','unplugged','plugged'],
    objects: ['sound','beat','tune','note','chord','rhythm','vibe','mood','frequency','wave','amp','speaker','mic','headphone','vinyl','tape','cassette','cd','mix','track','song','album','ep','single','set','show','gig','session','concert','tour','stage','stage','room','studio','bedroom','basement','garage','attic','rooftop','radio','playlist','crate','set','b2b','back2back','opening','headline','closer','encore','intermission','soundcheck','loadin','loadout'],
    nicheWords: ['music','sound','beat','tune','song','track','album','ep','single','remix','cover','acoustic','electric','live','session','concert','show','gig','tour','open','mic','jam','beat','tape','producer','singer','songwriter','vocalist','instrumentalist','dj','band','artist','musician','sound','audio','frequency','wave','analog','digital','vintage','modern','experimental','underground','mainstream','indie','alt','pop','rock','rap','hiphop','rnb','soul','jazz','blues','folk','country','electronic','house','techno','trance','drum','bass','dubstep','trap','lofi','synthwave','ambient','classical','opera','choir','acoustic','unplugged','live','studio','bedroom','lofi','chill','study','workout','party']
  },
  photo: {
    label: 'Photography',
    names: NAMES_N,
    activities: ['shoots','snaps','frames','captures','develops','prints','scans','edits','curates','archives','exhibits','publishes','reviews','tries','films','clicks','captures','sees','frames','composes'],
    adjectives: ['soft','sharp','raw','moody','dreamy','vintage','analog','natural','available','golden','blue','rim','back','front','high','low','key','fill','hard','diffused','cinematic','editorial','documentary','street','portrait','landscape','fine','commercial','lifestyle','wedding','event','travel','nature','urban','rural','suburban','indoor','outdoor','studio','location','natural','available','mixed','warm','cool','neutral','vibrant','muted','desaturated','saturated','high','low','contrast','high','low','key','midtone','shadow','highlight','detail','grainy','smooth','textured','blurry','sharp','tack','crisp'],
    objects: ['lens','camera','film','frame','shot','print','negative','slide','scan','lightroom','darkroom','gallery','exhibition','zine','book','mood','light','shadow','color','grain','contrast','highlight','shadow','midtone','curve','grade','lens','prime','zoom','wide','tele','macro','fisheye','tilt','shift','filter','hood','cap','strap','bag','tripod','monopod','gimbal','drone','steadicam','ringlight','softbox','beauty','dish','umbrella','reflector','flag','gel','diffuser','bounce','gobo','background','seamless','backdrop','shoot','session','booking','client','gallery','proof','album','wedding','portrait','family','maternity','newborn','kid','pet','product','commercial','editorial','fashion','beauty','lifestyle','travel','food','architecture','interior','exterior','street','documentary','landscape','nature','wildlife','sports','event','concert','party','portrait','selfie','self','portrait'],
    nicheWords: ['photo','photography','film','analog','digital','lens','camera','shoot','snap','frame','shot','print','gallery','exhibition','zine','book','editorial','fine','art','commercial','lifestyle','travel','street','documentary','portrait','landscape','nature','wedding','maternity','family','kid','pet','product','food','architecture','interior','urban','rural','35mm','medium','format','large','format','instant','polaroid','cinestill','portra','ektar','tri-x','hp5','delta','trix','fp4','ilford','kodak','fuji','canon','nikon','sony','leica','fujifilm','hasselblad','mamiya','pentax','olympus','panasonic','sigma','tamron','zeiss','voigtlander','voigt','voigtlander','voigt','voigtlander']
  },
  tech: {
    label: 'Tech',
    names: NAMES_M,
    activities: ['codes','builds','ships','makes','creates','designs','develops','engineers','debugs','refactors','reviews','mentors','teaches','writes','streams','automates','scripts','tests','commits','merges','deploys','releases','documents','learns','shares'],
    adjectives: ['lean','clean','elegant','fast','scalable','modular','robust','reliable','simple','minimal','modern','classic','boring','solid','clean','tested','documented','typed','scripted','compiled','interpreted','declarative','imperative','functional','reactive','async','sync','sync','sync'],
    objects: ['code','stack','build','app','site','web','mobile','tool','lib','library','framework','package','module','function','class','method','api','sdk','cli','ide','editor','terminal','shell','git','repo','branch','commit','pr','merge','deploy','release','version','tag','npm','pip','cargo','brew','docker','kubernetes','vm','container','image','layer','volume','network','port','socket','server','client','request','response','route','endpoint','middleware','handler','controller','model','view','template','component','hook','state','store','context','provider','reducer','action','dispatch','event','emit','listener','promise','async','await','callback','thread','worker','queue','cache','cookie','session','token','jwt','auth','user','admin','dashboard','panel','console','log','error','warn','debug','info','trace','test','spec','unit','integration','e2e','coverage','lint','format','eslint','prettier','ci','cd','pipeline','workflow','runner','build','test','deploy','release','publish','changelog','readme','license','docs','wiki','guide','tutorial','example','demo','sample','boilerplate','starter','template','scaffold','skeleton','seed','fixture','mock','stub','spy','fake'],
    nicheWords: ['code','dev','build','ship','make','app','site','web','mobile','tool','tech','software','hardware','saas','paas','iaas','b2b','b2c','api','sdk','cli','open','source','closed','source','github','gitlab','bitbucket','vercel','netlify','cloudflare','aws','gcp','azure','digitalocean','heroku','railway','fly','supabase','firebase','postgres','mysql','mongo','redis','graphql','rest','grpc','react','vue','svelte','next','nuxt','remix','astro','solid','preact','qwik','lit','alpine','htmx','tailwind','css','scss','sass','less','postcss','vite','webpack','esbuild','rollup','parcel','swc','babel','tsc','ts','js','jsx','tsx','py','rb','go','rs','java','kt','swift','cs','cpp','c','sql','html','svg','png','jpg','webp','avif','mp4','webm','mov','pdf','md','mdx','txt','json','yaml','toml','xml','csv','tsv','env','gitignore','dockerfile','compose','yaml','yml','toml','json','lock']
  },
  gaming: {
    label: 'Gaming',
    names: NAMES_M,
    activities: ['plays','builds','speedruns','streams','clutches','grinds','games','queues','parties','squads','carries','drops','loots','quests','runs','discords'],
    adjectives: ['casual','tryhard','chill','sweaty','competitive','co-op','solo','duo','squad','5-stack','mid','elo','low','high','bronze','silver','gold','plat','diamond','master','grandmaster','challenger','radiant','immortal','top','bottom','mid','jungle','adc','sup','carry','tank','dps','healer','mage','rogue','warrior','paladin','ranger','monk','druid','warlock','shaman','hunter','priest','berserker','bard','ninja','samurai','pirate','cowboy','knight','lord','king','queen','prince','princess','dragon','phoenix','wolf','fox','hawk','bear','lion','tiger','shark','viper','cobra','mantis','scorpion'],
    objects: ['controller','headset','keyboard','mouse','setup','rig','monitor','chair','desk','stream','twitch','youtube','discord','tiktok','instagram','twitter','clips','highlight','play','run','speedrun','clutch','ace','team','squad','party','lobby','match','game','round','match','rank','ranked','casual','comp','competitive','elo','lp','mmr','kd','kda','kdr','w','l','win','loss','victory','defeat','pog','gg','ez','gl','hf','nt','ty','gj','wp','f','btw','tbh','imo','imho','lmao','lol','rofl','omg','wtf','sus','ratio','mid','cope','seethe','mald','cringe','based','chad','sigma','alpha','beta','omega','introvert','extrovert','ambivert'],
    nicheWords: ['gaming','gamer','plays','streams','twitch','streamer','youtube','content','clips','highlights','speedrun','ranked','casual','comp','clutch','squad','party','match','game','session','controller','keyboard','mouse','setup','rig','setup','gameplay','walkthrough','guide','tips','tutorial','review','first','impression','stream','vod','clip','reel','short','tiktok','youtube','twitch','discord','community','guild','clan','team','squad','party']
  },
  comedy: {
    label: 'Comedy',
    names: NAMES_N,
    activities: ['jokes','puns','memes','riffs','roasts','sketches','bits','improvs','reacts','tries','reviews','rates','jests','quips','snarks','snarks','snarks'],
    adjectives: ['funny','lol','lmao','dead','dying','crying','hilarious','cringe','corny','cheesy','dry','deadpan','witty','silly','goofy','dopey','wacky','nutty','batty','bonkers','cuckoo','daffy','barmy','bats','insane','kooky','loony','mad','nutty','screwy','wacky','whacky','awkward','random','chaotic','unhinged','feral','feral','feral'],
    objects: ['meme','joke','pun','gag','bit','sketch','scene','bit','punchline','setup','punchline','callback','tag','button','laugh','giggle','cackle','snort','snicker','titter','guffaw','hoot','yelp','yike','oof','cringe','sus','mid','ratio','cope','seethe','mald','chad','sigma','based','cringe','cringe','cringe'],
    nicheWords: ['comedy','funny','lol','joke','pun','meme','bit','sketch','standup','improv','skit','prank','reaction','try','not','try','review','tier','list','ranking','best','worst','funniest','cringe','based','ratio','cope','seethe','mald','chad','sigma','alpha','feral','unhinged','chaotic','random','dnd','tiktok','reel','short','clip','twitter','tweet','thread','story','post','content','creator','artist','writer','director','actor','actress','comedian','host','guest','panel','roast','burn','insult','compliment','backhanded','savage','light','friendly','family','workplace','observational','absurd','surreal','dark','dry','deadpan','witty','silly','goofy','dopey','wacky','nutty','batty','bonkers','cuckoo','daffy','barmy','bats','insane','kooky','loony','mad','nutty','screwy','wacky','whacky','awkward','random','chaotic','unhinged','feral']
  },
  education: {
    label: 'Education',
    names: NAMES_N,
    activities: ['teaches','tutors','studies','learns','reads','writes','explains','reviews','tests','quizzes','lectures','presents','shares','simplifies','breaks down','walks through','guides','mentors','coaches','advises'],
    adjectives: ['simple','clear','easy','quick','deep','thorough','beginner','intermediate','advanced','expert','master','basic','essential','fundamental','introductory','comprehensive','complete','full','crash','speed','fast','slow','visual','auditory','hands-on','practical','theoretical','applied','clinical','academic','scholarly','research','peer','reviewed'],
    objects: ['lesson','class','course','module','unit','topic','subject','field','domain','realm','sphere','chapter','section','part','piece','lecture','seminar','workshop','tutorial','guide','walkthrough','demo','example','sample','exercise','practice','problem','question','answer','solution','key','tip','trick','hack','shortcut','method','approach','strategy','framework','model','theory','concept','idea','principle','rule','law','formula','equation','proof','theorem','lemma','corollary','definition','axiom','postulate','hypothesis','thesis','argument','counterexample','exception','case','study','survey','review','meta','analysis','synthesis','comparison','contrast','evaluation','assessment','rubric','criteria','standard','benchmark','goal','objective','outcome','result','finding','conclusion','recommendation','suggestion','tip','warning','caution','note','aside','comment','remark','observation','insight','perspective','viewpoint','angle','lens','framework','lens'],
    nicheWords: ['study','learn','class','course','lesson','tutor','teacher','professor','lecture','school','college','university','academy','institute','education','learning','study','homework','assignment','exam','test','quiz','midterm','final','project','paper','essay','thesis','dissertation','research','reading','writing','math','science','history','english','language','art','music','pe','recess','lunch','cafeteria','library','gym','playground','classroom','desk','chair','board','chalk','marker','pen','pencil','notebook','binder','folder','textbook','workbook','calculator','ruler','compass','protractor','map','globe','atlas','dictionary','thesaurus','encyclopedia','wikipedia','google','youtube','khan','academy','coursera','udemy','edx','skillshare','masterclass','duolingo','quizlet','anki','notion','obsidian','roam','logseq','evernote','onenote','goodnotes','notability','marginnote','reader','books','articles','videos','podcasts','tutorials','courses','lessons','classes','workshops','seminars','lectures','office','hours','study','group','partner','mentor','tutor','coach','advisor','counselor','therapist','doctor','nurse','dentist','optometrist','vet','lawyer','accountant','engineer','architect','designer','developer','programmer','analyst','scientist','researcher','writer','editor','journalist','reporter','anchor','host','producer','director','actor','actress','musician','artist','chef','baker','bartender','barista','server','hostess','manager','owner','founder','ceo','cto','cfo','coo','vp','director','manager','lead','senior','junior','intern','contractor','freelancer','consultant','advisor','expert','specialist','generalist','ninja','rockstar','guru','wizard','master','apprentice','student','graduate','alumnus','alumna','phd','md','jd','mba','ms','ma','ba','bs','aa','as','certification','license','degree','diploma','certificate','award','honor','distinction','magna','cum','laude','suma','cum','laude','dean','list','president','vice','president','secretary','treasurer','board','committee','club','organization','society','association','union','guild','fellowship','fraternity','sorority','team','captain','co-captain','member','officer','leader','follower','supporter','fan','critic','skeptic','optimist','pessimist','realist','idealist','pragmatist','theorist','empiricist','rationalist','romantic','classic','modern','postmodern','ancient','medieval','renaissance','industrial','contemporary','present','future','past','current','recent','old','new','next','first','last','best','worst','most','least','more','less','fewer','many','much','some','any','all','none','every','each','both','either','neither','one','two','three','four','five','six','seven','eight','nine','ten','hundred','thousand','million','billion','trillion','dozen','score','gross','ream','chord','link','chain','tier','level','grade','rank','rate','ratio','proportion','percentage','fraction','decimal','integer','whole','natural','prime','composite','even','odd','positive','negative','zero','null','void','empty','full','half','quarter','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','hundredth','thousandth','millionth','billionth','trillionth']
  },
  lifestyle: {
    label: 'Lifestyle',
    names: NAMES_N,
    activities: ['lives','slows','mornings','evenings','days','nights','reads','writes','journals','reflects','practices','breathes','meditates','rests','cooks','cleans','organizes','curates','shares','blooms','grows'],
    adjectives: ['slow','soft','quiet','calm','cozy','simple','minimal','intentional','mindful','present','awake','aware','alive','balanced','centered','grounded','rooted','wild','free','open','honest','true','real','whole','easy','light','bright','sunny','warm','cool','cold','foggy','misty','rainy','snowy','windy','still','silent','peaceful','serene','tranquil','gentle','tender','caring','kind','patient','grateful','thankful','content','happy','joyful','hopeful','optimistic','curious','playful','fun','clean','fresh','vintage','classic','timeless','enduring','lasting','everyday','modern','digital','analog','unplugged','simple','slow','fast','now','today'],
    objects: ['morning','evening','night','day','week','weekend','minute','hour','moment','pause','breath','cup','bowl','plate','spoon','mug','book','page','chapter','verse','line','word','note','song','track','album','list','frame','wall','desk','chair','room','home','house','door','window','mirror','candle','lamp','light','plant','leaf','stem','root','bloom','petal','rose','fern','moss','vine','stone','shell','pebble','feather','stick','string','thread','ribbon','knot','bow','box','jar','bottle','tin','bag','tote','pouch','case','cover','blanket','pillow','cushion','mat','rug','towel','soap','brush','comb','water','tea','coffee','matcha','juice','wine','bread','cheese','fruit','honey','butter','salt','sugar','spice','herb','flower'],
    nicheWords: ['life','live','daily','morning','evening','night','slow','mindful','intentional','simple','cozy','calm','quiet','soft','present','everyday','routine','ritual','habit','practice','journal','reflect','share','bloom','grow','pause','breathe','reset','focus','time','moment']
  },
  business: {
    label: 'Business',
    names: NAMES_M,
    activities: ['builds','founds','leads','ships','scales','grows','sells','closes','partners','advises','mentors','coaches','consults','plans','executes','operates','manages','directs','funds','invests','launches','releases','sources','produces','delivers','fulfills','supports','serves','helps'],
    adjectives: ['lean','smart','fast','nimble','agile','scrappy','sustainable','profitable','efficient','productive','effective','impactful','meaningful','purposeful','mission','values','aligned','customer','data','driven','metric','strategic','tactical','operational','execution','delivery','product','growth','revenue','profit','cash','startup','scaleup','enterprise','public','private','bootstrap','funded','seed','series','early','later','global','local','regional','modern','classic','premium','luxury','accessible','inclusive','diverse','sustainable','green','clean','ethical','honest','transparent','open','simple','smart','focused','sharp','precise','clean','reliable','solid','strong','durable','lasting','enduring','proven','tested','trusted','respected','known','loved'],
    objects: ['startup','company','studio','lab','workshop','agency','firm','group','team','squad','unit','pod','dept','office','hq','base','camp','hub','center','shop','store','market','marketplace','platform','network','community','collective','guild','club','society','association','org','foundation','fund','trust','capital','venture','equity','stake','share','option','grant','partner','founder','ceo','cto','cfo','coo','lead','head','chief','director','manager','senior','junior','intern','contractor','freelancer','consultant','advisor','expert','specialist','generalist','employee','staff','worker','maker','builder','creator','designer','developer','engineer','scientist','researcher','writer','editor','analyst','planner','strategist','marketer','seller','operator','producer','supplier','vendor','client','customer','user','member','subscriber','follower','fan','reader','viewer','listener','player','buyer','seller','trader','broker','agent','rep','ambassador','advocate','evangelist'],
    nicheWords: ['build','found','lead','ship','scale','grow','sell','partner','advise','mentor','coach','consult','plan','execute','operate','manage','direct','fund','invest','launch','release','source','produce','deliver','fulfill','support','serve','help','startup','scaleup','enterprise','agency','studio','lab','firm','group','team','co','hq','works','collective','club','society','business','brand','company']
  }
};

// Vibe-driven patterns. Each vibe is a list of {slot} templates
// that get filled with words from the niche banks.
const vibes = {
  cool: {
    label: 'Cool',
    desc: 'short, sharp, two-word combos',
    patterns: [
      '{name}{number}',
      '{name}.{initial}',
      '{name}_{initial}',
      '{adjective}{name}',
      '{name}{adjective}',
      '{niche_word}{name}',
      '{name}{niche_word}',
      '{object}.{object}',
      '{object}{object}'
    ]
  },
  pro: {
    label: 'Professional',
    desc: 'name + role / niche keyword',
    patterns: [
      '{name}{activity}',
      '{activity}{name}',
      '{niche_word}by{name}',
      '{niche_word}with{name}',
      '{name}with{niche_word}',
      '{name}{niche_word}',
      '{niche_word}{name}',
      '{name}official',
      '{name}hq',
      '{name}co',
      '{name}studio',
      '{name}works',
      '{name}{niche_word}co',
      'the{name}{niche_word}',
      'real{name}'
    ]
  },
  funny: {
    label: 'Funny',
    desc: 'silly noun combos',
    patterns: [
      '{object}{object}',
      '{niche_word}{object}',
      '{object}{niche_word}',
      'the{name}{object}',
      '{name}and{name}',
      '{niche_word}with{name}',
      '{name}{number}',
      '{object}_{object}',
      '{name}.{object}',
      'big{name}',
      'lil{name}'
    ]
  },
  mystery: {
    label: 'Mysterious',
    desc: 'one short, hard word',
    patterns: [
      '{name}',
      '{name}{number}',
      '{name}.{initial}',
      '{adjective}{object}',
      '{object}{adjective}',
      '{initial}.{name}',
      '{name}_{number}',
      '{name}{initial}{number}'
    ]
  },
  cute: {
    label: 'Cute',
    desc: 'soft name + sweet object',
    patterns: [
      '{name}{object}',
      '{object}{name}',
      '{name}.{object}',
      '{object}.{name}',
      '{name}{number}',
      'lil{name}',
      'little{name}',
      '{name}bunny',
      '{name}pie',
      '{name}bear',
      '{name}doll',
      'sweet{name}',
      'dear{name}'
    ]
  },
  edgy: {
    label: 'Edgy',
    desc: 'raw mood + object',
    patterns: [
      '{adjective}{object}',
      '{object}{adjective}',
      '{adjective}.{object}',
      '{object}.{adjective}',
      'raw{name}',
      'cold{name}',
      'dark{name}',
      'no{name}',
      '{name}rage',
      '{name}raw',
      'not{name}'
    ]
  },
  chill: {
    label: 'Chill',
    desc: 'mood + soft object',
    patterns: [
      '{mood}{object}',
      '{object}{mood}',
      '{mood}.{object}',
      '{object}.{mood}',
      '{mood}_{object}',
      '{name}{mood}',
      '{mood}{name}',
      'soft{name}',
      'slow{name}',
      'quiet{name}',
      'still{name}',
      'calm{name}'
    ]
  },
  luxury: {
    label: 'Luxury',
    desc: 'premium name + luxe word',
    patterns: [
      '{name}atelier',
      '{name}maison',
      '{name}studio',
      '{name}co',
      '{name}official',
      '{name}luxe',
      '{mood}atelier',
      '{mood}maison',
      '{mood}studio',
      '{mood}co',
      'the{name}club',
      'the{name}society',
      '{name}.gold',
      '{name}.co'
    ]
  }
};

const platforms = {
  instagram: { label: 'Instagram', maxLen: 30, separator: 'either', allowed: ['.', '_', ''] },
  youtube:   { label: 'YouTube',   maxLen: 100, separator: 'space', allowed: [' '] },
  tiktok:    { label: 'TikTok',    maxLen: 24, separator: 'either', allowed: ['.', '_', ''] },
  x:         { label: 'X / Twitter',maxLen: 15, separator: 'none', allowed: [''] },
  twitch:    { label: 'Twitch',    maxLen: 25, separator: 'none', allowed: [''] },
  discord:   { label: 'Discord',   maxLen: 32, separator: 'none', allowed: [''] },
  github:    { label: 'GitHub',    maxLen: 39, separator: 'dash', allowed: ['-'] },
  generic:   { label: 'Any social',maxLen: 50, separator: 'either', allowed: ['.', '_', ''] }
};

// =============================================================
// Helper: build the handle generator HTML
// =============================================================
function buildHandleGenerator() {
  const data = {
    defaults: { count: 12 },
    banks: { niches, vibes, platforms, namesF: NAMES_F, namesM: NAMES_M, namesN: NAMES_N, smallNums: SMALL_NUMS, moods: MOODS, objects: OBJECTS }
  };
  // JSON.stringify with </script> guard
  const dataJson = JSON.stringify(data, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Social Handle Generator - Instagram, YouTube, TikTok, X Username Ideas</title>
<meta name="description" content="Free social media handle generator for Instagram, YouTube, TikTok, X, Twitch, Discord, and GitHub. Answer 4 quick questions about your channel and get 12 real username ideas (first name + niche, mood + object, etc.) that people actually use." />
<meta name="theme-color" content="#0f1115" />
<link rel="canonical" href="https://nameswiftgenerator.com/handle-generator" />
<meta property="og:title" content="Social Handle Generator - Instagram, YouTube, TikTok, X" />
<meta property="og:description" content="Get 12 real social media username ideas for your channel. Built for creators, gamers, streamers, and indie hackers." />
<meta property="og:type" content="website" />
<link rel="stylesheet" href="assets/css/style.css" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Social Handle Generator",
  "url": "https://nameswiftgenerator.com/handle-generator",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any (browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "Free social media handle generator with niche + vibe + length customization."
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "How do I come up with a good social media username?",
     "acceptedAnswer": {"@type": "Answer", "text": "Start with your first name or nickname. Pick your niche (fashion, beauty, fitness, food, travel, art, music, photography, tech, gaming, comedy, education, lifestyle, business). Combine the two with a common pattern: name + activity (cookingwithsam), name + niche word (miaskincare), mood + object (softbloom), or a small meaningful number (liv_04). Keep it under 15 characters for X, 24 for TikTok, 30 for Instagram."}},
    {"@type": "Question", "name": "How do I check if a username is available?",
     "acceptedAnswer": {"@type": "Answer", "text": "For Instagram, TikTok, X, and Twitch, paste your generated handle into the platform's sign-up or search. For YouTube, the handle is the same as your channel name, so check on YouTube. For Discord, the username is separate from the display name."}},
    {"@type": "Question", "name": "Can I use these names commercially?",
     "acceptedAnswer": {"@type": "Answer", "text": "Yes - all generated names are provided for creative use. Note that the actual availability on each platform is determined by the platform's sign-up system, so always verify before launching your account or brand."}},
    {"@type": "Question", "name": "Are these handles likely to be available?",
     "acceptedAnswer": {"@type": "Answer", "text": "We generate uncommon combinations of first names, activity verbs, niche keywords, mood adjectives, and aesthetic objects, so most suggestions are likely available. We can't check every platform in real time, so the names show a 'likely available' indicator based on uniqueness, not a live check."}},
    {"@type": "Question", "name": "What's the difference between a handle and a display name?",
     "acceptedAnswer": {"@type": "Answer", "text": "The handle is your unique @username (no spaces, used in URLs and mentions). The display name is the readable name shown next to your posts. You usually set both, and they can be different versions of the same idea."}}
  ]
}
</script>
</head>
<body>
<header class="site-header">
  <div class="container nav-row">
    <a class="brand" href="index.html"><span class="mark">N</span><span>NameSwift</span></a>
    <nav class="nav-links" aria-label="Primary">
      <a href="index.html">Home</a>
      <a href="elf-name-generator.html">Elf</a>
      <a href="dnd-elf-names.html">D&amp;D</a>
      <a href="gamertag-generator.html">Gamertag</a>
      <a href="about.html">About</a>
    </nav>
    <button class="theme-toggle" data-theme-toggle aria-label="Toggle dark mode"><span aria-hidden="true">&#9788;</span><span>Theme</span></button>
    <button class="menu-toggle" data-menu-toggle aria-label="Open menu">&#9776;</button>
  </div>
  <div class="container mobile-menu" data-mobile-menu>
    <a href="index.html">Home</a>
    <a href="handle-generator.html">Handle Generator</a>
    <a href="gamertag-generator.html">Gamertag</a>
    <a href="username-generator.html">Username</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  </div>
</header>

<main>
  <section class="hero">
    <div class="container">
      <h1>Social Handle Generator</h1>
      <p>Get 12 real social media username ideas for Instagram, YouTube, TikTok, X, Twitch, Discord, and GitHub. Tell us your name, pick your niche and vibe, and we'll do the rest. Names use the patterns real creators actually pick - first name + niche, mood + object, soft compound words - not random combat syllables.</p>
    </div>
  </section>

  <div class="container">
    <div class="gen-card">
      <form id="handle-form" autocomplete="off">
        <div class="handle-grid">
          <div class="handle-field">
            <label for="hf-platform">Platform</label>
            <select id="hf-platform" name="platform">
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="x">X / Twitter</option>
              <option value="twitch">Twitch</option>
              <option value="discord">Discord</option>
              <option value="github">GitHub</option>
              <option value="generic">Any social</option>
            </select>
          </div>
          <div class="handle-field">
            <label for="hf-niche">What is your channel about?</label>
            <select id="hf-niche" name="niche">
              ${Object.entries(niches).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="handle-field">
            <label for="hf-vibe">What is your vibe?</label>
            <select id="hf-vibe" name="vibe">
              ${Object.entries(vibes).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="handle-field">
            <label for="hf-length">How long should it be?</label>
            <select id="hf-length" name="length">
              <option value="short">Short (under 10 chars)</option>
              <option value="medium" selected>Medium (10-18 chars)</option>
              <option value="long">Long (18+ chars)</option>
            </select>
          </div>
          <div class="handle-field handle-field-wide">
            <label for="hf-topic">Optional: a word to include in every name (e.g. "espresso", "arcade", "fern")</label>
            <input id="hf-topic" name="topic" type="text" maxlength="20" placeholder="leave blank to use first names from our pool" />
          </div>
          <div class="handle-field handle-field-wide">
            <label for="hf-seed">Optional: a first name or nickname to use (e.g. "maya", "max")</label>
            <input id="hf-seed" name="seed" type="text" maxlength="20" placeholder="leave blank for random first names" />
          </div>
        </div>
        <div class="generate-row" style="margin-top: 18px;">
          <button type="submit" class="btn-primary">Generate handles</button>
          <button type="button" class="btn-secondary" id="handle-surprise">Surprise me</button>
          <span class="muted" style="margin-left:auto; font-size:0.85rem;">12 fresh ideas, instantly</span>
        </div>
      </form>
      <div class="results" id="results" aria-live="polite" style="margin-top:24px;"></div>
    </div>

    <div class="ad-slot" data-id="ad-below-results" aria-label="Advertisement"></div>

    <article class="article">
      <h2>How to use this handle generator</h2>
      <ol>
        <li>Pick your platform (Instagram, YouTube, TikTok, X, Twitch, Discord, GitHub, or any social).</li>
        <li>Tell us what your channel is about (fashion, beauty, fitness, food, travel, art, music, photography, tech, gaming, comedy, education, lifestyle, or business).</li>
        <li>Pick the vibe that matches your personality (cool, professional, funny, mysterious, cute, edgy, chill, or luxury).</li>
        <li>Choose a length - short (under 10 chars), medium (10-18 chars), or long (18+ chars).</li>
        <li>(Optional) Add a word you want in every name and/or your first name to personalize.</li>
        <li>Hit <strong>Generate handles</strong> for 12 fresh username ideas. Or hit <strong>Surprise me</strong> to randomize all the answers.</li>
        <li>Tap the copy icon to copy a handle you like, then paste it into your platform to check availability.</li>
      </ol>

      <h2>How to pick a great social media username</h2>
      <p>A good social media handle does three things: it tells people what your content is, it sticks in their head, and it stays available across platforms. This handle generator combines 14 niche categories with 8 vibes to produce uncommon combinations that are likely to be available.</p>
      <p>The names use the patterns real creators actually pick: <strong>first name + niche</strong> (e.g. <em>cookingwithsam</em>), <strong>name + activity</strong> (e.g. <em>chef.aria</em>), <strong>mood + object</strong> (e.g. <em>softbloom</em>), <strong>the/hey/its/by/get/try + name</strong> (e.g. <em>heymia</em>), and <strong>name + small meaningful number</strong> (e.g. <em>liv_04</em>). No random combat syllables, no fantasy words.</p>

      <h2>Length rules by platform</h2>
      <ul>
        <li><strong>X / Twitter:</strong> 15 characters max. Go with <em>Short</em> or <em>Medium</em>.</li>
        <li><strong>TikTok:</strong> 24 characters max. <em>Short</em> or <em>Medium</em> works best.</li>
        <li><strong>Instagram:</strong> 30 characters max, allows underscores and periods. <em>Medium</em> is the sweet spot.</li>
        <li><strong>Twitch:</strong> 25 characters max, lowercase only. <em>Short</em> or <em>Medium</em>.</li>
        <li><strong>YouTube:</strong> 100 characters max, allows spaces and capitalisation. <em>Long</em> is fine here.</li>
        <li><strong>Discord:</strong> 32 characters max for the username. <em>Short</em> or <em>Medium</em>.</li>
        <li><strong>GitHub:</strong> 39 characters max, allows hyphens. <em>Medium</em> or <em>Long</em>.</li>
      </ul>

      <h2>Real handle patterns by vibe</h2>
      <ul>
        <li><strong>Cool</strong> - short and sharp: <em>liv.04</em>, <em>quietkai</em>, <em>nova.dawn</em></li>
        <li><strong>Professional</strong> - name + role: <em>cookingwithsam</em>, <em>chef.aria</em>, <em>designbymaya</em>, <em>mia.skincare</em></li>
        <li><strong>Funny</strong> - silly combos: <em>wafflelord</em>, <em>noodlebrain</em>, <em>big.maya</em></li>
        <li><strong>Mysterious</strong> - one short word: <em>vex</em>, <em>nyx</em>, <em>flux</em>, <em>kai</em></li>
        <li><strong>Cute</strong> - sweet + name: <em>lunabunny</em>, <em>peachyrose</em>, <em>sweet.olivia</em></li>
        <li><strong>Edgy</strong> - raw mood + object: <em>rawink</em>, <em>coldsteel</em>, <em>not.maya</em></li>
        <li><strong>Chill</strong> - soft + object: <em>softbloom</em>, <em>quietcloud</em>, <em>calm.kai</em></li>
        <li><strong>Luxury</strong> - premium + name: <em>velvetatelier</em>, <em>mia.maison</em>, <em>the.gold.club</em></li>
      </ul>

      <h2>After you generate a name you like</h2>
      <ol>
        <li>Copy the handle with the copy button</li>
        <li>Paste it into the platform's sign-up or username-change form</li>
        <li>If it's taken, hit <strong>Generate handles</strong> again for 12 new options</li>
        <li>Once you secure it on one platform, register the same name on the others to build a consistent brand</li>
      </ol>

      <div class="faq">
        <h2>Frequently asked questions</h2>
        <details><summary>How do I come up with a good social media username?</summary><p>Start with your first name or nickname. Pick your niche (fashion, beauty, fitness, food, travel, art, music, photography, tech, gaming, comedy, education, lifestyle, or business). Combine the two with a common pattern: name + activity (cookingwithsam), name + niche word (miaskincare), mood + object (softbloom), or a small meaningful number (liv_04). Keep it under 15 characters for X, 24 for TikTok, 30 for Instagram.</p></details>
        <details><summary>How do I check if a username is available?</summary><p>For Instagram, TikTok, X, and Twitch, paste your generated handle into the platform's sign-up or search. For YouTube, the handle is the same as your channel name, so check on YouTube. For Discord, the username is separate from the display name.</p></details>
        <details><summary>Can I use these names commercially?</summary><p>Yes - all generated names are provided for creative use. Note that the actual availability on each platform is determined by the platform's sign-up system, so always verify before launching your account or brand.</p></details>
        <details><summary>Are these handles likely to be available?</summary><p>We generate uncommon combinations of first names, activity verbs, niche keywords, mood adjectives, and aesthetic objects, so most suggestions are likely available. We can't check every platform in real time, so the names show a 'likely available' indicator based on uniqueness, not a live check.</p></details>
        <details><summary>What's the difference between a handle and a display name?</summary><p>The handle is your unique @username (no spaces, used in URLs and mentions). The display name is the readable name shown next to your posts. You usually set both, and they can be different versions of the same idea.</p></details>
        <details><summary>Should my Instagram handle match my TikTok handle?</summary><p>Yes, ideally. A consistent handle across platforms makes it easier for fans to find you everywhere. Use the <em>Surprise me</em> button until you find one you like, then register it on every platform you use.</p></details>
        <details><summary>What's a good username for a private/personal account vs a public/creator account?</summary><p>For a personal account, lean into your own name or a nickname (e.g. <em>maya.r</em> or <em>max_22</em>). For a public creator account, lean into your niche + vibe so the handle communicates your content at a glance (e.g. <em>cookingwithsam</em> for a food channel).</p></details>
      </div>
    </article>

    <div class="ad-slot" data-id="ad-in-content" aria-label="Advertisement"></div>

    <div class="cross-links">
      <h3>Related generators</h3>
      <a href="gamertag-generator.html">Gamertag Generator</a>
      <a href="username-generator.html">Username Generator</a>
      <a href="elf-name-generator.html">Elf Name Generator</a>
      <a href="dwarf-name-generator.html">Dwarf Name Generator</a>
      <a href="witch-name-generator.html">Witch Name Generator</a>
      <a href="world-of-warcraft-name-generator.html">World of Warcraft Names</a>
      <a href="index.html">All generators</a>
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="container footer-row">
    <div>&copy; <span id="yr"></span> NameSwift. Names are provided for creative use.</div>
    <div class="footer-links">
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </div>
</footer>

<script>
window.NF_HANDLE_DATA = ${dataJson};
</script>
<script src="assets/js/handle.js" defer></script>
<script>
  document.getElementById("yr").textContent = new Date().getFullYear();
</script>
<script src="assets/js/app.js" defer></script>
</body>
</html>`;
}

// =============================================================
// build-handle.js (the generator engine for the handle page)
//   - Template-based: each vibe has a list of {slot} patterns
//   - Slots: {name}, {number}, {initial}, {adjective}, {object},
//            {niche_word}, {activity}, {mood}
// =============================================================
function buildHandleJS() {
  return `/* handle.js
   Realistic social-handle generator.
   Uses first names, activity verbs, niche words, mood adjectives, and
   aesthetic objects combined with platform-aware patterns. Generates
   names that look like real Instagram, TikTok, YouTube, X, Twitch,
   Discord, and GitHub handles.
*/
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function initialOf(name) { return name ? name.charAt(0).toLowerCase() : ''; }
  function lc(s) { return s ? s.toLowerCase() : s; }
  function slug(s) { return lc(s).replace(/[^a-z0-9]+/g, ''); }
  function trim(s, n) { return s ? s.slice(0, n) : s; }

  // Find a word in a bank that fits within \`maxLen\` after slugging,
  // and is at least 3 chars (filters out single letters like "r", "s", "j").
  function pickFitting(bank, maxLen) {
    for (let i = 0; i < 12; i++) {
      const w = pick(bank);
      const sw = slug(w);
      if (sw.length >= 3 && sw.length <= maxLen) return w;
    }
    // Fallback: any word that slugs to at least 3 chars
    for (let i = 0; i < 8; i++) {
      const w = pick(bank);
      if (slug(w).length >= 3) return w;
    }
    return '';
  }

  // Fill a {slot} template with a word from the matching bank
  function fillSlot(slot, ctx) {
    const d = ctx.data;
    const niche = d.banks.niches[ctx.niche];
    if (!niche) return '';
    switch (slot) {
      case 'name': {
        // Use seed if provided, else use a name from the niche's first-name pool
        if (ctx.seed) return slug(ctx.seed);
        return pickFitting(niche.names, 10);
      }
      case 'initial':
        return initialOf(ctx.seed || pick(niche.names));
      case 'number':
        return pick(d.banks.smallNums);
      case 'adjective':
        return pickFitting(niche.adjectives, 8);
      case 'object':
        // If user provided a topic, prefer to use it as object slot
        if (ctx.topic) return slug(ctx.topic);
        return pickFitting(niche.objects, 10);
      case 'niche_word':
        return pickFitting(niche.nicheWords, 10);
      case 'activity':
        return pickFitting(niche.activities, 10);
      case 'mood':
        return pickFitting(d.banks.moods, 6);
      default:
        return '';
    }
  }

  // Apply the platform's separator style to a candidate string
  function applySeparator(parts, platform, allowed, fallback) {
    // \`parts\` is an array of words. We join them using a separator.
    const sep = pick(allowed);
    if (sep === ' ' || sep === 'space') {
      return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    if (sep === 'dash' || sep === '-') {
      return parts.join('-');
    }
    if (sep === 'either') {
      // random between dot, underscore, nothing
      const opts = ['.', '_', ''];
      const chosen = pick(opts);
      if (chosen === '') return parts.join('');
      return parts.join(chosen);
    }
    return parts.join(sep);
  }

  // Pick a separator respecting Instagram's no-leading/trailing-dot rules
  function pickSeparator(allowed, candidate) {
    let sep = pick(allowed);
    if (sep === '.' || sep === '_' || sep === '-') {
      // Ensure we don't end or start with a separator
      while (candidate.startsWith(sep) || candidate.endsWith(sep)) {
        candidate = candidate.replace(new RegExp('^\\\\' + sep), '').replace(new RegExp('\\\\' + sep + '$'), '');
      }
    }
    return candidate;
  }

  // Main build function
  function buildHandle() {
    const data = window.NF_HANDLE_DATA;
    if (!data) return [];

    const platform = $("#hf-platform").value;
    const niche = $("#hf-niche").value;
    const vibe = $("#hf-vibe").value;
    const length = $("#hf-length").value;
    const topicRaw = ($("#hf-topic").value || "").trim();
    const topic = topicRaw ? slug(topicRaw) : '';
    const seedRaw = ($("#hf-seed").value || "").trim();
    const seed = seedRaw ? slug(seedRaw) : '';

    const v = data.banks.vibes[vibe];
    const pMeta = data.banks.platforms[platform] || data.banks.platforms.generic;
    if (!v) return [];

    // Length -> target max length
    const wantMax = length === 'short' ? 10 : (length === 'medium' ? 18 : 30);
    const wantMin = length === 'short' ? 3 : (length === 'medium' ? 8 : 14);
    const maxLen = Math.min(wantMax, pMeta.maxLen);

    const ctx = { data, niche, vibe, topic, seed };

    const out = [];
    const seen = new Set();
    let safety = 0;
    while (out.length < data.defaults.count && safety < data.defaults.count * 30) {
      safety++;
      const pattern = pick(v.patterns);
      // Fill each slot, slugging each one individually so the literal separator in the template survives
      const filled = pattern.replace(/\\{([a-z_]+)\\}/g, (m, slot) => {
        const w = fillSlot(slot, ctx);
        return slug(w);
      });
      if (!filled) continue;

      let candidate = filled;

      // Platform-specific separator handling
      if (platform === 'youtube') {
        // Replace . _ - with spaces, then title-case each word
        candidate = candidate.replace(/[._-]+/g, ' ').trim();
        candidate = candidate.split(/\\s+/).filter(Boolean).map(function (w) {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');
      } else if (platform === 'github') {
        // Convert . and _ to -
        candidate = candidate.replace(/\\./g, '-').replace(/_/g, '-');
        candidate = candidate.replace(/-{2,}/g, '-');
      } else if (platform === 'x' || platform === 'twitch' || platform === 'discord') {
        // Strip dots and underscores (X/Twitch/Discord don't allow them)
        candidate = candidate.replace(/[._]/g, '');
      }
      // IG, TikTok, generic: keep as-is

      // Trim to max length
      if (candidate.length > maxLen) candidate = candidate.slice(0, maxLen);

      // Strip leading/trailing separators
      candidate = candidate.replace(/^[._-]+/, '').replace(/[._-]+$/, '');
      // Collapse double separators
      candidate = candidate.replace(/[._-]{2,}/g, '.');
      // Re-strip any new edge separators after collapsing
      candidate = candidate.replace(/^[._-]+/, '').replace(/[._-]+$/, '');

      // Min length check
      if (length === 'short' && candidate.length < wantMin) continue;
      if (candidate.length < 3) continue;

      if (seen.has(candidate.toLowerCase())) continue;
      seen.add(candidate.toLowerCase());
      out.push(candidate);
    }
    return out;
  }

  // For YouTube, the engine already produces "Title Case With Spaces" so we
  // just return as-is. For other platforms, return as-is.
  function formatFor(name, platform) {
    return name;
  }

  function renderResults(names) {
    const grid = $("#results");
    if (!grid) return;
    grid.innerHTML = "";
    if (!names.length) {
      grid.innerHTML = '<p class="muted">No handles yet. Try a different niche, vibe, or length and hit Generate again.</p>';
      return;
    }
    const platform = $("#hf-platform").value;
    const platformLabel = (window.NF_HANDLE_DATA.banks.platforms[platform] || {}).label || "Social";
    names.forEach(name => {
      const display = formatFor(name, platform);
      const card = document.createElement("article");
      card.className = "name-card";
      card.setAttribute("data-name", display);
      card.innerHTML = \`
        <div class="name-head">
          <div class="name-text"></div>
          <div style="display:flex; gap:2px;">
            <button class="icon-btn copy-btn" title="Copy" aria-label="Copy handle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        </div>
        <div class="name-meta">\${platformLabel} \u00b7 likely available</div>
      \`;
      card.querySelector(".name-text").textContent = display;
      card.querySelector(".copy-btn").addEventListener("click", (e) => {
        const btn = e.currentTarget;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(display);
        } else {
          const ta = document.createElement("textarea");
          ta.value = display; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta);
        }
        const toast = document.createElement("span");
        toast.className = "toast";
        toast.textContent = "Copied";
        btn.style.position = "relative";
        btn.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 200); }, 1100);
      });
      grid.appendChild(card);
    });
  }

  function init() {
    const form = $("#handle-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      renderResults(buildHandle());
    });
    const surprise = $("#handle-surprise");
    if (surprise) {
      surprise.addEventListener("click", () => {
        const niches = Object.keys(window.NF_HANDLE_DATA.banks.niches);
        const vibes = Object.keys(window.NF_HANDLE_DATA.banks.vibes);
        const platforms = Object.keys(window.NF_HANDLE_DATA.banks.platforms);
        const lengths = ["short","medium","long"];
        $("#hf-platform").value = platforms[Math.floor(Math.random() * platforms.length)];
        $("#hf-niche").value = niches[Math.floor(Math.random() * niches.length)];
        $("#hf-vibe").value = vibes[Math.floor(Math.random() * vibes.length)];
        $("#hf-length").value = lengths[Math.floor(Math.random() * lengths.length)];
        $("#hf-topic").value = "";
        $("#hf-seed").value = "";
        renderResults(buildHandle());
      });
    }
    // Initial generation on load
    renderResults(buildHandle());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
`;
}

// =============================================================
// CSS additions for the handle form
// =============================================================
function appendHandleCSS() {
  const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
  let css = fs.readFileSync(cssPath, 'utf8');

  const block = `
/* ====== Handle generator form ====== */
.handle-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 720px) {
  .handle-grid { grid-template-columns: 1fr 1fr; }
}
.handle-field { display: flex; flex-direction: column; gap: 6px; }
.handle-field-wide { grid-column: 1 / -1; }
.handle-field label {
  font-family: var(--font-display);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 700;
}
.handle-field select,
.handle-field input[type="text"] {
  background: var(--bg-elev-2);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 1rem;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.handle-field select { padding-right: 36px; background-image: linear-gradient(45deg, transparent 50%, var(--text-dim) 50%), linear-gradient(135deg, var(--text-dim) 50%, transparent 50%); background-position: calc(100% - 18px) 50%, calc(100% - 12px) 50%; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; }
.handle-field input[type="text"] { cursor: text; }
.handle-field select:focus,
.handle-field input[type="text"]:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.handle-field select:hover,
.handle-field input[type="text"]:hover { border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); }
`;

  if (!css.includes('/* ====== Handle generator form ====== */')) {
    css += block;
    fs.writeFileSync(cssPath, css);
    return true;
  }
  return false;
}

// =============================================================
// build SEO content page (shared by best-gaming-names + instagram)
// =============================================================
function buildSEOPage(opts) {
  const { slug, title, metaDesc, h1, intro, sections, faqs, relatedLinks, jsonLd } = opts;
  const head = JSON.stringify(jsonLd, null, 2);
  const related = relatedLinks.map((r) => `<a href="${r.href}">${r.label}</a>`).join('\n        ');
  const faqItems = faqs.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n        ');
  const sectionHTML = sections.map((s) => `<h2>${s.h2}</h2>\n${s.body}`).join('\n\n      ');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${metaDesc}" />
<meta name="theme-color" content="#0f1115" />
<link rel="canonical" href="https://nameswiftgenerator.com/${slug}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${metaDesc}" />
<meta property="og:type" content="article" />
<link rel="stylesheet" href="assets/css/style.css" />
<script type="application/ld+json">
${head}
</script>
</head>
<body>
<header class="site-header">
  <div class="container nav-row">
    <a class="brand" href="index.html"><span class="mark">N</span><span>NameSwift</span></a>
    <nav class="nav-links" aria-label="Primary">
      <a href="index.html">Home</a>
      <a href="elf-name-generator.html">Elf</a>
      <a href="dnd-elf-names.html">D&amp;D</a>
      <a href="gamertag-generator.html">Gamertag</a>
      <a href="about.html">About</a>
    </nav>
    <button class="theme-toggle" data-theme-toggle aria-label="Toggle dark mode"><span aria-hidden="true">&#9788;</span><span>Theme</span></button>
    <button class="menu-toggle" data-menu-toggle aria-label="Open menu">&#9776;</button>
  </div>
  <div class="container mobile-menu" data-mobile-menu>
    <a href="index.html">Home</a>
    <a href="${slug}">${h1}</a>
    <a href="handle-generator.html">Handle Generator</a>
    <a href="gamertag-generator.html">Gamertag</a>
    <a href="about.html">About</a>
  </div>
</header>

<main>
  <section class="hero">
    <div class="container">
      <h1>${h1}</h1>
      <p>${intro}</p>
    </div>
  </section>

  <div class="container">
    <div class="ad-slot" data-id="ad-below-results" aria-label="Advertisement"></div>

    <article class="article">
      ${sectionHTML}

      <div class="faq">
        <h2>Frequently asked questions</h2>
        ${faqItems}
      </div>
    </article>

    <div class="ad-slot" data-id="ad-in-content" aria-label="Advertisement"></div>

    <div class="cross-links">
      <h3>Related generators</h3>
        ${related}
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="container footer-row">
    <div>&copy; <span id="yr"></span> NameSwift. Names are provided for creative use.</div>
    <div class="footer-links">
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </div>
</footer>

<script>
  document.getElementById("yr").textContent = new Date().getFullYear();
</script>
<script src="assets/js/app.js" defer></script>
</body>
</html>`;
}

// =============================================================
// Build "Best Gaming Names" page
// =============================================================
function buildBestGamingNames() {
  const gamingNames = [
    "shadowslayer", "voidwalker", "ravenking", "ironwolf", "stormbreaker", "nightshade",
    "frostfang", "bloodmoon", "grimhunter", "dreadhowl", "venomshade", "ashbringer",
    "phantomrider", "chaosking", "doomcaller", "ironvanguard", "nightreaper", "soulreaver",
    "deathbringer", "crimsonknight", "shadowstrike", "voidhunter", "thunderfang", "wolfbane",
    "stormcaller", "bloodhunter", "dreadknight", "frostreaver", "ironclad", "shadowfang",
    "demonhunter", "nightshifter", "ashwalker", "soulstealer", "chaosrider", "grimreaper",
    "ironhowl", "stormhowl", "frostwolf", "shadestepper", "thunderwolf", "doomcrown",
    "ravenhowl", "venomfang", "nightfang", "ironpelt", "frosthunter", "grimfang",
    "stormshade", "bloodseeker", "soulrender", "crimsonfang", "voidcrown", "shadowblade"
  ];

  return buildSEOPage({
    slug: "best-gaming-names",
    title: "Best Gaming Names for 2026 - 50+ Cool Gamertag Ideas",
    metaDesc: "Looking for the best gaming names for 2026? Browse 50+ cool gamertag ideas organized by style (cool, funny, edgy, anime). Includes a free gamertag generator and tips for choosing a name that sticks.",
    h1: "Best Gaming Names for 2026",
    intro: "50+ cool gamertag ideas organized by style, with tips for picking a name that sticks. Whether you're a casual PS5 player, a ranked Valorant grinder, or a Minecraft builder, this list has something for you.",
    sections: [
      {
        h2: "Quick picks - 20 of the best gaming names right now",
        body: `<ul>
        <li><span class="example-name">shadowslayer</span> - sounds like a stealth assassin in any game</li>
        <li><span class="example-name">voidwalker</span> - mysterious, works for any genre</li>
        <li><span class="example-name">ravenking</span> - a little dark, a little royal</li>
        <li><span class="example-name">ironwolf</span> - the wolf pack vibes</li>
        <li><span class="example-name">stormbreaker</span> - feels like a Thor moment</li>
        <li><span class="example-name">nightshade</span> - elegant and dangerous</li>
        <li><span class="example-name">frostfang</span> - ice dragon energy</li>
        <li><span class="example-name">bloodmoon</span> - gothic, atmospheric</li>
        <li><span class="example-name">grimhunter</span> - doom slayer energy</li>
        <li><span class="example-name">dreadhowl</span> - werewolf vibes without trying</li>
        <li><span class="example-name">venomshade</span> - anti-hero, perfect for rogue mains</li>
        <li><span class="example-name">ashbringer</span> - paladin class, light-themed</li>
        <li><span class="example-name">phantomrider</span> - ghost in the shell</li>
        <li><span class="example-name">chaosking</span> - every MOBA main ever</li>
        <li><span class="example-name">doomcaller</span> - sounds like a boss fight</li>
        <li><span class="example-name">ironvanguard</span> - first-in-the-team vibes</li>
        <li><span class="example-name">nightreaper</span> - spooky without being try-hard</li>
        <li><span class="example-name">soulreaver</span> - demon souls main</li>
        <li><span class="example-name">deathbringer</span> - the "I'm the main character" energy</li>
        <li><span class="example-name">crimsonknight</span> - red knight, dark fantasy</li>
        </ul>`
      },
      {
        h2: "Cool gaming names (8 picks)",
        body: `<p>These names sound like they belong on a Twitch stream with 50k viewers. The trick: short, hard consonants, one sharp word.</p>
        <ul>
        <li><span class="example-name">xraven</span> - one letter, one word, infinite edge</li>
        <li><span class="example-name">primefang</span> - elite + danger</li>
        <li><span class="example-name">apexdoom</span> - sounds like a final boss</li>
        <li><span class="example-name">vexed</span> - one word, full attitude</li>
        <li><span class="example-name">grimzero</span> - number gives it weight</li>
        <li><span class="example-name">shade</span> - one word, one vibe</li>
        <li><span class="example-name">vanta</span> - feels like the inside of a stealth suit</li>
        <li><span class="example-name">hex</span> - three letters, one thousand hours played</li>
        </ul>`
      },
      {
        h2: "Funny gaming names (8 picks)",
        body: `<p>For when you want to be memorable without being scary. These work great on casual co-op nights and Discord servers.</p>
        <ul>
        <li><span class="example-name">npcenergy</span> - self-aware loot goblin</li>
        <li><span class="example-name">lagwitch</span> - blaming the wifi, always</li>
        <li><span class="example-name">crouchingsimpson</span> - the classic</li>
        <li><span class="example-name">altf4champ</span> - for the rage-quitters</li>
        <li><span class="example-name">potionhoarder</span> - never shares</li>
        <li><span class="example-name">lagspike</span> - you'll always be the one complaining about lag</li>
        <li><span class="example-name">gitgud</span> - tired but true</li>
        <li><span class="example-name">susmage</span> - multiplayer detective</li>
        </ul>`
      },
      {
        h2: "Edgy gaming names (8 picks)",
        body: `<p>For horror games, souls-likes, and the kind of usernames that get you killed first in Among Us.</p>
        <ul>
        <li><span class="example-name">dreadmoth</span> - genuinely unsettling</li>
        <li><span class="example-name">voidrot</span> - decay vibes</li>
        <li><span class="example-name">cruelthirteen</span> - lucky for nobody but you</li>
        <li><span class="example-name">ironveil</span> - cryptic, dark fantasy</li>
        <li><span class="example-name">blackmarrow</span> - witcher-coded</li>
        <li><span class="example-name">nightscream</span> - dramatic, classic</li>
        <li><span class="example-name">hollowking</span> - souls-like perfection</li>
        <li><span class="example-name">gorepriest</span> - for the Diablo mains</li>
        </ul>`
      },
      {
        h2: "How to pick a good gaming name",
        body: `<p>A great gamertag has four traits: it's <strong>short</strong> (under 12 characters reads well in any UI), <strong>memorable</strong> (one sharp word is better than three forgettable ones), <strong>pronounceable</strong> (your squad needs to be able to call it out in clutch), and <strong>genre-appropriate</strong> (a name that fits the game you're playing most). Avoid numbers and underscores when you can - they date your account and look like a placeholder.</p>
        <p>Need a custom one? Our <a href="gamertag-generator.html">free gamertag generator</a> combines 100+ prefixes (Shadow, Void, Iron, Storm, etc.) with 80+ suffixes (Slayer, Hunter, Reaper, etc.) to produce tens of thousands of unique combinations. Pick your vibe, hit generate, and you have 10 fresh ideas in under a second.</p>
        <p>For real-name style handles (like <em>liv_04</em> or <em>cookingwithsam</em>) that work on Twitch, YouTube, and Discord, use our <a href="handle-generator.html">social handle generator</a> - it uses first-name pools and the patterns real creators actually pick.</p>`
      },
      {
        h2: "How to change your gamertag in 2026",
        body: `<p>Every major platform lets you change your gamertag, though the rules vary:</p>
        <ul>
        <li><strong>Steam:</strong> Free once, then $5 per change. Profile names are separate from your account name.</li>
        <li><strong>Xbox:</strong> First change is free, then $9.99 per change. Limited to one change per 30 days.</li>
        <li><strong>PlayStation:</strong> First change free on PSN, then $4.99 per change. PSN IDs are unique forever - if someone has the name you want, even inactive, you can't take it.</li>
        <li><strong>Epic Games:</strong> Free, can change every 2 weeks.</li>
        <li><strong>Riot (Valorant, LoL):</strong> Free, can change occasionally, must include at least one letter and one number.</li>
        <li><strong>Battle.net:</strong> Free, can change every 30 days.</li>
        </ul>`
      }
    ],
    faqs: [
      { q: "What's a good gamertag?", a: "Short, memorable, pronounceable, and genre-appropriate. Aim for under 12 characters with one sharp word. Avoid numbers and underscores when possible." },
      { q: "How do I come up with a cool gamertag?", a: "Pick a vibe (cool, funny, edgy, anime) and a genre (fantasy, sci-fi, modern, horror). Combine one short word from each. Our gamertag generator does this for you - it produces 10 unique combinations in under a second." },
      { q: "Can I use the same gamertag on every platform?", a: "Often, but not always. Steam, Xbox, PlayStation, and Riot all have their own name spaces. Check availability on each platform after you find one you like." },
      { q: "Should my gamertag match my Twitch / YouTube name?", a: "Ideally yes - consistency makes it easier for fans to find you. Secure the name on every platform you stream on, even if you don't use them all yet. For real-name style handles, try our social handle generator which produces names people actually use on Twitch, YouTube, and Discord." },
      { q: "Can I change my gamertag later?", a: "Most platforms let you change, usually for a small fee (Xbox $9.99, PSN $4.99, Steam $5). So don't stress too much - but picking a good one upfront saves money." }
    ],
    relatedLinks: [
      { href: "gamertag-generator.html", label: "Gamertag Generator" },
      { href: "username-generator.html", label: "Username Generator" },
      { href: "handle-generator.html", label: "Social Handle Generator" },
      { href: "skyrim-name-generator.html", label: "Skyrim Names" },
      { href: "world-of-warcraft-name-generator.html", label: "WoW Names" },
      { href: "league-of-legends-name-generator.html", label: "League of Legends Names" },
      { href: "elden-ring-name-generator.html", label: "Elden Ring Names" },
      { href: "dragon-name-generator.html", label: "Dragon Names" },
      { href: "index.html", label: "All generators" }
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Best Gaming Names for 2026 - 50+ Cool Gamertag Ideas",
      "description": "50+ cool gamertag ideas organized by style, with tips for picking a name that sticks.",
      "author": { "@type": "Organization", "name": "NameSwift" },
      "publisher": { "@type": "Organization", "name": "NameSwift", "url": "https://nameswiftgenerator.com" },
      "datePublished": "2026-08-22",
      "dateModified": "2026-08-22"
    }
  });
}

// =============================================================
// Build "Instagram Username Ideas" page
//   All 60+ examples are now in the realistic-handle style:
//   first names, names + activities, mood + object, etc.
// =============================================================
function buildInstagramUsernameIdeas() {
  return buildSEOPage({
    slug: "instagram-username-ideas",
    title: "Instagram Username Ideas That Are Actually Available (2026)",
    metaDesc: "Looking for Instagram username ideas that are actually available? Browse 80+ realistic Instagram username examples by niche - first name + activity, mood + object, the / by / hey / its + name - plus a free Instagram username generator.",
    h1: "Instagram Username Ideas That Are Actually Available",
    intro: "80+ realistic Instagram username examples organized by niche, with a free generator that produces custom usernames using the patterns real creators actually pick. Plus the rules Instagram uses for availability, and how to claim the name across platforms before someone else does.",
    sections: [
      {
        h2: "The Instagram username rules (2026)",
        body: `<p>Before picking a username, know what Instagram allows:</p>
        <ul>
        <li><strong>Length:</strong> 1 to 30 characters. The sweet spot for memorability is 8 to 15 characters.</li>
        <li><strong>Characters:</strong> Letters, numbers, periods, and underscores. No spaces, no hyphens, no special characters.</li>
        <li><strong>Uniqueness:</strong> Globally unique. If you want a name, you have to claim it before someone else does.</li>
        <li><strong>Periods and underscores don't make a name unique.</strong> <code>jane.doe</code>, <code>jane_doe</code>, and <code>janedoe</code> are all considered the same handle by Instagram's system.</li>
        <li><strong>Changes have a 14-day cooldown.</strong> Don't pick a name you'll regret. You can change it, but not often.</li>
        </ul>`
      },
      {
        h2: "How real Instagram handles are named (the 6 patterns)",
        body: `<p>After looking at thousands of real Instagram accounts, the patterns collapse to six templates:</p>
        <ol>
        <li><strong>First name + activity or niche word</strong> - <em>cookingwithsam</em>, <em>miaskincare</em>, <em>jessrunssf</em>. The most common creator pattern. Uses your first name so fans can find you, plus a keyword that signals your content.</li>
        <li><strong>Name + small meaningful number</strong> - <em>liv_04</em>, <em>maya.22</em>, <em>max_95</em>. Personal accounts do this. The number is usually a birth year, lucky number, or just a number they like. Avoid random number strings like <em>emma57831</em> - they look like a bot.</li>
        <li><strong>First name + last initial</strong> - <em>jessica.r</em>, <em>sarah.m</em>, <em>luke.k</em>. Personal accounts where you want your real name but the full last name is taken.</li>
        <li><strong>the / hey / its / by / get / try + name</strong> - <em>thebrandname</em>, <em>heymia</em>, <em>itsmax</em>, <em>bynora</em>, <em>getgrowth</em>, <em>trycreate</em>. Brand and creator accounts. Reads as a voice.</li>
        <li><strong>Mood + aesthetic object</strong> - <em>softbloom</em>, <em>velvetdawn</em>, <em>goldenhour</em>, <em>quietcloud</em>. Aesthetic, lifestyle, photography, art. No first name. Just a feeling and a thing.</li>
        <li><strong>One short, hard word</strong> - <em>vex</em>, <em>nyx</em>, <em>flux</em>, <em>kai</em>, <em>onyx</em>, <em>ember</em>. The minimalist move. Four to six letters. The hardest to get because everyone wants them.</li>
        </ol>
        <p>Our <a href="handle-generator.html">free Instagram username generator</a> uses all six patterns, plus 14 niche categories and 8 vibe styles, to produce 12 custom names per generation.</p>`
      },
      {
        h2: "Fashion and style Instagram username ideas",
        body: `<p>Real fashion creators use first names + closet words. The cleanest pattern: <em>{name}{closet word}</em>.</p>
        <ul>
        <li><span class="example-name">mialinen</span>, <span class="example-name">maya.denim</span>, <span class="example-name">sofiawool</span>, <span class="example-name">ivycashmere</span>, <span class="example-name">nora.silk</span>, <span class="example-name">ariafits</span>, <span class="example-name">chloethreads</span>, <span class="example-name">elladrapes</span>, <span class="example-name">lunawears</span>, <span class="example-name">rosiestyles</span></li>
        </ul>
        <h3>Minimal fashion (one mood + object)</h3>
        <ul>
        <li><span class="example-name">softsilk</span>, <span class="example-name">rawlinen</span>, <span class="example-name">quietvelvet</span>, <span class="example-name">wildcotton</span>, <span class="example-name">puredenim</span>, <span class="example-name">slowwool</span></li>
        </ul>`
      },
      {
        h2: "Beauty and skincare Instagram username ideas",
        body: `<p>Beauty creators lean into the <em>{name}{skin word}</em> pattern. The skin words are real terms people search.</p>
        <ul>
        <li><span class="example-name">miaglow</span>, <span class="example-name">maya.skin</span>, <span class="example-name">sofiaroutine</span>, <span class="example-name">ellashimmer</span>, <span class="example-name">norabalances</span>, <span class="example-name">ariabalances</span>, <span class="example-name">chloeritual</span>, <span class="example-name">lunamoisturizes</span>, <span class="example-name">rubyglows</span>, <span class="example-name">opal.skin</span></li>
        </ul>
        <h3>Beauty aesthetic (mood + glow word)</h3>
        <ul>
        <li><span class="example-name">dewyaura</span>, <span class="example-name">softflushed</span>, <span class="example-name">quietgloss</span>, <span class="example-name">calm.skin</span>, <span class="example-name">glassyritual</span>, <span class="example-name">gloss.diary</span></li>
        </ul>`
      },
      {
        h2: "Fitness and wellness Instagram username ideas",
        body: `<p>Fitness handles usually start with the person's first name + a verb like lifts, runs, or trains.</p>
        <ul>
        <li><span class="example-name">maxlifts</span>, <span class="example-name">kaitrains</span>, <span class="example-name">jayruns</span>, <span class="example-name">lev.climbs</span>, <span class="example-name">zanesweats</span>, <span class="example-name">rio.builds</span>, <span class="example-name">ashstretches</span>, <span class="example-name">noahcoaches</span>, <span class="example-name">ezra.mobility</span>, <span class="example-name">theorowes</span></li>
        </ul>
        <h3>Fitness aesthetic (mood + action)</h3>
        <ul>
        <li><span class="example-name">slowlift</span>, <span class="example-name">quietgrind</span>, <span class="example-name">softsweat</span>, <span class="example-name">calm.rep</span>, <span class="example-name">rawmile</span>, <span class="example-name">justlift</span></li>
        </ul>`
      },
      {
        h2: "Food and cooking Instagram username ideas",
        body: `<p>Food creators use the <em>{name}{kitchen verb}</em> pattern or the <em>{name}{cuisine}</em> pattern.</p>
        <ul>
        <li><span class="example-name">sambakes</span>, <span class="example-name">tomcooks</span>, <span class="example-name">mayacooks</span>, <span class="example-name">nora.sips</span>, <span class="example-name">lenaeats</span>, <span class="example-name">ariabakes</span>, <span class="example-name">sofiakitchen</span>, <span class="example-name">miakneads</span>, <span class="example-name">ellaplate</span>, <span class="example-name">sagecooks</span></li>
        </ul>
        <h3>Food with first name + cuisine</h3>
        <ul>
        <li><span class="example-name">maya.sourdough</span>, <span class="example-name">sofiaramen</span>, <span class="example-name">chloepasta</span>, <span class="example-name">jessmatcha</span>, <span class="example-name">livbakery</span>, <span class="example-name">nora.ferments</span></li>
        </ul>
        <h3>Food aesthetic</h3>
        <ul>
        <li><span class="example-name">softsourdough</span>, <span class="example-name">quietkitchen</span>, <span class="example-name">slowoven</span>, <span class="example-name">calmplate</span>, <span class="example-name">wildbread</span>, <span class="example-name">pure.broth</span></li>
        </ul>`
      },
      {
        h2: "Travel Instagram username ideas",
        body: `<p>Travel handles are almost always first name + travel verb or location.</p>
        <ul>
        <li><span class="example-name">samtravels</span>, <span class="example-name">tomwanders</span>, <span class="example-name">mayaroams</span>, <span class="example-name">nora.explores</span>, <span class="example-name">lenatravels</span>, <span class="example-name">ariaroams</span>, <span class="example-name">sofiawanders</span>, <span class="example-name">miatreks</span>, <span class="example-name">ellajourneys</span>, <span class="example-name">sagewanders</span></li>
        </ul>
        <h3>Travel aesthetic</h3>
        <ul>
        <li><span class="example-name">slowpassport</span>, <span class="example-name">quietcompass</span>, <span class="example-name">softatlas</span>, <span class="example-name">calm.trail</span>, <span class="example-name">wildpassport</span>, <span class="example-name">rawhorizon</span></li>
        </ul>`
      },
      {
        h2: "Art, photography, and music Instagram username ideas",
        body: `<p>Creator accounts for visual and audio work lean on mood + object. The aesthetic handles the visual brand.</p>
        <ul>
        <li><span class="example-name">mayadraws</span>, <span class="example-name">nora.paints</span>, <span class="example-name">lenacrafts</span>, <span class="example-name">ariainks</span>, <span class="example-name">sofiasketches</span>, <span class="example-name">miapaints</span>, <span class="example-name">ellatextures</span>, <span class="example-name">sageprints</span></li>
        </ul>
        <h3>Photography handles</h3>
        <ul>
        <li><span class="example-name">maxshoots</span>, <span class="example-name">kai.frames</span>, <span class="example-name">levcaptures</span>, <span class="example-name">zaneprints</span>, <span class="example-name">rioshootsfilm</span>, <span class="example-name">ash.develops</span></li>
        </ul>
        <h3>Music handles</h3>
        <ul>
        <li><span class="example-name">maxplays</span>, <span class="example-name">kaimixes</span>, <span class="example-name">levproduces</span>, <span class="example-name">zanebeats</span>, <span class="example-name">riosings</span>, <span class="example-name">ashsamples</span></li>
        </ul>
        <h3>Aesthetic art / photo / music</h3>
        <ul>
        <li><span class="example-name">softcanvas</span>, <span class="example-name">quietsketch</span>, <span class="example-name">wildgrain</span>, <span class="example-name">rawlight</span>, <span class="example-name">calm.synth</span>, <span class="example-name">lowkeywave</span></li>
        </ul>`
      },
      {
        h2: "Tech and coding Instagram username ideas",
        body: `<p>Tech creators use first name + dev word or just the dev word. Short, no fluff.</p>
        <ul>
        <li><span class="example-name">maxcodes</span>, <span class="example-name">kaibuilds</span>, <span class="example-name">levships</span>, <span class="example-name">zanedev</span>, <span class="example-name">riobuilds</span>, <span class="example-name">ashmakes</span>, <span class="example-name">noahdebugs</span>, <span class="example-name">ezra.engineer</span>, <span class="example-name">theodev</span>, <span class="example-name">remy.stacks</span></li>
        </ul>
        <h3>Tech aesthetic</h3>
        <ul>
        <li><span class="example-name">quietstack</span>, <span class="example-name">slowcode</span>, <span class="example-name">calm.dev</span>, <span class="example-name">rawbuild</span>, <span class="example-name">cleantech</span>, <span class="example-name">shipdaily</span></li>
        </ul>`
      },
      {
        h2: "Gaming, lifestyle, business, and one-word handles",
        body: `<p>For gaming, lifestyle, business, and minimalist accounts, here are 40+ more in the same real-name style.</p>
        <ul>
        <li><span class="example-name">maxplays</span>, <span class="example-name">kaispeedruns</span>, <span class="example-name">levqueues</span>, <span class="example-name">zanestream</span>, <span class="example-name">rioclutches</span>, <span class="example-name">ashgrinds</span>, <span class="example-name">noahlobbies</span>, <span class="example-name">ezra.carries</span></li>
        <li><span class="example-name">mayalives</span>, <span class="example-name">nora.slows</span>, <span class="example-name">lenamornings</span>, <span class="example-name">ariadaily</span>, <span class="example-name">sofiareads</span>, <span class="example-name">miajournals</span>, <span class="example-name">ellabreathes</span>, <span class="example-name">sagepractices</span></li>
        <li><span class="example-name">maxfounds</span>, <span class="example-name">kaibuilds</span>, <span class="example-name">levleads</span>, <span class="example-name">zaneships</span>, <span class="example-name">riogrows</span>, <span class="example-name">ashscales</span>, <span class="example-name">noahsells</span>, <span class="example-name">ezrapartners</span></li>
        <li><span class="example-name">vex</span>, <span class="example-name">nyx</span>, <span class="example-name">flux</span>, <span class="example-name">kai</span>, <span class="example-name">onyx</span>, <span class="example-name">ember</span>, <span class="example-name">wren</span>, <span class="example-name">june</span>, <span class="example-name">sage</span>, <span class="example-name">lou</span>, <span class="example-name">faye</span>, <span class="example-name">gem</span>, <span class="example-name">cleo</span>, <span class="example-name">nova</span>, <span class="example-name">liv</span>, <span class="example-name">ada</span></li>
        </ul>`
      },
      {
        h2: "How to check if an Instagram username is available",
        body: `<p>Two ways. The fast way: open Instagram's sign-up screen, type the handle, and watch for the green check or the red "this username isn't available" message. The slower way: search for the exact handle in the Instagram search bar. If a profile comes up, it's taken. If you see "No results", it might still be available, or it might be hidden behind an inactive account.</p>
        <p>For inactive accounts, there's no public way to claim them. Some users wait 2 to 5 years and then contact Instagram support to ask for username release, but Instagram doesn't have a public process for this. The honest answer: if the name is taken by a dead account, you'll probably have to pick a different name.</p>`
      },
      {
        h2: "Should your Instagram handle match your TikTok and YouTube?",
        body: `<p>Yes, in 99% of cases. A consistent handle across platforms makes it dramatically easier for new fans to find you everywhere. Imagine someone watches your TikTok, types your handle into Instagram, and finds you instantly. The reverse is also true. If your handle is different on every platform, you lose some of those searches to people who gave up and followed a competitor instead.</p>
        <p>The exception: if your Instagram handle is taken but the same name is free on YouTube, you have three options. (1) Pick a close variation everywhere, like <code>@cookingwithsam</code> on YouTube and <code>@samcooks</code> on Instagram. (2) Use a different handle on Instagram and add a "link in bio" to your YouTube on the Instagram profile. (3) Pick a completely new name that is free everywhere, and lose the older audience for the sake of consistency.</p>`
      },
      {
        h2: "Display name vs. username: what's the difference?",
        body: `<p>Your <strong>username</strong> is the unique handle that appears in your profile URL and in mentions. It's the part after the <code>@</code> and it's globally unique on Instagram. Your <strong>display name</strong> is the readable name shown at the top of your profile, next to your posts in the feed, and in your comments. It doesn't need to be unique and you can change it any time.</p>
        <p>A common pattern: use a short, brandable handle (<code>@cookingwithsam</code>) and a longer, descriptive display name (<code>Sam | Sourdough &amp; slow cooking</code>). The handle is for tagging and searching, the display name is for first impressions.</p>`
      },
      {
        h2: "Names to avoid on Instagram",
        body: `<ul>
        <li><strong>Numbers that look like bot strings:</strong> <code>@emma57831</code> looks like a bot or a default account. Use a meaningful number instead: birth year, lucky number, single digit.</li>
        <li><strong>Underscores at the start or end:</strong> Looks like a placeholder. <code>_velvet</code> is a worse choice than <code>@velvet</code>.</li>
        <li><strong>Long compound words without separators:</strong> <code>@ilovefashionforever</code> is hard to read. <code>@ilovefashionforever</code> doesn't help. Use periods: <code>@i.love.fashion</code>.</li>
        <li><strong>Brand names you don't own:</strong> If your handle is <code>@nike_fan_official</code>, you're one trademark complaint away from losing it. Don't use brand names.</li>
        <li><strong>Hard-to-spell words:</strong> If you have to spell it out loud three times, it's not the right name. The easier you are to find, the more followers you'll get from word-of-mouth.</li>
        </ul>`
      },
      {
        h2: "Get a custom Instagram username in 2 seconds",
        body: `<p>Open the <a href="handle-generator.html">free Instagram username generator</a>, pick "Instagram" as the platform, choose your niche (fashion, beauty, fitness, food, travel, art, music, photography, tech, gaming, comedy, education, lifestyle, or business), pick a vibe (cool, professional, funny, mysterious, cute, edgy, chill, or luxury), and hit <strong>Generate handles</strong>. You get 12 custom username ideas built from a 200+ word bank of first names, activity verbs, niche keywords, mood adjectives, and aesthetic objects. Copy the one you like, paste it into Instagram, and see if it's available. If not, hit generate again for 12 fresh ones.</p>`
      }
    ],
    faqs: [
      { q: "How long can an Instagram username be?", a: "Instagram usernames can be 2 to 30 characters. The sweet spot for memorability and shareability is 8 to 15 characters. Shorter is better, but don't sacrifice meaning to save a character." },
      { q: "Can Instagram usernames have periods and underscores?", a: "Yes, both. But Instagram treats jane.doe, jane_doe, and janedoe as the same handle, so you can't claim multiple variations of the same name. Pick one separator and stick with it. Most modern Instagram handles use periods, since they read softer than underscores." },
      { q: "How often can I change my Instagram username?", a: "You can change your Instagram username, but there's a 14-day cooldown between changes. So don't pick a name you'll regret. Also note that your old username becomes available for someone else to claim the moment you change it." },
      { q: "What if my Instagram handle is taken on a dead account?", a: "There's no public process to claim a handle from an inactive account. You can report the account to Instagram for impersonation if it's actually pretending to be you or your brand, but if it's just a dormant account that happens to have your name, you'll need to pick a different name." },
      { q: "Should I use my real name on Instagram?", a: "For personal accounts, yes. Your real name (or a close variation like first initial + last name) is the most discoverable choice. For creator or brand accounts, use a niche + first name handle so the name communicates your content at a glance (e.g. cookingwithsam for a food channel)." }
    ],
    relatedLinks: [
      { href: "handle-generator.html", label: "Social Handle Generator" },
      { href: "gamertag-generator.html", label: "Gamertag Generator" },
      { href: "username-generator.html", label: "Username Generator" },
      { href: "best-gaming-names.html", label: "Best Gaming Names" },
      { href: "elf-name-generator.html", label: "Elf Name Generator" },
      { href: "dwarf-name-generator.html", label: "Dwarf Name Generator" },
      { href: "witch-name-generator.html", label: "Witch Name Generator" },
      { href: "vampire-name-generator.html", label: "Vampire Name Generator" },
      { href: "index.html", label: "All generators" }
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Instagram Username Ideas That Are Actually Available (2026)",
      "description": "80+ realistic Instagram username ideas by niche, plus a free generator using the patterns real creators actually pick.",
      "author": { "@type": "Organization", "name": "NameSwift" },
      "publisher": { "@type": "Organization", "name": "NameSwift", "url": "https://nameswiftgenerator.com" },
      "datePublished": "2026-08-22",
      "dateModified": "2026-08-22"
    }
  });
}

// =============================================================
// Update homepage (add 2 new tiles for Handle Generator + Best Gaming Names)
// =============================================================
function updateHomepage() {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // 1) Add the new tile in the generators grid (insert before closing </div> of grid)
  const newTile = `      <a class="gen-tile" href="handle-generator.html">
        <div class="gen-emoji">&#128221;</div>
        <h3>Social Handle Generator</h3>
        <p>Realistic social media username ideas for Instagram, YouTube, TikTok, X, Twitch, Discord, GitHub. 14 niches, 8 vibes.</p>
      </a>
      <a class="gen-tile" href="best-gaming-names.html">
        <div class="gen-emoji">&#127918;</div>
        <h3>Best Gaming Names</h3>
        <p>50+ cool gamertag ideas by style, with tips and the rules for changing your name on every platform.</p>
      </a>
      <a class="gen-tile" href="instagram-username-ideas.html">
        <div class="gen-emoji">&#128247;</div>
        <h3>Instagram Username Ideas</h3>
        <p>80+ realistic Instagram handle ideas by niche, plus the rules Instagram uses for availability.</p>
      </a>
`;

  // Try to insert before the closing </div> of the gaming grid (the last grid before <div class="article">)
  if (!html.includes('href="handle-generator.html"')) {
    const articleIdx = html.indexOf('<div class="article">');
    if (articleIdx > -1) {
      // Find the last </div> before the article block (this closes the gaming grid)
      const before = html.slice(0, articleIdx);
      const lastDiv = before.lastIndexOf('</div>');
      if (lastDiv > -1) {
        html = before.slice(0, lastDiv) + newTile + '    ' + before.slice(lastDiv) + html.slice(articleIdx);
      }
    }
  }

  fs.writeFileSync(indexPath, html);
}

// =============================================================
// Update sitemap.xml to include the 3 new URLs
// =============================================================
function updateSitemap() {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');

  const today = '2026-08-22';
  const newUrls = [
    { loc: 'handle-generator.html',        priority: '0.9' },
    { loc: 'best-gaming-names.html',       priority: '0.8' },
    { loc: 'instagram-username-ideas.html',priority: '0.8' }
  ];

  let changed = false;
  newUrls.forEach(u => {
    if (!xml.includes(u.loc)) {
      const entry = `  <url>
    <loc>https://nameswiftgenerator.com/${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>
`;
      xml = xml.replace('</urlset>', entry + '</urlset>');
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(sitemapPath, xml);
    console.log('[sitemap] added new URLs');
  } else {
    console.log('[sitemap] no changes needed');
  }
}

// =============================================================
// MAIN - orchestrate everything
// =============================================================
function main() {
  console.log('--- NameSwift handle generator build ---');

  // 1) Write handle-generator.html
  const handleHTML = buildHandleGenerator();
  fs.writeFileSync(path.join(__dirname, 'handle-generator.html'), handleHTML);
  console.log('[write] handle-generator.html (' + handleHTML.length + ' bytes)');

  // 2) Write assets/js/handle.js
  const handleJS = buildHandleJS();
  const jsDir = path.join(__dirname, 'assets', 'js');
  if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });
  fs.writeFileSync(path.join(jsDir, 'handle.js'), handleJS);
  console.log('[write] assets/js/handle.js (' + handleJS.length + ' bytes)');

  // 3) Append CSS for the handle form (idempotent)
  const cssChanged = appendHandleCSS();
  console.log('[css] appended handle form CSS: ' + (cssChanged ? 'yes' : 'already present'));

  // 4) Write best-gaming-names.html
  const gamingHTML = buildBestGamingNames();
  fs.writeFileSync(path.join(__dirname, 'best-gaming-names.html'), gamingHTML);
  console.log('[write] best-gaming-names.html (' + gamingHTML.length + ' bytes)');

  // 5) Write instagram-username-ideas.html
  const igHTML = buildInstagramUsernameIdeas();
  fs.writeFileSync(path.join(__dirname, 'instagram-username-ideas.html'), igHTML);
  console.log('[write] instagram-username-ideas.html (' + igHTML.length + ' bytes)');

  // 6) Update homepage
  updateHomepage();
  console.log('[update] index.html');

  // 7) Update sitemap
  updateSitemap();

  console.log('--- Build complete ---');
}

main();
