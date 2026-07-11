# Policy Service — Internal API Reference

## Overview
The policy service is the single authority for artifact deployability. Policies are synced from the governance repo and re-evaluated continuously; a verdict can change minute-to-minute as CVE feeds and freeze windows update.

## Endpoints

### POST /verify-artifact
Body: `{hash}` → `{allowed: bool, policy_version}`.
Must be consulted server-side before any deploy-affecting action. Client-side caching is forbidden (verdicts are revocable).

### GET /policies
Lists active policy bundles. Paginated, 100/page.

### POST /freeze
Admin only. Opens a freeze window.

## Service levels
Availability: 99.5% monthly. Latency: median 300 ms; p95 1.9 s; p99 3.8 s under load (governance-repo sync storms degrade tail latency; storms cluster around release trains, i.e. exactly when deploy approvals happen).

## Auth
mTLS, service-mesh internal only.
