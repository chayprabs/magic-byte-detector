# Privacy Policy — FileSniff

**Last updated:** May 31, 2026  
**Operator:** Chaitanya Prabuddha  
**Service:** FileSniff / magic-byte-detector

> This policy describes how the **hosted** Service handles information.  
> Self-hosted deployments are controlled by their operators, not by us.

---

## 1. Summary

| Mode | What leaves your device |
|------|-------------------------|
| **100% in-browser (default)** | Nothing from file contents; only normal website delivery (see §4) |
| **Full scan / URL / batch** | File or URL content is sent to the worker you use (ours or yours) |

We do **not** sell file contents. We do **not** use uploads for advertising profiles or AI training.

## 2. Who we are (data controller)

For the hosted Service operated by Chaitanya Prabuddha, the **data controller** is:

**Chaitanya Prabuddha**  
Contact: via [GitHub issues](https://github.com/chayprabs/magic-byte-detector/issues) on the project repository.

## 3. What we collect

### 3.1 Information you provide

- **Files or archives** you upload (only when you use server-side features)  
- **URLs** you submit for fetching (only in URL-scan mode)  
- **Hex/base64** pasted in-browser stays on your device unless you use server features  

We do **not** require an account, email, or name to use the Tool.

### 3.2 Information collected automatically

When you load the Site, typical web infrastructure may log:

- IP address  
- Browser type / user agent  
- Referrer, timestamps, request paths  
- TLS and CDN/security metadata  

We aim **not** to use third-party advertising trackers or social pixels on the playground.

### 3.3 Information we derive

- Detection results (format, MIME, hashes, flags) when you use our worker  
- **SHA-256** (and optionally **ssdeep** on worker paths)  
- Operational logs without intentionally storing full file contents after processing  

## 4. How we use information

We process data **only** to:

- Run the analysis you requested  
- Operate, secure, and debug the Service  
- Comply with law or enforce our Terms  

**Legal bases (EEA/UK GDPR-style):** contract (providing the Service you asked for), legitimate interests (security, abuse prevention), and legal obligation where applicable.

We do **not** use your files for marketing, sale, or model training.

## 5. Retention

| Data | Retention |
|------|-----------|
| Uploaded files (worker) | **Ephemeral** — processed in memory/temp storage and deleted promptly (target: within **5 minutes** of processing unless a technical failure delays deletion) |
| Server logs | Short operational retention; no intentional long-term storage of file bodies |
| Local browser | Under your control; clear site data in your browser |

## 6. Sharing and subprocessors

We do **not** sell personal information.

We may share limited data with:

- **Hosting / CDN providers** (e.g., static site host, cloud VM provider) strictly to deliver the Service  
- **Law enforcement** if required by valid legal process and only to the extent compelled  

A current list of categories: infrastructure hosting, DNS/TLS, GitHub (for source and issues only if you contact us there).

## 7. International transfers

If you access the Service from outside India, your data may be processed in **India** and wherever our hosts operate. We rely on appropriate safeguards where required (e.g., standard contractual clauses or equivalent mechanisms when applicable).

## 8. Security

We use reasonable technical measures (HTTPS, ephemeral processing, access limits). **No method is 100% secure.** You use the Service at your own risk, especially when uploading sensitive or malicious files.

## 9. Your rights

Depending on where you live, you may have rights to **access, correct, delete, restrict, object, or port** personal data, and to **withdraw consent** where processing is consent-based.

Because we typically **do not** maintain accounts or long-term file storage:

- **In-browser mode:** we often have **nothing** to retrieve about your file contents.  
- **Worker mode:** contact us promptly; ephemeral deletion may mean data is already gone.

**California (CCPA/CPRA):** We do not sell personal information. California residents may request disclosure/deletion of personal information we hold—contact us via GitHub.

**EU/UK:** You may lodge a complaint with your local supervisory authority.

We will respond to verifiable requests within timelines required by law (e.g., 30–45 days where applicable).

## 10. Children

The Service is **not** for users under **18**. We do not knowingly collect children's data.

## 11. Do not upload special categories

Do not upload files whose contents include highly sensitive personal data (health, biometrics, government IDs, etc.) unless you have a lawful basis and accept the risk. The Tool is not designed for regulated data processing on your behalf.

## 12. Changes

We may update this policy. Check the "Last updated" date. Continued use means you accept the updated policy.

## 13. Contact

[github.com/chayprabs/magic-byte-detector](https://github.com/chayprabs/magic-byte-detector)
