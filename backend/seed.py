import os
import sys
import random
from datetime import datetime, timedelta
from app.db.session import engine, Base, SessionLocal
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.models.follow import Follow
from app.models.story import Story
from app.models.message import Message
from app.models.notification import Notification
from app.core.security import get_password_hash

def seed_db():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("Seeding Indian creator profiles...")
    password_hash = get_password_hash("password123")

    users_data = [
        {
            "username": "aravind_photography",
            "email": "aravind@example.com",
            "full_name": "Aravind Sharma",
            "bio": "📸 Visual Storyteller | Incredible India 🇮🇳\n📍 New Delhi / Rajasthan\nCapturing heritage, colors & soul of Bharat ✨",
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "priya_travels",
            "email": "priya@example.com",
            "full_name": "Priya Patel",
            "bio": "✈️ Solo Wanderer across India 🇮🇳\n🏔️ Mountains, Valleys & Backwaters\n📩 Collabs: priya@travelindia.in",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "rohit_cricket",
            "email": "rohit@example.com",
            "full_name": "Rohit Verma",
            "bio": "🏏 Cricket Enthusiast & Sports Journalist\nCovering IPL, Team India & grassroots cricket 🔥",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "ananya_foodie",
            "email": "ananya@example.com",
            "full_name": "Ananya Roy",
            "bio": "🍲 Food Explorer & Recipe Developer\nFrom Butter Chicken to Masala Dosa 🌶️☕\n#DesiFoodies",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "kabir_vlogs",
            "email": "kabir@example.com",
            "full_name": "Kabir Mehta",
            "bio": "🎥 Travel Vlogger & Filmmaker\nExploring hidden gems of North East & Western Ghats 🌲",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "isha_fashion",
            "email": "isha@example.com",
            "full_name": "Isha Malhotra",
            "bio": "✨ Ethnic Wear & Contemporary Indian Fashion\nSarees, Lehengas & Handloom Couture 👗💃",
            "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "dev_tech_india",
            "email": "dev@example.com",
            "full_name": "Devansh Nair",
            "bio": "💻 Tech Founder & Developer @ Namma Bengaluru 🚀\nBuilding global products from India 🇮🇳",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "diya_art",
            "email": "diya@example.com",
            "full_name": "Diya Iyer",
            "bio": "🎨 Traditional Madhubani & Tanjore Artist\nBridging Indian heritage art with modern spaces ✨",
            "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "aditya_mountains",
            "email": "aditya@example.com",
            "full_name": "Aditya Singh",
            "bio": "🏔️ Himalayan Trekker & Wildlife Enthusiast\nHimachal | Ladakh | Uttarakhand ❄️",
            "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "neha_fitness",
            "email": "neha@example.com",
            "full_name": "Neha Kapoor",
            "bio": "🧘‍♀️ Yoga Practitioner & Wellness Coach\nHolistic living & Mindful Yoga 🌿 #YogaIndia",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "vikram_architect",
            "email": "vikram@example.com",
            "full_name": "Vikram Kulkarni",
            "bio": "🏛️ Heritage Architecture & Urban Design\nPreserving Indian stepwells, forts & monuments 🕌",
            "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80"
        },
        {
            "username": "demo_user",
            "email": "demo@example.com",
            "full_name": "Demo Account",
            "bio": "👋 Welcome to LifeStyleX India! Explore 100+ Indian posts, stories & connect with creators across India 🇮🇳",
            "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
        }
    ]

    db_users = {}
    for u in users_data:
        user = User(
            username=u["username"],
            email=u["email"],
            full_name=u["full_name"],
            bio=u["bio"],
            avatar=u["avatar"],
            hashed_password=password_hash
        )
        db.add(user)
        db.flush()
        db_users[u["username"]] = user

    print("Generating 100 Indian themed posts...")

    # High quality Unsplash image URLs of Indian monuments, landscapes, food, festivals, cities, and lifestyle
    indian_images = [
        # Monuments & Architecture
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1080&q=80", # Taj Mahal sunrise
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1080&q=80", # Jaipur Palace
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1080&q=80", # Delhi Gate
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1080&q=80", # Goa Beach
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1080&q=80", # Mumbai Marine Drive
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1080&q=80", # Hawa Mahal Pink City
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=80", # Indian Architecture
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1080&q=80", # Taj Mahal view
        "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1080&q=80", # Varanasi Ghats Ganga Aarti
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1080&q=80", # Golden Temple Amritsar
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1080&q=80", # Kerala Houseboat
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1080&q=80", # Kerala Backwaters
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1080&q=80", # Udaipur Lake Palace
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1080&q=80", # Rishikesh Ganges
        "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1080&q=80", # Himalayas Ladakh Pass
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1080&q=80", # South Indian Temple
        "https://images.unsplash.com/photo-1592639296346-560c37a0f711?auto=format&fit=crop&w=1080&q=80", # Qutub Minar Delhi

        # Indian Food & Culture
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1080&q=80", # Dosa Chutney
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1080&q=80", # Indian Curry Spices
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1080&q=80", # Samosa Chai
        "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1080&q=80", # Biryani
        "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=1080&q=80", # Indian Thali
        "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=1080&q=80", # Masala Chai Tea
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1080&q=80", # Paneer Tikka
        "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1080&q=80", # Indian Spices Market

        # Festivals & Lifestyle
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1080&q=80", # Diwali Diyas Light
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1080&q=80", # Holi Colors Celebration
        "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1080&q=80", # Indian Saree Fashion
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1080&q=80", # Traditional Lehenga Wedding
        "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1080&q=80", # Tricolor Indian Flag
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1080&q=80", # Tech Bengaluru Setup
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1080&q=80", # Yoga Meditation
    ]

    captions_templates = [
        "Sunrise over the majestic Taj Mahal in Agra 🌅 Nothing compares to the timeless beauty of Indian heritage. #IncredibleIndia #TajMahal #Agra #TravelIndia",
        "Exploring the Pink City Jaipur 🏰 The architecture of Hawa Mahal and Amer Fort is breathtaking! #Jaipur #Rajasthan #HeritageIndia #Architecture",
        "Evening Ganga Aarti in Varanasi ✨ Watching the oil lamps float down the holy Ganges is a soulful experience. #Varanasi #Banaras #SpiritualIndia",
        "Nothing beats a hot cup of Kulhad Masala Chai & Samosa on a rainy evening! ☕🥟 #ChaiLover #IndianFood #StreetFood #DesiVibes",
        "Crispy South Indian Masala Dosa with fresh coconut chutney & sambar! 🥞🌶️ #DosaLove #SouthIndianFood #FoodieIndia",
        "Exploring the serene backwaters of Alleppey, Kerala on a traditional houseboat 🌴🛶 #GodsOwnCountry #Kerala #TravelVibes",
        "Wandering through the colorful markets of Old Delhi 🌶️🌺 Full of vibrant spices, textiles, and rich history.",
        "Golden hour view at Marine Drive, Mumbai 🌆 The City of Dreams always lights up at night! #Mumbai #MumbaiDiaries #CityOfDreams",
        "Celebrating Diwali with glowing diyas & bright lights ✨ Wishing everyone peace, love and prosperity! 🪔 #DiwaliFestival #FestivalOfLights",
        "Holi vibes! Splashing vibrant colors & sharing sweet Gujiyas with friends 🎨💖 #Holi2026 #ColorsOfIndia",
        "Match day energy in India is unmatched! 🏏 Stadium roaring with loud cheers! #CricketIndia #TeamIndia #IPL",
        "Trekking in Manali & Leh Ladakh 🏔️ Snow-capped Himalayan peaks, crisp mountain air & endless horizons. #Himalayas #Ladakh #MountainTrek",
        "Tasting authentic Hyderabadi Dum Biryani 🍲 Rich aroma of saffron & spices cooked to perfection! #BiryaniLove #HyderabadFood",
        "Beautiful handloom silk saree collection showcase 👗 Honoring Indian weavers & tradition! #SareeNotSorry #IndianFashion",
        "Late night coding session at Bangalore tech hub 💻☕ Building global software from Namma Bengaluru! #BengaluruTech #StartupIndia",
        "Peaceful morning yoga session by the river Ganges in Rishikesh 🧘‍♀️ #Yoga #Wellness #Mindfulness #Rishikesh"
    ]

    usernames_list = list(db_users.keys())

    db_posts = []
    total_posts_to_generate = 100

    for i in range(total_posts_to_generate):
        username = usernames_list[i % len(usernames_list)]
        img_url = indian_images[i % len(indian_images)]
        caption = captions_templates[i % len(captions_templates)] + f" (Post #{i+1})"
        
        # Stagger post timestamps across past 30 days
        post_time = datetime.utcnow() - timedelta(hours=(total_posts_to_generate - i) * 5)
        
        post = Post(
            user_id=db_users[username].id,
            caption=caption,
            image_url=img_url,
            created_at=post_time
        )
        db.add(post)
        db.flush()
        db_posts.append(post)

    print("Seeding Indian post comments...")
    comments_list = [
        "Wah! Beautiful capture brother! 🔥🇮🇳",
        "Incredible India indeed! 😍 Adding this place to my bucket list.",
        "Mouthwatering food! Where is this restaurant located?",
        "Jai Hind! Such a proud moment! 🙏✨",
        "Superb composition & colors! Great shot! 📸",
        "This looks so peaceful! Loved the post ❤️",
        "Desi vibes always hit different! 💯",
        "Looking stunning! Beautiful traditional outfit 👌",
        "Match day vibes! Bleed Blue! 🏏🇮🇳",
        "Chai is emotion! ☕❤️"
    ]

    for post_obj in db_posts:
        # Add 2-4 comments per post
        num_comments = random.randint(2, 4)
        for _ in range(num_comments):
            commenter = random.choice(usernames_list)
            comment_text = random.choice(comments_list)
            c = Comment(post_id=post_obj.id, user_id=db_users[commenter].id, text=comment_text)
            db.add(c)

    print("Seeding likes across 100 posts...")
    for post_obj in db_posts:
        # Add 3-8 likes per post
        num_likes = random.randint(3, 8)
        liked_users = random.sample(usernames_list, num_likes)
        for u_name in liked_users:
            l = Like(post_id=post_obj.id, user_id=db_users[u_name].id)
            db.add(l)

    print("Seeding follows...")
    demo = db_users["demo_user"]
    for u_name, u_obj in db_users.items():
        if u_name != "demo_user":
            db.add(Follow(follower_id=demo.id, following_id=u_obj.id))
            db.add(Follow(follower_id=u_obj.id, following_id=demo.id))

    print("Seeding active stories...")
    stories_data = [
        (db_users["priya_travels"], "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80"),
        (db_users["aravind_photography"], "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80"),
        (db_users["ananya_foodie"], "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"),
        (db_users["rohit_cricket"], "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80"),
        (db_users["isha_fashion"], "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80")
    ]
    for user_obj, img_url in stories_data:
        s = Story(
            user_id=user_obj.id,
            image_url=img_url,
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(hours=24)
        )
        db.add(s)

    print("Seeding direct messages...")
    db.add(Message(sender_id=db_users["aravind_photography"].id, receiver_id=demo.id, text="Namaste! Welcome to LifeStyleX India! 🇮🇳✨"))
    db.add(Message(sender_id=demo.id, receiver_id=db_users["aravind_photography"].id, text="Namaste Aravind! Amazing photos of Taj Mahal & Jaipur!"))
    db.add(Message(sender_id=db_users["ananya_foodie"].id, receiver_id=demo.id, text="Let me know if you want the best street food spots in Delhi & Mumbai! 🍲☕"))

    db.commit()
    db.close()
    print("Database seeding completed with 100 Indian posts!")

if __name__ == "__main__":
    seed_db()
