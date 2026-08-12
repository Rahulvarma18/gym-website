export const nav = [
  { label: "Home", href: "#home" },
  { label: "Programs", href: "#programs" },
  { label: "Coaches", href: "#coaches" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export const programs = [
  {
    tag: "Strength",
    title: "Strength & Bodybuilding",
    description:
      "Structured muscle-building and strength cycles on barbells, machines, and free weights — coached form, not guesswork.",
    details: ["6 days / week access", "Personalised split", "Diet guidance included"],
    plate: 45,
    bgImage: "/trio-left.png",
  },
  {
    tag: "Transformation",
    title: "Weight Loss & Fat Burn",
    description:
      "Combined strength and cardio programming built to drop weight and keep it off, with monthly progress check-ins.",
    details: ["Cardio + weights mix", "Monthly inbody check-in", "Diet plan support"],
    plate: 25,
    bgImage: "/trio-center.png",
  },
  {
    tag: "Functional",
    title: "Functional Fitness",
    description:
      "Circuit-based training for everyday strength, mobility, and stamina — no machines required, just real work.",
    details: ["Group circuit classes", "Mobility & core focus", "All fitness levels"],
    plate: 35,
    bgImage: "/trio-right.png",
  },
];

// Cards for the scroll-pinned "Lookbook" style stack near the bottom of
// the homepage — one card pins center-screen while giant background type
// scrolls past, cross-fading through each entry as the user scrolls.
export const sessions = [
  {
    tag: "Leg Day",
    season: "STRENGTH BLOCK",
    date: "MON / THU",
    focus: "Squat, hinge & unilateral work",
    equipment: "Barbell rack",
    img: "./image copy.png",
  },
  {
    tag: "Push Day",
    season: "STRENGTH BLOCK",
    date: "TUE / FRI",
    focus: "Chest, shoulders & triceps",
    equipment: "Free weights",
    img: "image copy 2.png",
  },
  {
    tag: "Pull Day",
    season: "STRENGTH BLOCK",
    date: "WED / SAT",
    focus: "Back, biceps & grip work",
    equipment: "Pull-up rig",
    img: "image copy 3.png",
  },
  {
    tag: "Conditioning",
    season: "CIRCUIT BLOCK",
    date: "SATURDAY",
    focus: "Full-body metabolic circuit",
    equipment: "Open floor",
    img: "image copy 4.png",
  },
];

export const stats = [
  { value: "3,000", unit: "sq/ft", label: "Training floor", plate: 45 },
  { value: "18", unit: "", label: "Stations & platforms", plate: 35 },
  { value: "8:1", unit: "", label: "Member to coach", plate: 25 },
  { value: "500+", unit: "", label: "Members trained", plate: 10 },
];

export const coaches = [
  {
    name: "Ravi Teja Varma",
    role: "Head Coach · Strength & Bodybuilding",
    bio: "Certified strength coach with 10+ years training competitive lifters across Andhra Pradesh.",
    img: "./image copy 5.png",
  },
  {
    name: "Srinivas Reddy",
    role: "Weight Loss & Transformation",
    bio: "Specialises in fat-loss programming and nutrition planning for busy working professionals.",
    img: "./image copy 6.png",
  },
  {
    name: "Naveen Kumar Chowdary",
    role: "Functional Fitness",
    bio: "Runs the circuit and mobility floor. Focused on building everyday strength that lasts.",
    img: "image copy 12.png",
  },
];

export const pricingTiers = [
  {
    name: "Weekly",
    description: "Try the floor before you commit. Full access, no strings.",
    price: "₹399",
    period: "/week",
    featured: false,
    features: ["Full gym access", "Equipment orientation", "1 guest pass"],
  },
  {
    name: "Monthly",
    description: "Our most popular plan. Full access plus coaching support.",
    price: "₹1,499",
    period: "/month",
    featured: true,
    features: [
      "Everything in Weekly",
      "Personalised diet guidance",
      "Monthly progress check-in",
      "2 guest passes / month",
    ],
  },
  {
    name: "Yearly",
    description: "Best value for members who are in it for the long haul.",
    price: "₹12,999",
    period: "/year",
    featured: false,
    features: [
      "Everything in Monthly",
      "2 months free vs. monthly",
      "Quarterly inbody analysis",
      "Priority class booking",
    ],
  },
];

export const faqs = [
  {
    q: "Do I need to be experienced?",
    a: "Not at all. Our coaches will walk you through every machine and lift on day one.",
  },
  {
    q: "Is there a joining contract?",
    a: "No long-term contract. Choose weekly, monthly, or yearly — cancel or switch any time.",
  },
  {
    q: "Can I bring a friend?",
    a: "Yes. Every plan includes guest passes to bring someone along.",
  },
  {
    q: "Do you offer diet plans?",
    a: "Yes, all Monthly and Yearly members get personalised diet guidance from our coaches.",
  },
];

// Detail content for the "Diet plans" wide card / dedicated Nutrition page.
export const nutritionPlans = [
  {
    name: "Lean Fuel",
    goal: "Fat loss",
    calories: "1,800 kcal",
    macros: "40P / 35C / 25F",
    meals: ["Egg white & oat breakfast bowl", "Grilled chicken millet bowl", "Paneer & veg stir-fry"],
    img: "./image copy 7.png",
  },
  {
    name: "Mass Builder",
    goal: "Muscle gain",
    calories: "3,000 kcal",
    macros: "35P / 45C / 20F",
    meals: ["Peanut butter banana shake", "Rice, dal & double chicken", "Sweet potato & fish curry"],
    img: "./image copy 8.png",
  },
  {
    name: "Maintain & Perform",
    goal: "Body recomposition",
    calories: "2,300 kcal",
    macros: "35P / 40C / 25F",
    meals: ["Sprouts & multigrain toast", "Quinoa power bowl", "Grilled fish & greens"],
    img: "./image copy 9.png",
  },
];

export const nutritionPillars = [
  {
    title: "Coached, not generic",
    description: "Every plan is built around your training split, goals, and food preferences — not a copy-paste PDF.",
  },
  {
    title: "Macro-first, flexible",
    description: "We set your protein, carb, and fat targets, then let you swap meals freely within them.",
  },
  {
    title: "Monthly recalibration",
    description: "Calories and macros are adjusted every check-in as your weight and performance change.",
  },
];

// Detail content for the "Mobility block" wide card / dedicated Recovery page.
export const mobilityRoutines = [
  {
    name: "Morning Reset",
    duration: "10 min",
    focus: "Hips & spine",
    moves: ["Cat-cow flow", "90/90 hip switches", "Thoracic rotations"],
    img: "./image copy 10.png",
  },
  {
    name: "Post-Lift Flush",
    duration: "15 min",
    focus: "Legs & lower back",
    moves: ["Pigeon stretch", "Foam roll quads & IT band", "Standing hamstring reach"],
    img: "./image copy 11.png",
  },
  {
    name: "Shoulder Care",
    duration: "12 min",
    focus: "Shoulders & upper back",
    moves: ["Band pull-aparts", "Wall slides", "Sleeper stretch"],
    img: "image.png",
  },
];

export const recoveryPillars = [
  {
    title: "Built into every block",
    description: "Mobility work is programmed alongside your lifts, not left as homework you never get to.",
  },
  {
    title: "Coach-guided form",
    description: "Our floor coaches walk you through each stretch so you're loosening the right joint, safely.",
  },
  {
    title: "Track what loosens up",
    description: "Range-of-motion checks each month so recovery work shows up as real, measurable progress.",
  },
];

export const contactInfo = {
  address: ["Main Road, Kakinada", "Andhra Pradesh 533001"],
  phone: "+91 98765 43210",
  email: "hello@jayramfitness.com",
  hours: [
    { day: "Mon – Sat", time: "5:00a – 10:00p" },
    { day: "Sunday", time: "6:00a – 12:00p" },
  ],
  interests: [
    "Free trial visit",
    "Strength & Bodybuilding",
    "Weight Loss & Fat Burn",
    "Functional Fitness",
    "Just visiting",
  ],
};