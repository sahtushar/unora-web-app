/**
 * Central UI copy for `src/features/**` screens.
 * Add or edit strings here to keep product language consistent and easy to localize later.
 */

export const strings = {
  brand: {
    /** Shown in the slim shell header above every signed-in screen. */
    shell: {
      wordmark: "Unora",
      ariaLabel: "Unora",
    },
    /**
     * Rotating marketing / hero lines — one-connection, calm-intent dating.
     * Pick with `Math.floor(Math.random() * strings.brand.taglines.length)` or cycle in UI.
     */
    taglines: [
      "Fewer threads. More room for something real.",
      "Match your vibe—not your stress level.",
      "Built for depth in a shallow-scroll world.",
      "Your attention is sacred. We built Unora that way.",
      "Slow the scroll. Protect the spark.",
      "Dating that leaves space for your life—and someone worth it.",
      "Clear intentions. Quiet inbox. One lane for romance.",
      "Less performative chemistry. More honest presence.",
      "Where mutual interest waits without the pressure cooker.",
      "Calm beats chaos—connection with guardrails.",
      "Find your person without losing your peace.",
      "Unora: intention first, infinite scroll never.",
      "One connection at a time—because your focus isn’t infinite.",
      "No juggling hearts. One thread, fully felt.",
      "One open lane for love. Everything else can wait.",
      "When you’re in, you’re all in—and Unora keeps it that simple.",
      "Less parallel plotlines. One story worth finishing.",
      "One story ❤️ worth finishing.",
      "Quality over quantity, starting with one honest yes.",
      "One name in lights—not a whole roster in your head.",
      "Romance isn’t a tournament. One court, one shot at real.",
    ],
  },

  previewWelcome: {
    backdropDismissAria: "Dismiss welcome dialog",
    closeAria: "Close",
    title: "Unlock matches around you",
    leadStart: "Unora gets brighter when it knows ",
    leadEmphasis: "where your device is",
    leadMid:
      " - not to follow you around, but to find people who are actually ",
    leadEmphasis2: "close enough to meet",
    leadEnd:
      ". Enable location when your device asks, and your matches around you get instantly smarter.",
    midStart: "Your exact spot stays private; location helps tune ",
    midEmphasis: "nearby discovery, distance, and local matches",
    midEnd:
      " so every profile feels closer to your real world, not just your screen.",
    feedbackIntro:
      "One quick yes now saves you from browsing great profiles that are nowhere near your orbit.",
    feedbackStart: "Write to ",
    feedbackEmail: "sahtushar@gmail.com",
    feedbackMid: " - ",
    feedbackEmphasis: "we will help you switch location on",
    feedbackEnd: " if the prompt does not appear.",
    dismissCta: "I'll enable location",
    feedbackCta: "Need help",
    emailSubject: "Unora location help",
  },

  installPrompt: {
    title: "Install Unora for faster access",
    description:
      "Get an app-like experience on your device — quick launch, smooth flow, and less browser clutter.",
    installCta: "Install app",
    dismissAria: "Dismiss install prompt",
    iosDescription:
      "On iPhone/iPad, install from Safari using Add to Home Screen.",
    iosStepShare: "Tap Share, then",
    iosStepAdd: "Add to Home Screen.",
    iosGotItCta: "Got it",
    installedTitle: "Unora installed",
    installedDescription:
      "You can now launch Unora directly from your home screen.",
  },

  discover: {
    title: "Discover",
    empty: {
      title: "You’re caught up",
      description:
        "When new people align with your intentions, they’ll appear here quietly — no pressure to rush.",
      footnote:
        "Unora keeps Discover paced on purpose — calm beats infinite scrolling.",
      ctaConnection: "Go to Connection",
    },
    refreshCountdown: (hours: number) => `See new people in ${hours} hours.`,
    introVibe:
      "Connect over common ground with people who match your vibe, refreshed every day.",
    /** Section title above the active-connection card on Discover */
    activeConnectionHeading: "Your active connection",
    recommendedHeading: "Recommended for you",
    recommendationNote: "Based on your profile and past matches.",
    similarInterestsHeading: "Others in your orbit",
    /** Shown when the user taps Like while an active connection exists. */
    likeBlockedTitle: "One connection at a time",
    likeBlockedBody:
      "Unmatch when you’re ready for someone new — then Discover unlocks again.",
    likeBlockedDismiss: "Got it",
    helpAriaLabel: "Help with Discover",
    activeConnection: {
      title: "Active connection",
      /** Shown in the hint bar when session has no peer name yet */
      unnamedMatch: "Your match",
      footnoteBeforeLink: "Mutual interest waits in",
      footnoteLink: "Interested",
      footnoteAfterLink: "— calm until you make room for someone new.",
      taglines: [
        "One intentional thread — your attention stays undivided.",
        "Depth over noise: one conversation gets the room to grow.",
        "Less inbox chaos. More space for something real.",
        "One heart, one thread — dating that respects your focus.",
        "Presence beats pace — your active connection lives here.",
        "Real closeness needs one room, not ten half-open chats.",
        "Curated connection: one thread, your whole energy.",
        "Intentional by design — one active space for romance.",
        "One connection at a time — that’s the whole point.",
        "No side quests. One main storyline for your heart.",
        "Your roster isn’t a spreadsheet — one person gets the spotlight.",
        "Give one thread the room to turn into something big.",
        "Serial small talk ends where single-thread depth begins.",
        "One open heart, one open chat — everything else waits its turn.",
        "Unora slows the lane so one match can actually breathe.",
        "Save the multi-chat chaos for another app.",
        "One yes at a time. That’s how something real gets air.",
        "Stacked chats dilute chemistry — one keeps the heat.",
      ],
    },
    profileCard: {
      noPhoto: "No photo",
      pass: "Pass",
      likeAriaLabel: "Like",
      previewModeAria: "Profile preview",
      compatibilityHeading: "Compatibility",
      whyMatchPrefix: "Why this match:",
    },
    similarStrip: {
      photoPlaceholder: "—",
      selectProfileAria: (name: string, age: number) =>
        `Show ${name}, ${age} as your main recommendation`,
    },
    detailedProfile: {
      closeAria: "Close profile",
      openFullProfileAria: (name: string) => `Open ${name}’s full profile`,
      photoVerified: "Photo verified",
      noteDecorAria: "Note",
      highlightDecorAria: "Highlight",
      aboutTitle: "About me",
      alignmentTitle: "What lines up",
      interestsTitle: "My interests",
      highlightTitle: "What caught our eye",
      compatibilityTitle: "Unora compatibility",
      whyMatchLead: "Why this match",
      locationTitle: "My location",
      hometownLine: (hometown: string) => `Hometown · ${hometown}`,
      basedIn: (city: string) => `Lives in ${city}`,
      aroundCity: (city: string) => `Often around ${city}`,
      nearYouHint: "Within the distance you’ve set (preview).",
      block: "Block",
      report: "Report",
      passCta: "Not for me",
      likeCta: "Like",
      photosTitle: "More photos",
      emphasisCommentCta: "Comment",
      emphasisCommentAria:
        "Comment on this — preview only, messaging is not available yet",
      safetyTitle: "Safety",
      safetyFootnote:
        "Block and report are preview actions — real tools ship with moderation.",
    },
  },

  interested: {
    title: "Matches",
    subtitle: "People who have liked you and your matches — in one calm place.",
    sortAria: "Sort matches",
    sections: {
      mutualMatch: "Mutual Match",
      likedYou: "Liked You",
      mutualMatchDescription:
        "Two green lights met — your soft signal that the feeling’s mutual.",
      likedYouDescription:
        "They reached out first — say hello back when curiosity wins.",
    },
    switchConnectionModal: {
      backdropDismissAria: "Dismiss dialog",
      closeAria: "Close",
      title: "Room for one main story?",
      leadStart: "Unora keeps ",
      leadEmphasis: "one gentle conversation",
      leadEnd: " at a time — calm beats chaos.",
      hookStart: "To open ",
      hookEmphasisConnection: "Connection",
      hookMid: " with this new mutual match, you’ll first make space by ",
      hookEmphasisKind: "ending things kindly",
      hookEnd: " with who you’re talking to now.",
      swapDiagramLabel: "What shifts",
      currentLabel: "Active now",
      incomingLabel: "New match",
      cancelCta: "I’ll stay put",
      confirmCta: "Switch — I’m sure",
      previewNote:
        "Preview: real swaps ship with the API — today we’re just setting the tone.",
      personLine: (name: string, age?: number | null) =>
        age === undefined || age === null ? name : `${name}, ${age}`,
    },
    matchTile: {
      nameAgeLine: (name: string, age: number) => `${name}, ${age}`,
      passLabel: "Pass",
      likeLabel: "Like",
      actionsDisabledHint: "Preview — actions connect when this flow ships.",
      readyBadgeLabel: "Ready to connect",
      goToConnectionAria: "Open Connection",
    },
    empty: {
      title: "All quiet here",
      description:
        "Nothing is waiting on you right now — new mutual interest will show up softly, without spam or urgency.",
      footnote:
        "Designed to scale with pagination later; the calm layout stays.",
    },
    paginationFooter:
      "Pagination will plug in behind this list — the layout stays the same.",
    row: {
      ready_to_connect: {
        label: "Ready to connect",
        hint: "You can invite when it feels right.",
        tone: "success" as const,
      },
      waiting: {
        label: "Waiting",
        hint: "No action needed — we’ll keep this unhurried.",
        tone: "neutral" as const,
      },
    },
    openButton: "Open",
  },

  connection: {
    title: "Connection",
    subtitleEmpty: "One intentional space for your active match.",
    subtitleActive: (relativeDay: string) =>
      `Connected ${relativeDay} · calm, focused chat`,
    empty: {
      title: "No active connection yet",
      description:
        "When you and someone both choose each other — and you’re ready — this becomes a quiet home for one conversation at a time.",
      footnote: "One active connection keeps attention where it matters.",
      browseDiscover: "Browse Discover",
      viewInterested: "View matches",
    },
    activeBadge: "Active connection",
    detailsDisabled: "Details",
    startersSection: {
      title: "Start gently",
      description:
        "Pick a prompt if you want a softer opening — no pressure to perform.",
    },
    messagesHeading: "Messages",
    previewDisabledSending: "Sending is disabled in this preview build.",
  },

  profile: {
    title: "Profile",
    subtitle: "Your presence on Unora — clear, calm, complete.",
    header: {
      helpAria: "Help and support",
      settingsAria: "Settings",
    },
    summary: {
      completeProfile: "Complete profile",
      verifiedAria: "Verified on Unora",
    },
    edit: {
      title: "Edit profile",
      backAria: "Back to profile",
      editTab: "Edit",
      viewTab: "View",
      publicPreviewHint:
        "A preview of how you can look on a Discover card to others, using your current editor fields.",
      previewMatchLabel: "Your profile",
      previewWhyMatch:
        "A quick read of how your story, basics, and prompts come together.",
      previewPlaceholderBullet:
        "Add “What lines up” lines in the editor to preview them here.",
    },
    badgeWomenFirst: "Women-first safeguards on",
    appearance: {
      title: "Appearance",
      description:
        "Dress Unora in a mood that fits you — calm, warm, or quietly bold.",
      activeLabel: "Active",
    },
    photos: {
      title: "Photos",
      description:
        "Add up to eight photos, crop each one square, and reorder by removing and adding as you like.",
    },
    about: {
      title: "About you",
    },
    preferences: {
      title: "Preferences",
      seekingPrefix: "Seeking:",
      ageDistance: (min: number, max: number, km: number) => {
        const dist =
          km > 200 ? "Within 200+ km" : km === 0 ? "0 km" : `Within ${km} km`;
        return `Age ${min}–${max} · ${dist}`;
      },
    },
    verification: {
      title: "Verification",
      description:
        "Trust is built in layers — show what you’re comfortable with.",
      manage: "Manage",
      items: {
        phone: "Phone",
        photo: "Photo",
        id: "ID",
      },
      verified: "Verified",
      notYet: "Not yet",
    },
    profileCreation: {
      completion: {
        heading: "Completion Progress",
        progressAriaLabel: "How complete your profile is",
        almostThere:
          "You’re almost there — a few honest details, and your profile starts speaking for you.",
      },
      bio: {
        title: "Bio",
        hint: "Short beats perfect. Lead with warmth and one concrete detail.",
        placeholder:
          "e.g. Slow weekends, good boundaries, and I show up on time for the people I care about.",
      },
      basics: {
        title: "Basics",
        hint: "The small facts that make you feel like a real person, not a template.",
        showPublicly: "Show publicly",
      },
      locationPicker: {
        title: "Find your current city",
        searchPlaceholder: "Search cities",
        searchLabel: "Search cities",
        listLabel: "City suggestions",
        backAria: "Close city search",
        typeToSearch: "Type at least two letters to search.",
        searchLoading: "Searching…",
        empty: "No matches — try another spelling.",
        searchFailed: "Couldn’t load results. Try again in a moment.",
        missingToken:
          "Location search needs a Mapbox token — set VITE_MAPBOX_ACCESS_TOKEN in your environment.",
      },
      lifestyle: {
        title: "Lifestyle & values",
        hint: "Optional for some — helpful for others. Share what you’re comfortable with.",
      },
      interests: {
        title: "Interests",
        hint: "Pick a few that actually show up in your week — not a whole résumé.",
        minNote:
          "Choose at least two so Discover has something gentle to align on.",
        openPicker: "Browse by category",
        emptySelection: "Nothing here yet — add a few below.",
        pickerHint:
          "Tap to add or remove. Your picks also appear on your profile card.",
      },
      interestPicker: {
        title: "Interests",
        backAria: "Back to profile editor",
        continue: "Save Interests",
        continueDisabledHint: "Pick at least two to continue.",
        footerDockAria: "Interest picker actions",
        selectionRemaining:
          "You can choose {count} more — up to {max} in total.",
        selectionFull: "You’ve reached the maximum for now.",
        showMore: "Show more",
        showLess: "Show less",
        legacySelectedTitle: "Saved from an earlier list",
      },
      prompt: {
        title: "Conversation starter",
        hint: "Finish the line below — one honest sentence is enough.",
        label: "I’m hoping you…",
        placeholder:
          "…like unhurried plans, kind humor, and checking in without drama.",
      },
      alignment: {
        title: "What lines up",
        hint: "Add up to three short lines — they show as chips on detailed profiles, next to your conversation starter.",
        previewLabel: "Preview",
        line1Label: "Line 1",
        line2Label: "Line 2",
        line3Label: "Line 3",
        placeholder: "e.g. Both value clarity and warmth",
      },
      photos: {
        richGalleryHint:
          "Six or more photos score higher — optional, but it helps people feel your presence.",
        addPhoto: "Add photo",
        addPhotoAria: "Add a new profile photo",
        replacePhotoAria: "Adjust crop for this photo",
        removePhotoAria: "Remove this photo",
        maxPhotosNote: "You can add up to 8 photos.",
        maxPhotosReached: "Maximum of 8 photos reached.",
        cropTitle: "Adjust & crop",
        cropHint:
          "Drag to frame your face. Pinch or use the slider to zoom — works in mobile browsers too.",
        zoomLabel: "Zoom",
        saveCrop: "Save",
        cancelCrop: "Cancel",
        fileTooLarge: "That file is too large. Try one under 20 MB.",
        fileTypeInvalid: "Please choose an image file (JPEG, PNG, or WebP).",
        cropFailed: "Could not process this image. Try another photo.",
      },
      preferences: {
        hint: "Tune who you meet and how far you’re willing to travel — honesty saves everyone time.",
        seekingHint: "Who you’re open to",
        intentionsLabel: "What you’re looking for",
        intentionsLabelShort: "Looking for",
        intentionsPresetHint:
          "Pick a starting point — you can fine-tune the text underneath.",
        intentionsPlaceholder: "e.g. Serious, slow pace",
        intentionPresets: {
          serious_when_right: "Serious when it fits",
          open_exploring: "Open — see where it goes",
          friends_first: "Friends first",
          life_partner: "Long-term partner",
          figuring_out: "Still figuring it out",
        },
        intentionsDetailLabel: "Your wording",
        intentionsDetailHint:
          "Optional: adjust the line so it sounds exactly like you.",
        ageMinLabel: "Minimum age",
        ageMaxLabel: "Maximum age",
        ageRangeTitle: "Age",
        ageRangeStrictLabel: "This is a deal-breaker",
        ageRangeStrictHint:
          "We only show you people in this range, and you only show up to people whose range includes your age.",
        ageRangeStrictActiveHint: "· Age is a hard filter",
        distanceRangeTitle: "Distance",
        distanceSliderValue: (km: number) => (km > 200 ? "200+" : String(km)),
      },
      seekingLabels: {
        Men: "Men",
        Women: "Women",
        Nonbinary: "Non-binary",
      },
      fields: {
        jobTitle: "Job title",
        companyName: "Company name",
        degree: "Degree",
        schoolName: "College/School name",
        location: "Location",
        hometown: "Hometown",
        height: "Height (in cm)",
        exercise: "Exercise",
        drinking: "Drinking",
        smoking: "Smoking",
        kids: "Kids (plans)",
        haveKids: "Have kids",
        politics: "Politics",
        religion: "Religion",
        pronouns: "Pronouns",
        languages: "Languages",
        languagesMultiPlaceholder: "Choose up to 3 languages",
        zodiac: "Zodiac",
        placeholderShort: "Add",
        selectPlaceholder: "Choose",
      },
      completionHints: {
        bio: "Stretch your bio with one more sentence — about thirty characters reads grounded.",
        photos: "Add at least two photos so people can recognize your energy.",
        photosRich:
          "Add six or more photos if you want your gallery to feel complete.",
        pref_seeking: "Choose at least one group you’re open to meeting.",
        pref_age: "Set a valid age range (minimum under maximum, 18–99).",
        pref_distance:
          "Set a maximum distance (0–200+ km) in your preferences.",
        pref_intentions: "Add a clear sentence about what you’re looking for.",
        verify_phone:
          "Verify your phone when you’re ready — it anchors account safety.",
        verify_photo: "Complete photo verification so matches know it’s you.",
        verify_id:
          "Optional ID verification carries the strongest trust signal.",
        jobTitle: "Add your role or title.",
        companyName: "Add where you work.",
        degree: "Choose the option that best matches your education.",
        schoolName: "Add the school or college name.",
        location: "Add where you spend most of your time.",
        hometown: "Hometown helps long-distance context feel human.",
        height:
          "Height in centimeters is optional but reduces awkward guessing.",
        exercise: "Exercise rhythm helps lifestyle fit.",
        drinking: "Drinking preference keeps expectations kind.",
        smoking: "Smoking preference keeps expectations kind.",
        kids: "Share how you think about kids, if you want.",
        haveKids: "Note whether you have children, if you want.",
        politics: "Politics can stay private — or add a light label.",
        religion: "Religion can stay private — or add a light label.",
        pronouns: "Pronouns make introductions smoother for everyone.",
        languages: "Languages signal how you connect across backgrounds.",
        zodiac: "Zodiac is playful — skip if it’s not you.",
        interests: "Pick two or more interests from the list.",
        prompt: "Answer the prompt in a sentence or two.",
      },
      interestLabels: {
        reads: "Reads daily",
        coffee: "Coffee ritual",
        hiking: "Hiking",
        cooking: "Cooking",
        music_live: "Live music",
        travel_slow: "Slow travel",
        therapy_positive: "Therapy-positive",
        early_riser: "Early riser",
      },
      selectChoose: "Choose",
      selectOptions: {
        exercise: {
          often: "Often",
          sometimes: "Sometimes",
          rarely: "Rarely",
        },
        drinking: {
          yes_social: "Socially",
          sometimes: "Sometimes",
          no: "Not really",
        },
        smoking: {
          no: "No",
          sometimes: "Sometimes",
          yes: "Yes",
        },
        zodiac: {
          aries: "Aries",
          taurus: "Taurus",
          gemini: "Gemini",
          cancer: "Cancer",
          leo: "Leo",
          virgo: "Virgo",
          libra: "Libra",
          scorpio: "Scorpio",
          sagittarius: "Sagittarius",
          capricorn: "Capricorn",
          aquarius: "Aquarius",
          pisces: "Pisces",
        },
        haveKids: {
          no: "No",
          yes: "Yes",
          prefer_not_to_say: "Prefer not to say",
        },
        politics: {
          liberal: "Liberal",
          moderate: "Moderate",
          conservative: "Conservative",
          progressive: "Progressive",
          libertarian: "Libertarian",
          independent: "Independent",
          apolitical: "Apolitical",
          other: "Other",
          prefer_not_to_say: "Prefer not to say",
        },
        religion: {
          agnostic: "Agnostic",
          atheist: "Atheist",
          buddhist: "Buddhist",
          christian: "Christian",
          hindu: "Hindu",
          jewish: "Jewish",
          muslim: "Muslim",
          sikh: "Sikh",
          spiritual_not_religious: "Spiritual, not religious",
          other: "Other",
          prefer_not_to_say: "Prefer not to say",
        },
        pronouns: {
          she_her: "She/her",
          he_him: "He/him",
          they_them: "They/them",
          she_they: "She/they",
          he_they: "He/they",
          they_she: "They/she",
          other: "Other",
          prefer_not_to_say: "Prefer not to say",
        },
        degree: {
          high_school: "High school",
          some_college: "Some college",
          associate: "Associate degree",
          bachelors: "Bachelor's degree",
          masters: "Master's degree",
          doctorate: "Doctorate (PhD, etc.)",
          professional: "Professional (MD, JD, etc.)",
          trade_cert: "Trade / certification",
          others: "Others",
        },
      },
    },
    profileCompletionFlow: {
      next: {
        finish: "Finish profile",
        toAbout: "Continue to about me",
        toInterests: "Continue to interests",
        toLocation: "Continue to location",
        toPreferences: "Continue to preferences",
      },
      saveError: "Could not save right now. Please try again.",
      saving: "Saving...",
      slides: {
        about: {
          continueDisabledHint:
            "Write at least {count} characters to continue.",
          description:
            "Share a short about-me line to help matches understand you.",
          fieldLabel: "About me",
          minHint: "Keep it thoughtful. Minimum {count} characters.",
          placeholder:
            "I am at my best when... / Friends say I bring... / Looking for someone who...",
          remainingHint: "{count} characters left",
          suggestionsTitle: "Need ideas? Tap one to use it",
          suggestions: [
            "Intentional about time, energy, and who gets access to my attention.",
            "Calm communicator with a playful side and a soft spot for good chai.",
            "I value kindness, consistency, and people who mean what they say.",
            "Big on deep talks, small joys, and plans that actually happen.",
            "I bring emotional maturity, dry humor, and very good playlists.",
            "Low-drama life, high-effort love, and clear communication always.",
            "A romantic realist who believes effort is the loudest love language.",
            "I am happiest around warm people, meaningful routines, and honest words.",
            "I choose peace over chaos and depth over performative vibes.",
            "Thoughtful by default, adventurous when the company feels right.",
            "Career-focused but never too busy to show up with intention.",
            "Soft heart, sharp boundaries, and a healthy respect for time.",
            "I like laughter, clarity, and conversations that go beyond small talk.",
            "Emotionally available and looking for the same energy in return.",
            "I enjoy slow mornings, long walks, and people who are emotionally fluent.",
            "Confident, grounded, and still curious about life and love.",
            "I am here for a real connection, not a passing distraction.",
            "I love people who are warm, witty, and serious about growth.",
            "Give me books, coffee, and someone who communicates with care.",
            "I value trust, tenderness, and consistency over grand gestures.",
            "Ambitious in life, intentional in love, and loyal in relationships.",
            "I am a listener first, fixer second, and hype person always.",
            "Sarcasm in moderation, empathy in abundance, and honesty always.",
            "I appreciate emotional intelligence, accountability, and gentle humor.",
            "Stable life, soft heart, and zero interest in mixed signals.",
            "I am building a peaceful life and want a partner who adds to it.",
            "Good energy, clear words, and aligned intentions matter most to me.",
            "I enjoy meaningful company, spontaneous plans, and staying emotionally real.",
            "I show love through consistency, care, and being fully present.",
            "I am intentional with love and playful with everything else.",
            "Looking for someone kind, curious, and capable of real partnership.",
            "I believe love should feel safe, honest, and a little magical.",
            "I am equal parts cozy-home person and weekend-adventure planner.",
            "I value growth, gratitude, and people who keep their promises.",
            "Comfortable in my own company and excited to build with the right person.",
            "I lead with empathy, communicate clearly, and love with intention.",
            "Big believer in soft love, shared goals, and healthy boundaries.",
            "I like my relationships like my tea: warm, honest, and steady.",
            "Kind heart, ambitious mind, and a laugh that comes easily.",
            "I am ready for something intentional, reciprocal, and genuinely joyful.",
          ],
          title: "What should someone know about you?",
        },
        interests: {
          continueDisabledHint: "Pick at least 2 interests to continue.",
          description:
            "Choose interests that actually reflect your day-to-day vibe.",
          emptySelection: "Select at least two interests",
          minHint: "The more real this feels, the better your matches get.",
          selectionFull: "Selection full",
          selectionRemaining: "{count} picks left (max {max})",
          showLess: "Show less",
          showMore: "Show more",
          title: "What are you into?",
        },
        location: {
          description: "Only your neighborhood is shown to matches.",
          title: "Where do you live?",
        },
        preferences: {
          description:
            "Choose one dating intention and who you are open to meeting.",
          title: "What are you looking for?",
        },
        welcome: {
          description:
            "A few basics help us set up a calm, intentional experience.",
          fields: {
            dateOfBirth: "Date of birth",
            dateOfBirthPlaceholder: "DD-MM-YYYY",
            firstName: "First name",
            firstNamePlaceholder: "Your name",
            gender: "Gender",
            genderOptions: {
              man: "Man",
              nonbinary: "Non-binary",
              preferNotToSay: "Prefer not to say",
              woman: "Woman",
            },
            lastName: "Last name",
            lastNamePlaceholder: "Optional",
            lastNamePrivacy:
              "Kept private by default. We only show your last name to mutual matches and your current or past connections.",
          },
          locationPrompt: {
            backdropDismissAria: "Location prompt requires action",
            cta: "Enable location",
            description:
              "Turn on location so Unora can bring nearby matches into focus. Your exact spot stays private; it simply helps us show people close enough for real plans.",
            error:
              "Location is required to continue. Please allow location access when your device asks.",
            geocodeError:
              "We could not read your city from that location. Please try again with location services enabled.",
            loadingCta: "Finding your area...",
            saveError:
              "We could not save your location just now. Please try again.",
            unsupported:
              "This device or browser does not support location access. Try again from a browser with location services enabled.",
            title: "Find matches around you",
          },
          title:
            "Start with a few details so your profile feels unmistakably you.",
        },
      },
      location: {
        areaLabel: "Area / city / postcode",
        emptyLocation: "Set your area on the map",
        mapAriaLabel: "Location map picker",
        privacyLine:
          "Your exact pin stays private - matches only see a nearby area, never your doorstep.",
        readOnlyLine:
          "This line is filled automatically from the map so your pin and area always match.",
        useCurrentLocation: "Use my current location",
        useCurrentLocationLoading: "Detecting location...",
      },
    },
    account: {
      title: "Account",
      description:
        "Session preview — swap for real auth flows when the API is ready.",
      signOut: "Sign out",
    },
  },

  auth: {
    brandName: "Unora",
    /** Header tagline — heart is rendered in UI between these fragments */
    taglineBefore: "One story",
    taglineAfter: "worth finishing.",
    welcomeTitle: {
      lead: "One lane for ",
      /** “l” + heart + “ve” — heart replaces “o”; `loveAriaLabel` names the word for assistive tech. */
      loveLeft: "l",
      loveRight: "ve",
      loveAriaLabel: "love",
      bridge: "—begin with ",
      intention: "intention",
      end: ".",
    },
    welcomeSubtitle:
      "Sign in or create an account — calm, intentional, and yours to control.",
    continueGoogle: "Continue with Google",
    googleError: "Something went wrong. Please try again.",
    networkError:
      "We could not reach Unora. Check your connection and try again.",
    serverError: "Unora is having trouble right now. Please try again shortly.",
    sessionExpired: "Your session expired. Please sign in again.",
    googleEmailNotVerified:
      "Google could not confirm a verified email for this account. Use a verified Google email to continue.",
    legal: {
      prefix: "By signing up, you agree to our",
      terms: "Terms",
      mid: ". See how we use your data in our",
      privacy: "Privacy Policy",
      suffix: ".",
    },
  },
} as const;

export type FeatureStrings = typeof strings;
