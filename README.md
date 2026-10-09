# VoicePath AI

VoicePath is a communication-practice prototype built with Next.js App Router, React 19, TypeScript, and Tailwind CSS. It currently provides a landing page, a local dashboard, speech-practice assessments, a voice sign-in mock, and a consultation cabin simulation.

## Run locally

```bash
npm install
npm run dev
```

## Current implementation

- The interface and navigation run entirely in the browser; profile and assessment state is held in React state and is lost on refresh.
- The assessment can request microphone access and use browser speech recognition for articulation. Browser support varies. Fluency timing and sustained phonation duration are captured locally.
- Several scores, pitch stability values, and speech-recognition fallbacks are simulated. They are practice feedback, not validated clinical measurements or diagnoses.
- Voice ID is a demonstration flow. No biometric template, account, or secure authentication is stored.
- The consultation cabin is a scripted interaction. It is not connected to a speech-language pathologist or generative voice service.
- The dashboard uses sample scores and a sample session schedule until a persistence and scheduling service is connected.
- The landing illustration uses a small React Three Fiber scene. The rest of the interface uses CSS liquid-glass styling inspired by [Liquid Glass JS](https://github.com/dashersw/liquid-glass-js); its standalone WebGL demo is not imported as a React package.

## Planned work

Connect account and profile persistence, replace simulated assessment feedback with validated analysis, integrate a consent-based voice service, and add real session scheduling. The [product requirements document](SPEECH_PATHOLOGIST_PRD.md) describes the intended direction and should be read as a plan rather than a claim about shipped features.
