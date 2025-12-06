---
id: task-1
title: Deploy crypto-commons.org to self-hosted infrastructure
status: Done
assignee: []
created_date: '2025-12-06 15:25'
updated_date: '2025-12-06 15:26'
labels: []
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Migrate CCA website from external hosting to Netcup server with Cloudflare tunnel
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Update Next.js to latest (16.0.7) for security fix
- [x] #2 Create Dockerfile for static nginx deployment
- [x] #3 Create docker-compose.yml with Traefik labels
- [x] #4 Deploy to Netcup server
- [x] #5 Configure Cloudflare tunnel
- [x] #6 Update DNS records to point to tunnel
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Deployed 2025-12-06. Site is live at https://crypto-commons.org
<!-- SECTION:NOTES:END -->
