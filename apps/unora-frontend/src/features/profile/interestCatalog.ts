/**
 * Seed catalog for profile interests. Each entry is stable for API sync (`id`).
 * `icon` is a single emoji string for lightweight display without asset hosting.
 */
export type ProfileInterestItem = {
  /** Matches parent category `id` */
  categoryId: string;
  /** Emoji or other single-glyph marker shown beside the label */
  icon: string;
  id: string;
  label: string;
};

export type ProfileInterestCategory = {
  /** How many chips to show before "Show more" */
  defaultVisible: number;
  id: string;
  interests: ProfileInterestItem[];
  title: string;
};

/** Hard cap on simultaneous selections in the picker (UX / payload size). */
export const PROFILE_INTEREST_MAX_SELECTION = 8;

export const INTEREST_CATALOG: ProfileInterestCategory[] = [
  {
    id: "self_care",
    title: "Self-care",
    defaultVisible: 8,
    interests: [
      {
        id: "self_aromatherapy",
        label: "Aromatherapy",
        icon: "🕯️",
        categoryId: "self_care",
      },
      {
        id: "self_astrology",
        label: "Astrology",
        icon: "💫",
        categoryId: "self_care",
      },
      {
        id: "self_cold_plunge",
        label: "Cold plunging",
        icon: "🧊",
        categoryId: "self_care",
      },
      {
        id: "self_crystals",
        label: "Crystals",
        icon: "💎",
        categoryId: "self_care",
      },
      {
        id: "self_deep_chats",
        label: "Deep chats",
        icon: "💬",
        categoryId: "self_care",
      },
      {
        id: "self_journaling",
        label: "Journaling",
        icon: "✍️",
        categoryId: "self_care",
      },
      {
        id: "self_mindfulness",
        label: "Mindfulness",
        icon: "🧠",
        categoryId: "self_care",
      },
      {
        id: "self_nutrition",
        label: "Nutrition",
        icon: "🥦",
        categoryId: "self_care",
      },
      {
        id: "self_retreats",
        label: "Retreats",
        icon: "🧘",
        categoryId: "self_care",
      },
      {
        id: "self_skin_care",
        label: "Skin care",
        icon: "🧴",
        categoryId: "self_care",
      },
      {
        id: "self_sleep",
        label: "Sleeping well",
        icon: "💤",
        categoryId: "self_care",
      },
      {
        id: "self_slow_living",
        label: "Slow living",
        icon: "🐌",
        categoryId: "self_care",
      },
      {
        id: "self_therapy",
        label: "Therapy",
        icon: "💛",
        categoryId: "self_care",
      },
      {
        id: "self_time_offline",
        label: "Time offline",
        icon: "🏞️",
        categoryId: "self_care",
      },
    ],
  },
  {
    id: "sports",
    title: "Sports",
    defaultVisible: 8,
    interests: [
      {
        id: "sport_football_us",
        label: "American football",
        icon: "🏈",
        categoryId: "sports",
      },
      {
        id: "sport_athletics",
        label: "Athletics",
        icon: "🎽",
        categoryId: "sports",
      },
      {
        id: "sport_badminton",
        label: "Badminton",
        icon: "🏸",
        categoryId: "sports",
      },
      {
        id: "sport_baseball",
        label: "Baseball",
        icon: "⚾",
        categoryId: "sports",
      },
      {
        id: "sport_basketball",
        label: "Basketball",
        icon: "🏀",
        categoryId: "sports",
      },
      {
        id: "sport_bodybuilding",
        label: "Bodybuilding",
        icon: "💪",
        categoryId: "sports",
      },
      {
        id: "sport_bouldering",
        label: "Bouldering",
        icon: "🧗",
        categoryId: "sports",
      },
      {id: "sport_bowling", label: "Bowling", icon: "🎳", categoryId: "sports"},
      {id: "sport_cycling", label: "Cycling", icon: "🚴", categoryId: "sports"},
      {id: "sport_running", label: "Running", icon: "🏃", categoryId: "sports"},
      {
        id: "sport_swimming",
        label: "Swimming",
        icon: "🏊",
        categoryId: "sports",
      },
      {id: "sport_yoga", label: "Yoga", icon: "🧘‍♀️", categoryId: "sports"},
    ],
  },
  {
    id: "creativity",
    title: "Creativity",
    defaultVisible: 8,
    interests: [
      {id: "crea_art", label: "Art", icon: "🎨", categoryId: "creativity"},
      {
        id: "crea_crafts",
        label: "Crafts",
        icon: "🪄",
        categoryId: "creativity",
      },
      {
        id: "crea_crochet",
        label: "Crocheting",
        icon: "🧶",
        categoryId: "creativity",
      },
      {
        id: "crea_dance",
        label: "Dancing",
        icon: "💃",
        categoryId: "creativity",
      },
      {
        id: "crea_design",
        label: "Design",
        icon: "✏️",
        categoryId: "creativity",
      },
      {
        id: "crea_drawing",
        label: "Drawing",
        icon: "🖍️",
        categoryId: "creativity",
      },
      {
        id: "crea_fashion",
        label: "Fashion",
        icon: "👗",
        categoryId: "creativity",
      },
      {
        id: "crea_knitting",
        label: "Knitting",
        icon: "🧵",
        categoryId: "creativity",
      },
      {
        id: "crea_photo",
        label: "Photography",
        icon: "📷",
        categoryId: "creativity",
      },
      {
        id: "crea_writing",
        label: "Writing",
        icon: "📝",
        categoryId: "creativity",
      },
    ],
  },
  {
    id: "food_drink",
    title: "Food & drink",
    defaultVisible: 8,
    interests: [
      {
        id: "food_coffee",
        label: "Coffee",
        icon: "☕",
        categoryId: "food_drink",
      },
      {
        id: "food_foodie",
        label: "Foodie",
        icon: "🍜",
        categoryId: "food_drink",
      },
      {id: "food_wine", label: "Wine", icon: "🍷", categoryId: "food_drink"},
      {id: "food_bbq", label: "BBQ", icon: "🥩", categoryId: "food_drink"},
      {id: "food_beer", label: "Beer", icon: "🍺", categoryId: "food_drink"},
      {
        id: "food_boba",
        label: "Boba tea",
        icon: "🧋",
        categoryId: "food_drink",
      },
      {
        id: "food_burgers",
        label: "Burgers",
        icon: "🍔",
        categoryId: "food_drink",
      },
      {id: "food_cake", label: "Cake", icon: "🧁", categoryId: "food_drink"},
      {
        id: "food_cocktails",
        label: "Cocktails",
        icon: "🍸",
        categoryId: "food_drink",
      },
      {
        id: "food_mocktails",
        label: "Mocktails",
        icon: "🍹",
        categoryId: "food_drink",
      },
      {id: "food_pizza", label: "Pizza", icon: "🍕", categoryId: "food_drink"},
      {
        id: "food_plant",
        label: "Plant-based",
        icon: "🥑",
        categoryId: "food_drink",
      },
      {id: "food_sushi", label: "Sushi", icon: "🍣", categoryId: "food_drink"},
      {
        id: "food_baking",
        label: "Baking",
        icon: "🍰",
        categoryId: "food_drink",
      },
    ],
  },
  {
    id: "staying_in",
    title: "Staying in",
    defaultVisible: 8,
    interests: [
      {id: "in_ai", label: "AI", icon: "🤖", categoryId: "staying_in"},
      {
        id: "in_board_games",
        label: "Board games",
        icon: "🎲",
        categoryId: "staying_in",
      },
      {id: "in_chess", label: "Chess", icon: "♟️", categoryId: "staying_in"},
      {
        id: "in_cooking",
        label: "Cooking",
        icon: "🍳",
        categoryId: "staying_in",
      },
      {
        id: "in_garden",
        label: "Gardening",
        icon: "🌱",
        categoryId: "staying_in",
      },
      {
        id: "in_plants",
        label: "House plants",
        icon: "🪴",
        categoryId: "staying_in",
      },
      {
        id: "in_podcasts",
        label: "Podcasts",
        icon: "🎙️",
        categoryId: "staying_in",
      },
      {
        id: "in_programming",
        label: "Programming",
        icon: "💻",
        categoryId: "staying_in",
      },
      {
        id: "in_reading",
        label: "Reading",
        icon: "📚",
        categoryId: "staying_in",
      },
      {
        id: "in_games",
        label: "Video games",
        icon: "🎮",
        categoryId: "staying_in",
      },
    ],
  },
  {
    id: "going_out",
    title: "Going out",
    defaultVisible: 8,
    interests: [
      {id: "out_bars", label: "Bars", icon: "🍻", categoryId: "going_out"},
      {
        id: "out_cafes",
        label: "Cafe-hopping",
        icon: "☕",
        categoryId: "going_out",
      },
      {
        id: "out_drag",
        label: "Drag shows",
        icon: "👑",
        categoryId: "going_out",
      },
      {id: "out_films", label: "Films", icon: "🍿", categoryId: "going_out"},
      {
        id: "out_festivals",
        label: "Festivals",
        icon: "🎉",
        categoryId: "going_out",
      },
      {id: "out_gigs", label: "Gigs", icon: "🎟️", categoryId: "going_out"},
      {id: "out_improv", label: "Improv", icon: "🎭", categoryId: "going_out"},
      {
        id: "out_karaoke",
        label: "Karaoke",
        icon: "🎤",
        categoryId: "going_out",
      },
    ],
  },
  {
    id: "reading",
    title: "Reading",
    defaultVisible: 10,
    interests: [
      {
        id: "read_action",
        label: "Action & adventure",
        icon: "📚",
        categoryId: "reading",
      },
      {id: "read_bio", label: "Biographies", icon: "📚", categoryId: "reading"},
      {
        id: "read_classics",
        label: "Classics",
        icon: "📚",
        categoryId: "reading",
      },
      {id: "read_comedy", label: "Comedy", icon: "📚", categoryId: "reading"},
      {
        id: "read_comics",
        label: "Comic books",
        icon: "📚",
        categoryId: "reading",
      },
      {id: "read_crime", label: "Crime", icon: "📚", categoryId: "reading"},
      {id: "read_fantasy", label: "Fantasy", icon: "📚", categoryId: "reading"},
      {id: "read_history", label: "History", icon: "📚", categoryId: "reading"},
      {id: "read_horror", label: "Horror", icon: "📚", categoryId: "reading"},
      {id: "read_manga", label: "Manga", icon: "📚", categoryId: "reading"},
      {id: "read_mystery", label: "Mystery", icon: "📚", categoryId: "reading"},
      {
        id: "read_philosophy",
        label: "Philosophy",
        icon: "📚",
        categoryId: "reading",
      },
      {id: "read_poetry", label: "Poetry", icon: "📚", categoryId: "reading"},
      {
        id: "read_psychology",
        label: "Psychology",
        icon: "📚",
        categoryId: "reading",
      },
      {id: "read_romance", label: "Romance", icon: "📚", categoryId: "reading"},
      {id: "read_scifi", label: "Sci-fi", icon: "📚", categoryId: "reading"},
      {id: "read_science", label: "Science", icon: "📚", categoryId: "reading"},
    ],
  },
  {
    id: "travelling",
    title: "Travelling",
    defaultVisible: 8,
    interests: [
      {
        id: "travel_backpack",
        label: "Backpacking",
        icon: "🎒",
        categoryId: "travelling",
      },
      {
        id: "travel_beach",
        label: "Beaches",
        icon: "🏖️",
        categoryId: "travelling",
      },
      {
        id: "travel_camping",
        label: "Camping",
        icon: "⛺",
        categoryId: "travelling",
      },
      {
        id: "travel_city",
        label: "City breaks",
        icon: "🌇",
        categoryId: "travelling",
      },
      {
        id: "travel_country",
        label: "Country escapes",
        icon: "🏡",
        categoryId: "travelling",
      },
      {
        id: "travel_hiking",
        label: "Hiking trips",
        icon: "⛰️",
        categoryId: "travelling",
      },
      {
        id: "travel_road",
        label: "Road trips",
        icon: "🛣️",
        categoryId: "travelling",
      },
      {
        id: "travel_solo",
        label: "Solo trips",
        icon: "🧳",
        categoryId: "travelling",
      },
      {
        id: "travel_spa",
        label: "Spa weekends",
        icon: "🛀",
        categoryId: "travelling",
      },
      {
        id: "travel_winter",
        label: "Winter sports",
        icon: "❄️",
        categoryId: "travelling",
      },
    ],
  },
  {
    id: "music",
    title: "Music",
    defaultVisible: 8,
    interests: [
      {id: "music_afro", label: "Afro", icon: "🎵", categoryId: "music"},
      {id: "music_arab", label: "Arab", icon: "🎵", categoryId: "music"},
      {id: "music_blues", label: "Blues", icon: "🎵", categoryId: "music"},
      {
        id: "music_classical",
        label: "Classical",
        icon: "🎵",
        categoryId: "music",
      },
      {id: "music_country", label: "Country", icon: "🎵", categoryId: "music"},
      {id: "music_desi", label: "Desi", icon: "🎵", categoryId: "music"},
      {id: "music_edm", label: "EDM", icon: "🎵", categoryId: "music"},
      {
        id: "music_electronic",
        label: "Electronic",
        icon: "🎵",
        categoryId: "music",
      },
      {id: "music_indie", label: "Indie", icon: "🎵", categoryId: "music"},
      {id: "music_jazz", label: "Jazz", icon: "🎵", categoryId: "music"},
      {id: "music_rock", label: "Rock", icon: "🎵", categoryId: "music"},
    ],
  },
  {
    id: "film_tv",
    title: "Film & TV",
    defaultVisible: 10,
    interests: [
      {
        id: "tv_action",
        label: "Action & adventure",
        icon: "📺",
        categoryId: "film_tv",
      },
      {id: "tv_animated", label: "Animated", icon: "📺", categoryId: "film_tv"},
      {id: "tv_anime", label: "Anime", icon: "📺", categoryId: "film_tv"},
      {
        id: "tv_bollywood",
        label: "Bollywood",
        icon: "📺",
        categoryId: "film_tv",
      },
      {id: "tv_comedy", label: "Comedy", icon: "📺", categoryId: "film_tv"},
      {
        id: "tv_cooking",
        label: "Cooking shows",
        icon: "📺",
        categoryId: "film_tv",
      },
      {id: "tv_crime", label: "Crime", icon: "📺", categoryId: "film_tv"},
      {
        id: "tv_docs",
        label: "Documentaries",
        icon: "📺",
        categoryId: "film_tv",
      },
      {id: "tv_drama", label: "Drama", icon: "📺", categoryId: "film_tv"},
      {id: "tv_fantasy", label: "Fantasy", icon: "📺", categoryId: "film_tv"},
      {
        id: "tv_game_shows",
        label: "Game shows",
        icon: "📺",
        categoryId: "film_tv",
      },
      {id: "tv_horror", label: "Horror", icon: "📺", categoryId: "film_tv"},
      {id: "tv_indie", label: "Indie", icon: "📺", categoryId: "film_tv"},
      {id: "tv_kdrama", label: "K-drama", icon: "📺", categoryId: "film_tv"},
      {id: "tv_mystery", label: "Mystery", icon: "📺", categoryId: "film_tv"},
      {
        id: "tv_reality",
        label: "Reality shows",
        icon: "📺",
        categoryId: "film_tv",
      },
      {id: "tv_romcom", label: "Rom-com", icon: "📺", categoryId: "film_tv"},
    ],
  },
  {
    id: "pets",
    title: "Pets",
    defaultVisible: 6,
    interests: [
      {id: "pet_birds", label: "Birds", icon: "🐦", categoryId: "pets"},
      {id: "pet_cats", label: "Cats", icon: "🐱", categoryId: "pets"},
      {id: "pet_dogs", label: "Dogs", icon: "🐶", categoryId: "pets"},
      {id: "pet_fish", label: "Fish", icon: "🐠", categoryId: "pets"},
      {id: "pet_turtles", label: "Turtles", icon: "🐢", categoryId: "pets"},
    ],
  },
  {
    id: "personality",
    title: "Personality & traits",
    defaultVisible: 8,
    interests: [
      {
        id: "trait_ambition",
        label: "Ambition",
        icon: "🚀",
        categoryId: "personality",
      },
      {
        id: "trait_active",
        label: "Being active",
        icon: "🏆",
        categoryId: "personality",
      },
      {
        id: "trait_family",
        label: "Being family-oriented",
        icon: "💗",
        categoryId: "personality",
      },
      {
        id: "trait_open",
        label: "Being open-minded",
        icon: "🧠",
        categoryId: "personality",
      },
      {
        id: "trait_romantic",
        label: "Being romantic",
        icon: "💘",
        categoryId: "personality",
      },
      {
        id: "trait_kind",
        label: "Kindness",
        icon: "🤝",
        categoryId: "personality",
      },
      {
        id: "trait_humor",
        label: "Playful humor",
        icon: "😄",
        categoryId: "personality",
      },
    ],
  },
];

const interestById = new Map<string, ProfileInterestItem>();
for (const cat of INTEREST_CATALOG) {
  for (const item of cat.interests) {
    interestById.set(item.id, item);
  }
}

export function getCatalogInterest(
  id: string
): ProfileInterestItem | undefined {
  return interestById.get(id);
}
