---
id: TASK-7
title: Deploy Twenty CRM at crm.crypto-commons.org
status: Done
assignee:
  - '@claude'
created_date: '2026-02-15 17:33'
labels:
  - infrastructure
  - crm
  - deployment
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Deploy a Twenty CRM instance for Crypto Commons, accessible via crm.crypto-commons.org. Reuses the existing consolidated Twenty CRM multi-workspace instance on Netcup RS 8000 at /opt/apps/twenty/.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 crm.crypto-commons.org DNS CNAME points to Cloudflare tunnel
- [ ] #2 crm.crypto-commons.org hostname added to Cloudflare tunnel config via API
- [ ] #3 Traefik redirect: crm.crypto-commons.org -> crypto-commons.rnetwork.online (308)
- [ ] #4 crypto-commons.rnetwork.online added to Twenty CRM main router rule
- [ ] #5 Twenty CRM workspace accessible at crypto-commons.rnetwork.online
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Deployed Twenty CRM workspace for Crypto Commons using the existing consolidated multi-workspace instance.\n\nChanges made:\n1. DNS: Added CNAME record for crm.crypto-commons.org -> Cloudflare tunnel\n2. Cloudflare Tunnel: Added crm.crypto-commons.org hostname via API (config version 310)\n3. Traefik (docker-compose at /opt/apps/twenty/): Added crypto-commons.rnetwork.online to main router + redirect middleware from crm.crypto-commons.org\n4. Workspace created by user at crypto-commons.rnetwork.online with contact@crypto-commons.org\n\nURLs:\n- crm.crypto-commons.org -> 308 redirect -> crypto-commons.rnetwork.online\n- crypto-commons.rnetwork.online -> Twenty CRM workspace (200 OK)
<!-- SECTION:FINAL_SUMMARY:END -->
