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
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400",
  },
  {
    tag: "Push Day",
    season: "STRENGTH BLOCK",
    date: "TUE / FRI",
    focus: "Chest, shoulders & triceps",
    equipment: "Free weights",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400&q=80",
  },
  {
    tag: "Pull Day",
    season: "STRENGTH BLOCK",
    date: "WED / SAT",
    focus: "Back, biceps & grip work",
    equipment: "Pull-up rig",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=80",
  },
  {
    tag: "Conditioning",
    season: "CIRCUIT BLOCK",
    date: "SATURDAY",
    focus: "Full-body metabolic circuit",
    equipment: "Open floor",
    img: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?w=1400&q=80",
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
    img: "https://images.unsplash.com/photo-1583500178689-665d1f77e67d?w=900&q=80",
  },
  {
    name: "Srinivas Reddy",
    role: "Weight Loss & Transformation",
    bio: "Specialises in fat-loss programming and nutrition planning for busy working professionals.",
    img: "https://images.unsplash.com/photo-1630065612476-294f637f0248?w=900&q=80",
  },
  {
    name: "Naveen Kumar Chowdary",
    role: "Functional Fitness",
    bio: "Runs the circuit and mobility floor. Focused on building everyday strength that lasts.",
    img: "https://images.unsplash.com/photo-1707900285737-09a42c837118?w=900&q=80",
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

export const contactInfo = {
  address: ["Main Road, Kakinada", "Andhra Pradesh 533001"],
  phone: "+91 98765 43210",
  email: "hello@ironworks.gym",
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