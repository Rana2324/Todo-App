# Use Case: Geolocation & Social Media Integration

## Primary Actor
Authenticated User

## Pre-conditions
- User has created at least one Todo item.

## Main Success Scenario
1. User clicks the "Attach Place" button on a Todo item.
2. Search modal opens; user types a venue name (e.g. "Central Cafe").
3. Server Action calls `placeService.searchPlaces(query)` which queries Geoapify (or returns mock matches).
4. User selects a place from search results; `todoService.attachPlace` writes location coordinates and place name to the database row.
5. User clicks the attached location badge to open the Place Insights dialog.
6. System concurrently fetches Google Business Profile ratings/hours via `gbpService` and recent social media posts via `instagramService`.
7. UI displays rich venue details directly inside the Todo dashboard.
