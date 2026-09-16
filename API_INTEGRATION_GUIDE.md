# BuildSphere AI Version 3.0 — Complete True API Integration Guide & Roadmap

This comprehensive document outlines all current **Mocked & Simulated APIs** across the BuildSphere AI Version 3.0 system, detailing the exact step-by-step instructions to convert them into **True Production Integrations**, required API keys for `backend/.env`, and direct developer portal website links.

---

## 📋 Executive Summary of Mocked vs. Real Integrations

| Module / Feature | Current Status in v3.0 | Target Production Integration | Priority |
| :--- | :--- | :--- | :--- |
| **BIM 3D Model Rendering & Collision AI** | ❌ Mocked (Three.js geometric wireframes & simulated clashes) | **Autodesk Platform Services (Forge) / BIM 360 API** | 🔥 High |
| **Generative AI & Safety Analytics** | ⚠️ Hybrid (Local heuristic rules + rule-based simulation) | **Google Cloud Vertex AI & Gemini Pro 1.5 API** | 🔥 High |
| **IoT Crane & Weather Sensor Streams** | ❌ Mocked (Randomized mathematical telemetry generators) | **AWS IoT Core / ThingsBoard MQTT Platform** | 🟧 Medium |
| **Financial Payroll & Subcontractor Billing** | ❌ Mocked (Static ledgers & simulated approval pipelines) | **Stripe Connect API / QuickBooks Online API** | 🟧 Medium |
| **Site Drone Inspection Mappings** | ❌ Mocked (Simulated photogrammetry bounding boxes) | **DroneDeploy API / DJI Enterprise Flight Hub 2** | 🟦 Low |
| **SMS/Email Real-Time Safety Alerts** | ❌ Mocked (Console console.log outputs & localized toast notifications) | **Twilio Messaging API / SendGrid API** | 🟦 Low |

---

## 🛠️ Step-by-Step True Integration Guide & Website Links

### 1. Autodesk Platform Services (formerly Forge) & BIM 360 API
To replace our simulated 3D model clash detection in [ClientPortal.jsx](file:///c:/BuildSphere%20AI%20Version%203.0/frontend/src/pages/ClientPortal.jsx) and site engineer models with real structural CAD/REVIT model viewers:

1. **Register & Obtain Keys**: Visit the Autodesk Developer Portal and create a new Web App application to get your `CLIENT_ID` and `CLIENT_SECRET`.
   * **Developer Website**: [https://aps.autodesk.com/developer/overview](https://aps.autodesk.com/developer/overview)
2. **Required Scopes**: Enable the following API access scopes:
   * `data:read`, `bucket:create`, `bucket:read`, `viewables:read` (Model Derivative API)
   * `bim360:checkin`, `bim360:account:read` (BIM 360 Administration)
3. **Add Credentials to Backend .env**:
   ```env
   AUTODESK_CLIENT_ID="your_autodesk_client_id_here"
   AUTODESK_CLIENT_SECRET="your_autodesk_client_secret_here"
   AUTODESK_BUCKET_KEY="buildsphere_ai_bim_models"
   ```
4. **Backend Implementation**: Use the `@autodesk/forge-apis` Node.js library or Python equivalent to tokenize model files via OAuth 2.0 two-legged authentication and return an **urn** (Uniform Resource Name) to the frontend Autodesk Viewer instance.

---

### 2. Google Cloud Vertex AI & Gemini Multimodal AI
To upgrade structural cracks photo diagnostics and AI safety chat assistants from local algorithmic rules to real generative AI:

1. **Google Cloud Console Setup**: Enable the Vertex AI API and Gemini AI Platform in your project (`buildsphere-ai-503703`).
   * **Developer Website**: [https://console.cloud.google.com/vertex-ai](https://console.cloud.google.com/vertex-ai) and [https://ai.google.dev](https://ai.google.dev)
2. **Generate IAM Service Account / API Key**:
   * Create an API key under Google AI Studio or a GCP Service Account JSON key with `Vertex AI User` permissions.
3. **Add Credentials to Backend .env**:
   ```env
   GEMINI_API_KEY="your_live_gemini_api_key_here"
   VERTEX_AI_PROJECT_ID="buildsphere-ai-503703"
   VERTEX_AI_LOCATION="us-central1"
   ```
4. **Integration Pattern**: Replace simulated mock responses in `backend/app.py` / safety controllers with calls to `google.generativeai` package using model `gemini-1.5-pro` for text/photo diagnostics.

---

### 3. AWS IoT Core & ThingsBoard Telemetry
To switch simulated equipment fuel readings, tower crane load stress sensors, and site dust quality indices to true streaming telemetry:

1. **Provision IoT Hub**: Create an AWS IoT Core account or self-host an open-source ThingsBoard community instance.
   * **Developer Website**: [https://aws.amazon.com/iot-core/](https://aws.amazon.com/iot-core/) or [https://thingsboard.io/docs/api/](https://thingsboard.io/docs/api/)
2. **Device Authentication**: Provision security certificates (`X.509`) for field sensory gateways via MQTT over WebSockets.
3. **Add Credentials to Backend .env**:
   ```env
   AWS_IOT_ENDPOINT="a2example-ats.iot.us-east-1.amazonaws.com"
   THINGSBOARD_HOST="http://localhost:8080"
   THINGSBOARD_DEVICE_TOKEN="your_crane_sensor_token"
   ```
4. **Integration Pattern**: Connect your backend webhook service or frontend WebSocket to listen directly to MQTT topics (e.g., `buildsphere/site-a/crane-1/load_strain`).

---

### 4. Stripe Connect & QuickBooks Online Accounting
To transform simulated invoice settlements and subcontractor payroll in financial modules into real automated payouts:

1. **Register for FinTech API Access**:
   * **Stripe Developer Portal**: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   * **Intuit QuickBooks Developer API**: [https://developer.intuit.com/](https://developer.intuit.com/)
2. **Create Webhook Endpoints**: Configure payment intent success hooks so BuildSphere updates construction project ledger balances automatically upon transaction settlement.
3. **Add Credentials to Backend .env**:
   ```env
   STRIPE_SECRET_KEY="sk_test_51Px9X..."
   STRIPE_WEBHOOK_SECRET="whsec_89df..."
   INTUIT_CLIENT_ID="Q301..."
   INTUIT_CLIENT_SECRET="Q302..."
   ```

---

### 5. DroneDeploy API & DJI Flight Hub 2
To transition our mocked site topography scans and volumetric earthwork tracking into real photogrammetry pipeline feeds:

1. **API Developer Portal**: Request developer API tokens for cloud processing of automated flight missions.
   * **Developer Website**: [https://developer.dronedeploy.com/](https://developer.dronedeploy.com/) and [https://developer.dji.com/flighthub2-api/](https://developer.dji.com/flighthub2-api/)
2. **Add Credentials to Backend .env**:
   ```env
   DRONEDEPLOY_API_KEY="dd_api_key_v1_..."
   DJI_FLIGHTHUB_TOKEN="dji_cloud_token_..."
   ```

---

### 6. Twilio SMS & SendGrid Email Notifications
To convert our simulated notification feeds into live SMS alerts for critical on-site OSHA safety anomalies:

1. **Claim API Keys & Virtual Phone Number**:
   * **Developer Website**: [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio) and [https://sendgrid.com/solutions/email-api/](https://sendgrid.com/solutions/email-api/)
2. **Add Credentials to Backend .env**:
   ```env
   TWILIO_ACCOUNT_SID="AC_your_account_sid_here"
   TWILIO_AUTH_TOKEN="your_auth_token_here"
   TWILIO_PHONE_NUMBER="+18005550199"
   SENDGRID_API_KEY="SG.your_sendgrid_api_key"
   ```
3. **Integration Pattern**: In `backend/notifications.py`, wrap your alert dispatch logic so that whenever a notification of category `error` (Emergency / Safety Violation) is created, an outbound HTTP POST request is triggered to Twilio's messaging service.

---

## 🔒 Verification & System Readiness Checklist

- [x] All 26 User Persona Dashboards optimized for **100% display viewports** with interactive cyber-glassmorphic styling.
- [x] Universal dark table row hover animations and glowing form controls integrated in master [Dashboard.css](file:///c:/BuildSphere%20AI%20Version%203.0/frontend/src/Dashboard.css).
- [x] [NotificationsPanel.jsx](file:///c:/BuildSphere%20AI%20Version%203.0/frontend/src/components/NotificationsPanel.jsx) upgraded with dark frosted glassmorphism, animated unread notification counter dots, and responsive spacing.
- [x] Backend `.env` configured with enterprise Google Auth credentials and documented expansion paths for Autodesk, Vertex AI, Stripe, and AWS IoT.
