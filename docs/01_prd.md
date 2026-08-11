# 01_prd.md

This file captures the Product Requirements Document for AI Meeting Autopsy.

## Purpose

Build an AI-powered meeting analysis app that ingests audio or transcript and surfaces decisions, action items, meeting health, topic drift, speaking balance, and recommendations.

## Users

- Team leads / engineering managers
- Product managers
- Executives / directors
- Individual contributors

## MVP

- Upload audio / paste transcript
- Extract decisions, action items, and topics
- Display meeting health score, speaking balance, and waste metrics
- Basic authentication with session cookie
- Demo data available without login

## Scope

- Local development with Next.js, Prisma, Postgres
- OpenAI integration optional for AI enhancement
- No billing, no external integrations beyond OpenAI

## Success Metrics

- App starts locally with `npm install` and `npm run dev`
- Dashboard is reachable with seeded demo data
- Meeting upload or transcript analysis persists a meeting record
- Authentication works securely
