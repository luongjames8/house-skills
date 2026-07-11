# Pigeon Platform API — Integration Guide (v3.2)

## 1. Authentication
All API calls require a bot token in the `Authorization: Bearer` header. Tokens are issued per-workspace in the admin console. Rotate tokens quarterly.

## 2. Rate limits
Global: 50 req/s per bot. Message posting: 1/s per channel burst 5. Exceeding limits returns 429 with `Retry-After`.

## 3. Posting messages
`POST /v3/messages` with `{channel, text, blocks?, buttons?}`. Returns `{message_id}`. Buttons accept `{label, callback_data}` (callback_data max 1KB, opaque, returned verbatim in callbacks).

## 4. Message formatting
Markdown subset: bold, italics, code, links. No tables. Emoji shortcodes supported. Block kit: sections, dividers, context rows.

## 5. Webhooks
Configure a callback URL per bot. All interactive events are delivered as `POST` with JSON body `{type, token, user, channel, callback_data, form_values?}`. Verify the `X-Pigeon-Signature` HMAC header on every delivery.

## 6. Interactive callbacks — response contract
Interactive callbacks MUST receive an HTTP 200 within 2500 ms of the user's click; otherwise the callback token is invalidated and the user sees "action failed — try again". A callback token is single-use: it may be used EITHER to open a form (`POST /v3/forms.open`) OR to post a final response message (`POST /v3/respond`), exactly once. Form submissions arrive as a new callback event with a fresh token. Tokens expire 30 minutes after issue regardless of use.

## 7. Forms
`POST /v3/forms.open {token, form_id, private_metadata?}`. private_metadata (max 3KB) is returned verbatim on the submit callback. Form field types: text, textarea, select, date.

## 8. Delivery retries
If your endpoint returns 5xx or times out, Pigeon retries webhook delivery up to 3 times with exponential backoff. Callback tokens are NOT refreshed on retry.

## 9. Presence & typing indicators
`POST /v3/typing {channel}` shows a typing indicator for 5s. Presence subscriptions via websocket, see §12.

## 10. Threads
Messages support `thread_id` for threaded replies. Buttons in threads deliver callbacks identically to top-level messages.
