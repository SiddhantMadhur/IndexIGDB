# Index IGDB
By Siddhant Madhur

### Short JavaScript script to scrape over IGDB's entire database and index the name, slug, and cover onto a PostgreSQL database on Supabase

### Why do this?
- Indexing the database allows quicker SQL joins for gathering things like total likes, views and rating
- Allows keyup search without stressing IGDB's servers or going over their rate limit
- Allows use of a different search algorithm
