# Tournament Registration Schema Migration Guide

## Overview

This guide explains the migration from email-based to student ID-based data collection for tournament team member registrations in the Appwrite database.

## What Changed

### Before
- Team members were identified by email addresses
- Email was the primary unique identifier
- Multiple registrations per email were possible

### After
- Team members are identified by student IDs
- Student ID is the primary unique identifier
- Each student ID can only register once across all tournaments
- Email is retained for contact purposes

## Key Changes

### 1. PlayerInfo Interface
```typescript
// Before
interface PlayerInfo {
  name: string;
  email: string;
  university: string;
  inGameId?: string;
}

// After
interface PlayerInfo {
  name: string;
  studentId: string;
  university: string;
  inGameId?: string;
}
```

### 2. Tournament Registration Collection Schema

#### New Required Field
- **studentId** (string, UNIQUE INDEX)
  - Captain's student ID
  - Prevents duplicate registrations
  - Must be unique across all registrations

#### Updated Players JSON Structure
```json
{
  "players": [
    {
      "name": "Player Name",
      "studentId": "STU123456",
      "university": "University Name",
      "inGameId": "InGameUsername"
    }
  ],
  "substitutes": [
    {
      "name": "Substitute Name",
      "studentId": "STU789012",
      "university": "University Name",
      "inGameId": "InGameUsername"
    }
  ]
}
```

## Migration Steps

### Step 1: Setup Collection Schema

Run the setup script to display the required schema:

```bash
npm run setup:tournament-registration
```

This will display:
- All required attributes
- Data types
- Unique constraints
- JSON structure examples

### Step 2: Create/Update Collection in Appwrite Console

1. Go to Appwrite Console
2. Navigate to Databases > Your Database
3. Create or update the `tournament_registrations` collection
4. Add the following attributes:

| Attribute | Type | Required | Unique | Description |
|-----------|------|----------|--------|-------------|
| tournamentId | string | Yes | No | Tournament ID |
| playerName | string | Yes | No | Captain's full name |
| email | string | Yes | No | Captain's email |
| **studentId** | string | Yes | **Yes** | Captain's student ID |
| university | string | No | No | Captain's university |
| teamName | string | No | No | Team name |
| players | string | No | No | JSON: team members & substitutes |
| additionalInfo | string | No | No | Additional info |
| status | string | Yes | No | pending/approved/rejected |
| registrationDate | datetime | Yes | No | Registration timestamp |
| userId | string | Yes | No | Appwrite user ID |

**Important**: Set `studentId` as a UNIQUE INDEX to prevent duplicate registrations.

### Step 3: Migrate Existing Data

Run the migration script to update existing registrations:

```bash
npm run migrate:tournament-registration
```

This script will:
1. Fetch all existing registrations
2. Convert email references to studentId in players/substitutes
3. Add studentId field to captain records
4. Update the JSON structure
5. Verify the migration

### Step 4: Verify Migration

The migration script automatically verifies the changes. You can also manually check:

1. Go to Appwrite Console
2. View a sample registration document
3. Confirm:
   - `studentId` field exists
   - `players` JSON uses `studentId` instead of `email`
   - No duplicate `studentId` values

## Database Queries

### Find registrations by student ID
```javascript
const registrations = await databases.listDocuments(
  DB_ID,
  'tournament_registrations',
  [Query.equal('studentId', 'STU123456')]
);
```

### Check if student already registered
```javascript
const existing = await databases.listDocuments(
  DB_ID,
  'tournament_registrations',
  [Query.equal('studentId', 'STU123456')]
);

if (existing.documents.length > 0) {
  // Student already registered
}
```

### Find all registrations for a tournament
```javascript
const registrations = await databases.listDocuments(
  DB_ID,
  'tournament_registrations',
  [Query.equal('tournamentId', 'TOURNAMENT_ID')]
);
```

## Frontend Changes

### Form Validation
The registration form now validates:
- Student ID is required for all team members
- Student ID must be unique (checked against database)
- Each student can only register once

### Error Messages
- "Your student ID has already been used to register for a tournament. Each student ID can only register once."
- "Please fill in all required team players. You need X additional players."

## Rollback Plan

If you need to rollback:

1. Keep a backup of your Appwrite database before migration
2. Restore from backup if needed
3. The old email field is still available in the data

## Troubleshooting

### Issue: "studentId is not unique"
**Solution**: Check for duplicate studentId values in existing data and clean them up before migration.

### Issue: Migration fails with "Collection not found"
**Solution**: Ensure the collection exists in Appwrite Console before running migration.

### Issue: Players JSON not updating
**Solution**: Check that the JSON is properly formatted and contains the expected structure.

## Environment Variables

Ensure these are set in your `.env` file:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DB_ID=your_database_id
NEXT_PUBLIC_APPWRITE_TOURNAMENT_REGISTRATIONS_COLLECTION_ID=tournament_registrations
```

## Scripts Reference

### Setup Script
```bash
npm run setup:tournament-registration
```
Displays the required schema and setup instructions.

### Migration Script
```bash
npm run migrate:tournament-registration
```
Migrates existing data to the new schema.

## Testing

After migration, test the following:

1. **New Registration**: Register a new team with student IDs
2. **Duplicate Prevention**: Try registering with the same student ID (should fail)
3. **Data Integrity**: Verify all player data is correctly stored
4. **Query Performance**: Test queries by studentId

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Appwrite documentation
3. Check the migration script logs for detailed error messages

## Timeline

- **Phase 1**: Setup collection schema (manual in Appwrite Console)
- **Phase 2**: Run migration script
- **Phase 3**: Test and verify
- **Phase 4**: Deploy to production

## Notes

- The migration is non-destructive; original data is preserved
- Email field is retained for backward compatibility
- Student ID becomes the primary identifier for duplicate prevention
- All existing registrations will be updated with studentId
