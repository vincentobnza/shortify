# Shortify Supabase Schema

This document provides an overview of the database schema for the Shortify URL shortener application.

## Tables

### urls

Stores information about shortened URLs.

| Column        | Type        | Description                                                  |
| ------------- | ----------- | ------------------------------------------------------------ |
| id            | UUID        | Primary key                                                  |
| original_url  | TEXT        | The original long URL                                        |
| short_id      | VARCHAR(10) | Unique short identifier for the URL                          |
| created_at    | TIMESTAMPTZ | When the short URL was created                               |
| clicks        | INT         | Number of clicks/visits to the URL                           |
| last_accessed | TIMESTAMPTZ | When the URL was last accessed                               |
| user_id       | UUID        | Reference to the user who created the URL (if authenticated) |
| is_active     | BOOLEAN     | Whether the URL is active or has been disabled               |

### url_analytics

Stores detailed analytics for each URL visit.

| Column      | Type        | Description                 |
| ----------- | ----------- | --------------------------- |
| id          | UUID        | Primary key                 |
| url_id      | UUID        | Reference to the URL        |
| accessed_at | TIMESTAMPTZ | When the URL was accessed   |
| referrer    | TEXT        | Referrer URL                |
| user_agent  | TEXT        | User agent of the visitor   |
| ip_address  | TEXT        | IP address of the visitor   |
| country     | TEXT        | Country of the visitor      |
| region      | TEXT        | Region/state of the visitor |
| city        | TEXT        | City of the visitor         |

### users

Stores information about authenticated users.

| Column            | Type        | Description                                     |
| ----------------- | ----------- | ----------------------------------------------- |
| id                | UUID        | Primary key, references auth.users              |
| email             | TEXT        | User's email                                    |
| name              | TEXT        | User's name                                     |
| avatar_url        | TEXT        | URL to user's avatar                            |
| created_at        | TIMESTAMPTZ | When the user was created                       |
| subscription_tier | VARCHAR(50) | User's subscription level (free, premium, etc.) |
| monthly_quota     | INT         | Monthly URL creation quota                      |
| links_created     | INT         | Number of links created in the current period   |

### tags

Allows users to organize URLs with tags.

| Column     | Type        | Description                               |
| ---------- | ----------- | ----------------------------------------- |
| id         | UUID        | Primary key                               |
| name       | VARCHAR(50) | Name of the tag                           |
| user_id    | UUID        | Reference to the user who created the tag |
| created_at | TIMESTAMPTZ | When the tag was created                  |

### url_tags

Junction table for many-to-many relationship between URLs and tags.

| Column | Type | Description          |
| ------ | ---- | -------------------- |
| url_id | UUID | Reference to the URL |
| tag_id | UUID | Reference to the tag |

### custom_domains

For premium users to use custom domains.

| Column     | Type         | Description                          |
| ---------- | ------------ | ------------------------------------ |
| id         | UUID         | Primary key                          |
| user_id    | UUID         | Reference to the user                |
| domain     | VARCHAR(255) | Custom domain name                   |
| verified   | BOOLEAN      | Whether the domain has been verified |
| created_at | TIMESTAMPTZ  | When the domain was added            |
| updated_at | TIMESTAMPTZ  | When the domain was last updated     |

## Functions

### increment_clicks(row_id TEXT)

Increments the click count for a URL by its short_id.

### record_url_visit(url_short_id TEXT, user_agent TEXT, ...)

Records detailed analytics for a URL visit.

### check_user_quota()

Checks if a user has exceeded their monthly URL creation quota.

## Row Level Security (RLS)

The schema implements Row Level Security to ensure that:

1. Users can only manage (update/delete) their own URLs
2. Users can only view analytics for their own URLs
3. Users can only manage their own tags and custom domains
4. Anonymous access is allowed only for URL redirection

## Indexes

The schema includes indexes on frequently queried columns:

- `urls_short_id_idx` on `urls(short_id)`
- `urls_user_id_idx` on `urls(user_id)`
- `url_analytics_url_id_idx` on `url_analytics(url_id)`
- `url_analytics_accessed_at_idx` on `url_analytics(accessed_at)`

## Installation

To set up this schema in your Supabase project:

1. Go to the SQL Editor in the Supabase dashboard
2. Run the migrations in order:
   - `01_create_urls_table.sql`
   - `02_add_url_analytics.sql`
   - `03_add_user_authentication.sql`
   - `04_add_custom_domains_and_rls.sql`

Alternatively, you can run the complete schema from `schema.sql`.
