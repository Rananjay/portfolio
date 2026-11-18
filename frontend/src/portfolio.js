// Change this file to personalize the portfolio without rewriting the pages.
export const profile = {
  name: "Rananjay Chauhan",
  initials: "RC",
  title: "Software Developer",
  tagline: "I build practical, secure software.",
  introduction:
  "I’m Rananjay, a software developer who likes turning a messy problem into something useful. My work brings together web development, data, and a habit of asking how things could work a little better.",
  email: "rananjaychauhan28@gmail.com",
  location: "Ontario, Canada",
  photo: "/images/profile.jpg",
  resume: "/resume.pdf",
  about:
    "I am a software developer studying Artificial Intelligence – Software Engineering Technology at Centennial College. My background spans technical analysis, software support, cloud technologies, and application development. I enjoy breaking complex problems into manageable steps and building reliable solutions with clear documentation.",
  skills: [
    "JavaScript", "React", "Node.js", "Express", "MongoDB",
    "Python", "Java", "SQL", "REST APIs", "Git",
    "AWS", "Google Cloud", "Secure Coding",
  ],
};

export const education = [
  {
    title: "Artificial Intelligence – Software Engineering Technology",
    institution: "Centennial College",
    date: "In progress · Fall 2026",
    qualification: "Advanced Diploma · Fast-track",
  },
  {
    title: "Information Technology Business Analysis – Operations",
    institution: "Conestoga College",
    date: "August 2019",
    qualification: "Graduate Certificate",
  },
  {
    title: "Computer Science – Open Source & Open Standards",
    institution: "University of Petroleum and Energy Studies",
    date: "June 2017",
    qualification: "Bachelor's Degree",
  },
];

export const experience = [
  {
    role: "Technical Analyst",
    company: "NPower Canada",
    dates: "August 2021 – March 2026",
    description:
      "Technical instruction, development workflows, project review, debugging, cloud computing, and cybersecurity.",
  },
  {
    role: "Support Advisor",
    company: "Shopify",
    dates: "October 2020 – August 2021",
    description:
      "Technical troubleshooting, merchant support, workflow documentation, and collaboration on application improvements.",
  },
  {
    role: "Technical Software Specialist",
    company: "Ecobee Technologies",
    dates: "June 2019 – October 2020",
    description:
      "Software development, REST APIs, cloud modernization, production support, and systematic troubleshooting.",
  },
];

export const services = [
  {
    number: "01",
    title: "Web Application Development",
    description:
      "Responsive interfaces and clear user journeys for practical web applications.",
  },
  {
    number: "02",
    title: "Backend & API Development",
    description:
      "Structured server-side applications, REST APIs, and database integration.",
  },
  {
    number: "03",
    title: "Technical Workflow Development",
    description:
      "Clear documentation, scripting, and repeatable workflows that simplify technical tasks.",
  },
  {
    number: "04",
    title: "Secure Coding & Troubleshooting",
    description:
      "Security-conscious implementation, debugging, and systematic issue analysis.",
  },
];

// Replace the draft entries and image paths with real projects before submission.
// Until then, the UI labels them honestly as draft entries.
export const projects = [
  {
    title: "Job Tracker",
    category: "Making the job search more manageable",
    technologies: ["Web Application", "Team Project"],
    description:
      "A job search can quickly become a collection of tabs, notes, and forgotten follow-ups. Job Tracker brings that process into one place, helping people keep track of their applications and what comes next.",
    role:
      "Development contributor on a collaborative application.",
    outcome:
      "Completed a working job-tracking project with my team.",
    image: "/images/project-covers.png",
    coverPosition: "left",
    needsDetails: false,
  },
  {
    title: "Electricity Tracker",
    category: "Finding meaning in energy data",
    technologies: ["Big Data", "Energy Analysis"],
    description:
      "An electricity-tracking project built around a simple question: what can usage data tell us? I worked with big-data concepts to explore electricity consumption and make the information easier to understand.",
    role:
      "Project developer working with electricity data and big-data concepts.",
    outcome:
      "Completed an electricity-tracking and analysis project.",
    image: "/images/project-covers.png",
    coverPosition: "center",
    needsDetails: false,
  },
  {
    title: "Bloom Fitness",
    category: "A little more progress, one goal at a time",
    technologies: ["Fitness", "Goal Tracking"],
    description:
      "Bloom Fitness focuses on the everyday side of working toward fitness goals. The project brings goal tracking into a dedicated application, with an emphasis on making personal progress easier to follow.",
    role:
      "Developer working on a fitness goal-tracking application.",
    outcome:
      "Completed a fitness application focused on tracking personal goals.",
    image: "/images/project-covers.png",
    coverPosition: "right",
    needsDetails: false,
  },
];