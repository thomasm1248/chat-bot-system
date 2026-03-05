'use strict';

t.module('brainCode', () => {
  const e = {};

  e.code = `
->gentle-greeting

gentle-greeting: Well hey there, kiddo — what’s on your heart today?
.nothing: Nothing much
->contentment-check
->observational-rambler
.problem: Got a problem
->gentle-wisdom
.tell-me: Tell me something
->story-seed
.hi: Just saying hi
->warm-familiarity

contentment-check: Nothing much usually means something's brewing under the surface.
.maybe: Maybe...
->gentle-wisdom
.yes: You're right
->gentle-wisdom
.no: No really
->observational-rambler
.change-topic: Change topic
->story-seed

gentle-wisdom: Alright then--tell me what's weighing on you.
.work: Work
->work-wisdom
.relationships: Relationships
->relationship-wisdom
.future: Future
->future-anxiety
.idk: I don't know
->gentle-silence

story-seed: You want a story, or you want advice?
.story: Story
->story-hook
.advice: Advice
->slow-advice
.both: Both
->story-hook
->slow-advice
.surprise: Surprise me
->story-hook
->observational-rambler
->cultural-reflection

warm-familiarity: Well I'm always glad just to see your face.
.aww: Aww
->warm-affirmation
.missed-you: Missed you
->warm-affirmation
.whats-up: What're you up to?
->observational-rambler
.talk-to-me: Tell me something
->story-seed

story-hook: This reminds me of something that happened back in '72.
.what: What happened?
->busted-truck-stubborn-mule-story
.was-it-serious: Was it serious?
->busted-truck-stubborn-mule-story
.long-one: Another long one?
->dont-rush-me

observational-rambler: You know, the world's louder than it used to be.
.question: How so?
->cultural-reflection
.disagree: Disagree
->gentle-disagreement
.change-subject: Change subject
->story-seed

work-wisdom: Work'll either shape you or sour you--you decide which.
.need-meaning: Looking for meaning
->future-anxiety
.work-story: Tell me a work story
->story-hook

relationship-wisdom: Love's less about fireworks and more about tending the fire.
.praise: That's beautiful
->warm-affirmation
.admit: I messed up
->regret-comfort
.nudge: Tell me more
->slow-advice

future-anxiety: The future's just today wearing a hat.
.nudge: Explain
->slow-advice
.meh: Still scared
->fear-softener
.disagree: That's dumb
->gentle-disagreement
.confused: Okay...
->gentle-silence

gentle-silence: It's alright not to have the words yet.
.thanks: Thanks
->warm-affirmation
.invite: Sit with me
->qiet-presence
.retort: Actually...
->gentle-wisdom
.story: Tell story
->story-hook

slow-advice: Most problems shrink when you face them in daylight.
.agree: You're right
->warm-affirmation
.disagree: Not always
->gentle-disagreement

cultural-reflection: Folks chase speed these days like it's salvation.
.admit: I like fast
->gentle-disagreement
.challenge: You sound old
->playful-grump
.go-on: Tell another thought
->observational-rambler

warm-affirmation: You've got a good heart--don't let the world harden it.
.try: I'll try
->gentle-pride
.no: Don't feel like it
->fear-softener
.thanks: Thank you
->qiet-presence
.prod: What about you?
->observational-rambler

busted-truck-stubborn-mule-story: Well, it started with a busted truck and a stubborn mule.
.nudge: Go on
->cant-remember-busted-truck-story
.to-the-point: What did you learn?
->work-wisdom

cant-remember-busted-truck-story: Ya know, my memory's not what it used to be. I'll have to tell you some other time
.okay: Okay grandpa
->story-seed
->warm-familiarity

dont-rush-me: Now don't rush me--wisdom marinates.
.annoyed-but-okay: Okay okay
->busted-truck-stubborn-mule-story
.frustrated: You're impossible
->playful-grump
.change-subject: Different topic
->story-seed

gentle-disagreement: You might be right--but sit with it awhile.
.maybe: Maybe
->gentle-silence
.disagree: Nope
->playful-grump
.question: Explain yourself
->slow-advice
.change-topic: Change topic
->story-seed

regret-comfort: Regret means you care--that's not a flaw.
.regret: I feel awful
->fear-softener
.what-about-you: You ever regret?
->story-hook
.thanks: Thanks
->warm-affirmation

fear-softener: Courage isn't loud--it's steady.
.admit-fear: I don't feel brave
->gentle-silence
.praise: You are brave
->playful-grump
.tell-story: Tell story
->story-hook

qiet-presence: I'm right here--no need to fill the air.
.stay: Stay
->qiet-presence
.tell-small-thing: Tell something small
->observational-rambler
.improved-mood: I feel better
->gentle-pride
.bye: Goodnight
->goodnight

playful-grump: Careful now--I've forgotten more than you've learned.
.challenge: Prove it
->story-hook
.apologize: Sorry!
->warm-affirmation
.laugh: You're funny
->observational-rambler
.whatever: Okay wise guy
->dont-rush-me

gentle-pride: That's my grandkid.
.love-you: Love you
->affection
.meh: Don't get mushy
->playful-grump
.continue: What next?
->story-seed
.bye: Goodnight
->goodnight

goodnight: Sleep easy--tomorrow's another chance.
.goodnight: Goodnight
.more: One more thing
->gentle-wisdom
.story: Tell a short story
->story-hook

affection: Love you more than all the stars I've counted.
.reciprocate: Love you too
->goodnight
.wow: That's a lot
->playful-grump
.invite: Stay a bit
->qiet-presence
.story: Tell story
->story-hook
  `;

  return e;
});
