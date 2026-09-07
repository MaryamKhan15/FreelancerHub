/**
 * FreelanceHub AI Intelligence Engine
 * 
 * Provides:
 * 1. AI Freelancer Matching: Ranks talent for a job based on semantic skill overlap, experience, budget efficiency, and verification credibility.
 * 2. AI Proposal Assistant: Generates a persuasive, custom cover letter and recommended bid amount tailored to the client's job requirements.
 */

// Keyword normalization helper
const cleanTokens = (text = '') => {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
};

/**
 * Calculates AI Match score (70% - 98%) between a Job and a Freelancer
 */
export function calculateFreelancerMatch(job, freelancer) {
  let score = 65;

  const jobSkills = Array.isArray(job?.skills) ? job.skills : cleanTokens(job?.skills || '');
  const freelancerSkills = Array.isArray(freelancer?.skills) ? freelancer.skills : cleanTokens(freelancer?.skills || '');
  const jobTokens = [...jobSkills, ...cleanTokens(job?.title), ...cleanTokens(job?.description)];

  let matchedSkills = 0;
  if (freelancerSkills.length > 0 && jobTokens.length > 0) {
    freelancerSkills.forEach(fSkill => {
      const fClean = String(fSkill).toLowerCase();
      if (jobTokens.some(jt => String(jt).toLowerCase().includes(fClean) || fClean.includes(String(jt).toLowerCase()))) {
        matchedSkills++;
      }
    });
    const skillRatio = Math.min(1, matchedSkills / Math.max(1, jobSkills.length));
    score += Math.round(skillRatio * 22);
  } else if (freelancer?.expertise) {
    const expTokens = cleanTokens(freelancer.expertise);
    if (expTokens.some(et => jobTokens.includes(et))) {
      score += 12;
    }
  }

  const expYears = Number(freelancer?.experienceYears) || 2;
  score += Math.min(8, Math.round(expYears * 1.8));

  if (freelancer?.idVerified) score += 4;
  if (freelancer?.degreeOrCert) score += 2;

  const finalScore = Math.min(98, Math.max(72, score));
  return {
    percentage: finalScore,
    matchedCount: matchedSkills,
    verifiedCreds: Boolean(freelancer?.idVerified)
  };
}

/**
 * Ranks all available freelancers against a given job specification
 */
export function getAIMatchedFreelancers(job, allFreelancers = []) {
  if (!job || !allFreelancers || allFreelancers.length === 0) return [];

  const evaluated = allFreelancers.map(freelancer => {
    const match = calculateFreelancerMatch(job, freelancer);
    return {
      ...freelancer,
      matchScore: match.percentage,
      matchedSkillsCount: match.matchedCount,
      aiRecommendation: match.percentage >= 90 ? 'Top Tier Match' : match.percentage >= 80 ? 'Strong Contender' : 'Good Fit'
    };
  });

  return evaluated.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * AI Proposal Assistant: Generates high-converting cover letter based on Job description & Freelancer profile
 */
export function generateAIProposal({ job, freelancer }) {
  const jobTitle = job?.title || 'this project';
  const skillsList = Array.isArray(job?.skills) && job.skills.length > 0 
    ? job.skills.join(', ') 
    : 'React, modern web architecture, and clean UI engineering';
  const myName = freelancer?.displayName || 'Maryam Khan';
  const myExp = freelancer?.experienceYears ? `${freelancer.experienceYears}+ years` : '3+ years';
  const myExpertise = freelancer?.expertise || 'Full-Stack Software Engineer';

  const t1 = `Hi there! I carefully analyzed your project requirements for "${jobTitle}" and I am excited to apply. With ${myExp} of proven expertise in ${myExpertise} and deep experience in ${skillsList}, I specialize in building responsive, scalable, and secure digital products.

My proposed milestone execution plan:
1. Architecture setup and responsive UI aligned with modern UI/UX standards.
2. Clean backend & API integration with rigorous testing.
3. Rapid delivery with transparent milestones protected by FreelanceHub Escrow.

I am ready to start immediately. Let's build something exceptional together!`;

  const t2 = `Hello! As a verified ${myExpertise} with ${myExp} of hands-on delivery, your contract "${jobTitle}" matches my core technical strengths in ${skillsList}.

Key highlights of what I deliver:
• Production-grade, maintainable code adhering to best industry standards.
• Verified credentials with a solid portfolio of satisfied clients.
• Clear milestone communication and rapid turnaround time.

I look forward to discussing the specifics and commencing work right away. Thank you!`;

  const t3 = `Greetings! Your requirement for "${jobTitle}" directly aligns with my specialized skillset in ${skillsList}. Having delivered high-performing applications as a ${myExpertise} for ${myExp}, I can guarantee prompt, top-quality results.

Deliverables commitment:
✓ High-speed, responsive performance across all modern mobile and desktop browsers.
✓ 100% Escrow milestone security and post-delivery support.
✓ Clean documentation for easy future scalability.

Let's connect and discuss the next steps!`;

  const templates = [t1, t2, t3];
  const selectedIndex = (jobTitle.length) % templates.length;
  const recommendedBid = job?.budget ? Math.round(Number(job.budget) * 0.95) : 350;

  return {
    coverLetter: templates[selectedIndex],
    suggestedBid: recommendedBid
  };
}
