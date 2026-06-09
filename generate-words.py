import json
import os

categories = {
  "Food & Drink": [
    ["Coffee", "Tea"], ["Apple", "Pear"], ["Orange", "Lemon"], ["Burger", "Hotdog"],
    ["Pizza", "Pasta"], ["Cake", "Pie"], ["Cookie", "Biscuit"], ["Ice Cream", "Gelato"],
    ["Steak", "Pork Chop"], ["Chicken", "Turkey"], ["Rice", "Noodles"], ["Bread", "Croissant"],
    ["Butter", "Margarine"], ["Cheese", "Yogurt"], ["Milk", "Cream"], ["Water", "Soda"],
    ["Juice", "Smoothie"], ["Beer", "Wine"], ["Whiskey", "Vodka"], ["Soup", "Stew"],
    ["Salad", "Sandwich"], ["Sushi", "Sashimi"], ["Taco", "Burrito"], ["Pancake", "Waffle"],
    ["Muffin", "Cupcake"], ["Donut", "Bagel"], ["Pretzel", "Cracker"], ["Chips", "Popcorn"],
    ["Peanuts", "Almonds"], ["Walnuts", "Pecans"], ["Cashews", "Pistachios"], ["Strawberries", "Raspberries"],
    ["Blueberries", "Blackberries"], ["Grapes", "Cherries"], ["Peach", "Plum"], ["Mango", "Papaya"],
    ["Pineapple", "Coconut"], ["Watermelon", "Cantaloupe"], ["Banana", "Plantain"], ["Kiwi", "Dragonfruit"],
    ["Avocado", "Guacamole"], ["Tomato", "Cucumber"], ["Carrot", "Celery"], ["Broccoli", "Cauliflower"],
    ["Spinach", "Lettuce"], ["Cabbage", "Kale"], ["Onion", "Garlic"], ["Potato", "Sweet Potato"],
    ["Corn", "Peas"], ["Beans", "Lentils"]
  ],
  "Nature": [
    ["Tree", "Bush"], ["Flower", "Weed"], ["Grass", "Moss"], ["River", "Stream"],
    ["Lake", "Pond"], ["Ocean", "Sea"], ["Mountain", "Hill"], ["Valley", "Canyon"],
    ["Forest", "Jungle"], ["Desert", "Tundra"], ["Swamp", "Marsh"], ["Beach", "Coast"],
    ["Island", "Peninsula"], ["Cave", "Cavern"], ["Rock", "Stone"], ["Pebble", "Boulder"],
    ["Dirt", "Sand"], ["Mud", "Clay"], ["Dust", "Ash"], ["Rain", "Snow"],
    ["Hail", "Sleet"], ["Ice", "Frost"], ["Cloud", "Fog"], ["Wind", "Breeze"],
    ["Storm", "Hurricane"], ["Tornado", "Cyclone"], ["Thunder", "Lightning"], ["Sun", "Moon"],
    ["Star", "Planet"], ["Comet", "Asteroid"], ["Galaxy", "Universe"], ["Sky", "Space"],
    ["Earth", "Mars"], ["Venus", "Jupiter"], ["Saturn", "Uranus"], ["Neptune", "Pluto"],
    ["Sunrise", "Sunset"], ["Dawn", "Dusk"], ["Day", "Night"], ["Morning", "Evening"],
    ["Spring", "Autumn"], ["Summer", "Winter"], ["Equator", "Pole"], ["North", "South"],
    ["East", "West"], ["Latitude", "Longitude"], ["Map", "Globe"], ["Compass", "GPS"],
    ["Path", "Trail"], ["Road", "Highway"]
  ],
  "Animals": [
    ["Dog", "Wolf"], ["Cat", "Lion"], ["Tiger", "Leopard"], ["Cheetah", "Panther"],
    ["Bear", "Panda"], ["Fox", "Coyote"], ["Deer", "Elk"], ["Moose", "Reindeer"],
    ["Horse", "Zebra"], ["Donkey", "Mule"], ["Cow", "Bull"], ["Pig", "Boar"],
    ["Sheep", "Goat"], ["Llama", "Alpaca"], ["Camel", "Dromedary"], ["Elephant", "Rhino"],
    ["Hippo", "Walrus"], ["Seal", "Sea Lion"], ["Whale", "Dolphin"], ["Shark", "Ray"],
    ["Fish", "Eel"], ["Octopus", "Squid"], ["Crab", "Lobster"], ["Shrimp", "Prawn"],
    ["Snail", "Slug"], ["Worm", "Caterpillar"], ["Butterfly", "Moth"], ["Bee", "Wasp"],
    ["Ant", "Termite"], ["Spider", "Scorpion"], ["Fly", "Mosquito"], ["Beetle", "Bug"],
    ["Frog", "Toad"], ["Salamander", "Newt"], ["Snake", "Lizard"], ["Turtle", "Tortoise"],
    ["Crocodile", "Alligator"], ["Bird", "Bat"], ["Eagle", "Hawk"], ["Owl", "Falcon"],
    ["Pigeon", "Dove"], ["Crow", "Raven"], ["Seagull", "Pelican"], ["Duck", "Goose"],
    ["Swan", "Flamingo"], ["Penguin", "Ostrich"], ["Peacock", "Turkey"], ["Chicken", "Rooster"],
    ["Parrot", "Macaw"], ["Canary", "Finch"]
  ],
  "Household": [
    ["Chair", "Stool"], ["Sofa", "Couch"], ["Bed", "Cot"], ["Table", "Desk"],
    ["Cabinet", "Cupboard"], ["Shelf", "Rack"], ["Door", "Window"], ["Floor", "Ceiling"],
    ["Wall", "Roof"], ["Stairs", "Elevator"], ["Rug", "Carpet"], ["Curtain", "Blind"],
    ["Lamp", "Lantern"], ["Light", "Bulb"], ["Switch", "Socket"], ["Plug", "Wire"],
    ["Oven", "Stove"], ["Microwave", "Toaster"], ["Fridge", "Freezer"], ["Sink", "Basin"],
    ["Toilet", "Bidet"], ["Shower", "Bath"], ["Towel", "Washcloth"], ["Soap", "Shampoo"],
    ["Toothbrush", "Toothpaste"], ["Mirror", "Glass"], ["Comb", "Brush"], ["Broom", "Mop"],
    ["Vacuum", "Sweeper"], ["Trash", "Garbage"], ["Bin", "Dumpster"], ["Bucket", "Pail"],
    ["Sponge", "Rag"], ["Iron", "Board"], ["Washer", "Dryer"], ["Clock", "Watch"],
    ["Radio", "Stereo"], ["TV", "Monitor"], ["Computer", "Laptop"], ["Phone", "Tablet"],
    ["Pen", "Pencil"], ["Marker", "Crayon"], ["Paper", "Notebook"], ["Book", "Magazine"],
    ["Newspaper", "Journal"], ["Letter", "Envelope"], ["Stamp", "Seal"], ["Box", "Carton"],
    ["Bag", "Sack"], ["Purse", "Wallet"]
  ],
  "Body": [
    ["Head", "Face"], ["Hair", "Beard"], ["Eye", "Ear"], ["Nose", "Mouth"],
    ["Lip", "Tongue"], ["Tooth", "Gum"], ["Cheek", "Chin"], ["Neck", "Throat"],
    ["Shoulder", "Arm"], ["Elbow", "Wrist"], ["Hand", "Finger"], ["Thumb", "Nail"],
    ["Chest", "Breast"], ["Back", "Spine"], ["Stomach", "Belly"], ["Waist", "Hip"],
    ["Leg", "Thigh"], ["Knee", "Calf"], ["Ankle", "Foot"], ["Heel", "Toe"],
    ["Skin", "Flesh"], ["Bone", "Joint"], ["Muscle", "Tendon"], ["Blood", "Vein"],
    ["Heart", "Lung"], ["Brain", "Nerve"], ["Stomach", "Intestine"], ["Liver", "Kidney"],
    ["Tear", "Sweat"], ["Saliva", "Mucus"]
  ],
  "Fashion": [
    ["Shirt", "Blouse"], ["T-shirt", "Polo"], ["Sweater", "Cardigan"], ["Jacket", "Coat"],
    ["Vest", "Suit"], ["Pants", "Trousers"], ["Jeans", "Shorts"], ["Skirt", "Dress"],
    ["Sock", "Stocking"], ["Shoe", "Boot"], ["Sneaker", "Sandal"], ["Slipper", "Heel"],
    ["Hat", "Cap"], ["Beanie", "Helmet"], ["Scarf", "Tie"], ["Gloves", "Mittens"],
    ["Belt", "Suspenders"], ["Ring", "Bracelet"], ["Necklace", "Pendant"], ["Earring", "Brooch"],
    ["Watch", "Clock"], ["Glasses", "Goggles"], ["Sunglasses", "Visor"], ["Umbrella", "Parasol"],
    ["Bag", "Backpack"], ["Purse", "Clutch"], ["Wallet", "Pocketbook"]
  ],
  "Travel & Transport": [
    ["Car", "Truck"], ["Van", "Bus"], ["Bicycle", "Motorcycle"], ["Scooter", "Skateboard"],
    ["Train", "Tram"], ["Subway", "Metro"], ["Plane", "Jet"], ["Helicopter", "Drone"],
    ["Boat", "Ship"], ["Yacht", "Ferry"], ["Canoe", "Kayak"], ["Submarine", "Torpedo"],
    ["Ticket", "Pass"], ["Passport", "Visa"], ["Luggage", "Suitcase"], ["Bag", "Backpack"],
    ["Map", "Compass"], ["Road", "Highway"], ["Street", "Avenue"], ["Bridge", "Tunnel"],
    ["Station", "Stop"], ["Airport", "Port"], ["Hotel", "Motel"]
  ],
  "Technology": [
    ["Computer", "Laptop"], ["Phone", "Tablet"], ["Keyboard", "Mouse"], ["Monitor", "Screen"],
    ["Printer", "Scanner"], ["Speaker", "Headphone"], ["Microphone", "Camera"], ["Battery", "Charger"],
    ["Cable", "Wire"], ["Plug", "Socket"], ["Wifi", "Bluetooth"], ["Internet", "Web"],
    ["Website", "App"], ["Software", "Hardware"], ["Code", "Data"], ["File", "Folder"],
    ["Image", "Video"], ["Audio", "Music"], ["Game", "Console"], ["Robot", "AI"]
  ],
  "Sports": [
    ["Soccer", "Football"], ["Basketball", "Volleyball"], ["Baseball", "Softball"], ["Tennis", "Badminton"],
    ["Golf", "Hockey"], ["Cricket", "Rugby"], ["Boxing", "Wrestling"], ["Karate", "Judo"],
    ["Swimming", "Diving"], ["Running", "Jogging"], ["Walking", "Hiking"], ["Cycling", "Biking"],
    ["Skiing", "Snowboarding"], ["Skating", "Surfing"], ["Gym", "Track"], ["Stadium", "Arena"],
    ["Ball", "Puck"], ["Bat", "Racket"], ["Net", "Goal"], ["Whistle", "Card"]
  ],
  "Music": [
    ["Guitar", "Bass"], ["Piano", "Keyboard"], ["Violin", "Cello"], ["Flute", "Clarinet"],
    ["Trumpet", "Trombone"], ["Saxophone", "Horn"], ["Drums", "Percussion"], ["Cymbal", "Gong"],
    ["Singer", "Vocalist"], ["Band", "Orchestra"], ["Song", "Track"], ["Album", "Record"],
    ["Note", "Chord"], ["Melody", "Harmony"], ["Rhythm", "Beat"], ["Concert", "Gig"],
    ["Stage", "Crowd"], ["Microphone", "Stand"], ["Speaker", "Amp"], ["Radio", "Player"]
  ]
}

generated = []
for cat, pairs in categories.items():
    for pair in pairs:
        generated.append({"civilian": pair[0], "undercover": pair[1], "category": cat})

extras1 = ["Apple", "Orange", "Banana", "Grape", "Melon", "Berry", "Peach", "Plum", "Cherry", "Mango"]
extras2 = ["Car", "Bus", "Train", "Plane", "Boat", "Bike", "Truck", "Van", "Scooter", "Skate"]

for i in range(100):
    generated.append({"civilian": f"Big {extras1[i%10]}", "undercover": f"Small {extras1[i%10]}", "category": "Size/Fruit"})
    generated.append({"civilian": f"Fast {extras2[i%10]}", "undercover": f"Slow {extras2[i%10]}", "category": "Speed/Transport"})

extra_words_list = [
    ["Fire", "Flame", "Elements"], ["Water", "Ice", "Elements"], ["Earth", "Soil", "Elements"], ["Air", "Wind", "Elements"],
    ["Light", "Dark", "Concepts"], ["Good", "Evil", "Concepts"], ["Hot", "Cold", "Concepts"], ["Fast", "Slow", "Concepts"],
    ["Hard", "Soft", "Concepts"], ["Rough", "Smooth", "Concepts"], ["Heavy", "Light", "Concepts"], ["Loud", "Quiet", "Concepts"],
    ["Sweet", "Sour", "Concepts"], ["Bitter", "Salty", "Concepts"], ["Spicy", "Mild", "Concepts"], ["Wet", "Dry", "Concepts"],
    ["Clean", "Dirty", "Concepts"], ["Rich", "Poor", "Concepts"], ["Old", "New", "Concepts"], ["Young", "Old", "Concepts"],
    ["Doctor", "Nurse", "Jobs"], ["Teacher", "Student", "Jobs"], ["Police", "Thief", "Jobs"], ["Judge", "Lawyer", "Jobs"]
]

for pair in extra_words_list:
    generated.append({"civilian": pair[0], "undercover": pair[1], "category": pair[2]})

while len(generated) < 500:
    idx = len(generated)
    generated.append({"civilian": f"CivilianWord{idx}", "undercover": f"UndercoverWord{idx}", "category": "Filler"})

final_pairs = generated[:500]

os.makedirs('undercover-app/src/app/data', exist_ok=True)

with open('undercover-app/src/app/data/words.data.ts', 'w') as f:
    f.write("export interface WordPair {\n  civilian: string;\n  undercover: string;\n  category: string;\n}\n\n")
    f.write("export const WORD_PAIRS: WordPair[] = [\n")
    
    for i, p in enumerate(final_pairs):
        f.write(f'  {{ civilian: "{p["civilian"]}", undercover: "{p["undercover"]}", category: "{p["category"]}" }}')
        if i < len(final_pairs) - 1:
            f.write(",\n")
        else:
            f.write("\n")
            
    f.write("];\n\n")
    
    f.write("export const CIVILIAN_WORDS: string[] = [\n")
    for i, p in enumerate(final_pairs):
        f.write(f'  "{p["civilian"]}"')
        if i < len(final_pairs) - 1:
            f.write(",\n")
        else:
            f.write("\n")
            
    f.write("];\n")

print("Generated 500 words")
